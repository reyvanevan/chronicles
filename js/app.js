import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- STATE ---
let currentUser = null;

// --- DOM ELEMENTS ---
const bottomNav = document.getElementById('bottom-nav');
const addPostBtn = document.getElementById('add-post-btn');
const postModal = document.getElementById('post-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const postForm = document.getElementById('post-form');
const feedContainer = document.getElementById('feed-container');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');

// --- UTILS ---
async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

// --- AUTHENTICATION ---
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        console.log("Logged in as:", user.email);
        if (addPostBtn) addPostBtn.classList.remove('hidden');
        if (loginModal) loginModal.classList.add('hidden');
    } else {
        console.log("Logged out");
        if (addPostBtn) addPostBtn.classList.add('hidden');
    }
});

// Secret Login Trigger (Click Logo 5 Times)
let logoClicks = 0;
const logoTrigger = document.getElementById('secret-login-trigger');
if (logoTrigger) {
    logoTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        logoClicks++;
        if (logoClicks === 5) {
            if (currentUser) {
                if (confirm("Logout?")) signOut(auth);
            } else {
                loginModal.classList.remove('hidden');
            }
            logoClicks = 0;
        }
        setTimeout(() => logoClicks = 0, 2000);
    });
}

// Login Form Submit
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            loginForm.reset();
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    });
}

// --- POSTING ---
if (addPostBtn) {
    addPostBtn.addEventListener('click', () => {
        postModal.classList.remove('hidden');
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        postModal.classList.add('hidden');
    });
}

if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const caption = document.getElementById('post-caption').value;
        const fileInput = document.getElementById('post-image');
        const submitBtn = postForm.querySelector('button[type="submit"]');

        if (!fileInput.files[0]) return alert("Please select an image");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Posting...";

            const imageBase64 = await compressImage(fileInput.files[0]);

            await addDoc(collection(db, "posts"), {
                caption: caption,
                image: imageBase64,
                timestamp: serverTimestamp(),
                likes: 0
            });

            postModal.classList.add('hidden');
            postForm.reset();
            // Reset preview if you had one
        } catch (error) {
            console.error("Post error:", error);
            alert("Failed to post");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Share";
        }
    });
}

// --- FEED RENDER ---
if (feedContainer) {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        feedContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const post = doc.data();
            const date = post.timestamp ? new Date(post.timestamp.toDate()).toLocaleDateString() : 'Just now';

            const article = document.createElement('article');
            article.className = "bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4";

            // Delete button (Only for admin)
            const deleteBtn = currentUser ? `
                <button onclick="window.deletePost('${doc.id}')" class="text-slate-400 hover:text-red-500">
                    <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                </button>
            ` : '';

            article.innerHTML = `
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 p-[2px]">
                            <img src="https://ui-avatars.com/api/?name=Us&background=random" class="w-full h-full rounded-full border-2 border-white dark:border-slate-900 object-cover">
                        </div>
                        <span class="font-semibold text-sm text-slate-900 dark:text-white">us.daily</span>
                    </div>
                    ${deleteBtn}
                </div>

                <!-- Image -->
                <div class="w-full aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src="${post.image}" class="w-full h-full object-cover" loading="lazy">
                </div>

                <!-- Actions -->
                <div class="px-4 py-3">
                    <div class="flex items-center gap-4 mb-2">
                        <button class="hover:opacity-60"><i data-lucide="heart" class="w-6 h-6 text-slate-900 dark:text-white"></i></button>
                        <button class="hover:opacity-60"><i data-lucide="message-circle" class="w-6 h-6 text-slate-900 dark:text-white"></i></button>
                        <button class="hover:opacity-60"><i data-lucide="send" class="w-6 h-6 text-slate-900 dark:text-white"></i></button>
                    </div>
                    
                    <!-- Caption -->
                    <div class="text-sm text-slate-900 dark:text-white">
                        <span class="font-semibold mr-2">us.daily</span>${post.caption}
                    </div>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase">${date}</p>
                </div>
            `;
            feedContainer.appendChild(article);
        });
        lucide.createIcons();
    });
}

// Global Delete Function
window.deletePost = async (id) => {
    if (confirm("Delete this post?")) {
        await deleteDoc(doc(db, "posts", id));
    }
};
