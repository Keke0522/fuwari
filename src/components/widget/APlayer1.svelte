<script>
    import { onMount } from 'svelte';

    let loading = true;
    let retryCount = 0;
    const MAX_RETRY = 3;


    function detectTheme() {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches
            ? '#222222'
            : '#e6e6e6';
    }

    async function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function checkPlayerReady(container) {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                const aplayer = container.querySelector('.aplayer');
                if (aplayer) {
                    clearInterval(check);
                    resolve(aplayer);
                }
            }, 200);
        });
    }

    onMount(async () => {
        try {
            const container = document.getElementById('meting');

            // ✅ 先加载本地 JS 脚本
            await Promise.race([
                Promise.all([
                    loadScript('/libs/aplayer/APlayer.min.js'),
                    loadScript('/libs/meting/Meting.min.js')
                ]),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('加载超时')), 5000))
            ]);

            // ✅ 脚本加载后再创建 meting-js 元素
            const newMeting = document.createElement('meting-js');
            newMeting.setAttribute('server', 'netease');
            newMeting.setAttribute('type', 'playlist');
            newMeting.setAttribute('id', '3778678');
            newMeting.setAttribute('order', 'random');
            newMeting.setAttribute('list-folded', 'true');
            newMeting.setAttribute('theme', '#42b983');
            newMeting.setAttribute('lrc-type', '1');
            newMeting.setAttribute('autoplay', 'false');
            newMeting.setAttribute('mutex', 'true');
            newMeting.setAttribute('preload', 'auto');

            container.innerHTML = '';
            container.appendChild(newMeting);

            const aplayer = await checkPlayerReady(container);

            const handleLyricsLoad = () => {
                if (!aplayer.options.lrc.enabled && retryCount < MAX_RETRY) {
                    retryCount++;
                    aplayer.options.lrc.enabled = true;
                    aplayer.lrc.show();
                    aplayer.lrc.hide();
                    aplayer.lrc.show();
                }
            };

            aplayer.addEventListener('loadeddata', handleLyricsLoad);
            aplayer.addEventListener('timeupdate', handleLyricsLoad);

            setTimeout(() => {
                const lrcContainer = aplayer.querySelector('.aplayer-lrc');
                if (lrcContainer) {
                    lrcContainer.style.display = 'block';
                    lrcContainer.style.opacity = 1;
                }
                aplayer.lrc.show();
            }, 1500);

            loading = false;
        } catch (err) {
            console.error('播放器初始化失败:', err);
            loading = false;
        }
    });
</script>

<link rel="stylesheet" href="/libs/aplayer/APlayer.min.css" />

{#if loading}
    <div class="loading-container">
        <div class="spinner"></div>
        <p>正在加载音乐播放器...</p>
    </div>
{/if}

<div id="meting"></div>

<style>
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        color: #666;
        font-size: 14px;
    }

    .spinner {
        width: 32px;
        height: 32px;
        border: 4px solid #ccc;
        border-top-color: #42b983;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    :global(.aplayer) {
        border-radius: 12px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        transition: all 0.3s ease;
    }

    :global(.aplayer:hover) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
    }

    :global(.aplayer-list) {
        max-height: 300px !important;
        border-top: 1px solid rgba(0,0,0,0.05) !important;
    }

    :global(.aplayer-lrc) {
        display: block !important;
        opacity: 1 !important;
        height: auto !important;
        margin: 15px 0 !important;
    }

    @media (prefers-color-scheme: dark) {
        :global(.aplayer) {
            background: #2a2a2a !important;
        }

        :global(.aplayer-lrc p) {
            color: rgba(255, 255, 255, 0.85) !important;
            text-shadow: 0 0 2px rgba(0,0,0,0.5) !important;
        }

        :global(.aplayer-list li) {
            color: rgba(255,255,255,0.7) !important;
            border-color: rgba(255,255,255,0.1) !important;
        }
    }
</style>
