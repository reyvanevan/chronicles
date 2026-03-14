import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where
} from 'firebase/firestore';
import { db } from '../firebase-config.js';
import { getCurrentUserProfile, USER_PROFILES } from './profiles.js';
import { POST_TYPES } from './shared.js';
import { normalizeFirestoreDate } from './utils.js';

export async function createStory(storyData) {
    const { imageBase64, caption, authorId } = storyData;

    const author = USER_PROFILES[authorId] || getCurrentUserProfile();
    if (!author) throw new Error('User not authenticated');

    const story = {
        type: POST_TYPES.STORY,
        imageBase64,
        caption: caption || '',
        authorId: author.id,
        authorName: author.name,
        authorDisplayName: author.displayName,
        authorAvatar: author.avatarUrl,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
    };

    const ref = await addDoc(collection(db, 'stories'), story);
    return ref.id;
}

export async function getActiveStories() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const storiesQuery = query(
        collection(db, 'stories'),
        where('createdAt', '>=', Timestamp.fromDate(yesterday)),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(storiesQuery);
    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt) || new Date()
    }));
}

export async function getAllStories(limitCount = 50) {
    const storiesQuery = query(
        collection(db, 'stories'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(storiesQuery);
    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt) || new Date()
    }));
}

export async function getArchivedStories(authorId, limitCount = 100) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const storiesQuery = query(
        collection(db, 'stories'),
        where('authorId', '==', authorId),
        where('createdAt', '<', Timestamp.fromDate(yesterday)),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(storiesQuery);
    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt) || new Date()
    }));
}

export function groupStoriesByMonth(stories) {
    const grouped = {};

    stories.forEach((story) => {
        const date = story.createdAt;
        const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!grouped[monthKey]) {
            grouped[monthKey] = [];
        }
        grouped[monthKey].push(story);
    });

    return grouped;
}
