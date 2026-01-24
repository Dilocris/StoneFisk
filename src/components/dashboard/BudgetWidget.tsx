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

    const totalBudget = data.project.totalBudget || 1; // Prevent div by zero
    const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

    // Bar heights in percentage
    const paidHeight = (paidAmount / totalBudget) * 100;
    const pendingHeight = (pendingAmount / totalBudget) * 100;
    const availableHeight = Math.max(0, (remaining / totalBudget) * 100);

    return (
        <Card title="Status Financeiro" className="h-[600px] flex flex-col overflow-hidden bg-[#1c1c1c] text-[#c5c8c6]">
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-around gap-8 px-6 py-4">

                {/* Visual Area - Vertical Thermometer */}
                <div className="h-full py-8 flex items-center justify-center">
                    <div className="relative w-28 h-full flex flex-col items-center">
                        {/* The "Thermometer" Bar */}
                        <div className="w-16 h-full bg-[#2d2d2d] rounded-full overflow-hidden flex flex-col-reverse border-4 border-[#3e3d32] shadow-inner">
                            {/* Paid Segment */}
                            <div
                                style={{ height: `${paidHeight}%` }}
                                className="w-full bg-[#f92672] transition-all duration-700 shadow-lg shadow-[#f92672]/20"
                                title={`Pago: R$ ${paidAmount.toLocaleString()}`}
                            />
                            {/* Pending Segment */}
                            <div
                                style={{ height: `${pendingHeight}%` }}
                                className="w-full bg-[#fce566] transition-all duration-700 shadow-lg shadow-[#fce566]/10 border-t border-white/10"
                                title={`Pendente: R$ ${pendingAmount.toLocaleString()}`}
                            />
                            {/* Empty space represented by background */}
                        </div>

                        {/* Floating Label - Centered on bar with translucency */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center bg-[#2d2d2d]/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-white/10 z-10 transition-transform hover:scale-110">
                            <span className="text-3xl font-black text-white leading-none tracking-tighter">{percentageUsed}%</span>
                            <span className="text-[9px] font-black text-[#9a9a9a] uppercase tracking-widest mt-1">Utilizado</span>
                        </div>
                    </div>
                </div>

                {/* Stats Area */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="group p-4 rounded-2xl bg-[#2d2d2d] border border-[#3e3d32] transition-all hover:scale-[1.02]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-[#f92672] uppercase tracking-widest">Pago</span>
                                <span className="text-[9px] font-bold text-[#f92672]/50">{Math.round(paidHeight)}%</span>
                            </div>
                            <span className="text-xl font-bold text-white">R$ {paidAmount.toLocaleString()}</span>
                        </div>

                        <div className="group p-4 rounded-2xl bg-[#2d2d2d] border border-[#3e3d32] transition-all hover:scale-[1.02]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-[#fce566] uppercase tracking-widest">Pendente</span>
                                <span className="text-[9px] font-bold text-[#fce566]/50">{Math.round(pendingHeight)}%</span>
                            </div>
                            <span className="text-xl font-bold text-white">R$ {pendingAmount.toLocaleString()}</span>
                        </div>

                        <div className="group p-4 rounded-2xl bg-[#2d2d2d] border border-[#3e3d32] transition-all hover:scale-[1.02]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-[#98e342] uppercase tracking-widest">Disponível</span>
                                <span className="text-[9px] font-bold text-[#98e342]/50">{Math.round(availableHeight)}%</span>
                            </div>
                            <span className="text-xl font-bold text-[#98e342]">R$ {remaining.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-2 pt-4 border-t border-[#3e3d32]">
                        <span className="block text-[10px] font-black text-[#9a9a9a] uppercase tracking-widest mb-1">Orçamento Total</span>
                        <span className="text-2xl font-black text-[#67d8ef]">R$ {data.project.totalBudget.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
