'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Expense, Task, Supplier, Asset } from '@/lib/types';

type ModalType = 'expense' | 'task' | 'supplier' | 'asset' | 'settings' | null;

interface ModalState {
    type: ModalType;
    data: Expense | Task | Supplier | Asset | null;
    isOpen: boolean;
}

interface ModalContextType {
    modal: ModalState;
    openModal: (type: ModalType, data?: Expense | Task | Supplier | Asset | null) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modal, setModal] = useState<ModalState>({ type: null, data: null, isOpen: false });

    const openModal = useCallback((type: ModalType, data: Expense | Task | Supplier | Asset | null = null) => {
        setModal({ type, data, isOpen: true });
    }, []);

    const closeModal = useCallback(() => {
        setModal({ type: null, data: null, isOpen: false });
    }, []);

    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
}
