import { db } from '../firebase-config.js';
import { doc, setDoc } from 'firebase/firestore';
import { compressImageToBase64 } from '../firestore-service.js';

declare const lucide: any;

// ─── Helpers ───────────────────────────────────────────────────────────────

const win = window as any;

const emptyGridHTML = `
    <div class="col-span-full text-center py-8">
        <div class="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <i data-lucide="image" class="w-6 h-6 text-slate-400"></i>
        </div>
        <p class="text-slate-400 text-sm">No photos yet</p>
        <p class="text-slate-400 text-xs">Click "Add Photo" to upload</p>
    </div>`;

function photoCardHTML(type: 'princess' | 'guardian', photo: any, idx: number): string {
    const removeFn  = type === 'princess' ? 'removePrincessPhoto'       : 'removeGuardianPhoto';
    const captionFn = type === 'princess' ? 'updatePrincessPhotoCaption' : 'updateGuardianPhotoCaption';
    return `
        <div class="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src="${photo.url}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                <div class="flex gap-2">
                    <button onclick="togglePhotoVisibility('${type}', ${idx})" class="p-2 rounded-full ${photo.showOnProfile ? 'bg-green-500' : 'bg-slate-500'} text-white hover:scale-110 transition">
                        <i data-lucide="${photo.showOnProfile ? 'eye' : 'eye-off'}" class="w-4 h-4"></i>
                    </button>
                    <button onclick="${removeFn}(${idx})" class="p-2 rounded-full bg-red-500 text-white hover:scale-110 transition">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
                <input type="text" value="${photo.caption || ''}" onchange="${captionFn}(${idx}, this.value)"
                    class="w-full text-xs text-center bg-transparent border-b border-white/30 text-white placeholder-white/50 py-1 focus:outline-none" placeholder="Caption...">
            </div>
            ${photo.showOnProfile ? '<span class="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></span>' : ''}
        </div>`;
}

// ─── Render ─────────────────────────────────────────────────────────────────

export function renderStickers(stickers: string[]): void {
    const container = document.getElementById('rey-stickers-display');
    if (!container) return;
    container.innerHTML = stickers?.length > 0
        ? stickers.map(s => `<span class="text-2xl hover:scale-110 transition cursor-default" title="Added by Anya">${s}</span>`).join('')
        : '<span class="text-slate-400 text-xs" id="no-stickers-msg">No stickers yet 💕</span>';
}

export function renderPrincessGallery(gallery: any[]): void {
    const container = document.getElementById('princess-gallery-grid');
    if (!container) return;
    container.innerHTML = gallery?.length > 0
        ? gallery.map((p, i) => photoCardHTML('princess', p, i)).join('')
        : emptyGridHTML;
    lucide.createIcons();
}

export function renderGuardianGallery(gallery: any[]): void {
    const container = document.getElementById('guardian-gallery-grid');
    if (!container) return;
    container.innerHTML = gallery?.length > 0
        ? gallery.map((p, i) => photoCardHTML('guardian', p, i)).join('')
        : emptyGridHTML;
    lucide.createIcons();
}

// ─── Photo CRUD ──────────────────────────────────────────────────────────────

win.togglePhotoVisibility = (type: string, idx: number) => {
    if (type === 'princess') {
        win.princessGallery[idx].showOnProfile = !win.princessGallery[idx].showOnProfile;
        renderPrincessGallery(win.princessGallery);
    } else {
        win.guardianGallery[idx].showOnProfile = !win.guardianGallery[idx].showOnProfile;
        renderGuardianGallery(win.guardianGallery);
    }
};

win.updatePrincessPhotoCaption = (idx: number, caption: string) => { win.princessGallery[idx].caption = caption; };
win.updateGuardianPhotoCaption = (idx: number, caption: string) => { win.guardianGallery[idx].caption = caption; };

win.removePrincessPhoto = (idx: number) => {
    if (confirm('Remove this photo?')) { win.princessGallery.splice(idx, 1); renderPrincessGallery(win.princessGallery); }
};
win.removeGuardianPhoto = (idx: number) => {
    if (confirm('Remove this photo?')) { win.guardianGallery.splice(idx, 1); renderGuardianGallery(win.guardianGallery); }
};

// ─── Upload Modal ────────────────────────────────────────────────────────────

win.currentGalleryTarget = null;

win.openGalleryUploadModal = (target: string) => {
    win.currentGalleryTarget = target;
    document.getElementById('gallery-upload-modal')?.classList.remove('hidden');
    const preview = document.getElementById('gallery-upload-preview') as HTMLImageElement;
    if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    document.getElementById('gallery-upload-placeholder')?.classList.remove('hidden');
    (document.getElementById('gallery-upload-caption') as HTMLInputElement).value = '';
    (document.getElementById('gallery-file-input') as HTMLInputElement).value = '';
    const titleEl = document.getElementById('gallery-modal-title');
    if (titleEl) titleEl.textContent = target === 'princess' ? 'Add Photo - Princess Gallery' : 'Add Photo - Guardian Gallery';
};

win.closeGalleryUploadModal = () => {
    document.getElementById('gallery-upload-modal')?.classList.add('hidden');
    win.currentGalleryTarget = null;
};

win.handleGalleryFileSelect = (input: HTMLInputElement) => {
    if (input.files?.[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('gallery-upload-preview') as HTMLImageElement;
            if (preview) { preview.src = e.target!.result as string; preview.classList.remove('hidden'); }
            document.getElementById('gallery-upload-placeholder')?.classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
};

win.submitGalleryPhoto = async () => {
    const fileInput = document.getElementById('gallery-file-input') as HTMLInputElement;
    const caption   = (document.getElementById('gallery-upload-caption') as HTMLInputElement).value.trim();
    const submitBtn = document.getElementById('gallery-submit-btn') as HTMLButtonElement;
    if (!fileInput.files?.[0]) { alert('Please select an image first'); return; }
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Uploading...';
        lucide.createIcons();
        const base64Image = await compressImageToBase64(fileInput.files[0], 800, 0.8);
        const newPhoto    = { id: Date.now(), url: base64Image, caption, showOnProfile: true };
        if (win.currentGalleryTarget === 'princess') {
            win.princessGallery = [...(win.princessGallery || []), newPhoto];
            renderPrincessGallery(win.princessGallery);
        } else {
            win.guardianGallery = [...(win.guardianGallery || []), newPhoto];
            renderGuardianGallery(win.guardianGallery);
        }
        submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Added!';
        submitBtn.classList.replace('bg-blue-500', 'bg-green-500');
        lucide.createIcons();
        setTimeout(() => {
            win.closeGalleryUploadModal();
            submitBtn.innerHTML = '<i data-lucide="upload" class="w-4 h-4"></i> Add Photo';
            submitBtn.classList.replace('bg-green-500', 'bg-blue-500');
            submitBtn.disabled = false;
            lucide.createIcons();
        }, 1000);
    } catch (error: any) {
        console.error('Upload error:', error);
        alert('Failed to upload: ' + error.message);
        submitBtn.innerHTML = '<i data-lucide="upload" class="w-4 h-4"></i> Add Photo';
        submitBtn.disabled = false;
        lucide.createIcons();
    }
};

win.addPrincessGalleryPhoto = () => win.openGalleryUploadModal('princess');
win.addGuardianGalleryPhoto = () => win.openGalleryUploadModal('guardian');

// ─── Stickers ────────────────────────────────────────────────────────────────

win.addSticker = async (emoji: string) => {
    if (win.currentUserRole?.role !== 'princess') return;
    try {
        const stickers: string[] = [...(win.currentReyStickers || []), emoji];
        win.currentReyStickers = stickers;
        await setDoc(doc(db, 'landing', 'profileRey'), { stickers, updatedAt: new Date() }, { merge: true });
        renderStickers(stickers);
        const picker = document.getElementById('sticker-picker');
        picker?.classList.add('animate-pulse');
        setTimeout(() => picker?.classList.remove('animate-pulse'), 500);
    } catch (error) {
        console.error('Error adding sticker:', error);
    }
};
