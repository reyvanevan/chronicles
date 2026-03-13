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

// Music Logic
function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');
    if (audio && btn) {
        if (audio.paused) {
            audio.play();
            btn.classList.add('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
        } else {
            audio.pause();
            btn.classList.remove('ring-4', 'ring-brand-pink/30', 'dark:ring-brand-accent/20');
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
