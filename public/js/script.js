// Init Icons
lucide.createIcons();

// Init AOS
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
});

// Theme Logic is handled in Layout.astro to prevent FOUC

let lastLetterTrigger = null;
let musicStatusTimer = null;

// Mobile Menu Logic
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Modal Logic
function openModal() {
    const modal = document.getElementById('hidden-letter');
    if (modal) {
        lastLetterTrigger = document.activeElement;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        const closeButton = modal.querySelector('button');
        if (closeButton) {
            closeButton.focus();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('hidden-letter');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    if (lastLetterTrigger && typeof lastLetterTrigger.focus === 'function') {
        lastLetterTrigger.focus();
    }
}

function handleLetterTriggerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
    }
}

function setMusicStatus(message, tone = 'info') {
    const status = document.getElementById('musicStatus');
    if (!status) return;

    status.classList.remove('hidden', 'text-slate-600', 'dark:text-slate-300', 'text-red-600', 'dark:text-red-400', 'border-red-200', 'dark:border-red-500/30', 'bg-red-50/90', 'dark:bg-red-500/10');
    status.textContent = message;

    if (tone === 'error') {
        status.classList.add('text-red-600', 'dark:text-red-400', 'border-red-200', 'dark:border-red-500/30', 'bg-red-50/90', 'dark:bg-red-500/10');
    } else {
        status.classList.add('text-slate-600', 'dark:text-slate-300');
    }

    if (musicStatusTimer) {
        clearTimeout(musicStatusTimer);
    }

    musicStatusTimer = setTimeout(() => {
        status.classList.add('hidden');
        status.textContent = '';
    }, tone === 'error' ? 5000 : 2500);
}

// Music Logic
function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');
    if (audio && btn) {
        if (audio.paused) {
            setMusicStatus('Mencoba memutar musik...');
            audio.play()
                .then(() => {
                    btn.classList.add('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
                    btn.setAttribute('aria-label', 'Jeda musik latar');
                    setMusicStatus('Musik diputar.');
                })
                .catch(() => {
                    btn.classList.remove('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
                    btn.setAttribute('aria-label', 'Putar musik latar');
                    setMusicStatus('Browser menahan autoplay atau file audio gagal diputar.', 'error');
                });
        } else {
            audio.pause();
            btn.classList.remove('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
            btn.setAttribute('aria-label', 'Putar musik latar');
            setMusicStatus('Musik dijeda.');
        }
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 10) {
            header.classList.add('shadow-sm');
        } else {
            header.classList.remove('shadow-sm');
        }
    }
});

// Secret Login Logic handled in index.html

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const modal = document.getElementById('hidden-letter');
    if (modal && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');
    if (!audio || !btn) return;

    audio.addEventListener('error', () => {
        btn.classList.remove('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
        btn.setAttribute('aria-label', 'Musik latar tidak tersedia');
        setMusicStatus('File musik tidak ditemukan atau gagal dimuat.', 'error');
    });

    audio.addEventListener('ended', () => {
        btn.classList.remove('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
        btn.setAttribute('aria-label', 'Putar musik latar');
    });
});
