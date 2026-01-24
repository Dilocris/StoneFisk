'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { HealthCheck } from '@/components/dashboard/HealthCheck';
import { AssetsTracker } from '@/components/dashboard/AssetsTracker';
import { ProgressLog } from '@/components/dashboard/ProgressLog';
import { GanttWorkspace } from '@/components/dashboard/GanttWorkspace';
import { ManagementLayer } from '@/components/dashboard/ManagementLayer';
import { BudgetWidget } from '@/components/dashboard/BudgetWidget';
import { Modal } from '@/components/ui/Modal';
import { AddExpenseForm } from '@/components/forms/AddExpenseForm';
import { AddTaskForm } from '@/components/forms/AddTaskForm';
import { AddAssetForm } from '@/components/forms/AddAssetForm';
import { AddSupplierForm } from '@/components/forms/AddSupplierForm';
import { ProjectSettingsForm } from '@/components/forms/ProjectSettingsForm';
import { Calendar, ChevronRight, Settings } from 'lucide-react';
import { generatePDFReport } from '@/lib/export';

export default function Home() {
  const { data } = useProject();

  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Edit states
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  // Event Listeners
  React.useEffect(() => {
    const openExp = () => { setEditingExpense(null); setIsExpenseModalOpen(true); };
    const openTask = () => { setEditingTask(null); setIsTaskModalOpen(true); };
    const openAsset = () => setIsAssetModalOpen(true);
    const openSupplier = () => { setEditingSupplier(null); setIsSupplierModalOpen(true); };
    const openSettings = () => setIsSettingsModalOpen(true);

    const editExp = (e: any) => { setEditingExpense(e.detail); setIsExpenseModalOpen(true); };
    const editTask = (e: any) => { setEditingTask(e.detail); setIsTaskModalOpen(true); };
    const editSup = (e: any) => { setEditingSupplier(e.detail); setIsSupplierModalOpen(true); };

    window.addEventListener('open-expense-modal', openExp);
    window.addEventListener('open-task-modal', openTask);
    window.addEventListener('open-asset-modal', openAsset);
    window.addEventListener('open-supplier-modal', openSupplier);
    window.addEventListener('open-settings-modal', openSettings);
    window.addEventListener('edit-expense', editExp);
    window.addEventListener('edit-task', editTask);
    window.addEventListener('edit-supplier', editSup);

    return () => {
      window.removeEventListener('open-expense-modal', openExp);
      window.removeEventListener('open-task-modal', openTask);
      window.removeEventListener('open-asset-modal', openAsset);
      window.removeEventListener('open-supplier-modal', openSupplier);
      window.removeEventListener('open-settings-modal', openSettings);
      window.removeEventListener('edit-expense', editExp);
      window.removeEventListener('edit-task', editTask);
      window.removeEventListener('edit-supplier', editSup);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 pb-20">
      {/* Top Utility Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">AG</div>
          <span className="font-bold text-slate-800 dark:text-white tracking-tight">Antigravity Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoje</p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">Em Progresso</span>
              <span className="text-slate-400 text-xs font-medium">• {data.project.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Resumo da Obra
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generatePDFReport(data)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            >
              Exportar Relatório
            </button>
          </div>
        </header>

        {/* Strategic Hero (Gantt) */}
        <section className="relative group">
          <GanttWorkspace />
        </section>

        {/* Pulse & Logistics Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Health & Progress */}
          <div className="lg:col-span-2 space-y-8">
            <HealthCheck />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AssetsTracker />
              <ProgressLog />
            </div>
          </div>

          {/* Right Column: Financials */}
          <div className="space-y-8">
            <BudgetWidget />
          </div>
        </div>

        {/* Administration Layer */}
        <ManagementLayer />
      </div>

      {/* Modals */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => { setIsExpenseModalOpen(false); setEditingExpense(null); }}
        title={editingExpense ? "Editar Lançamento" : "Novo Lançamento Financeiro"}
      >
        <AddExpenseForm initialData={editingExpense} onSuccess={() => setIsExpenseModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
        title={editingTask ? "Editar Tarefa" : "Agendar Nova Tarefa"}
      >
        <AddTaskForm initialData={editingTask} onSuccess={() => setIsTaskModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        title="Rastrear Item"
      >
        <AddAssetForm onSuccess={() => setIsAssetModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Configurações do Projeto"
      >
        <ProjectSettingsForm onSuccess={() => setIsSettingsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => { setIsSupplierModalOpen(false); setEditingSupplier(null); }}
        title={editingSupplier ? "Editar Fornecedor" : "Cadastrar Novo Fornecedor"}
      >
        <AddSupplierForm initialData={editingSupplier} onSuccess={() => setIsSupplierModalOpen(false)} />
      </Modal>

    </main>
  );
}
