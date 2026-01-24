'use client';

import React, { useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';
import { Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from 'lucide-react';

export function GanttWorkspace() {
    const { data } = useProject();
    const [hoveredTaskId, setHoveredTaskId] = React.useState<string | null>(null);
    const [viewOffset, setViewOffset] = React.useState(0); // Offset in days from "Project Start" or "Today"? User wants scrolable to past.

    const BRAZILIAN_HOLIDAYS = useMemo(() => [
        { date: '2026-01-01', name: 'Ano Novo' },
        { date: '2026-02-17', name: 'Carnaval' },
        { date: '2026-04-03', name: 'Sexta-feira Santa' },
        { date: '2026-04-21', name: 'Tiradentes' },
        { date: '2026-05-01', name: 'Dia do Trabalho' },
        { date: '2026-06-04', name: 'Corpus Christi' },
        { date: '2026-09-07', name: 'Independência' },
        { date: '2026-10-12', name: 'Nossa Sra. Aparecida' },
        { date: '2026-11-02', name: 'Finados' },
        { date: '2026-11-15', name: 'Proclamação da República' },
        { date: '2026-11-20', name: 'Consciência Negra' },
        { date: '2026-12-25', name: 'Natal' }
    ], []);

    const { timelineGrid, taskBars, dayLines, windowStart, totalDelayDays } = useMemo(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() + viewOffset);

        const totalDays = 90;
        const windowEnd = new Date(start);
        windowEnd.setDate(windowEnd.getDate() + totalDays);

        // Generate Grid Labels (Months)
        const grid = [];
        let current = new Date(start);

        while (current < windowEnd) {
            const monthName = current.toLocaleDateString('pt-BR', { month: 'long' });
            const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
            const daysLeftInMonth = daysInMonth - current.getDate() + 1;
            const span = Math.min(daysLeftInMonth, (windowEnd.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

            grid.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                width: `${(span / totalDays) * 100}%`
            });

            current = new Date(current);
            current.setDate(current.getDate() + span);
        }

        // Generate Day Lines & Weekends
        const dayLines: { day: number; isWeekend: boolean; isToday: boolean; holiday?: { date: string; name: string }; left: string; width: string; }[] = [];
        const todayStr = new Date().toDateString();
        for (let i = 0; i < totalDays; i++) {
            const dayDate = new Date(start);
            dayDate.setDate(dayDate.getDate() + i);
            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            const isToday = dayDate.toDateString() === todayStr;
            const dateISO = dayDate.toISOString().split('T')[0];
            const holiday = BRAZILIAN_HOLIDAYS.find(h => h.date === dateISO);

            dayLines.push({
                day: dayDate.getDate(),
                isWeekend,
                isToday,
                holiday,
                left: `${(i / totalDays) * 100}%`,
                width: `${(1 / totalDays) * 100}%`
            });
        }

        // Map Tasks to Bars
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bars = data.tasks.map((task) => {
            // Fix: Use Date.parse or ensure 'YYYY-MM-DD' is treated as start of day local
            const tStart = new Date(task.startDate + 'T00:00:00');
            const tEnd = new Date(task.endDate + 'T23:59:59');

            const effectiveStart = Math.max(tStart.getTime(), start.getTime());
            const effectiveEnd = Math.min(tEnd.getTime(), windowEnd.getTime());

            if (effectiveEnd <= effectiveStart) return null;

            const left = ((effectiveStart - start.getTime()) / (1000 * 60 * 60 * 24 * totalDays)) * 100;
            const width = ((effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24 * totalDays)) * 100;

            let color = 'bg-[#49483e]'; // Monokai Muted Gray
            if (task.status === 'Completed') color = 'bg-[#98e342]'; // Monokai Green
            if (task.status === 'Blocked') color = 'bg-[#f92672]'; // Monokai Red
            if (task.status === 'In Progress') color = 'bg-[#fce566] text-black'; // Monokai Yellow

            const isOverdue = tEnd < today && task.status !== 'Completed';

            return {
                ...task,
                left: `${left}%`,
                width: `${width}%`,
                color,
                isOverdue
            };
        }).filter(Boolean);

        // Calculate Total Delay Load (Overage)
        const totalDelayDays = data.tasks
            .filter(t => t.status !== 'Completed')
            .reduce((sum, t) => {
                const tEnd = new Date(t.endDate + 'T23:59:59');
                if (tEnd < today) {
                    const diff = today.getTime() - tEnd.getTime();
                    return sum + Math.ceil(diff / (1000 * 60 * 60 * 24));
                }
                return sum;
            }, 0);

        return {
            timelineGrid: grid,
            taskBars: bars,
            dayLines,
            windowStart: start,
            totalDelayDays
        };
    }, [data.tasks, viewOffset, BRAZILIAN_HOLIDAYS]);

    const handleNext = () => setViewOffset(prev => prev + 7);
    const handlePrev = () => setViewOffset(prev => prev - 7);
    const handleJump = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        const targetDate = new Date(e.target.value);
        targetDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setViewOffset(diffDays);
    };

    return (
        <Card id="gantt-section" className="mb-8 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-4 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="text-blue-500" size={20} />
                        Cronograma
                    </h2>

                    <div className="flex items-center bg-[#2d2d2d] rounded-2xl p-1.5 gap-2 shadow-sm border border-[#3e3d32]">
                        <button
                            onClick={handlePrev}
                            className="p-2 hover:bg-[#3e3d32] rounded-xl text-[#67d8ef] transition-all hover:scale-110 active:scale-95"
                            title="7 dias para trás"
                        >
                            <ChevronLeft size={20} strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => setViewOffset(0)}
                            className="px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#9a9a9a] hover:text-[#67d8ef] transition-all border-x border-[#3e3d32]"
                        >
                            Hoje
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-2 hover:bg-[#3e3d32] rounded-xl text-[#67d8ef] transition-all hover:scale-110 active:scale-95"
                            title="7 dias para frente"
                        >
                            <ChevronRight size={20} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="relative group/date">
                        <input
                            type="date"
                            onChange={handleJump}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 transition-all uppercase tracking-tight">
                            <CalendarIcon size={14} /> Pular p/ Data
                        </button>
                    </div>

                    {timelineGrid.length > 0 && (
                        <div className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-xl border font-bold transition-all animate-in fade-in slide-in-from-left-4",
                            totalDelayDays > 0
                                ? "bg-rose-50 border-rose-100 text-rose-600 animate-pulse"
                                : "bg-emerald-50 border-emerald-100 text-emerald-600"
                        )}>
                            <div className="flex flex-col">
                                <span className="text-[7px] uppercase tracking-widest leading-none mb-0.5">Carga de Atraso</span>
                                <span className="text-xs leading-none">{totalDelayDays} {totalDelayDays === 1 ? 'dia' : 'dias'}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight text-[#9a9a9a]">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#49483e]" /> Pendente</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#fce566]" /> Em Curso</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#98e342]" /> Pronto</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f92672]" /> Bloqueado</div>
                    <div className="flex items-center gap-1 ml-2"><span className="w-3 h-3 rounded-sm border-2 border-[#f92672] animate-pulse" /> Atrasado</div>
                </div>
            </div>

            <div className="relative overflow-hidden pb-6">
                <div className="relative">
                    {/* Month Header */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800 mb-0 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-lg">
                        {timelineGrid.map((m, i) => (
                            <div
                                key={i}
                                style={{ width: m.width }}
                                className="text-center py-2 text-[10px] font-black uppercase tracking-widest text-[#9a9a9a] border-r border-[#3e3d32] last:border-0"
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
                                    "text-center py-1 text-[8px] font-bold border-r border-slate-50 dark:border-slate-800 last:border-0 transition-colors",
                                    d.isToday ? "bg-blue-500 text-white" : d.isWeekend ? "bg-slate-50/50 dark:bg-slate-800/30 text-slate-500" : "text-slate-400"
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
                                        "absolute top-0 bottom-0 border-r transition-colors",
                                        line.isToday ? "bg-blue-500/10 border-blue-500/30 z-0" : "border-slate-100/50 dark:border-slate-800/30",
                                        line.isWeekend && !line.isToday && "bg-slate-100/50 dark:bg-slate-800/20",
                                        line.holiday && "bg-rose-500/5"
                                    )}
                                >
                                    {line.isToday && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-blue-500 text-white text-[6px] font-black rounded-b uppercase tracking-tighter">Hoje</div>
                                    )}
                                    {line.holiday && (
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                            <div className="w-1 h-1 rounded-full bg-rose-400 mb-1" />
                                            <span className="text-[6px] font-bold text-rose-500 whitespace-nowrap opacity-50 uppercase">{line.holiday.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Task Bars */}
                        <div className="relative z-10 space-y-3 pt-2">
                            {taskBars.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400 italic text-sm gap-2">
                                    <Info size={32} className="opacity-20" />
                                    <span>Nenhuma tarefa ativa nesta janela.</span>
                                    <button onClick={() => setViewOffset(0)} className="text-[10px] font-black uppercase text-blue-500 mt-2 hover:underline">Voltar para Hoje</button>
                                </div>
                            ) : (
                                (taskBars as any[]).map((task) => (
                                    <div key={task.id} className="relative h-8">
                                        <div
                                            className={clsx(
                                                "group absolute h-full rounded-xl shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center px-4 text-xs font-bold text-white overflow-visible z-20 hover:z-50",
                                                task.color,
                                                hoveredTaskId && hoveredTaskId !== task.id && "opacity-40 grayscale-[0.2]",
                                                task.isOverdue && "ring-4 ring-rose-500/50 border-2 border-white ring-offset-2 ring-offset-rose-500 animate-pulse"
                                            )}
                                            style={{ left: task.left, width: task.width }}
                                            onMouseEnter={() => setHoveredTaskId(task.id)}
                                            onMouseLeave={() => setHoveredTaskId(null)}
                                            onClick={() => window.dispatchEvent(new CustomEvent('edit-task', { detail: task }))}
                                        >
                                            <span className="truncate">{task.title}</span>
                                            {task.isOverdue && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg animate-bounce" />
                                            )}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                                            {/* Tooltip */}
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
