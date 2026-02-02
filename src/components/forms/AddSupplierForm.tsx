'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Category, CATEGORIES, Supplier } from '@/lib/types';
import { Check, Loader2, Star, User, Phone, FileText, Mail, Globe } from 'lucide-react';
import clsx from 'clsx';

interface AddSupplierFormProps {
    onSuccess: () => void;
    initialData?: Supplier;
}

export function AddSupplierForm({ onSuccess, initialData }: AddSupplierFormProps) {
    const { addSupplier, updateSupplier } = useProject();
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || '');
    const [phone1, setPhone1] = useState(initialData?.phone1 || '');
    const [phone2, setPhone2] = useState(initialData?.phone2 || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [website, setWebsite] = useState(initialData?.website || '');
    const [category, setCategory] = useState<Category>(initialData?.category || CATEGORIES[0]);
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [notes, setNotes] = useState(initialData?.notes || '');

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '').slice(0, 11); // Strict limit to 11 digits
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handlePhoneChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setter(formatted);
    };

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
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 pb-4">
                <div className="space-y-4">
                    <div className="relative">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-widest pl-1">
                            <User size={12} className="text-primary" /> Nome do Fornecedor / Empresa
                        </label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Marmoraria Rocha"
                            maxLength={100}
                            className="w-full p-4 bg-secondary rounded-2xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"
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
                                onChange={handlePhoneChange(setPhone1)}
                                placeholder="(27) 99999-9999"
                                maxLength={15}
                                pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
                                title="Formato: (XX) XXXXX-XXXX"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest pl-1">
                                <Phone size={12} className="text-slate-400" /> Telefone 2 (Opcional)
                            </label>
                            <input
                                value={phone2}
                                onChange={handlePhoneChange(setPhone2)}
                                placeholder="(##) #####-####"
                                maxLength={15}
                                pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
                                title="Formato: (XX) XXXXX-XXXX"
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
                                maxLength={100}
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
                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-secondary text-foreground">{c}</option>)}
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
                                        star <= rating ? "text-warning bg-warning/10" : "text-muted-foreground/30 bg-secondary"
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
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-70 mt-4"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                    {initialData ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR FORNECEDOR'}
                </button>
            </form>
        </div>
    );
}
