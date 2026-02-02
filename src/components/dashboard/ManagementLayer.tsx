'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useModal } from '@/context/ModalContext';
import { Category, CATEGORIES, Expense, Task, Supplier } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Trash2, Edit3, Plus, CreditCard, Phone, Mail, Globe, User, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

export function ManagementLayer() {
    const { data, supplierMap, updateExpense, deleteExpense, updateTask, deleteTask, deleteSupplier } = useProject();
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState<'expenses' | 'tasks' | 'suppliers'>('expenses');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');

    // Clear selection when changing tabs
    React.useEffect(() => {
        setSelectedIds([]);
        setSearchTerm('');
        setCategoryFilter('all');
    }, [activeTab]);

    const getCurrentItems = () => {
        if (activeTab === 'expenses') return data.expenses;
        if (activeTab === 'tasks') return data.tasks;
        return data.suppliers;
    };

    const getFilteredItems = () => {
        const items = getCurrentItems();
        const term = searchTerm.trim().toLowerCase();

        return items.filter((item: Expense | Task | Supplier) => {
            if (categoryFilter !== 'all') {
                if ('category' in item && item.category !== categoryFilter) return false;
            }
            if (!term) return true;
            if (activeTab === 'expenses') {
                return (
                    item.name?.toLowerCase().includes(term) ||
                    item.category?.toLowerCase().includes(term) ||
                    item.paymentMethod?.toLowerCase().includes(term)
                );
            }
            if (activeTab === 'tasks') {
                return (
                    item.title?.toLowerCase().includes(term) ||
                    item.category?.toLowerCase().includes(term) ||
                    item.status?.toLowerCase().includes(term)
                );
            }
            return (
                item.name?.toLowerCase().includes(term) ||
                item.phone1?.toLowerCase().includes(term) ||
                item.phone2?.toLowerCase().includes(term) ||
                item.email?.toLowerCase().includes(term) ||
                item.category?.toLowerCase().includes(term)
            );
        });
    };

    const filteredItems = getFilteredItems();

    const handleSelectAll = () => {
        const items = getCurrentItems();
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(i => i.id));
        }
    };

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleBulkDelete = () => {
        if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} itens selecionados?`)) return;

        if (activeTab === 'expenses') {
            selectedIds.forEach(id => deleteExpense(id));
        } else if (activeTab === 'tasks') {
            selectedIds.forEach(id => deleteTask(id));
        } else {
            selectedIds.forEach(id => deleteSupplier(id));
        }
        setSelectedIds([]);
    };

    return (
        <section className="mt-12" id="management-section">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gerenciamento Detalhado</h2>
                    <p className="text-sm text-slate-500">Controle total sobre cada lançamento</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 ? (
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all duration-150 ease-out animate-in fade-in slide-in-from-top-2"
                            >
                                <Trash2 size={18} />
                                Excluir ({selectedIds.length})
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    const type = activeTab === 'expenses' ? 'expense' :
                                        activeTab === 'tasks' ? 'task' : 'supplier';
                                    openModal(type);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-150 ease-out font-outfit"
                            >
                                <Plus size={18} />
                                {activeTab === 'expenses' ? 'Novo Gasto' : activeTab === 'tasks' ? 'Nova Tarefa' : 'Novo Fornecedor'}
                            </button>
                        )}
                    </div>

                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <button
                            onClick={() => setActiveTab('expenses')}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-150 ease-out",
                                activeTab === 'expenses' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Gastos
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-150 ease-out",
                                activeTab === 'tasks' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Tarefas
                        </button>
                        <button
                            onClick={() => setActiveTab('suppliers')}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-150 ease-out",
                                activeTab === 'suppliers' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Fornecedores
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
                <div className="flex-1">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Busca</span>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={activeTab === 'suppliers' ? 'Buscar por nome, telefone ou email...' : 'Buscar por nome, categoria ou status...'}
                        className="w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-foreground"
                    />
                </div>
                <div className="w-full md:w-64">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Categoria</span>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="w-full p-3 bg-secondary text-foreground rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all text-xs font-bold"
                    >
                        <option value="all" className="bg-secondary text-foreground">Todas as categorias</option>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c} className="bg-secondary text-foreground">{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-none shadow-xl bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="w-12 px-6 py-4 bg-secondary border-b border-border">
                                    <input
                                        type="checkbox"
                                        checked={getCurrentItems().length > 0 && selectedIds.length === getCurrentItems().length}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-card cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[9px] bg-secondary border-b border-border">
                                    {activeTab === 'suppliers' ? 'Fornecedor / Contato' : 'Nome / Item'}
                                </th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[9px] bg-secondary border-b border-border">Categoria</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[9px] bg-secondary border-b border-border">
                                    {activeTab === 'expenses' ? 'Vencimento' : activeTab === 'tasks' ? 'Início' : 'Observações'}
                                </th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[9px] text-right bg-secondary border-b border-border">
                                    {activeTab === 'expenses' ? 'Valor' : activeTab === 'tasks' ? 'Previsão Fim' : ''}
                                </th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[9px] text-center bg-secondary border-b border-border">
                                    {activeTab === 'suppliers' ? 'AvaliaÃ§Ã£o' : activeTab === 'expenses' ? 'Status / Anexos' : 'Status'}
                                </th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[9px] text-right bg-secondary border-b border-border">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {activeTab === 'expenses' ? (
                                filteredItems.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground italic">Nenhum gasto registrado.</td></tr>
                                ) : (
                                    (filteredItems as Expense[]).map(exp => (
                                        <tr key={exp.id} className={clsx("hover:bg-muted/50 transition-colors duration-150 group", selectedIds.includes(exp.id) && "bg-muted/30")}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(exp.id)}
                                                    onChange={() => toggleSelection(exp.id)}
                                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-card cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                                    {exp.name}
                                                    {exp.installmentInfo && (
                                                        <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[8px] font-black rounded border border-blue-100 dark:border-blue-900/50">
                                                            P{exp.installmentInfo.current}/{exp.installmentInfo.total}
                                                        </span>
                                                    )}
                                                </div>
                                                {exp.supplierId && (
                                                    <div className="text-[9px] text-blue-500 font-bold flex items-center gap-1 mt-0.5">
                                                        <User size={10} /> {supplierMap.get(exp.supplierId)?.name || 'Fornecedor Desconhecido'}
                                                    </div>
                                                )}
                                                {exp.paymentMethod && (
                                                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1 mt-0.5">
                                                        <CreditCard size={10} /> {exp.paymentMethod}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">{exp.category}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">
                                                {new Date(exp.dueDate || exp.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-600 dark:text-slate-400">R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <select
                                                        value={exp.status}
                                                        onChange={(e) => updateExpense(exp.id, { status: e.target.value as any })}
                                                        className={clsx(
                                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter cursor-pointer outline-none border transition-all duration-150 ease-out",
                                                            exp.status === 'Paid' ? "bg-success/10 text-success border-success/30" :
                                                                exp.status === 'Deposit' ? "bg-info/10 text-info border-info/30" : "bg-warning/10 text-warning border-warning/30"
                                                        )}
                                                    >
                                                        <option value="Paid">Pago</option>
                                                        <option value="Deposit">Sinal</option>
                                                        <option value="Pending">Pendente</option>
                                                    </select>
                                                    {exp.attachments && exp.attachments.length > 0 ? (
                                                        <button
                                                            onClick={() => window.dispatchEvent(new CustomEvent('edit-expense', { detail: exp }))}
                                                            className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors duration-150"
                                                        >
                                                            <ImageIcon size={12} /> {exp.attachments.length}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => window.dispatchEvent(new CustomEvent('edit-expense', { detail: exp }))}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                        title="Editar"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Excluir este gasto?')) deleteExpense(exp.id) }}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : activeTab === 'tasks' ? (
                                filteredItems.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground italic">Nenhuma tarefa registrada.</td></tr>
                                ) : (
                                    (filteredItems as Task[]).map(task => (
                                        <tr key={task.id} className={clsx("hover:bg-muted/50 transition-colors duration-150 group", selectedIds.includes(task.id) && "bg-muted/30")}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(task.id)}
                                                    onChange={() => toggleSelection(task.id)}
                                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-card cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{task.title}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">{task.category}</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-400 text-xs">
                                                {new Date(task.startDate).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-600 dark:text-slate-400">
                                                {new Date(task.endDate).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                                                    className={clsx(
                                                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter cursor-pointer outline-none border transition-all duration-150 ease-out",
                                                        task.status === 'Completed' ? "bg-success/10 text-success border-success/30" :
                                                            task.status === 'In Progress' ? "bg-warning/10 text-warning border-warning/30" :
                                                                task.status === 'Blocked' ? "bg-danger/10 text-danger border-danger/30" : "bg-muted text-muted-foreground border-border"
                                                    )}
                                                >
                                                    <option value="Pending">Pendente</option>
                                                    <option value="In Progress">Em Curso</option>
                                                    <option value="Completed">Pronto</option>
                                                    <option value="Blocked">Bloqueado</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => window.dispatchEvent(new CustomEvent('edit-task', { detail: task }))}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                        title="Editar"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Excluir esta tarefa?')) deleteTask(task.id) }}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                filteredItems.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground italic">Nenhum fornecedor cadastrado.</td></tr>
                                ) : (
                                    (filteredItems as Supplier[]).map(sup => (
                                        <tr key={sup.id} className={clsx("hover:bg-muted/50 transition-colors duration-150 group", selectedIds.includes(sup.id) && "bg-muted/30")}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(sup.id)}
                                                    onChange={() => toggleSelection(sup.id)}
                                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-card cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700 dark:text-slate-200">{sup.name}</div>
                                                <div className="flex flex-col gap-0.5 mt-1">
                                                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                                                        <Phone size={10} /> {sup.phone1} {sup.phone2 && `/ ${sup.phone2}`}
                                                    </div>
                                                    {sup.email && (
                                                        <div className="text-[10px] text-blue-500/70 font-medium flex items-center gap-1">
                                                            <Mail size={10} /> {sup.email}
                                                        </div>
                                                    )}
                                                    {sup.website && (
                                                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                            <Globe size={10} /> {sup.website}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">{sup.category}</td>
                                            <td colSpan={2} className="px-6 py-4 text-xs italic text-slate-400">{sup.notes || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <span key={star} className={clsx("text-xs", star <= (sup.rating || 0) ? "text-amber-400" : "text-slate-200")}>★</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => window.dispatchEvent(new CustomEvent('edit-supplier', { detail: sup }))}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                        title="Editar"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Remover fornecedor?')) deleteSupplier(sup.id) }}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    );
}
