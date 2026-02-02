'use client';

import React, { useState } from 'react';

import { useProject } from '@/context/ProjectContext';

import { Category, Task, CATEGORIES } from '@/lib/types';

import { Check, Loader2 } from 'lucide-react';

import clsx from 'clsx';

import { formatDateInput } from '@/lib/date';

interface AddTaskFormProps {

    onSuccess: () => void;

    initialData?: Task;

}

export function AddTaskForm({ onSuccess, initialData }: AddTaskFormProps) {

    const { data, addTask, updateTask } = useProject();

    const [isLoading, setIsLoading] = useState(false);

    const [dateError, setDateError] = useState('');

    const [title, setTitle] = useState(initialData?.title || '');

    const [category, setCategory] = useState<Category>(initialData?.category || 'Mão de Obra');

    const [startDate, setStartDate] = useState(initialData?.startDate || formatDateInput(new Date()));

    const [endDate, setEndDate] = useState(initialData?.endDate || formatDateInput(new Date()));

    const [status, setStatus] = useState<Task['status']>(initialData?.status || 'Pending');

    const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setIsLoading(true);

        setDateError('');

        if (endDate < startDate) {

            setDateError('A data final deve ser igual ou posterior Ã  data de inÃ­cio.');

            setIsLoading(false);

            return;

        }

        const taskData = {

            title,

            category,

            startDate,

            endDate,

            status,

            supplierId

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

                    maxLength={200}

                    className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"

                />

            </div>

            <div className="grid grid-cols-2 gap-4">

                <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Início</label>

                    <input

                        required

                        type="date"

                        value={startDate}

                        min="2000-01-01"

                        max="2100-12-31"

                        onChange={(e) => {

                            setStartDate(e.target.value);

                            if (dateError) setDateError('');

                        }}

                        className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"

                    />

                </div>

                <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Previsão Fim</label>

                    <input

                        required

                        type="date"

                        value={endDate}

                        min="2000-01-01"

                        max="2100-12-31"

                        onChange={(e) => {

                            setEndDate(e.target.value);

                            if (dateError) setDateError('');

                        }}

                        className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"

                    />

                </div>

            </div>

            {dateError && (

                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">

                    {dateError}

                </p>

            )}

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-secondary text-foreground">{c}</option>)}
                    </select>
                </div>
            </div>

            <div>

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fornecedor Responsável</label>

                <select

                    value={supplierId}

                    onChange={(e) => setSupplierId(e.target.value)}

                    className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"

                >

                    <option value="" className="bg-secondary text-foreground">Nenhum Fornecedor (Opcional)</option>

                    {data.suppliers.map(s => <option key={s.id} value={s.id} className="bg-secondary text-foreground">{s.name}</option>)}

                </select>

            </div>

            <div>

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>

                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">

                    {(['Pending', 'In Progress', 'Completed', 'Blocked'] as const).map((s) => (

                        <button

                            key={s}

                            type="button"

                            onClick={() => setStatus(s)}

                            className={clsx(

                                "py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tighter",

                                status === s

                                    ? s === 'Blocked' ? "bg-danger text-danger-foreground shadow-sm" :

                                        s === 'Pending' ? "bg-muted text-muted-foreground border border-border" :

                                            s === 'In Progress' ? "bg-warning text-warning-foreground shadow-sm" :

                                                "bg-success text-success-foreground shadow-sm"

                                    : "bg-secondary text-muted-foreground hover:bg-muted"

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

                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all mt-6 flex items-center justify-center disabled:opacity-70"

            >

                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}

                {initialData ? 'SALVAR ALTERAÇÕES' : 'AGENDAR TAREFA'}

            </button>

        </form>

    );

}

