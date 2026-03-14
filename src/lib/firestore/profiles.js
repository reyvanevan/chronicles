import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config.js';

export const EMAIL_TO_AUTHOR = {
    'partner@example.com': 'rey',
    'her@example.com': 'anya'
};

export const USER_PROFILES = {
    rey: {
        id: 'rey',
        name: 'Partner B',
        displayName: 'Rey',
        email: 'partner@example.com',
        role: 'The Observer',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        accentColor: 'blue'
    },
    anya: {
        id: 'anya',
        name: 'Partner A',
        displayName: 'Her',
        email: 'her@example.com',
        role: 'The Main Character',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        accentColor: 'pink'
    }
};

export async function loadUserAvatarsFromFirestore() {
    try {
        const [reyDoc, herDoc] = await Promise.all([
            getDoc(doc(db, 'landing', 'profileRey')),
            getDoc(doc(db, 'landing', 'profileHer'))
        ]);

        if (reyDoc.exists() && reyDoc.data().photo) {
            USER_PROFILES.rey.avatarUrl = reyDoc.data().photo;
            USER_PROFILES.rey.name = reyDoc.data().name || USER_PROFILES.rey.name;
            USER_PROFILES.rey.displayName = reyDoc.data().name || USER_PROFILES.rey.displayName;
        }

        if (herDoc.exists() && herDoc.data().photo) {
            USER_PROFILES.anya.avatarUrl = herDoc.data().photo;
            USER_PROFILES.anya.name = herDoc.data().name || USER_PROFILES.anya.name;
            USER_PROFILES.anya.displayName = herDoc.data().name || USER_PROFILES.anya.displayName;
        }

        console.log('[FirestoreService] User avatars loaded from Firestore');
        return USER_PROFILES;
    } catch (error) {
        console.warn('[FirestoreService] Could not load avatars from Firestore:', error);
        return USER_PROFILES;
    }
}

export function getAuthorAvatar(authorId) {
    return USER_PROFILES[authorId]?.avatarUrl || USER_PROFILES.rey.avatarUrl;
}

export function getCurrentAuthor(user) {
    if (!user || !user.email) return 'rey';
    return EMAIL_TO_AUTHOR[user.email.toLowerCase()] || 'rey';
}

export function getCurrentUserProfile() {
    const user = auth.currentUser;
    if (!user) return null;

    const email = user.email?.toLowerCase() || '';
    if (email.includes('rey') || email.includes('reyvan')) {
        return USER_PROFILES.rey;
    }
    return USER_PROFILES.anya;
}

export function resolveAuthorId(authorId) {
    const current = getCurrentUserProfile();
    return authorId || current?.id || 'rey';
}
