'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Check, Loader2, Package } from 'lucide-react';

interface AddAssetFormProps {
    onSuccess: () => void;
}

export function AddAssetForm({ onSuccess }: AddAssetFormProps) {
    const { data, addAsset } = useProject();
    const [name, setName] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            addAsset({
                name,
                status: 'Purchased',
                supplierId
            });
            onSuccess();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="flex flex-col items-center justify-center p-4 mb-2">
                <Package size={40} className="text-blue-500 mb-2" />
                <p className="text-xs text-slate-500 text-center uppercase font-bold tracking-widest">Novo item para rastrear entrega</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">O que foi comprado?</label>
                <input
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Piso da Cozinha, Torneiras, Sofá..."
                    className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-center text-lg font-bold"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center text-[10px]">Quem é o Fornecedor?</label>
                <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                >
                    <option value="">Selecione o Fornecedor (Opcional)</option>
                    {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <button
                type="submit"
                disabled={isLoading || !name}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                Rastrear Entrega
            </button>
        </form>
    );
}
