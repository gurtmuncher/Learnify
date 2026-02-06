function openGame(url, name) {
    const overlay = document.createElement('div');
    overlay.id = 'game-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:1000;';

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = 'width:100%;height:100%;border:none;';

    const controls = document.createElement('div');
    controls.style.cssText = 'position:fixed;top:1rem;right:1rem;display:flex;gap:0.5rem;z-index:1001;opacity:0;transition:opacity 0.2s;';

    const newTabBtn = document.createElement('button');
    newTabBtn.textContent = '↗';
    newTabBtn.style.cssText = 'background:rgba(255,255,255,0.05);color:#fff;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.85rem;transition:all 0.2s;';
    newTabBtn.onmouseover = () => { newTabBtn.style.background = 'rgba(255,255,255,0.08)'; };
    newTabBtn.onmouseout = () => { newTabBtn.style.background = 'rgba(255,255,255,0.05)'; };
    newTabBtn.onclick = () => openInNewTab(url);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'background:rgba(255,255,255,0.05);color:#fff;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.85rem;transition:all 0.2s;';
    closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,255,255,0.08)'; };
    closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.05)'; };
    closeBtn.onclick = closeGame;

    controls.appendChild(newTabBtn);
    controls.appendChild(closeBtn);

    overlay.appendChild(iframe);
    overlay.appendChild(controls);
    document.body.appendChild(overlay);

    overlay.onmousemove = () => {
        controls.style.opacity = '1';
        clearTimeout(overlay.hideTimer);
        overlay.hideTimer = setTimeout(() => { controls.style.opacity = '0'; }, 2000);
    };

    setTimeout(() => { controls.style.opacity = '1'; }, 100);
    overlay.hideTimer = setTimeout(() => { controls.style.opacity = '0'; }, 3000);
}

function closeGame() {
    const overlay = document.getElementById('game-overlay');
    if (overlay) overlay.remove();
}

function openInNewTab(url) {
    const win = window.open('about:blank', '_blank');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Learnify</title></head>
        <body style="margin:0;overflow:hidden;">
        <iframe src="${url}" style="width:100vw;height:100vh;border:none;"></iframe>
        </body>
        </html>
    `);
    win.document.close();
}

document.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
        e.preventDefault();
        const url = card.getAttribute('href');
        const name = card.querySelector('span')?.textContent || 'Game';
        openGame(url, name);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('game-overlay');
        if (overlay) {
            closeGame();
        } else {
            window.location.href = 'https://classroom.google.com';
        }
    }
});