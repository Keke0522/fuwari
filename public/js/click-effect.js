document.addEventListener("click", function (e) {
    const symbols = ["◇", "◆", "✦", "✧", "⟁", "⟡", "⧫", "⬣", "✴", "⛶"];
    const colors = ["#ff6b81", "#f368e0", "#ff9f43", "#48dbfb", "#1dd1a1", "#a29bfe"];

    const count = 12; // 每次爆炸数量

    // playClickSound();

    for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "click-particle";
        particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        document.body.appendChild(particle);

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 16 + "px";
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100 + 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const scale = Math.random() * 0.6 + 0.7;
        const rotate = Math.random() * 360;

        particle.style.left = e.clientX + "px";
        particle.style.top = e.clientY + "px";
        particle.style.color = color;
        particle.style.fontSize = size;
        particle.style.transform = `translate(0, 0) scale(${scale}) rotate(${rotate}deg)`;

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            particle.style.opacity = 0;
        });

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
});

function playClickSound() {
    const audio = new Audio("/mp3/pick-922761.mp3");
    audio.volume = 0.3; // 音量大小
    audio.play().catch(() => {}); // 兼容某些浏览器首次点击后才允许播放
}
