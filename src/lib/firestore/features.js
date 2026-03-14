import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebase-config.js';
import { resolveAuthorId } from './profiles.js';
import { DEFAULT_FEATURE_VISIBILITY, FEATURE_COLLECTIONS } from './shared.js';
import { normalizeFirestoreDate } from './utils.js';

export async function getFeatureVisibilityConfig() {
    try {
        const snap = await getDoc(doc(db, 'config', 'featureVisibility'));
        if (snap.exists()) {
            return {
                ...DEFAULT_FEATURE_VISIBILITY,
                ...snap.data()
            };
        }

        const seededConfig = {
            ...DEFAULT_FEATURE_VISIBILITY,
            public: { ...DEFAULT_FEATURE_VISIBILITY.public },
            universe: { ...DEFAULT_FEATURE_VISIBILITY.universe },
            core: { ...DEFAULT_FEATURE_VISIBILITY.core }
        };
        await setDoc(doc(db, 'config', 'featureVisibility'), seededConfig, { merge: true });
        return seededConfig;
    } catch (error) {
        console.warn('Failed to load feature visibility config:', error);
        return { ...DEFAULT_FEATURE_VISIBILITY };
    }
}

export async function setFeatureVisibility(portal, featureKey, isVisible) {
    const current = await getFeatureVisibilityConfig();
    const next = {
        ...current,
        [portal]: {
            ...(current[portal] || {}),
            [featureKey]: !!isVisible
        }
    };
    await setDoc(doc(db, 'config', 'featureVisibility'), next, { merge: true });
    return next;
}

export async function isFeatureVisibleForPortal(portal, featureKey, fallback = true) {
    const cfg = await getFeatureVisibilityConfig();
    const portalConfig = cfg?.[portal] || {};
    if (portalConfig[featureKey] === undefined) return fallback;
    return !!portalConfig[featureKey];
}

export async function createMoodEntry(entryData) {
    const authorId = resolveAuthorId(entryData.authorId);
    const payload = {
        authorId,
        mood: entryData.mood || 'neutral',
        note: entryData.note || '',
        tags: entryData.tags || [],
        date: entryData.date ? Timestamp.fromDate(new Date(entryData.date)) : serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, FEATURE_COLLECTIONS.moodEntries), payload);
    return ref.id;
}

export async function getMoodEntries(limitCount = 31, authorId = null) {
    const resolvedAuthorId = resolveAuthorId(authorId);
    const moodQuery = query(
        collection(db, FEATURE_COLLECTIONS.moodEntries),
        where('authorId', '==', resolvedAuthorId),
        orderBy('date', 'desc'),
        limit(limitCount)
    );

    const snap = await getDocs(moodQuery);
    return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        date: normalizeFirestoreDate(item.data().date),
        createdAt: normalizeFirestoreDate(item.data().createdAt),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt)
    }));
}

export async function updateMoodEntry(entryId, updates) {
    await updateDoc(doc(db, FEATURE_COLLECTIONS.moodEntries, entryId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteMoodEntry(entryId) {
    await deleteDoc(doc(db, FEATURE_COLLECTIONS.moodEntries, entryId));
}

export async function createQuickNote(noteData) {
    const authorId = resolveAuthorId(noteData.authorId);
    const payload = {
        authorId,
        title: noteData.title || '',
        content: noteData.content || '',
        status: noteData.status || 'open',
        isPinned: !!noteData.isPinned,
        dueDate: noteData.dueDate ? Timestamp.fromDate(new Date(noteData.dueDate)) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, FEATURE_COLLECTIONS.quickNotes), payload);
    return ref.id;
}

export async function getQuickNotes(limitCount = 50, authorId = null) {
    const resolvedAuthorId = resolveAuthorId(authorId);
    const notesQuery = query(
        collection(db, FEATURE_COLLECTIONS.quickNotes),
        where('authorId', '==', resolvedAuthorId),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
    );

    const snap = await getDocs(notesQuery);
    return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        dueDate: normalizeFirestoreDate(item.data().dueDate),
        createdAt: normalizeFirestoreDate(item.data().createdAt),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt)
    }));
}

export async function updateQuickNote(noteId, updates) {
    await updateDoc(doc(db, FEATURE_COLLECTIONS.quickNotes, noteId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteQuickNote(noteId) {
    await deleteDoc(doc(db, FEATURE_COLLECTIONS.quickNotes, noteId));
}

export async function createProjectTrack(trackData) {
    const authorId = resolveAuthorId(trackData.authorId);
    const payload = {
        authorId,
        title: trackData.title || 'Untitled Project',
        description: trackData.description || '',
        progress: Number.isFinite(trackData.progress) ? trackData.progress : 0,
        status: trackData.status || 'active',
        targetDate: trackData.targetDate ? Timestamp.fromDate(new Date(trackData.targetDate)) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, FEATURE_COLLECTIONS.projectTracks), payload);
    return ref.id;
}

export async function getProjectTracks(limitCount = 30, authorId = null) {
    const resolvedAuthorId = resolveAuthorId(authorId);
    const tracksQuery = query(
        collection(db, FEATURE_COLLECTIONS.projectTracks),
        where('authorId', '==', resolvedAuthorId),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
    );

    const snap = await getDocs(tracksQuery);
    return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        targetDate: normalizeFirestoreDate(item.data().targetDate),
        createdAt: normalizeFirestoreDate(item.data().createdAt),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt)
    }));
}

export async function updateProjectTrack(trackId, updates) {
    await updateDoc(doc(db, FEATURE_COLLECTIONS.projectTracks, trackId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteProjectTrack(trackId) {
    await deleteDoc(doc(db, FEATURE_COLLECTIONS.projectTracks, trackId));
}

export async function createLetterboxLetter(letterData) {
    const payload = {
        fromAuthorId: resolveAuthorId(letterData.fromAuthorId),
        toAuthorId: letterData.toAuthorId || 'anya',
        title: letterData.title || 'A letter for you',
        content: letterData.content || '',
        openAt: letterData.openAt ? Timestamp.fromDate(new Date(letterData.openAt)) : serverTimestamp(),
        isRead: false,
        readAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, FEATURE_COLLECTIONS.letterbox), payload);
    return ref.id;
}

export async function getLetterboxLetters(limitCount = 30, toAuthorId = null) {
    const resolvedTarget = toAuthorId || resolveAuthorId(null);
    const lettersQuery = query(
        collection(db, FEATURE_COLLECTIONS.letterbox),
        where('toAuthorId', '==', resolvedTarget),
        orderBy('openAt', 'desc'),
        limit(limitCount)
    );

    const snap = await getDocs(lettersQuery);
    return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        openAt: normalizeFirestoreDate(item.data().openAt),
        readAt: normalizeFirestoreDate(item.data().readAt),
        createdAt: normalizeFirestoreDate(item.data().createdAt),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt)
    }));
}

export async function markLetterboxAsRead(letterId) {
    await updateDoc(doc(db, FEATURE_COLLECTIONS.letterbox, letterId), {
        isRead: true,
        readAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

export async function createFinanceEntry(entryData) {
    const payload = {
        type: entryData.type || 'saving',
        amount: Number(entryData.amount || 0),
        category: entryData.category || 'general',
        note: entryData.note || '',
        createdBy: resolveAuthorId(entryData.createdBy),
        date: entryData.date ? Timestamp.fromDate(new Date(entryData.date)) : serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, FEATURE_COLLECTIONS.financeEntries), payload);
    return ref.id;
}

export async function getFinanceEntries(limitCount = 100) {
    const financeQuery = query(
        collection(db, FEATURE_COLLECTIONS.financeEntries),
        orderBy('date', 'desc'),
        limit(limitCount)
    );

    const snap = await getDocs(financeQuery);
    return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        date: normalizeFirestoreDate(item.data().date),
        createdAt: normalizeFirestoreDate(item.data().createdAt),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt)
    }));
}

export async function updateFinanceEntry(entryId, updates) {
    await updateDoc(doc(db, FEATURE_COLLECTIONS.financeEntries, entryId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteFinanceEntry(entryId) {
    await deleteDoc(doc(db, FEATURE_COLLECTIONS.financeEntries, entryId));
}

export async function createSharedLink(linkData) {
    const payload = {
        title: linkData.title || 'Untitled Link',
        url: linkData.url || '',
        description: linkData.description || '',
        tags: linkData.tags || [],
        addedBy: resolveAuthorId(linkData.addedBy),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, FEATURE_COLLECTIONS.sharedLinks), payload);
    return ref.id;
}

export async function getSharedLinks(limitCount = 200) {
    const linksQuery = query(
        collection(db, FEATURE_COLLECTIONS.sharedLinks),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
    );

    const snap = await getDocs(linksQuery);
    return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt)
    }));
}

export async function updateSharedLink(linkId, updates) {
    await updateDoc(doc(db, FEATURE_COLLECTIONS.sharedLinks, linkId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteSharedLink(linkId) {
    await deleteDoc(doc(db, FEATURE_COLLECTIONS.sharedLinks, linkId));
}
