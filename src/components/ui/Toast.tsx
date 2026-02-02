'use client';
import { useProject } from '@/context/ProjectContext';
import { useEffect } from 'react';

export function ErrorToast() {
    const { error, clearError } = useProject();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(clearError, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    if (!error) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
            <span>{error}</span>
            <button onClick={clearError} className="hover:opacity-80">&times;</button>
        </div>
    );
}
