'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';
import { Calendar, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export function TimelineWidget() {
    const { data } = useProject();

    // Filter for pending tasks and sort by date
    const upcomingTasks = data.tasks
        .filter(t => t.status === 'Pending' || t.status === 'In Progress')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5); // Show top 5 for better filling

    return (
        <Card title="Próximos Passos" className="h-full flex flex-col">
            {upcomingTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-muted-foreground/30">
                    <CheckCircle2 size={48} className="mb-3 opacity-20" />
                    <p className="text-sm italic uppercase font-black tracking-widest text-[10px]">Tudo em dia!</p>
                </div>
            ) : (
                <ul className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                    {upcomingTasks.map(task => (
                        <li key={task.id} className="flex items-start gap-4 p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200 group">
                            <div className={clsx(
                                "mt-0.5 p-2 rounded-xl transition-all duration-200 shadow-sm",
                                task.status === 'In Progress' ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                            )}>
                                <Calendar size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-sm text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{task.title}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{task.category}</span>
                                    <span className="text-[10px] font-black font-mono text-muted-foreground/60 tracking-tighter">
                                        {new Date(task.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
