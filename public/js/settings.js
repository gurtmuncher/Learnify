const DEFAULT_TITLE = 'Learnify';
const DEFAULT_PANIC_KEY = ']';
const DEFAULT_PANIC_URL = 'https://classroom.google.com';

function updateFavicon(dataUrl) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = dataUrl;
}

document.addEventListener('keydown', (e) => {
    const panicKey = localStorage.getItem('panicKey') || DEFAULT_PANIC_KEY;
    if (e.key === panicKey) {
        const panicUrl = localStorage.getItem('panicURL') || DEFAULT_PANIC_URL;
        window.location.replace(panicUrl);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTitle = localStorage.getItem('pageTitle');
    if (savedTitle) document.title = savedTitle;

    const savedFavicon = localStorage.getItem('favicon');
    if (savedFavicon) updateFavicon(savedFavicon);

    const pageTitleInput = document.getElementById('page-title');
    const faviconUpload = document.getElementById('favicon-upload');
    const panicKeyInput = document.getElementById('panic-key');
    const panicUrlInput = document.getElementById('panic-url');

    if (pageTitleInput) {
        pageTitleInput.value = localStorage.getItem('pageTitle') || '';
        pageTitleInput.addEventListener('input', (e) => {
            const title = e.target.value;
            if (title) {
                localStorage.setItem('pageTitle', title);
                document.title = title;
            } else {
                localStorage.removeItem('pageTitle');
                document.title = DEFAULT_TITLE;
            }
        });
    }

    if (panicKeyInput) {
        panicKeyInput.value = localStorage.getItem('panicKey') || DEFAULT_PANIC_KEY;
        panicKeyInput.addEventListener('input', (e) => {
            const key = e.target.value;
            if (key?.length === 1) {
                localStorage.setItem('panicKey', key.toLowerCase());
            }
        });
    }

    if (panicUrlInput) {
        panicUrlInput.value = localStorage.getItem('panicURL') || DEFAULT_PANIC_URL;
        panicUrlInput.addEventListener('input', (e) => {
            if (e.target.value) {
                localStorage.setItem('panicURL', e.target.value);
            }
        });
    }

    if (faviconUpload) {
        faviconUpload.addEventListener('change', () => {
            const file = faviconUpload.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    localStorage.setItem('favicon', e.target.result);
                    updateFavicon(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});