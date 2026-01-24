'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';
import { Calendar, CheckCircle2 } from 'lucide-react';

export function TimelineWidget() {
    const { data } = useProject();

    // Filter for pending tasks and sort by date
    const upcomingTasks = data.tasks
        .filter(t => t.status === 'Pending' || t.status === 'In Progress')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3); // Show top 3

    return (
        <Card title="Cronograma Ativo" className="h-full">
            {upcomingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <CheckCircle2 size={40} className="mb-2 opacity-50" />
                    <p>Tudo em dia!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {upcomingTasks.map(task => (
                        <li key={task.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 dark:border-slate-700">
                            <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-md dark:bg-blue-900/30 dark:text-blue-400">
                                <Calendar size={16} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">{task.title}</h4>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-slate-500">{task.category}</span>
                                    <span className="text-xs font-mono text-slate-400">{new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
