'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function BudgetWidget() {
    const { data, getBudgetStats } = useProject();
    const { totalSpent, remaining } = getBudgetStats();

    // Differentiate Paid vs Pending
    const paidAmount = data.expenses
        .filter(e => e.status === 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);

    const pendingAmount = data.expenses
        .filter(e => e.status !== 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);

    const chartData = useMemo(() => [
        { name: 'Pago', value: paidAmount, color: '#e11d48' }, // Rose 600
        { name: 'Pendente', value: pendingAmount, color: '#eab308' }, // Amber  Yellow
        { name: 'Disponível', value: remaining > 0 ? remaining : 0, color: '#10b981' } // Emerald 500
    ], [paidAmount, pendingAmount, remaining]);

    const percentageUsed = Math.round((totalSpent / data.project.totalBudget) * 100);

    return (
        <Card title="Status Financeiro" className="h-[600px] flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 px-8">
                {/* Visual Area */}
                <div className="w-full lg:w-3/5 h-[350px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={90}
                                outerRadius={130}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | undefined) => `R$ ${(value || 0).toLocaleString()}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{percentageUsed}%</span>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Utilizado</span>
                    </div>
                </div>

                {/* Stats Area */}
                <div className="w-full lg:w-2/5 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                            <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Pago</span>
                            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">R$ {paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                            <span className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Pendente</span>
                            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">R$ {pendingAmount.toLocaleString()}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                            <span className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Disponível</span>
                            <span className="text-xl font-bold text-emerald-600">R$ {remaining.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orçamento Total</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">R$ {data.project.totalBudget.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
