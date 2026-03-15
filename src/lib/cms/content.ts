import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config.js';

declare const lucide: any;
const win = window as any;

// ─── Shared button helpers ────────────────────────────────────────────────────

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

function setBtnError(btn: HTMLButtonElement, originalText: string, fromColor: string) {
    btn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i> Error!';
    btn.classList.add('bg-red-500');
    btn.disabled = false;
    lucide.createIcons();
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-red-500');
        btn.classList.add(fromColor);
    }, 1000);
}

// ─── Save Memories ────────────────────────────────────────────────────────────

win.saveMemories = async function () {
    const btn = (event as any).target.closest('button') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    setBtnSaving(btn);
    try {
        const iconColors = ['pink', 'blue', 'yellow'];
        const icons      = ['smile', 'heart', 'sparkles'];
        const items = Array.from({ length: 3 }, (_, i) => {
            const n     = i + 1;
            const title = document.getElementById(`mem${n}-title`) as HTMLInputElement;
            const desc  = document.getElementById(`mem${n}-desc`)  as HTMLTextAreaElement;
            const img   = document.getElementById(`mem${n}`)        as HTMLImageElement;
            let imageSrc = img?.src || null;
            if (imageSrc && (imageSrc === '' || imageSrc === win.location.href || imageSrc.startsWith('blob:'))) imageSrc = null;
            return { id: n, title: title?.value || '', description: desc?.value || '', icon: icons[i], iconColor: iconColors[i], image: imageSrc, order: n };
        });
        await setDoc(doc(db, 'landing', 'memories'), { items, updatedAt: new Date() });
        setBtnSuccess(btn, originalText, 'bg-purple-500');
    } catch (error: any) {
        console.error('Save memories error:', error);
        setBtnError(btn, originalText, 'bg-purple-500');
        setTimeout(() => alert('Failed to save: ' + error.message), 1100);
    }
};

// ─── Save Gallery (Landing) ───────────────────────────────────────────────────

win.saveGallery = async function () {
    const btn = (event as any).target.closest('button') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    setBtnSaving(btn);
    try {
        const items = Array.from({ length: 4 }, (_, i) => {
            const n   = i + 1;
            const img = document.getElementById(`gal${n}`) as HTMLImageElement;
            const cap = document.getElementById(`gal${n}-caption`) as HTMLInputElement;
            let imageSrc = img?.src || '';
            if (imageSrc === win.location.href || imageSrc.startsWith('blob:')) imageSrc = '';
            return { id: n, url: imageSrc, caption: cap?.value || '', order: n };
        });
        await setDoc(doc(db, 'landing', 'gallery'), { items, updatedAt: new Date() });
        setBtnSuccess(btn, originalText, 'bg-blue-500');
    } catch (error: any) {
        console.error('Save gallery error:', error);
        setBtnError(btn, originalText, 'bg-blue-500');
        setTimeout(() => alert('Failed to save: ' + error.message), 1100);
    }
};

// ─── Save Letter ──────────────────────────────────────────────────────────────

win.saveLetter = async function () {
    const btn = (event as any).target.closest('button') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    setBtnSaving(btn);
    try {
        await setDoc(doc(db, 'landing', 'letter'), {
            title:   (document.getElementById('letter-title')   as HTMLInputElement).value,
            content: (document.getElementById('letter-content') as HTMLTextAreaElement).value,
            quote:   (document.getElementById('letter-quote')   as HTMLInputElement).value,
            updatedAt: new Date()
        });
        setBtnSuccess(btn, originalText, 'bg-red-500');
    } catch (error: any) {
        console.error('Save letter error:', error);
        btn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i> Error!';
        btn.disabled = false;
        lucide.createIcons();
        setTimeout(() => { alert('Failed to save: ' + error.message); btn.innerHTML = originalText; }, 1000);
    }
};

