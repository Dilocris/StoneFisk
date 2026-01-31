'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import clsx from 'clsx';

export function HealthCheck() {
    const { data, getBudgetStats } = useProject();
    const { totalSpent, remaining } = getBudgetStats();

    // Financial Health Calculation
    const totalBudget = data.project.totalBudget;
    const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    let financialStatus: 'good' | 'warning' | 'critical' = 'good';
    if (budgetUsage > 95) financialStatus = 'critical';
    else if (budgetUsage > 80) financialStatus = 'warning';

    // Timeline Health Calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delayedTasks = data.tasks.filter(t => t.status !== 'Completed' && new Date(t.endDate) < today);
    const totalDelayDays = delayedTasks.reduce((acc, t) => {
        const endDate = new Date(t.endDate);
        const diffTime = Math.abs(today.getTime() - endDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0);

    let timelineStatus: 'good' | 'warning' | 'critical' = 'good';
    if (totalDelayDays >= 15) timelineStatus = 'critical';
    else if (totalDelayDays > 0) timelineStatus = 'warning';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Health Card */}
            <Card className={clsx(
                "relative overflow-hidden transition-all duration-200 ease-out border-l-4",
                financialStatus === 'good' && "border-l-success bg-success/10",
                financialStatus === 'warning' && "border-l-warning bg-warning/10",
                financialStatus === 'critical' && "border-l-danger bg-danger/10"
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
                        financialStatus === 'good' && "bg-success/20 text-success",
                        financialStatus === 'warning' && "bg-warning/20 text-warning",
                        financialStatus === 'critical' && "bg-danger/20 text-danger"
                    )}>
                        {financialStatus === 'good' ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{budgetUsage.toFixed(0)}% do total utilizado</span>
                    <span className="font-bold">Restam R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-3 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={clsx(
                            "h-full transition-[width] duration-400 ease-out",
                            financialStatus === 'good' ? "bg-success" : financialStatus === 'warning' ? "bg-warning" : "bg-danger"
                        )}
                        style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                    />
                </div>
            </Card>

            {/* Timeline Health Card */}
            <Card className={clsx(
                "relative overflow-hidden transition-all duration-200 ease-out border-l-4",
                timelineStatus === 'good' && "border-l-info bg-info/10",
                timelineStatus === 'warning' && "border-l-warning bg-warning/10",
                timelineStatus === 'critical' && "border-l-danger bg-danger/10"
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
                        timelineStatus === 'good' && "bg-info/20 text-info",
                        timelineStatus === 'warning' && "bg-warning/20 text-warning",
                        timelineStatus === 'critical' && "bg-danger/20 text-danger"
                    )}>
                        {timelineStatus === 'good' ? <CheckCircle2 size={24} /> : timelineStatus === 'warning' ? <Clock size={24} /> : <AlertCircle size={24} />}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{totalDelayDays} dias de atraso acumulado</span>
                    <button
                        onClick={() => document.getElementById('gantt-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-blue-600 font-semibold hover:underline transition-colors duration-150 hover:text-blue-700"
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
                                i <= (5 - Math.min(Math.ceil(totalDelayDays / 3), 5)) ? "bg-info" : "bg-secondary"
                            )}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}
