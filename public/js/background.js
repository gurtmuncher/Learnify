function initWaterBackground() {
    const style = document.createElement('style');
    style.textContent = `
        .water-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
            background: linear-gradient(to bottom, #0077be, #003366);
            perspective: 1000px;
        }
        .water-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            opacity: 0.6;
            will-change: transform, opacity;
        }
        .layer-1 {
            background: repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px);
            background-size: 200px;
            animation: wave-motion-1 20s ease-in-out infinite alternate;
            filter: blur(8px);
            opacity: 0.5;
        }
        .layer-2 {
            background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 60%);
            animation: wave-motion-2 18s linear infinite;
            filter: blur(5px);
            opacity: 0.7;
            transform: translateZ(-50px);
        }
        .layer-3 {
            background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
            animation: wave-motion-3 22s ease infinite alternate-reverse;
            filter: blur(6px);
            opacity: 0.6;
            transform: translateZ(-100px);
        }
        .water-highlights {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at var(--highlight-x, 50%) var(--highlight-y, 25%), rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 30%);
            mix-blend-mode: screen;
            opacity: var(--highlight-opacity, 0.7);
            will-change: transform, opacity;
        }
        .particle-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        .particle {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            animation: particle-fade-out 1s ease-out forwards;
            will-change: transform, opacity;
        }
        @keyframes wave-motion-1 {
            0% { transform: scale(1, 1) translate(0, 0) rotate(0deg); }
            50% { transform: scale(1.03, 0.97) translate(30px, 15px) rotate(1deg); }
            100% { transform: scale(1, 1) translate(0, 0) rotate(0deg); }
        }
        @keyframes wave-motion-2 {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(50px, 20px) rotate(2deg); }
        }
        @keyframes wave-motion-3 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-40px, -15px) rotate(-1deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes particle-fade-out {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--particle-end-x), var(--particle-end-y)) scale(0.2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const bg = document.createElement('div');
    bg.className = 'water-background';
    bg.innerHTML = `
        <div class="water-layer layer-1"></div>
        <div class="water-layer layer-2"></div>
        <div class="water-layer layer-3"></div>
        <div class="water-highlights"></div>
        <div class="particle-container"></div>
    `;
    document.body.prepend(bg);

    const waterHighlights = bg.querySelector('.water-highlights');
    const particleContainer = bg.querySelector('.particle-container');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function updateHighlightPosition() {
        const targetX = (mouseX / window.innerWidth) * 100;
        const targetY = (mouseY / window.innerHeight) * 100;
        const currentX = parseFloat(waterHighlights.style.getPropertyValue('--highlight-x') || 50);
        const currentY = parseFloat(waterHighlights.style.getPropertyValue('--highlight-y') || 50);
        const lerpFactor = 0.05;
        const newX = currentX + (targetX - currentX) * lerpFactor;
        const newY = currentY + (targetY - currentY) * lerpFactor;
        waterHighlights.style.setProperty('--highlight-x', `${newX}%`);
        waterHighlights.style.setProperty('--highlight-y', `${newY}%`);
        waterHighlights.style.setProperty('--highlight-opacity', '0.8');
    }

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        const endX = (Math.random() - 0.5) * 100;
        const endY = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--particle-end-x', `${endX}px`);
        particle.style.setProperty('--particle-end-y', `${endY}px`);
        particleContainer.appendChild(particle);
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    let lastParticleTime = 0;
    const particleInterval = 100;

    document.addEventListener('mousemove', (event) => {
        const currentTime = Date.now();
        if (currentTime - lastParticleTime > particleInterval) {
            createParticle(event.clientX + (Math.random() - 0.5) * 10, event.clientY + (Math.random() - 0.5) * 10);
            lastParticleTime = currentTime;
        }
    });

    function animate() {
        updateHighlightPosition();
        requestAnimationFrame(animate);
    }

    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaterBackground);
} else {
    initWaterBackground();
}