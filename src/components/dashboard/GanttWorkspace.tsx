'use client';

import React, { useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

export function GanttWorkspace() {
    const { data } = useProject();
    const [hoveredTaskId, setHoveredTaskId] = React.useState<string | null>(null);

    const { timelineGrid, taskBars, dayLines } = useMemo(() => {
        const windowStart = new Date();
        windowStart.setHours(0, 0, 0, 0);

        const totalDays = 90;
        const windowEnd = new Date(windowStart);
        windowEnd.setDate(windowEnd.getDate() + totalDays);

        // Generate Grid Labels (Months)
        const grid = [];
        let current = new Date(windowStart);

        while (current < windowEnd) {
            const monthName = current.toLocaleDateString('pt-BR', { month: 'long' });
            const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
            const daysLeftInMonth = daysInMonth - current.getDate() + 1;
            const span = Math.min(daysLeftInMonth, (windowEnd.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

            grid.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                width: `${(span / totalDays) * 100}%`
            });

            current.setDate(current.getDate() + span);
        }

        // Generate Day Lines & Weekends
        const dayLines = [];
        for (let i = 0; i < totalDays; i++) {
            const dayDate = new Date(windowStart);
            dayDate.setDate(dayDate.getDate() + i);
            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            dayLines.push({
                day: dayDate.getDate(),
                isWeekend,
                left: `${(i / totalDays) * 100}%`,
                width: `${(1 / totalDays) * 100}%`
            });
        }

        // Map Tasks to Bars
        const bars = data.tasks.map((task) => {
            const start = new Date(task.startDate);
            const end = new Date(task.endDate);

            const effectiveStart = Math.max(start.getTime(), windowStart.getTime());
            const effectiveEnd = Math.min(end.getTime(), windowEnd.getTime());

            if (effectiveEnd <= effectiveStart) return null;

            const left = ((effectiveStart - windowStart.getTime()) / (1000 * 60 * 60 * 24 * totalDays)) * 100;
            const width = ((effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24 * totalDays)) * 100;

            let color = 'bg-blue-500';
            if (task.status === 'Completed') color = 'bg-emerald-500';
            if (task.status === 'Blocked') color = 'bg-rose-500';
            if (task.status === 'In Progress') color = 'bg-amber-500';

            return {
                ...task,
                left: `${left}%`,
                width: `${width}%`,
                color
            };
        }).filter(Boolean);

        return {
            timelineGrid: grid,
            taskBars: bars,
            dayLines
        };
    }, [data.tasks]);

    return (
        <Card id="gantt-section" className="mb-8 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="text-blue-500" size={20} />
                        Cronograma
                    </h2>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Pendente</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Em Curso</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Pronto</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Bloqueado</div>
                </div>
            </div>

            <div className="relative overflow-x-auto pb-6 custom-scrollbar-thick scroll-smooth">
                <style jsx global>{`
                    .custom-scrollbar-thick::-webkit-scrollbar {
                        height: 10px;
                    }
                    .custom-scrollbar-thick::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar-thick::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 10px;
                    }
                    .dark .custom-scrollbar-thick::-webkit-scrollbar-thumb {
                        background: #334155;
                    }
                `}</style>
                <div className="min-w-[2000px] relative">
                    {/* Month Header */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800 mb-0 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-lg">
                        {timelineGrid.map((m, i) => (
                            <div
                                key={i}
                                style={{ width: m.width }}
                                className="text-center py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 dark:border-slate-700 last:border-0"
                            >
                                {m.name}
                            </div>
                        ))}
                    </div>

                    {/* Day Numbers Header */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900">
                        {dayLines.map((d, i) => (
                            <div
                                key={i}
                                style={{ width: d.width }}
                                className={clsx(
                                    "text-center py-1 text-[8px] font-bold text-slate-400 border-r border-slate-50 dark:border-slate-800 last:border-0",
                                    d.isWeekend && "bg-slate-50/50 dark:bg-slate-800/30 text-slate-500"
                                )}
                            >
                                {d.day}
                            </div>
                        ))}
                    </div>

                    {/* Gantt Grid */}
                    <div className="relative min-h-[350px] px-0">
                        {/* Day vertical lines & Weekend markings */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {dayLines.map((line, i) => (
                                <div
                                    key={i}
                                    style={{ left: line.left, width: line.width }}
                                    className={clsx(
                                        "absolute top-0 bottom-0 border-r border-slate-100/50 dark:border-slate-800/30",
                                        line.isWeekend && "bg-slate-100/50 dark:bg-slate-800/20"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Task Bars */}
                        <div className="relative z-10 space-y-3 pt-2">
                            {taskBars.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-slate-400 italic text-sm gap-2">
                                    <Info size={32} className="opacity-20" />
                                    Nenhuma tarefa programada para os próximos 90 dias.
                                </div>
                            ) : (
                                (taskBars as any[]).map((task) => (
                                    <div key={task.id} className="relative h-8">
                                        <div
                                            className={clsx(
                                                "group absolute h-full rounded-xl shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center px-4 text-xs font-bold text-white overflow-visible z-20 hover:z-50",
                                                task.color,
                                                hoveredTaskId && hoveredTaskId !== task.id && "opacity-40 grayscale-[0.2]"
                                            )}
                                            style={{ left: task.left, width: task.width }}
                                            onMouseEnter={() => setHoveredTaskId(task.id)}
                                            onMouseLeave={() => setHoveredTaskId(null)}
                                        >
                                            <span className="truncate">{task.title}</span>
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                                            {/* Tooltip visible only when hovering the bar */}
                                            {hoveredTaskId === task.id && (
                                                <div className="absolute opacity-100 pointer-events-none transition-all duration-200 bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                                    <div className="bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-xl shadow-2xl whitespace-nowrap border border-white/10">
                                                        <span className="text-sm font-bold block mb-1">{task.title}</span>
                                                        <div className="flex gap-4 text-[10px] opacity-70">
                                                            <span>📅 {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}</span>
                                                            <span className="font-black uppercase">
                                                                {task.status === 'Pending' ? 'Pendente' :
                                                                    task.status === 'In Progress' ? 'Em Curso' :
                                                                        task.status === 'Completed' ? 'Pronto' : 'Bloqueado'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900 dark:border-t-slate-800" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
