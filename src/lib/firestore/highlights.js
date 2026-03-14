import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebase-config.js';
import { normalizeFirestoreDate } from './utils.js';

export async function createHighlight(highlightData) {
    const { name, icon, gradient, authorId, coverImageBase64 } = highlightData;
    const highlight = {
        name: name.trim(),
        icon: icon || 'star',
        gradient: gradient || 'pink',
        authorId,
        coverImageBase64: coverImageBase64 || null,
        storyIds: [],
        storyCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, 'highlights'), highlight);
    return ref.id;
}

export async function getHighlights(authorId) {
    const highlightsQuery = query(
        collection(db, 'highlights'),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(highlightsQuery);
    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt) || new Date(),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt) || new Date()
    }));
}

export async function getHighlightById(highlightId) {
    const snapshot = await getDocs(query(collection(db, 'highlights'), where('__name__', '==', highlightId)));
    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data();
    return {
        id: snapshot.docs[0].id,
        ...data,
        createdAt: normalizeFirestoreDate(data.createdAt) || new Date(),
        updatedAt: normalizeFirestoreDate(data.updatedAt) || new Date()
    };
}

export async function addStoryToHighlight(highlightId, storyId, storyImageBase64 = null) {
    const highlightRef = doc(db, 'highlights', highlightId);
    const snapshot = await getDocs(query(collection(db, 'highlights'), where('__name__', '==', highlightId)));
    if (snapshot.empty) throw new Error('Highlight not found');

    const currentData = snapshot.docs[0].data();
    const currentStoryIds = currentData.storyIds || [];
    if (currentStoryIds.includes(storyId)) return;

    const updateData = {
        storyIds: [...currentStoryIds, storyId],
        storyCount: currentStoryIds.length + 1,
        updatedAt: serverTimestamp()
    };

    if (!currentData.coverImageBase64 && storyImageBase64) {
        updateData.coverImageBase64 = storyImageBase64;
    }

    await updateDoc(highlightRef, updateData);
}

export async function removeStoryFromHighlight(highlightId, storyId) {
    const highlightRef = doc(db, 'highlights', highlightId);
    const snapshot = await getDocs(query(collection(db, 'highlights'), where('__name__', '==', highlightId)));
    if (snapshot.empty) throw new Error('Highlight not found');

    const currentData = snapshot.docs[0].data();
    const currentStoryIds = currentData.storyIds || [];
    const newStoryIds = currentStoryIds.filter((id) => id !== storyId);

    await updateDoc(highlightRef, {
        storyIds: newStoryIds,
        storyCount: newStoryIds.length,
        updatedAt: serverTimestamp()
    });
}

export async function updateHighlight(highlightId, updates) {
    await updateDoc(doc(db, 'highlights', highlightId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteHighlight(highlightId) {
    await deleteDoc(doc(db, 'highlights', highlightId));
}

export async function getHighlightStories(highlightId) {
    const highlightSnapshot = await getDocs(query(collection(db, 'highlights'), where('__name__', '==', highlightId)));
    if (highlightSnapshot.empty) return [];

    const storyIds = highlightSnapshot.docs[0].data().storyIds || [];
    if (storyIds.length === 0) return [];

    const stories = [];
    for (const storyId of storyIds) {
        const storySnapshot = await getDocs(query(collection(db, 'stories'), where('__name__', '==', storyId)));
        if (!storySnapshot.empty) {
            const data = storySnapshot.docs[0].data();
            stories.push({
                id: storySnapshot.docs[0].id,
                ...data,
                createdAt: normalizeFirestoreDate(data.createdAt) || new Date()
            });
        }
    }

    return stories.sort((left, right) => right.createdAt - left.createdAt);
}
