import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config.js';

export async function logout() {
    try {
        await signOut(auth);
        window.location.href = '/universe/login';
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

export function isAuthenticated() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
}

export async function requireAuth() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        window.location.href = '/universe/login';
    }
}
