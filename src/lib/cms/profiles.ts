import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config.js';

declare const lucide: any;
const win = window as any;

// ─── Shared button feedback helpers ──────────────────────────────────────────

function setBtnSaving(btn: HTMLButtonElement) {
    btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Saving...';
    btn.disabled = true;
    lucide.createIcons();
}

function setBtnSuccess(btn: HTMLButtonElement, originalText: string, fromColor: string) {
    btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Saved!';
    btn.classList.replace(fromColor, 'bg-green-500');
    lucide.createIcons();
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.replace('bg-green-500', fromColor);
        btn.disabled = false;
        lucide.createIcons();
    }, 2000);
}

function setBtnError(btn: HTMLButtonElement) {
    btn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i> Error!';
    btn.classList.add('bg-red-500');
    btn.disabled = false;
    lucide.createIcons();
}

// ─── Save functions ───────────────────────────────────────────────────────────

win.saveProfile = async function () {
    const btn = (event as any).target.closest('button') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    setBtnSaving(btn);
    try {
        await setDoc(doc(db, 'landing', 'profile'), {
            name:  (document.getElementById('input-name')  as HTMLInputElement).value,
            title: (document.getElementById('input-title') as HTMLInputElement).value,
            bio:   (document.getElementById('input-bio')   as HTMLTextAreaElement).value,
            photo: (document.getElementById('profilePreview') as HTMLImageElement).src,
            tags:  ['input-tag1', 'input-tag2', 'input-tag3'].map(id => (document.getElementById(id) as HTMLInputElement).value),
            updatedAt: new Date()
        });
        setBtnSuccess(btn, originalText, 'bg-brand-accent');
    } catch (error: any) {
        console.error('Save error:', error); setBtnError(btn);
    }
};

win.savePrincessProfile = async function () {
    const btn = document.getElementById('btn-save-princess-profile') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    setBtnSaving(btn);
    try {
        await setDoc(doc(db, 'landing', 'profileHer'), {
            name:  (document.getElementById('input-princess-name')  as HTMLInputElement).value,
            title: (document.getElementById('input-princess-title') as HTMLInputElement).value,
            bio:   (document.getElementById('input-princess-bio')   as HTMLTextAreaElement).value,
            photo: (document.getElementById('princessProfilePreview') as HTMLImageElement).src,
            gallery: win.princessGallery || [],
            stats: [0, 1, 2, 3].map(i => ({
                label: ((document.getElementById(`stat-her-label-${i}`) as HTMLInputElement)?.value || ''),
                value: ((document.getElementById(`stat-her-value-${i}`) as HTMLInputElement)?.value || ''),
            })),
            updatedAt: new Date()
        });
        setBtnSuccess(btn, originalText, 'bg-pink-500');
    } catch (error: any) {
        console.error('Save error:', error); setBtnError(btn);
    }
};

win.saveReyProfile = async function () {
    const btn = document.getElementById('btn-save-rey-profile') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    setBtnSaving(btn);
    try {
        await setDoc(doc(db, 'landing', 'profileRey'), {
            name:    (document.getElementById('input-rey-name')  as HTMLInputElement).value,
            title:   (document.getElementById('input-rey-title') as HTMLInputElement).value,
            bio:     (document.getElementById('input-rey-bio')   as HTMLTextAreaElement).value,
            photo:   (document.getElementById('reyProfilePreview') as HTMLImageElement).src,
            stickers: win.currentReyStickers || [],
            gallery:  win.guardianGallery || [],
            stats: [0, 1, 2, 3].map(i => ({
                label: ((document.getElementById(`stat-rey-label-${i}`) as HTMLInputElement)?.value || ''),
                value: ((document.getElementById(`stat-rey-value-${i}`) as HTMLInputElement)?.value || ''),
            })),
            updatedAt: new Date()
        });
        setBtnSuccess(btn, originalText, 'bg-blue-500');
    } catch (error: any) {
        console.error('Save error:', error); setBtnError(btn);
    }
};
