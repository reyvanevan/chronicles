import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase-config.js';
import { getCurrentAuthor } from './profiles.js';

export const LOVE_MILESTONES = {
    0: { emoji: '💔', message: 'Starting from zero...', color: 'slate' },
    10: { emoji: '🌱', message: 'A small seed of hope', color: 'slate' },
    20: { emoji: '💙', message: 'Dia bilang 20%... dan itu sudah bikin aku senyum seharian.', color: 'blue' },
    30: { emoji: '🌸', message: 'Perlahan tapi pasti...', color: 'blue' },
    40: { emoji: '💜', message: 'Getting closer each day', color: 'purple' },
    50: { emoji: '💗', message: 'Halfway there! Keep going...', color: 'pink' },
    60: { emoji: '💕', message: 'More than friends now?', color: 'pink' },
    70: { emoji: '💖', message: 'Almost there... I can feel it', color: 'pink' },
    80: { emoji: '💝', message: 'So close to home...', color: 'rose' },
    90: { emoji: '💘', message: 'Just a little more...', color: 'rose' },
    100: { emoji: '❤️', message: 'Welcome back, my love. Aku pulang.', color: 'red' }
};

export function getMilestone(progress) {
    const milestones = Object.keys(LOVE_MILESTONES).map(Number).sort((a, b) => b - a);
    for (const threshold of milestones) {
        if (progress >= threshold) {
            return LOVE_MILESTONES[threshold];
        }
    }
    return LOVE_MILESTONES[0];
}

export function getMilestoneMessage(progress) {
    if (progress === 0) return { emoji: '🖤', message: 'Belum mulai...', color: 'slate' };
    if (progress < 20) return { emoji: '🌱', message: 'Baru mulai tumbuh kembali...', color: 'emerald' };
    if (progress < 40) return { emoji: '🌸', message: 'Ada sesuatu yang mulai kembali...', color: 'pink' };
    if (progress < 60) return { emoji: '💛', message: 'Setengah jalan pulang...', color: 'yellow' };
    if (progress < 80) return { emoji: '🧡', message: 'Semakin dekat...', color: 'orange' };
    if (progress < 100) return { emoji: '💗', message: 'Hampir sampai...', color: 'rose' };
    return { emoji: '💕', message: "I'm home. Welcome back, my love.", color: 'pink' };
}

export async function getLoveProgress() {
    try {
        const docRef = doc(db, 'landing', 'loveProgress');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                currentProgress: data.currentProgress || 0,
                lastUpdate: data.lastUpdate?.toDate() || null,
                lastUpdatedBy: data.lastUpdatedBy || 'anya',
                isVisible: data.isVisible !== undefined ? data.isVisible : true,
                history: (data.history || []).map((item) => ({
                    ...item,
                    date: item.date?.toDate() || new Date()
                })),
                visitorCount: data.visitorCount || 0
            };
        }

        return {
            currentProgress: 0,
            lastUpdate: null,
            lastUpdatedBy: 'anya',
            isVisible: true,
            history: [],
            visitorCount: 0
        };
    } catch (error) {
        console.error('Error getting love progress:', error);
        throw error;
    }
}

export async function updateLoveProgress(newProgress, note = '') {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Must be logged in');

        const author = getCurrentAuthor(user);
        if (author !== 'anya') throw new Error('Only Princess can update this');

        const docRef = doc(db, 'landing', 'loveProgress');
        const docSnap = await getDoc(docRef);
        const currentData = docSnap.exists() ? docSnap.data() : { history: [], visitorCount: 0 };
        const history = currentData.history || [];

        history.push({
            date: new Date(),
            value: newProgress,
            note: note || getMilestone(newProgress).message
        });

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                currentProgress: newProgress,
                lastUpdate: serverTimestamp(),
                lastUpdatedBy: 'anya',
                history,
                visitorCount: currentData.visitorCount || 0,
                isVisible: true
            });
        } else {
            await updateDoc(docRef, {
                currentProgress: newProgress,
                lastUpdate: serverTimestamp(),
                lastUpdatedBy: 'anya',
                history
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating love progress:', error);
        throw error;
    }
}

export async function toggleLoveProgressVisibility(isVisible) {
    try {
        const docRef = doc(db, 'landing', 'loveProgress');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, { isVisible, currentProgress: 0, history: [] });
        } else {
            await updateDoc(docRef, { isVisible });
        }
        return { success: true };
    } catch (error) {
        console.error('Error toggling visibility:', error);
        throw error;
    }
}

export async function incrementVisitorCount() {
    try {
        const docRef = doc(db, 'landing', 'loveProgress');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const currentCount = docSnap.data().visitorCount || 0;
            await updateDoc(docRef, {
                visitorCount: currentCount + 1
            });
            return currentCount + 1;
        }

        await setDoc(docRef, {
            currentProgress: 0,
            lastUpdate: serverTimestamp(),
            lastUpdatedBy: 'system',
            history: [],
            visitorCount: 1
        });
        return 1;
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
        return 0;
    }
}
