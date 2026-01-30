'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Category, Expense, Room, CATEGORIES, ROOMS } from '@/lib/types';
import { Check, Loader2, Paperclip, X, CreditCard, Calendar, Repeat, Plus, FileText } from 'lucide-react';
import clsx from 'clsx';
import { formatDateInput } from '@/lib/date';

interface AddExpenseFormProps {
    onSuccess: () => void;
    initialData?: Expense;
}

export function AddExpenseForm({ onSuccess, initialData }: AddExpenseFormProps) {
    const { data, addExpense, updateExpense, uploadFile, deleteFile } = useProject();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const attachmentsRef = React.useRef<string[]>([]);

    const [name, setName] = useState(initialData?.name || '');
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [category, setCategory] = useState<Category>(initialData?.category || CATEGORIES[0]);
    const [room, setRoom] = useState<Room>(initialData?.room || ROOMS[0]);
    const [date, setDate] = useState(initialData?.date || formatDateInput(new Date()));
    const [dueDate, setDueDate] = useState(initialData?.dueDate || formatDateInput(new Date()));
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
        e.target.value = ''; // Reset input to allow re-uploading same file if deleted
    };

    const removeAttachment = (url: string) => {
        setAttachments(prev => prev.filter(a => a !== url));
        if (!initialData) {
            void deleteFile(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const parsedAmount = Number.parseFloat(amount);
        if (!Number.isFinite(parsedAmount)) {
            setIsLoading(false);
            return;
        }

        const expenseData = {
            name,
            amount: Math.round(parsedAmount * 100) / 100,
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
                const installmentTotal = isInstallment ? Math.max(1, Number.parseInt(installmentCount, 10) || 1) : 1;
                addExpense(expenseData, installmentTotal);
            }
            setDidSubmit(true);
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        attachmentsRef.current = attachments;
    }, [attachments]);

    React.useEffect(() => {
        return () => {
            if (!initialData && !didSubmit && attachmentsRef.current.length > 0) {
                attachmentsRef.current.forEach(url => { void deleteFile(url); });
            }
        };
    }, [deleteFile, didSubmit, initialData]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="bg-card p-4 rounded-2xl mb-4 border border-border shadow-sm">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Informações de Compra</label>
                <div className="space-y-4">
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome do produto ou serviço (ex: Piso Vinílico)"
                        className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground placeholder:text-muted-foreground"
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
                                className="w-full p-3 pl-10 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-mono font-bold text-foreground placeholder:text-muted-foreground"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">R$</span>
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full p-3 bg-secondary text-foreground rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-xs font-bold"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-secondary text-foreground">{c}</option>)}
                        </select>
                    </div>

                    <select
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        className="w-full p-3 bg-secondary text-foreground rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-xs font-bold"
                    >
                        <option value="" className="bg-secondary text-foreground">Selecione o Fornecedor (Opcional)</option>
                        {data.suppliers.map(s => <option key={s.id} value={s.id} className="bg-secondary text-foreground">{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-2xl border border-border">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-2">
                        <Calendar size={12} className="text-primary" /> Vencimento
                    </label>
                    <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-foreground custom-calendar-icon-white"
                    />
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-2">
                        <CreditCard size={12} className="text-primary" /> Forma
                    </label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-foreground"
                    >
                        <option value="PIX" className="bg-secondary text-foreground">PIX</option>
                        <option value="Boleto" className="bg-secondary text-foreground">Boleto</option>
                        <option value="Cartão de Crédito" className="bg-secondary text-foreground">Cartão de Crédito</option>
                        <option value="Transferência" className="bg-secondary text-foreground">Transferência</option>
                        <option value="Dinheiro" className="bg-secondary text-foreground">Dinheiro</option>
                    </select>
                </div>
            </div>

            {!initialData && (
                <div className="bg-warning/10 p-4 rounded-2xl border border-warning/20">
                    <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-warning uppercase">
                            <Repeat size={14} /> Parcelamento
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsInstallment(!isInstallment)}
                            className={`w-10 h-5 rounded-full transition-all relative ${isInstallment ? 'bg-warning' : 'bg-muted'}`}
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
                                    className="w-full p-2 bg-card rounded-xl border-none text-sm font-bold text-foreground"
                                />
                            </div>
                            <div className="flex-1">
                                <span className="text-[10px] text-muted-foreground font-bold block mb-1">Valor/Parcela</span>
                                <div className="text-sm font-black text-warning">
                                    R$ {(parseFloat(amount || '0') / parseInt(installmentCount || '1')).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">Cômodo</label>
                    <select
                        value={room}
                        onChange={(e) => setRoom(e.target.value as Room)}
                        className="w-full bg-secondary text-foreground rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all p-2 text-xs font-bold"
                    >
                        {ROOMS.map(r => <option key={r} value={r} className="bg-secondary text-foreground">{r}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">Status</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStatus('Paid')}
                            className={clsx(
                                "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                status === 'Paid' ? 'bg-success text-success-foreground shadow-md' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            PAGO
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('Deposit')}
                            className={clsx(
                                "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                status === 'Deposit' ? 'bg-info text-info-foreground shadow-md' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            SINAL
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('Pending')}
                            className={clsx(
                                "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                status === 'Pending' ? 'bg-warning text-warning-foreground shadow-md' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            PEND
                        </button>
                    </div>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-border group hover:bg-muted/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                        <Paperclip size={12} /> Anexos e Fotos
                    </label>
                    {isUploading && <span className="text-[10px] text-primary animate-pulse">Enviando...</span>}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((url, index) => {
                        const isPdf = url.toLowerCase().endsWith('.pdf');
                        return (
                            <div key={index} className="relative group/img w-16 h-16 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center">
                                {isPdf ? (
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                        <FileText size={18} />
                                        <span className="text-[8px] font-bold">PDF</span>
                                    </div>
                                ) : (
                                    <img src={url} alt={`Anexo ${index + 1}`} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(url)}
                                        className="p-1 bg-rose-500 rounded-full text-white hover:bg-rose-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all">
                        <Plus size={20} />
                        <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,image/heic,application/pdf" />
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || isUploading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all mt-4 flex items-center justify-center disabled:opacity-70"
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Check className="mr-2" size={20} />}
                {initialData ? 'SALVAR ALTERAÇÕES' : (isInstallment ? `REGISTRAR ${installmentCount} PARCELAS` : 'REGISTRAR GASTO')}
            </button>
        </form>
    );
}
