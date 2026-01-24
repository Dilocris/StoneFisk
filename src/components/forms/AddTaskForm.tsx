'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Category, Task, Room, CATEGORIES, ROOMS } from '@/lib/types';
import { Check, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AddTaskFormProps {
    onSuccess: () => void;
    initialData?: Task;
}

export function AddTaskForm({ onSuccess, initialData }: AddTaskFormProps) {
    const { addTask, updateTask } = useProject();
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState<Category>(initialData?.category || 'Mão de Obra');
    const [room, setRoom] = useState<Room>(initialData?.room || ROOMS[0]);
    const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(initialData?.endDate || new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState<Task['status']>(initialData?.status || 'Pending');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const taskData = {
            title,
            category,
            room,
            startDate,
            endDate,
            status
        };

        try {
            if (initialData) {
                updateTask(initialData.id, taskData);
            } else {
                addTask(taskData);
            }
            onSuccess();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição da Tarefa</label>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Pintura da Fachada"
                    className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Início</label>
                    <input
                        required
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Previsão Fim</label>
                    <input
                        required
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cômodo/Área</label>
                    <select
                        value={room}
                        onChange={(e) => setRoom(e.target.value as Room)}
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    {(['Pending', 'In Progress', 'Completed', 'Blocked'] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={clsx(
                                "py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tighter",
                                status === s
                                    ? s === 'Blocked' ? "bg-rose-500 text-white shadow-sm" : "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-200"
                            )}
                        >
                            {s === 'Pending' ? 'Pendente' : s === 'In Progress' ? 'Em Curso' : s === 'Completed' ? 'Pronto' : 'Bloqueado'}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all mt-6 flex items-center justify-center disabled:opacity-70"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                {initialData ? 'SALVAR ALTERAÇÕES' : 'AGENDAR TAREFA'}
            </button>
        </form>
    );
}
