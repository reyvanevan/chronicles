import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config.js';
import { renderGuardianGallery, renderPrincessGallery, renderStickers } from './gallery.js';

export async function loadDashboardData(): Promise<void> {
    try {
        // Profile (Landing Page)
        const profileDoc = await getDoc(doc(db, 'landing', 'profile'));
        if (profileDoc.exists()) {
            const p = profileDoc.data();
            (document.getElementById('input-name') as HTMLInputElement).value = p.name || '';
            (document.getElementById('input-title') as HTMLInputElement).value = p.title || '';
            (document.getElementById('input-bio') as HTMLTextAreaElement).value = p.bio || '';
            (document.getElementById('profilePreview') as HTMLImageElement).src = p.photo || '';
            if (p.tags) {
                (document.getElementById('input-tag1') as HTMLInputElement).value = p.tags[0] || '';
                (document.getElementById('input-tag2') as HTMLInputElement).value = p.tags[1] || '';
                (document.getElementById('input-tag3') as HTMLInputElement).value = p.tags[2] || '';
            }
        }

        // Stats
        const statsDoc = await getDoc(doc(db, 'landing', 'stats'));
        if (statsDoc.exists()) {
            const s = statsDoc.data();
            const el = (id: string) => document.getElementById(id);
            if (el('stat-visits')) el('stat-visits')!.textContent = s.totalVisits?.toLocaleString() || '0';
            if (el('stat-memories')) el('stat-memories')!.textContent = s.memoriesCount || '0';
            if (s.startDate && el('stat-days')) {
                const start = s.startDate.toDate ? s.startDate.toDate() : new Date(s.startDate);
                el('stat-days')!.textContent = Math.floor((Date.now() - start.getTime()) / 86400000).toLocaleString();
            }
        }

        // Gallery (Landing)
        const galleryDoc = await getDoc(doc(db, 'landing', 'gallery'));
        if (galleryDoc.exists()) {
            galleryDoc.data().items?.forEach((item: any, i: number) => {
                const img = document.getElementById(`gal${i + 1}`) as HTMLImageElement;
                const cap = document.getElementById(`gal${i + 1}-caption`) as HTMLInputElement;
                if (img) img.src = item.url;
                if (cap) cap.value = item.caption;
            });
        }

        // Memories
        const memoriesDoc = await getDoc(doc(db, 'landing', 'memories'));
        if (memoriesDoc.exists()) {
            memoriesDoc.data().items?.forEach((item: any, i: number) => {
                const title = document.getElementById(`mem${i + 1}-title`) as HTMLInputElement;
                const desc  = document.getElementById(`mem${i + 1}-desc`) as HTMLTextAreaElement;
                const img   = document.getElementById(`mem${i + 1}`) as HTMLImageElement;
                if (title) title.value = item.title;
                if (desc)  desc.value  = item.description;
                if (img && item.image) img.src = item.image;
            });
        }

        // Letter
        const letterDoc = await getDoc(doc(db, 'landing', 'letter'));
        if (letterDoc.exists()) {
            const l = letterDoc.data();
            const cfg = (window as any).siteConfig;
            const defaultGreeting = cfg?.letter?.defaultGreeting || 'Hai Anya...';
            const defaultClosing  = cfg?.letter?.defaultClosing  || 'I love you, today and forever.';
            const get = (id: string) => document.getElementById(id);
            (get('letter-title') as HTMLInputElement).value  = l.title || '';
            (get('letter-content') as HTMLTextAreaElement).value = l.content || '';
            (get('letter-quote') as HTMLInputElement).value  = l.quote || '';
            if (get('letter-preview-title'))   get('letter-preview-title')!.textContent = l.title || defaultGreeting;
            if (get('letter-preview-content')) get('letter-preview-content')!.textContent = l.content || 'Your message will appear here...';
            if (get('letter-preview-quote'))   get('letter-preview-quote')!.textContent = '"' + (l.quote || defaultClosing) + '"';
        }

        // Princess Profile
        const herDoc = await getDoc(doc(db, 'landing', 'profileHer'));
        if (herDoc.exists()) {
            const h = herDoc.data();
            (document.getElementById('input-princess-name') as HTMLInputElement).value = h.name || '';
            (document.getElementById('input-princess-title') as HTMLInputElement).value = h.title || '';
            (document.getElementById('input-princess-bio') as HTMLTextAreaElement).value = h.bio || '';
            (document.getElementById('princessProfilePreview') as HTMLImageElement).src = h.photo || '';
            if (h.stats && Array.isArray(h.stats)) {
                h.stats.forEach((stat: any, i: number) => {
                    const lbl = document.getElementById(`stat-her-label-${i}`) as HTMLInputElement;
                    const val = document.getElementById(`stat-her-value-${i}`) as HTMLInputElement;
                    if (lbl) lbl.value = stat.label || '';
                    if (val) val.value = stat.value || '';
                });
            }
            const gallery = h.gallery?.length > 0 ? h.gallery : [];
            (window as any).princessGallery = gallery;
            renderPrincessGallery(gallery);
        }

        // Rey (Guardian) Profile
        const reyDoc = await getDoc(doc(db, 'landing', 'profileRey'));
        if (reyDoc.exists()) {
            const r = reyDoc.data();
            (document.getElementById('input-rey-name') as HTMLInputElement).value = r.name || '';
            (document.getElementById('input-rey-title') as HTMLInputElement).value = r.title || '';
            (document.getElementById('input-rey-bio') as HTMLTextAreaElement).value = r.bio || '';
            (document.getElementById('reyProfilePreview') as HTMLImageElement).src = r.photo || '';
            if (r.stats && Array.isArray(r.stats)) {
                r.stats.forEach((stat: any, i: number) => {
                    const lbl = document.getElementById(`stat-rey-label-${i}`) as HTMLInputElement;
                    const val = document.getElementById(`stat-rey-value-${i}`) as HTMLInputElement;
                    if (lbl) lbl.value = stat.label || '';
                    if (val) val.value = stat.value || '';
                });
            }
            const avatar = document.getElementById('sidebarAdminAvatar') as HTMLImageElement;
            const name   = document.getElementById('sidebarAdminName');
            if (avatar && r.photo) avatar.src = r.photo;
            if (name && r.name)   name.textContent = r.name;
            const stickers = r.stickers?.length > 0 ? r.stickers : [];
            (window as any).currentReyStickers = stickers;
            renderStickers(stickers);
            const gallery = r.gallery?.length > 0 ? r.gallery : [];
            (window as any).guardianGallery = gallery;
            renderGuardianGallery(gallery);
        }

        await checkUserRole();
        console.log('✅ Dashboard loaded');
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function checkUserRole(): Promise<void> {
    const currentUser = (window as any).currentUser;
    if (!currentUser) return;
    try {
        let foundUser: any = null;
        for (const userId of ['rey', 'anya']) {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists() && userDoc.data().email === currentUser.email) {
                foundUser = { id: userId, ...userDoc.data() };
                break;
            }
        }
        (window as any).currentUserRole = foundUser;
        if (foundUser?.role === 'princess') {
            const hide = (id: string) => { const el = document.getElementById(id); if (el) el.style.display = 'none'; };
            const disable = (id: string) => {
                const el = document.getElementById(id) as HTMLInputElement;
                if (el) { el.disabled = true; el.classList.add('opacity-60', 'cursor-not-allowed'); }
            };
            hide('btn-save-rey-profile');
            hide('rey-photo-overlay');
            hide('rey-photo-input');
            disable('input-rey-name');
            disable('input-rey-bio');
            document.getElementById('sticker-picker')?.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error checking user role:', error);
    }
}
