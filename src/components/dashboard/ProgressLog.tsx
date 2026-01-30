'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { Send, History, Check, Edit3, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export function ProgressLog() {
    const { data, addProgressNote, updateProgressNote, deleteProgressNote } = useProject();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingDate, setEditingDate] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!note.trim()) return;
        setIsSaving(true);

        if (editingDate) {
            updateProgressNote(editingDate, note);
            setEditingDate(null);
        } else {
            addProgressNote(note);
        }

        setNote('');
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleEdit = (entry: { date: string, note: string }) => {
        setNote(entry.note);
        setEditingDate(entry.date);
        document.getElementById('daily-note-area')?.focus();
    };

    return (
        <Card title="Diário da Obra" className="min-h-[200px] max-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-500">O que mudou hoje?</p>
                {editingDate && (
                    <button
                        onClick={() => { setNote(''); setEditingDate(null); }}
                        className="text-[10px] font-bold text-rose-500 hover:underline uppercase"
                    >
                        Cancelar Edição
                    </button>
                )}
            </div>

            <div className="relative mb-6">
                <textarea
                    id="daily-note-area"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: O pintor finalizou o teto da sala..."
                    className="w-full h-24 p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none pr-12"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!note.trim() || isSaving}
                    className={clsx(
                        "absolute top-2 right-2 p-2 text-white rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:shadow-none",
                        editingDate ? "bg-amber-500 shadow-amber-500/30" : "bg-blue-600 shadow-blue-500/30"
                    )}
                >
                    {isSaving ? <Check size={16} /> : editingDate ? <Edit3 size={16} /> : <Send size={16} />}
                </button>
                <p className="mt-1 text-[9px] text-slate-400 font-medium px-2">Aperte Enter para enviar</p>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <History size={14} />
                    Linha do Tempo
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 border-t border-slate-50 dark:border-slate-800 pt-4">
                    {data.progressLog.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Nenhuma anotação ainda.</p>
                    ) : (
                        <ul className="space-y-4">
                            {data.progressLog.map((entry) => (
                                <li key={entry.date} className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 group">
                                    <div className="flex justify-between items-start">
                                        <span className="block text-[10px] font-bold text-blue-500 mb-1">
                                            {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(entry)}
                                                className="p-1 hover:text-amber-500 transition-colors"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                            <button
                                                onClick={() => deleteProgressNote(entry.date)}
                                                className="p-1 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                                        {entry.note}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Card>
    );
}
