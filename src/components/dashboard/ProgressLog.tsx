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
        <Card title="Diário da Obra" className="h-[520px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">O que mudou hoje?</p>
                {editingDate && (
                    <button
                        onClick={() => { setNote(''); setEditingDate(null); }}
                        className="text-[9px] font-black text-danger hover:underline uppercase transition-all tracking-tighter"
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
                    className="w-full h-24 p-4 bg-secondary dark:bg-slate-900/50 border border-border rounded-2xl resize-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out text-sm outline-none pr-12 text-foreground font-medium"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!note.trim() || isSaving}
                    className={clsx(
                        "absolute top-3 right-3 p-2 text-white rounded-xl shadow-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:shadow-none active:scale-90",
                        editingDate ? "bg-warning shadow-warning/20" : "bg-primary shadow-primary/20"
                    )}
                >
                    {isSaving ? <Check size={16} /> : editingDate ? <Edit3 size={16} /> : <Send size={16} />}
                </button>
                <p className="mt-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-widest px-1">Aperte Enter para enviar</p>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                    <History size={14} className="text-primary" />
                    Linha do Tempo
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 border-t border-border pt-4">
                    {data.progressLog.length === 0 ? (
                        <p className="text-xs text-muted-foreground/50 italic py-8 text-center uppercase tracking-widest font-black text-[10px]">Nenhuma anotação ainda.</p>
                    ) : (
                        <ul className="space-y-6">
                            {data.progressLog.map((entry) => (
                                <li key={entry.date} className="relative pl-6 border-l-2 border-border group last:pb-4">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-card border-2 border-primary group-hover:scale-125 transition-transform duration-300" />
                                    <div className="flex justify-between items-start">
                                        <span className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1 bg-primary/10 px-2 py-0.5 rounded-full">
                                            {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEdit(entry)}
                                                className="p-1.5 hover:text-warning hover:bg-warning/10 rounded-lg transition-all"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                            <button
                                                onClick={() => deleteProgressNote(entry.date)}
                                                className="p-1.5 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-foreground font-medium leading-relaxed break-words mt-1">
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
