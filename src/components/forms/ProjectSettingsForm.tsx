'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { formatDateInput } from '@/lib/date';
import { Check, Download, Loader2, Trash2 } from 'lucide-react';

interface ProjectSettingsFormProps {
    onSuccess: () => void;
}

export function ProjectSettingsForm({ onSuccess }: ProjectSettingsFormProps) {
    const { data, updateProject, resetData, importData } = useProject();
    const [name, setName] = useState(data.project.name);
    const [budget, setBudget] = useState(data.project.totalBudget.toString());
    const [isLoading, setIsLoading] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const parsedBudget = Number.parseFloat(budget);
        if (!Number.isFinite(parsedBudget)) {
            setIsLoading(false);
            return;
        }

        try {
            updateProject({
                name,
                totalBudget: Math.max(0, parsedBudget)
            });
            onSuccess();
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackup = () => {
        const safeName = (data.project.name || 'stonefisk')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        const dateTag = formatDateInput(new Date());
        const filename = `${safeName || 'stonefisk'}-backup-${dateTag}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleClearAll = async () => {
        if (!confirm('Tem certeza que deseja apagar todos os dados? Essa ação não pode ser desfeita.')) return;
        const typed = prompt('Digite APAGAR para confirmar:');
        if (typed !== 'APAGAR') return;
        setIsClearing(true);
        try {
            resetData({ keepProject: true });
            onSuccess();
        } finally {
            setIsClearing(false);
        }
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size before processing
        if (file.size > MAX_FILE_SIZE) {
            alert('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
            e.target.value = '';
            return;
        }

        setIsImporting(true);
        try {
            const text = await file.text();
            const payload = JSON.parse(text);
            const ok = importData(payload);
            if (!ok) {
                alert('Arquivo inválido. Verifique se é um backup do StoneFisk.');
            } else {
                onSuccess();
            }
        } catch (err) {
            alert('Falha ao importar. Arquivo corrompido ou inválido.');
        } finally {
            setIsImporting(false);
            e.target.value = '';
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
                    maxLength={100}
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
                        min={0}
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

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <button
                    type="button"
                    onClick={handleBackup}
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                >
                    <Download className="mr-2" size={18} />
                    Backup dos Dados
                </button>
                <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={isClearing}
                    className="w-full py-3 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all flex items-center justify-center disabled:opacity-70"
                >
                    {isClearing ? <Loader2 className="animate-spin mr-2" size={18} /> : <Trash2 className="mr-2" size={18} />}
                    Apagar Todos os Dados
                </button>
                <label className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center cursor-pointer">
                    <Download className="mr-2" size={18} />
                    {isImporting ? 'Importando...' : 'Importar Backup'}
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleImport}
                        className="hidden"
                        disabled={isImporting}
                    />
                </label>
                <p className="text-[10px] text-slate-400 font-medium">
                    O backup baixa um arquivo JSON com todo o projeto atual.
                </p>
            </div>
        </form>
    );
}
