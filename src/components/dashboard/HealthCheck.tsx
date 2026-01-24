'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export function HealthCheck() {
    const { data, getBudgetStats } = useProject();
    const { totalSpent, remaining } = getBudgetStats();

    // Financial Health Calculation
    const budgetUsage = (totalSpent / data.project.totalBudget) * 100;
    let financialStatus: 'good' | 'warning' | 'critical' = 'good';
    if (budgetUsage > 95) financialStatus = 'critical';
    else if (budgetUsage > 80) financialStatus = 'warning';

    // Timeline Health Calculation
    const delayedTasks = data.tasks.filter(t => t.status !== 'Completed' && new Date(t.endDate) < new Date()).length;
    let timelineStatus: 'good' | 'warning' | 'critical' = 'good';
    if (delayedTasks >= 3) timelineStatus = 'critical';
    else if (delayedTasks > 0) timelineStatus = 'warning';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Financial Health Card */}
            <Card className={clsx(
                "relative overflow-hidden transition-all duration-300 border-l-4",
                financialStatus === 'good' && "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10",
                financialStatus === 'warning' && "border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10",
                financialStatus === 'critical' && "border-l-rose-500 bg-rose-50/50 dark:bg-rose-900/10"
            )}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                            Saúde Financeira
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {financialStatus === 'good' ? 'Tudo sob controle' : financialStatus === 'warning' ? 'Atenção ao teto' : 'Orçamento Estourado'}
                        </h3>
                    </div>
                    <div className={clsx(
                        "p-2 rounded-full",
                        financialStatus === 'good' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
                        financialStatus === 'warning' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
                        financialStatus === 'critical' && "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
                    )}>
                        {financialStatus === 'good' ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{budgetUsage.toFixed(0)}% do total utilizado</span>
                    <span className="font-bold">Restam R$ {remaining.toLocaleString()}</span>
                </div>
                <div className="mt-3 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={clsx(
                            "h-full transition-all duration-1000",
                            financialStatus === 'good' ? "bg-emerald-500" : financialStatus === 'warning' ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                    />
                </div>
            </Card>

            {/* Timeline Health Card */}
            <Card className={clsx(
                "relative overflow-hidden transition-all duration-300 border-l-4",
                timelineStatus === 'good' && "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10",
                timelineStatus === 'warning' && "border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10",
                timelineStatus === 'critical' && "border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10"
            )}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                            Ritmo da Obra
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {timelineStatus === 'good' ? 'Cronograma em Dia' : timelineStatus === 'warning' ? 'Ajustes Necessários' : 'Obra Travada'}
                        </h3>
                    </div>
                    <div className={clsx(
                        "p-2 rounded-full",
                        timelineStatus === 'good' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                        timelineStatus === 'warning' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
                        timelineStatus === 'critical' && "bg-orange-100 text-orange-600 dark:bg-orange-900/30"
                    )}>
                        {timelineStatus === 'good' ? <CheckCircle2 size={24} /> : timelineStatus === 'warning' ? <Clock size={24} /> : <AlertCircle size={24} />}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{delayedTasks} tarefas com atraso</span>
                    <button
                        onClick={() => document.getElementById('gantt-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Ver Detalhes
                    </button>
                </div>
                <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className={clsx(
                                "h-1 flex-1 rounded-full",
                                i <= (5 - delayedTasks) ? "bg-blue-400" : "bg-slate-200 dark:bg-slate-700"
                            )}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}
