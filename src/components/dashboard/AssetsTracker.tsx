'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/ui/Card';
import { Package, Truck, CheckCircle2, Trash2, Plus, User, Edit3, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

export function AssetsTracker() {
    const { data, toggleAssetStatus, deleteAsset } = useProject();

    return (
        <Card title="Já chegou na obra?" className="min-h-[200px] max-h-[600px] flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                {(!data.assets || data.assets.length === 0) ? (
                    <div className="py-12 text-center text-slate-400">
                        <Package className="mx-auto mb-2 opacity-10" size={48} />
                        <p className="text-sm italic">Nenhum item em rastreio.</p>
                    </div>
                ) : (
                    data.assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border hover:shadow-md transition-all duration-150 ease-out hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleAssetStatus(asset.id)}
                                    className={clsx(
                                        "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-150 ease-out",
                                        asset.status === 'Delivered'
                                            ? "bg-success border-success text-success-foreground shadow-lg shadow-success/20"
                                            : "border-border text-transparent hover:border-success"
                                    )}
                                >
                                    <CheckCircle2 size={24} className={asset.status === 'Delivered' ? 'opacity-100' : 'opacity-0'} />
                                </button>
                                <div>
                                    <h4 className={clsx(
                                        "font-bold text-sm transition-colors duration-150",
                                        asset.status === 'Delivered' ? "text-muted-foreground line-through decoration-success/30" : "text-foreground"
                                    )}>
                                        {asset.name}
                                    </h4>
                                    <div className="flex flex-col gap-0.5 mt-0.5">
                                        <span className={clsx(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            asset.status === 'Delivered' ? "text-success" : "text-muted-foreground"
                                        )}>
                                            {asset.status === 'Delivered' ? 'Entregue' : 'Comprado / Em Rota'}
                                        </span>
                                        {asset.supplierId && (
                                            <div className="text-[9px] text-blue-500 font-bold flex items-center gap-1">
                                                <User size={10} /> {data.suppliers.find(s => s.id === asset.supplierId)?.name || 'Fornecedor Desconhecido'}
                                            </div>
                                        )}
                                        {/* Check for linked expense attachments */}
                                        {(() => {
                                            const linkedExpense = data.expenses.find(e => e.orderId === asset.id || e.id === asset.id);
                                            if (linkedExpense?.attachments?.length) {
                                                return (
                                                    <div className="text-[9px] text-purple-500 font-bold flex items-center gap-1 mt-0.5">
                                                        <ImageIcon size={10} /> {linkedExpense.attachments.length} Foto(s)
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        const linkedExpense = data.expenses.find(e => e.orderId === asset.id || e.id === asset.id);
                                        if (linkedExpense) {
                                            window.dispatchEvent(new CustomEvent('edit-expense', { detail: linkedExpense }));
                                        } else {
                                            window.dispatchEvent(new CustomEvent('edit-asset', { detail: asset }));
                                        }
                                    }}
                                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                    title="Editar"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => { if (confirm('Excluir este item?')) deleteAsset(asset.id) }}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                                    title="Excluir"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-asset-modal'))}
                className="w-full mt-6 py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-150 ease-out font-bold text-xs flex items-center justify-center gap-2 group"
            >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-150 ease-out" />
                Adicionar Item para Rastrear
            </button>
        </Card >
    );
}
