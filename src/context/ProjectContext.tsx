'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ProjectData, Expense, Task, Project, Asset, Supplier } from '@/lib/types';
import { formatDateInput } from '@/lib/date';

// Initial empty state (will be populated from API)
const DEFAULT_DATA: ProjectData = {
    project: {
        name: "Loading...",
        totalBudget: 0,
        startDate: ""
    },
    expenses: [],
    tasks: [],
    assets: [],
    suppliers: [],
    progressLog: []
};

interface ProjectContextType {
    data: ProjectData;
    isLoading: boolean;
    addExpense: (expense: Omit<Expense, 'id'>, installments?: number) => void;
    addTask: (task: Omit<Task, 'id'>) => void;
    updateProject: (project: Partial<Project>) => void;
    uploadFile: (file: File) => Promise<string | null>;
    deleteFile: (url: string) => Promise<void>;
    getBudgetStats: () => { totalSpent: number; remaining: number };
    toggleAssetStatus: (id: string) => void;
    addAsset: (asset: Omit<Asset, 'id'>) => void;
    updateAsset: (id: string, asset: Partial<Asset>) => void;
    deleteAsset: (id: string) => void;
    addProgressNote: (note: string) => void;
    updateProgressNote: (date: string, note: string) => void;
    deleteProgressNote: (date: string) => void;
    updateExpense: (id: string, expense: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;
    resetData: (options?: { keepProject?: boolean }) => void;
    importData: (payload: ProjectData) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

function isValidProjectData(body: any): body is ProjectData {
    if (!body || typeof body !== 'object') return false;
    const requiredKeys: (keyof ProjectData)[] = ['project', 'expenses', 'tasks', 'assets', 'suppliers', 'progressLog'];
    if (!requiredKeys.every(key => key in body)) return false;
    if (typeof body.project !== 'object' || typeof body.project.name !== 'string' || typeof body.project.totalBudget !== 'number') {
        return false;
    }
    const collections: (keyof ProjectData)[] = ['expenses', 'tasks', 'assets', 'suppliers', 'progressLog'];
    if (!collections.every(key => Array.isArray(body[key]))) return false;
    return true;
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<ProjectData>(DEFAULT_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstLoad = React.useRef(true);

    // 2. Load Data from API
    const loadData = useCallback(async () => {
        try {
            const res = await fetch('/api/project');
            if (res.ok) {
                const jsonData = await res.json();
                setData({
                    ...jsonData,
                    assets: jsonData.assets || [],
                    suppliers: jsonData.suppliers || [],
                    progressLog: jsonData.progressLog || []
                });
            }
        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            setIsLoading(false);
            // We set isFirstLoad to false AFTER the first state update is complete
            // This is actually handled better by checking isLoading in the persistence effect
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // 3. Persist Data to API (Auto-save)
    useEffect(() => {
        if (isLoading || isFirstLoad.current) {
            if (!isLoading) isFirstLoad.current = false;
            return;
        }

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        saveTimerRef.current = setTimeout(async () => {
            try {
                await fetch('/api/project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (e) {
                console.error("Failed to save data", e);
            }
        }, 800);

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [data, isLoading]);

    const deleteFile = async (url: string) => {
        try {
            await fetch('/api/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
        } catch (e) {
            console.error("Delete upload failed", e);
        }
    };

    const addExpense = (expense: Omit<Expense, 'id'>, installments: number = 1) => {
        const orderId = crypto.randomUUID();
        const newExpenses: Expense[] = [];
        const installmentTotal = Number.isFinite(installments) && installments > 0 ? Math.floor(installments) : 1;
        const totalCents = Math.round(expense.amount * 100);
        const baseCents = Math.floor(totalCents / installmentTotal);
        const remainder = totalCents - (baseCents * installmentTotal);
        const baseDate = expense.dueDate || expense.date || formatDateInput(new Date());
        const startDate = new Date(`${baseDate}T00:00:00`);

        for (let i = 0; i < installmentTotal; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + i);
            const amountCents = baseCents + (i < remainder ? 1 : 0);

            newExpenses.push({
                ...expense,
                id: crypto.randomUUID(),
                orderId,
                amount: amountCents / 100,
                dueDate: formatDateInput(dueDate),
                installmentInfo: installmentTotal > 1 ? { current: i + 1, total: installmentTotal } : undefined
            });
        }

        const autoAsset: Asset = {
            id: orderId,
            name: expense.name,
            status: 'Purchased',
            supplierId: expense.supplierId
        };

        setData(prev => ({
            ...prev,
            expenses: [...prev.expenses, ...newExpenses],
            assets: [...prev.assets, autoAsset]
        }));
    };

    const addTask = (task: Omit<Task, 'id'>) => {
        const newTask: Task = { ...task, id: crypto.randomUUID() };
        setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    };

    const updateProject = (projectUpdates: Partial<Project>) => {
        setData(prev => ({ ...prev, project: { ...prev.project, ...projectUpdates } }));
    };

    const addAsset = (asset: Omit<Asset, 'id'>) => {
        const newAsset: Asset = { ...asset, id: crypto.randomUUID() };
        setData(prev => ({ ...prev, assets: [...prev.assets, newAsset] }));
    };

    const updateAsset = (id: string, updates: Partial<Asset>) => {
        setData(prev => ({
            ...prev,
            assets: prev.assets.map(asset => asset.id === id ? { ...asset, ...updates } : asset)
        }));
    };

    const deleteAsset = (id: string) => {
        setData(prev => ({ ...prev, assets: prev.assets.filter(a => a.id !== id) }));
    };

    const toggleAssetStatus = (id: string) => {
        setData(prev => ({
            ...prev,
            assets: prev.assets.map(asset =>
                asset.id === id
                    ? { ...asset, status: (asset.status === 'Purchased' ? 'Delivered' : 'Purchased') as 'Purchased' | 'Delivered' }
                    : asset
            )
        }));
    };

    const addProgressNote = (note: string) => {
        const newEntry = { date: new Date().toISOString(), note };
        setData(prev => ({ ...prev, progressLog: [newEntry, ...prev.progressLog] }));
    };

    const updateProgressNote = (date: string, note: string) => {
        setData(prev => ({
            ...prev,
            progressLog: prev.progressLog.map(p => p.date === date ? { ...p, note } : p)
        }));
    };

    const deleteProgressNote = (date: string) => {
        setData(prev => ({
            ...prev,
            progressLog: prev.progressLog.filter(p => p.date !== date)
        }));
    };

    const updateExpense = (id: string, updates: Partial<Expense>) => {
        const expenseToUpdate = data.expenses.find(e => e.id === id);
        if (updates.attachments && expenseToUpdate?.attachments) {
            const removed = expenseToUpdate.attachments.filter(url => !updates.attachments?.includes(url));
            removed.forEach(url => {
                const referencedElsewhere = data.expenses.some(exp => exp.id !== id && exp.attachments?.includes(url));
                if (!referencedElsewhere) {
                    void deleteFile(url);
                }
            });
        }
        setData(prev => {
            return {
                ...prev,
                expenses: prev.expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp),
                assets: prev.assets.map(asset => {
                    if (expenseToUpdate && asset.id === expenseToUpdate.orderId) {
                        return {
                            ...asset,
                            name: updates.name || asset.name,
                            supplierId: updates.supplierId !== undefined ? updates.supplierId : asset.supplierId
                        };
                    }
                    return asset;
                })
            };
        });
    };

    const deleteExpense = (id: string) => {
        const expenseToDelete = data.expenses.find(e => e.id === id);
        if (expenseToDelete?.attachments) {
            expenseToDelete.attachments.forEach(url => {
                const referencedElsewhere = data.expenses.some(exp => exp.id !== id && exp.attachments?.includes(url));
                if (!referencedElsewhere) {
                    void deleteFile(url);
                }
            });
        }
        setData(prev => {
            // Only delete the asset if it was solely linked to this expense 
            // OR if all installments of the same order are being deleted (common case for single expenses)
            const remainingWithThisOrder = prev.expenses.filter(e =>
                e.id !== id && e.orderId === expenseToDelete?.orderId
            );

            return {
                ...prev,
                expenses: prev.expenses.filter(exp => exp.id !== id),
                assets: remainingWithThisOrder.length === 0
                    ? prev.assets.filter(asset => asset.id !== (expenseToDelete?.orderId || id))
                    : prev.assets
            };
        });
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
        }));
    };

    const deleteTask = (id: string) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(task => task.id !== id)
        }));
    };

    const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
        const newSupplier = { ...supplier, id: crypto.randomUUID() };
        setData(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
    };

    const updateSupplier = (id: string, updates: Partial<Supplier>) => {
        setData(prev => ({
            ...prev,
            suppliers: prev.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
    };

    const deleteSupplier = (id: string) => {
        setData(prev => ({
            ...prev,
            suppliers: prev.suppliers.filter(s => s.id !== id)
        }));
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const json = await res.json();
                return json.url;
            }
        } catch (e) {
            console.error("Upload failed", e);
        }
        return null;
    };

    const resetData = (options: { keepProject?: boolean } = {}) => {
        const keepProject = options.keepProject !== false;
        setData(prev => ({
            project: keepProject
                ? { ...prev.project, startDate: formatDateInput(new Date()) }
                : { name: 'StoneFisk Project', totalBudget: 0, startDate: formatDateInput(new Date()) },
            expenses: [],
            tasks: [],
            assets: [],
            suppliers: [],
            progressLog: []
        }));
    };

    const importData = (payload: ProjectData) => {
        if (!isValidProjectData(payload)) return false;
        setData({
            ...payload,
            assets: payload.assets || [],
            suppliers: payload.suppliers || [],
            progressLog: payload.progressLog || []
        });
        return true;
    };

    const getBudgetStats = () => {
        const totalSpent = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const remaining = data.project.totalBudget - totalSpent;
        return { totalSpent, remaining };
    };

    return (
        <ProjectContext.Provider value={{
            data,
            isLoading,
            addExpense,
            addTask,
            updateProject,
            uploadFile,
            deleteFile,
            getBudgetStats,
            toggleAssetStatus,
            addAsset,
            updateAsset,
            deleteAsset,
            addProgressNote,
            updateProgressNote,
            deleteProgressNote,
            updateExpense,
            deleteExpense,
            updateTask,
            deleteTask,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            resetData,
            importData
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
