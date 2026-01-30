'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Asset } from '@/lib/types';
import { Check, Loader2, Package } from 'lucide-react';

interface AddAssetFormProps {
    onSuccess: () => void;
    initialData?: Asset;
}

export function AddAssetForm({ onSuccess, initialData }: AddAssetFormProps) {
    const { data, addAsset, updateAsset } = useProject();
    const [name, setName] = useState(initialData?.name || '');
    const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (initialData) {
                updateAsset(initialData.id, { name, supplierId });
            } else {
                addAsset({
                    name,
                    status: 'Purchased',
                    supplierId
                });
            }
            onSuccess();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="flex flex-col items-center justify-center p-4 mb-2">
                <Package size={40} className="text-primary mb-2" />
                <p className="text-xs text-muted-foreground text-center uppercase font-bold tracking-widest">Novo item para rastrear entrega</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">O que foi comprado?</label>
                <input
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Piso da Cozinha, Torneiras, Sofá..."
                    className="w-full p-4 bg-secondary rounded-2xl border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-center text-lg font-bold text-foreground"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center text-[10px]">Quem é o Fornecedor?</label>
                <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full p-4 bg-secondary rounded-2xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"
                >
                    <option value="">Selecione o Fornecedor (Opcional)</option>
                    {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                {initialData ? 'Salvar Alterações' : 'Rastrear Entrega'}
            </button>
        </form>
    );
}
