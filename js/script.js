// Init Icons
lucide.createIcons();

// Init AOS
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
});

// Check LocalStorage for Theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

// Toggle Theme Logic
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

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
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('hidden-letter');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
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

// Secret Login Logic
const secretTrigger = document.getElementById('secret-login-trigger');
if (secretTrigger) {
    let logoClickCount = 0;
    secretTrigger.addEventListener('click', (e) => {
        // Karena ini link <a>, kita prevent default kalau mau fitur klik 5x jalan tanpa pindah halaman
        // Tapi kalau user mau tetep pindah halaman, fitur ini agak tricky.
        // Asumsi: User mau fitur ini jalan, jadi kita prevent default kalau belum 5x?
        // Atau biarkan saja, tapi fitur ini mungkin jarang kepake kalau link aktif.
        // Kita tambahkan preventDefault sementara biar logicnya jalan.

        logoClickCount++;
        if (logoClickCount === 5) {
            e.preventDefault();
            alert("Welcome back, Rey! (Login feature coming soon)");
            logoClickCount = 0;
        }

        // Reset count
        setTimeout(() => {
            logoClickCount = 0;
        }, 2000);
    });
}
