import { db } from '../firebase-config.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { compressImageToBase64, toggleLoveProgressVisibility } from '../firestore-service.js';

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

// ─── Sasuke / Love Progress ───────────────────────────────────────────────────

export async function loadSasukeImage(): Promise<void> {
    try {
        const cfg       = (window as any).siteConfig;
        const sasukeDoc = await getDoc(doc(db, 'landing', 'sasukeImage'));
        if (sasukeDoc.exists()) {
            const d = sasukeDoc.data();
            const preview = document.getElementById('sasukePreview')     as HTMLImageElement;
            const nameEl  = document.getElementById('sasukeName')        as HTMLInputElement;
            const descEl  = document.getElementById('sasukeDescription') as HTMLInputElement;
            if (preview) preview.src  = d.url || '';
            if (nameEl)  nameEl.value = d.name        || cfg?.zeroMarker?.name        || 'Sasuke Uchiha';
            if (descEl)  descEl.value = d.description || cfg?.zeroMarker?.description || '0% - Stranger/Friendzone marker';
        }
        const progressDoc = await getDoc(doc(db, 'landing', 'loveProgress'));
        const isVisible   = progressDoc.exists() ? (progressDoc.data().isVisible ?? true) : true;
        const toggleBtn   = document.getElementById('loveProgressVisibilityToggle') as HTMLInputElement;
        const label       = document.getElementById('visibilityToggleLabel');
        if (toggleBtn) toggleBtn.checked = isVisible;
        if (label)     label.textContent  = isVisible ? 'Visible' : 'Hidden';
    } catch (error) {
        console.error('Error loading Sasuke image:', error);
    }
}

win.saveSasukeImage = async function () {
    const fileInput = document.getElementById('sasukeImageInput')   as HTMLInputElement;
    const name      = (document.getElementById('sasukeName')        as HTMLInputElement).value.trim();
    const desc      = (document.getElementById('sasukeDescription') as HTMLInputElement).value.trim();
    const saveBtn   = document.getElementById('saveSasukeBtn')      as HTMLButtonElement;
    if (!fileInput.files?.[0]) { alert('Please select an image first'); return; }
    if (!name)                  { alert('Please enter a name/label'); return; }
    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Saving...';
        lucide.createIcons();
        const base64Image = await compressImageToBase64(fileInput.files[0], 600, 0.8);
        await setDoc(doc(db, 'landing', 'sasukeImage'), { url: base64Image, name, description: desc, updatedAt: serverTimestamp() });
        saveBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Saved!';
        saveBtn.classList.replace('bg-brand-accent', 'bg-green-600');
        lucide.createIcons();
        setTimeout(() => {
            saveBtn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save Image';
            saveBtn.classList.replace('bg-green-600', 'bg-brand-accent');
            saveBtn.disabled = false;
            lucide.createIcons();
        }, 2000);
    } catch (error: any) {
        console.error('Save error:', error);
        alert('Failed to save image: ' + error.message);
        saveBtn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save Image';
        saveBtn.disabled = false;
        lucide.createIcons();
    }
};

win.toggleLoveProgress = async function () {
    const toggleBtn = document.getElementById('loveProgressVisibilityToggle') as HTMLInputElement;
    const label     = document.getElementById('visibilityToggleLabel');
    const isVisible = toggleBtn.checked;
    try {
        if (label) label.textContent = 'Saving...';
        await toggleLoveProgressVisibility(isVisible);
        if (label) label.textContent = isVisible ? 'Visible' : 'Hidden';
    } catch (error) {
        console.error('Error toggling visibility:', error);
        alert('Failed to update visibility setting');
        toggleBtn.checked = !isVisible;
        if (label) label.textContent = toggleBtn.checked ? 'Visible' : 'Hidden';
    }
};
