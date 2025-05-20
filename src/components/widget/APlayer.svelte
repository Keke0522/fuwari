<script>
    import { onMount } from 'svelte';

    let loading = true;
    let aplayerInstance;

    const musicList = [
        {
            name: '舍得',
            artist: '王唯旖',
            cover: '/music/img/舍得.jpeg',
            url: '/music/ls/王唯旖-舍得.mp3',
            lrc:'/music/lrc/舍得.lrc'
        },
        {
            name: '认真的雪',
            artist: '薛之谦',
            cover: '/music/img/认真的雪.jpeg',
            url: '/music/ls/薛之谦-认真的雪.mp3',
            lrc: '/music/lrc/认真的雪.lrc'
        },
        {
            name: '勾指起誓',
            artist: '泠鸢yousa',
            cover: '/music/img/勾指起誓.jpeg',
            url: '/music/ls/Hanser&泠鸢Yousa - 【冷冷】勾指起誓.mp3',
            lrc: '/music/lrc/勾指起誓.lrc'
        },
        {
            name: '故梦',
            artist: '双笙',
            cover: '/music/img/故梦.jpeg',
            url: '/music/ls/music-storage/双笙（陈元汐） - 故梦（一周年礼物）（Cover 橙翼）.mp3',
            lrc: '/music/lrc/故梦.lrc'
        }
        ]

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

    onMount(async () => {
        try {
            await loadScript('/libs/aplayer/APlayer.min.js');

            const container = document.getElementById('aplayer');

            aplayerInstance = new window.APlayer({
                container,
                fixed: false,
                autoplay: false,
                theme: '#42b983',
                loop: 'all',
                order: 'list',
                preload: 'auto',
                volume: 0.8,
                mutex: true,
                lrcType: 3,
                listFolded: false,
                audio: musicList
            });

            aplayerInstance.on('loadeddata', () => {
                const lrcEl = container.querySelector('.aplayer-lrc');
                const listEl = container.querySelector('.aplayer-list');

                if (lrcEl && listEl) {
                    // 检查 lrcEl 当前是否已在 listEl 外部
                    if (lrcEl.parentElement !== listEl.parentElement) {
                        // 移除旧的 lrcEl
                        if (lrcEl.parentElement) {
                            lrcEl.parentElement.removeChild(lrcEl);
                        }
                        // 插入为 listEl 同级，紧接在其后
                        listEl.parentElement.insertBefore(lrcEl, listEl.nextSibling);
                    }

                    // 确保 lrcEl 样式类似 listEl
                    lrcEl.style.maxHeight = '300px';
                    lrcEl.style.overflowY = 'auto';
                    lrcEl.style.borderTop = '1px solid rgba(0, 0, 0, 0.05)';
                    lrcEl.style.marginTop = '8px';
                }
            });

            // 插入按钮到 .aplayer-controller 里面
            const controller = container.querySelector('.aplayer-time');
            if (controller) {
                const btn = document.createElement('button');
                // width: 15px;
                // height: 15px;
                btn.textContent = '词';
                btn.style.background = 'transparent';
                btn.style.color = '#42b983';
                btn.style.border = 'none';
                btn.style.outline = 'none';
                btn.style.cursor = 'pointer';
                btn.style.verticalAlign = 'middle';
                btn.style.padding = '0';
                btn.style.fontSize = '12px';
                btn.style.margin = '0';
                btn.style.display = 'inline-block';
                btn.style.width = '15px';
                btn.style.height = '15px';
                btn.addEventListener('click', () => {
                    const lrc = container.querySelector('.aplayer-lrc');
                    if (lrc) {
                        if (lrc.style.display !== 'block' || !lrc.style.display) {
                            lrc.style.setProperty('display', 'block', 'important');
                            //灰色字体
                            lrc.style.setProperty('color', '#666', 'important');
                            btn.textContent = '词';
                            console.log('显示歌词');
                        } else {
                            lrc.style.setProperty('display', 'none', 'important');
                            btn.textContent = '词';
                            //黑色字体
                            lrc.style.setProperty('color', '#000', 'important');
                            console.log('隐藏歌词');
                        }
                    }
                });

                controller.appendChild(btn);
            }

            loading = false;
        } catch (err) {
            console.error('本地播放器初始化失败:', err);
            loading = false;
        }
    });
</script>

<link rel="stylesheet" href="/libs/aplayer/APlayer.min.css"/>

{#if !loading}
    <div id="aplayer-wrapper" class="fade-in">
        <div id="aplayer"></div>
        <div class="aplayer-lrc-placeholder"></div>
    </div>
{/if}

<!-- 播放器容器 -->
<div id="aplayer"></div>

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
        to { transform: rotate(365deg); }
    }

    .fade-in {
        animation: fadeIn 0.8s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }

    :global(.aplayer) {
        border-radius: 12px;
        margin:0 !important;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 1) !important;
        border-radius: 12px !important;

    }

    /*:global(.aplayer:hover) {*/
    /*    transform: translateY(-2px);*/
    /*    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15) !important;*/
    /*}*/

    :global(.aplayer .aplayer-pic) {
        width: 65px !important;
        height: 65px !important;
    }
    :global(.aplayer.aplayer-withlrc .aplayer-info) {
        margin-left: 65px !important;
        height: 65px !important;
    }
    :global(.aplayer-list) {
        max-height: 300px !important;
        overflow-y: auto !important;
        border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
    }

    :global(.aplayer-lrc) {
        display: none !important;
        opacity: 1 !important;
        height: 20px !important;
        overflow-y: auto !important;
        padding: 40px 14px !important;
        line-height: 1.6 !important;
    }

    :global(.aplayer-lrc p) {
        font-size: 14px !important;
        margin: 5px 0 !important;
        transition: color 0.3s ease;
    }

    :global(.aplayer-lrc::-webkit-scrollbar),
    :global(.aplayer-list::-webkit-scrollbar) {
        width: 6px;
    }

    :global(.aplayer-lrc::-webkit-scrollbar-thumb),
    :global(.aplayer-list::-webkit-scrollbar-thumb) {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
    }
    :global(.aplayer .aplayer-controller) {
        display: block !important;
        flex-direction: column !important;
        gap: 8px !important;
    }

    :global(.aplayer .aplayer-bar-wrap) {
        order: 2 !important; /* 将进度条移动到第二行 */
    }


    :global(.aplayer-bar-wrap) {
        margin: -12px 0 0 5px !important;
    }
    :global(.aplayer .aplayer-controls) {
        order: 1 !important; /* 控制按钮保持第一行 */
        justify-content: space-between !important;
    }

    :global(.aplayer .aplayer-time) {
        position: static !important;
        margin-left: 0 !important;
        padding-top: 4px !important;
    }
    @media (prefers-color-scheme: dark) {
        :global(.aplayer) {
            background: #2a2a2a !important;
        }

        :global(.aplayer-lrc p) {
            color: rgba(255, 255, 255, 0.85) !important;
            text-shadow: 0 0 2px rgba(0, 0, 0, 0.5) !important;
        }

        :global(.aplayer-list li) {
            color: rgba(255, 255, 255, 0.7) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
    }
</style>
