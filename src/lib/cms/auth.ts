import { auth } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function initAuth(onAuthenticated: () => void): void {
    onAuthStateChanged(auth, (user) => {
        const loadingScreen = document.getElementById('loading-screen');
        if (user) {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            onAuthenticated();
        } else {
            window.location.href = '/core/login';
        }
    });
}

(window as any).logout = async function (): Promise<void> {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await signOut(auth);
            window.location.href = '/core/login';
        } catch (error: any) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        }
    }
};
