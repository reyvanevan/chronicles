import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebase-config.js';
import { getCurrentUserProfile, USER_PROFILES } from './profiles.js';
import { POST_TYPES } from './shared.js';
import { normalizeFirestoreDate } from './utils.js';

export async function createPost(postData) {
    const { type, caption, imageBase64, images, location, tags, authorId } = postData;

    const author = USER_PROFILES[authorId] || getCurrentUserProfile();
    if (!author) throw new Error('User not authenticated');

    const post = {
        type: type || POST_TYPES.PHOTO,
        caption: caption || '',
        imageBase64: imageBase64 || null,
        location: location || '',
        tags: tags || [],
        authorId: author.id,
        authorName: author.name,
        authorDisplayName: author.displayName,
        authorAvatar: author.avatarUrl,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    if (images && images.length > 0) {
        post.images = images;
    }

    const ref = await addDoc(collection(db, 'posts'), post);
    return ref.id;
}

export async function getPosts(limitCount = 20, authorId = null) {
    const postsQuery = authorId
        ? query(
            collection(db, 'posts'),
            where('authorId', '==', authorId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        )
        : query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount));

    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt) || new Date(),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt) || new Date()
    }));
}

export async function getPostsByTag(tag, limitCount = 20) {
    const postsQuery = query(
        collection(db, 'posts'),
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        createdAt: normalizeFirestoreDate(item.data().createdAt) || new Date(),
        updatedAt: normalizeFirestoreDate(item.data().updatedAt) || new Date()
    }));
}

export async function deletePost(postId) {
    await deleteDoc(doc(db, 'posts', postId));
}

export async function updatePost(postId, updates) {
    await updateDoc(doc(db, 'posts', postId), {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function toggleLike(postId, currentLikes) {
    await updateDoc(doc(db, 'posts', postId), {
        likes: currentLikes + 1
    });
}
