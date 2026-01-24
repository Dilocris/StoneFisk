'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Category, CATEGORIES, Supplier } from '@/lib/types';
import { Check, Loader2, Star, User, Phone, FileText, Mail, Globe } from 'lucide-react';
import { clsx } from 'clsx';

interface AddSupplierFormProps {
    onSuccess: () => void;
    initialData?: Supplier;
}

export function AddSupplierForm({ onSuccess, initialData }: AddSupplierFormProps) {
    const { addSupplier, updateSupplier } = useProject();
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || '');
    const [phone1, setPhone1] = useState(initialData?.phone1 || '(27) ');
    const [phone2, setPhone2] = useState(initialData?.phone2 || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [website, setWebsite] = useState(initialData?.website || '');
    const [category, setCategory] = useState<Category>(initialData?.category || CATEGORIES[0]);
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [notes, setNotes] = useState(initialData?.notes || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const supplierData = {
            name,
            phone1,
            phone2,
            email,
            website,
            category,
            rating,
            notes
        };

        try {
            if (initialData) {
                updateSupplier(initialData.id, supplierData);
            } else {
                addSupplier(supplierData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-4">
                <div className="relative">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                        <User size={12} className="text-blue-500" /> Nome do Fornecedor / Empresa
                    </label>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Marmoraria Rocha"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                            <Phone size={12} className="text-blue-500" /> Telefone 1 (Principal)
                        </label>
                        <input
                            required
                            value={phone1}
                            onChange={(e) => setPhone1(e.target.value)}
                            placeholder="(27) 99999-9999"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                            <Phone size={12} className="text-slate-400" /> Telefone 2 (Opcional)
                        </label>
                        <input
                            value={phone2}
                            onChange={(e) => setPhone2(e.target.value)}
                            placeholder="(27) 99999-9999"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                            <Mail size={12} className="text-blue-500" /> E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contato@empresa.com"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                            <Globe size={12} className="text-blue-500" /> Site
                        </label>
                        <input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="www.empresa.com.br"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                        Categoria
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                        Avaliação
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={clsx(
                                    "p-2 rounded-xl transition-all",
                                    star <= rating ? "text-amber-500 bg-amber-50 dark:bg-amber-900/10" : "text-slate-300 bg-slate-50 dark:bg-slate-800"
                                )}
                            >
                                <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                        <FileText size={12} className="text-blue-500" /> Observações
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Detalhes sobre o serviço, prazos, etc."
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold min-h-[100px]"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70 mt-4"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                {initialData ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR FORNECEDOR'}
            </button>
        </form>
    );
}
