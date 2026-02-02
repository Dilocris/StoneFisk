'use client';

import React, { useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import clsx from 'clsx';

export function HealthCheck() {
    const { data, getBudgetStats } = useProject();
    const { totalSpent, remaining } = getBudgetStats();

    // Memoize financial health calculations
    const { budgetUsage, financialStatus } = useMemo(() => {
        const totalBudget = data.project.totalBudget;
        const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

        let financialStatus: 'good' | 'warning' | 'critical' = 'good';
        if (budgetUsage > 95) financialStatus = 'critical';
        else if (budgetUsage > 80) financialStatus = 'warning';

        return { budgetUsage, financialStatus };
    }, [data.project.totalBudget, totalSpent]);

    // Memoize timeline health calculations (overdue tasks and delay calculations)
    const { totalDelayDays, timelineStatus } = useMemo(() => {
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

        return { totalDelayDays, timelineStatus };
    }, [data.tasks]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Health Card */}
            <Card className={clsx(
                "relative overflow-hidden transition-all duration-300 ease-out border-l-4",
                financialStatus === 'good' && "border-l-success bg-success/5",
                financialStatus === 'warning' && "border-l-warning bg-warning/5",
                financialStatus === 'critical' && "border-l-danger bg-danger/5"
            )}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            Saúde Financeira
                        </p>
                        <h3 className="text-xl font-black text-foreground tracking-tight">
                            {financialStatus === 'good' ? 'Tudo sob controle' : financialStatus === 'warning' ? 'Atenção ao teto' : 'Orçamento Estourado'}
                        </h3>
                    </div>
                    <div className={clsx(
                        "p-2 rounded-xl shadow-lg transition-transform duration-300",
                        financialStatus === 'good' && "bg-success/20 text-success shadow-success/10",
                        financialStatus === 'warning' && "bg-warning/20 text-warning shadow-warning/10",
                        financialStatus === 'critical' && "bg-danger/20 text-danger shadow-danger/10"
                    )}>
                        {financialStatus === 'good' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">{budgetUsage.toFixed(0)}% Utilizado</span>
                    <span className="text-foreground">Restam R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className={clsx(
                            "h-full transition-[width] duration-700 ease-out",
                            financialStatus === 'good' ? "bg-success" : financialStatus === 'warning' ? "bg-warning" : "bg-danger"
                        )}
                        style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                    />
                </div>
            </Card>

            {/* Timeline Health Card */}
            <Card className={clsx(
                "relative overflow-hidden transition-all duration-300 ease-out border-l-4",
                timelineStatus === 'good' && "border-l-info bg-info/5",
                timelineStatus === 'warning' && "border-l-warning bg-warning/5",
                timelineStatus === 'critical' && "border-l-danger bg-danger/5"
            )}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            Ritmo da Obra
                        </p>
                        <h3 className="text-xl font-black text-foreground tracking-tight">
                            {timelineStatus === 'good' ? 'Cronograma em Dia' : timelineStatus === 'warning' ? 'Ajustes Necessários' : 'Obra Travada'}
                        </h3>
                    </div>
                    <div className={clsx(
                        "p-2 rounded-xl shadow-lg transition-transform duration-300",
                        timelineStatus === 'good' && "bg-info/20 text-info shadow-info/10",
                        timelineStatus === 'warning' && "bg-warning/20 text-warning shadow-warning/10",
                        timelineStatus === 'critical' && "bg-danger/20 text-danger shadow-danger/10"
                    )}>
                        {timelineStatus === 'good' ? <CheckCircle2 size={20} /> : timelineStatus === 'warning' ? <Clock size={20} /> : <AlertCircle size={20} />}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">{totalDelayDays} dias de atraso</span>
                    <button
                        onClick={() => document.getElementById('gantt-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-primary hover:underline transition-all active:scale-95"
                    >
                        Ver Detalhes
                    </button>
                </div>
                <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className={clsx(
                                "h-1.5 flex-1 rounded-full",
                                i <= (5 - Math.min(Math.ceil(totalDelayDays / 3), 5)) ? "bg-info" : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}
