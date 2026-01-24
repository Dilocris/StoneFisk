'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Category, Expense, Room, CATEGORIES, ROOMS } from '@/lib/types';
import { Check, Loader2, Paperclip, X, CreditCard, Calendar, Repeat } from 'lucide-react';

interface AddExpenseFormProps {
    onSuccess: () => void;
    initialData?: Expense;
}

export function AddExpenseForm({ onSuccess, initialData }: AddExpenseFormProps) {
    const { data, addExpense, updateExpense, uploadFile } = useProject();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [name, setName] = useState(initialData?.name || '');
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [category, setCategory] = useState<Category>(initialData?.category || CATEGORIES[0]);
    const [room, setRoom] = useState<Room>(initialData?.room || ROOMS[0]);
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || 'PIX');
    const [status, setStatus] = useState<'Paid' | 'Pending' | 'Deposit'>(initialData?.status || 'Pending');
    const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
    const [attachments, setAttachments] = useState<string[]>(initialData?.attachments || []);

    // Installment specific state
    const [isInstallment, setIsInstallment] = useState(false);
    const [installmentCount, setInstallmentCount] = useState('1');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadFile(file);
        if (url) {
            setAttachments(prev => [...prev, url]);
        }
        setIsUploading(false);
    };

    const removeAttachment = (url: string) => {
        setAttachments(prev => prev.filter(a => a !== url));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const expenseData = {
            name,
            amount: parseFloat(amount),
            category,
            room,
            date,
            dueDate,
            paymentMethod,
            status,
            supplierId,
            attachments
        };

        try {
            if (initialData) {
                updateExpense(initialData.id, expenseData);
            } else {
                addExpense(expenseData, isInstallment ? parseInt(installmentCount) : 1);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="bg-blue-50/50 dark:bg-slate-800/50 p-4 rounded-2xl mb-4 border border-blue-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Informações de Compra</label>
                <div className="space-y-4">
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome do produto ou serviço (ex: Piso Vinílico)"
                        className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Valor Total (R$)"
                                className="w-full p-3 pl-10 bg-white dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono font-bold"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs font-bold"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <select
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs font-bold"
                    >
                        <option value="">Selecione o Fornecedor (Opcional)</option>
                        {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2">
                        <Calendar size={12} className="text-blue-500" /> Vencimento
                    </label>
                    <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-slate-700 dark:text-slate-200"
                    />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2">
                        <CreditCard size={12} className="text-blue-500" /> Forma
                    </label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-slate-700 dark:text-slate-200"
                    >
                        <option value="PIX">PIX</option>
                        <option value="Boleto">Boleto</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                        <option value="Transferência">Transferência</option>
                        <option value="Dinheiro">Dinheiro</option>
                    </select>
                </div>
            </div>

            {!initialData && (
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase">
                            <Repeat size={14} /> Parcelamento
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsInstallment(!isInstallment)}
                            className={`w-10 h-5 rounded-full transition-all relative ${isInstallment ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isInstallment ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    {isInstallment && (
                        <div className="flex items-center gap-4 animate-in slide-in-from-top-2">
                            <div className="flex-1">
                                <span className="text-[10px] text-slate-500 font-bold block mb-1">Nº de Parcelas</span>
                                <input
                                    type="number"
                                    min="2"
                                    max="48"
                                    value={installmentCount}
                                    onChange={(e) => setInstallmentCount(e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-none text-sm font-bold"
                                />
                            </div>
                            <div className="flex-1">
                                <span className="text-[10px] text-slate-500 font-bold block mb-1">Valor/Parcela</span>
                                <div className="text-sm font-black text-amber-600">
                                    R$ {(parseFloat(amount || '0') / parseInt(installmentCount || '1')).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Cômodo</label>
                    <select
                        value={room}
                        onChange={(e) => setRoom(e.target.value as Room)}
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-xs font-bold"
                    >
                        {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Status</label>
                    <div className="flex gap-1">
                        <button type="button" onClick={() => setStatus('Paid')} className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase transition-all ${status === 'Paid' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>PAGO</button>
                        <button type="button" onClick={() => setStatus('Deposit')} className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase transition-all ${status === 'Deposit' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>SINAL</button>
                        <button type="button" onClick={() => setStatus('Pending')} className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase transition-all ${status === 'Pending' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>PEND</button>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || isUploading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all mt-6 flex items-center justify-center disabled:opacity-70"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                {initialData ? 'SALVAR ALTERAÇÕES' : (isInstallment ? `REGISTRAR ${installmentCount} PARCELAS` : 'REGISTRAR GASTO')}
            </button>
        </form>
    );
}
