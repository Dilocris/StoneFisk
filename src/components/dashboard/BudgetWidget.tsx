'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';

export function BudgetWidget() {
    const { data, getBudgetStats } = useProject();
    const { totalSpent, remaining } = getBudgetStats();

    const paidAmount = data.expenses
        .filter(e => e.status === 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);

    const pendingAmount = data.expenses
        .filter(e => e.status !== 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalBudget = data.project.totalBudget;
    const hasBudget = totalBudget > 0;
    const percentageUsed = hasBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const isOverBudget = hasBudget && totalSpent > totalBudget;

    // Bar heights in percentage
    const spentTotal = paidAmount + pendingAmount;
    const usedPercent = hasBudget ? Math.min(100, (spentTotal / totalBudget) * 100) : 0;
    const paidHeight = spentTotal > 0 ? (paidAmount / spentTotal) * usedPercent : 0;
    const pendingHeight = spentTotal > 0 ? (pendingAmount / spentTotal) * usedPercent : 0;
    const availableHeight = hasBudget ? Math.max(0, (remaining / totalBudget) * 100) : 0;

    return (
        <Card title="Status Financeiro" className="h-[600px] flex flex-col overflow-hidden bg-card text-card-foreground">
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-around gap-8 px-6 py-4">

                {/* Visual Area - Vertical Thermometer */}
                <div className="h-full py-8 flex items-center justify-center">
                    <div className="relative w-28 h-full flex flex-col items-center">
                        {/* The "Thermometer" Bar */}
                        <div className="w-16 h-full bg-muted rounded-full overflow-hidden flex flex-col-reverse border-4 border-border shadow-inner">
                            {/* Paid Segment */}
                            <div
                                style={{ height: `${paidHeight}%` }}
                                className="w-full bg-success transition-[height] duration-300 ease-out shadow-lg shadow-success/20"
                                title={`Pago: R$ ${paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            />
                            {/* Pending Segment */}
                            <div
                                style={{ height: `${pendingHeight}%` }}
                                className="w-full bg-warning transition-[height] duration-300 ease-out shadow-lg shadow-warning/10 border-t border-white/10"
                                title={`Pendente: R$ ${pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            />
                            {/* Empty space represented by background */}
                        </div>

                        {/* Floating Label - Centered on bar with translucency */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center bg-card/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-border z-10 transition-transform duration-150 ease-out hover:scale-110">
                            <span className="text-3xl font-black text-foreground leading-none tracking-tighter">{percentageUsed}%</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                                {isOverBudget ? 'Acima do OrÃ§amento' : 'Utilizado'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Area */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="group p-4 rounded-2xl bg-card border border-border transition-transform duration-150 ease-out hover:scale-[1.01]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-success uppercase tracking-widest">Pago</span>
                                <span className="text-[9px] font-bold text-success/50">{Math.round(paidHeight)}%</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">R$ {paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className="group p-4 rounded-2xl bg-card border border-border transition-transform duration-150 ease-out hover:scale-[1.01]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-warning uppercase tracking-widest">Pendente</span>
                                <span className="text-[9px] font-bold text-warning/50">{Math.round(pendingHeight)}%</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className="group p-4 rounded-2xl bg-card border border-border transition-transform duration-150 ease-out hover:scale-[1.01]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-info uppercase tracking-widest">Disponível</span>
                                <span className="text-[9px] font-bold text-info/50">{Math.round(availableHeight)}%</span>
                            </div>
                            <span className="text-xl font-bold text-info">R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="mt-2 pt-4 border-t border-border">
                        <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Orçamento Total</span>
                        <span className="text-2xl font-black text-foreground">R$ {data.project.totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
