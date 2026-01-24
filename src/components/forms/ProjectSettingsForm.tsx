'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Check, Loader2, Target } from 'lucide-react';

interface ProjectSettingsFormProps {
    onSuccess: () => void;
}

export function ProjectSettingsForm({ onSuccess }: ProjectSettingsFormProps) {
    const { data, updateProject } = useProject();
    const [name, setName] = useState(data.project.name);
    const [budget, setBudget] = useState(data.project.totalBudget.toString());
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            updateProject({
                name,
                totalBudget: parseFloat(budget)
            });
            onSuccess();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Identificação da Obra</label>
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Orçamento Total Planejado (R$)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input
                        required
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                    />
                </div>
                <p className="mt-2 text-[10px] text-slate-400 font-medium">Esse valor é usado para calcular a saúde financeira e o gráfico de rosca.</p>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center disabled:opacity-70"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                Salvar Configurações
            </button>
        </form>
    );
}
