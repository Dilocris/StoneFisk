import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProjectData } from './types';

export const generatePDFReport = (data: ProjectData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text(data.project.name, 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Relatório Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    // --- Financial Health Badge ---
    const totalSpent = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetUsage = (totalSpent / data.project.totalBudget) * 100;
    const remaining = data.project.totalBudget - totalSpent;

    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(14, 35, pageWidth - 14, 35);

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [['Orçamento Total', 'Total Comprometido', 'Saldo Disponível', 'Uso']],
        body: [[
            `R$ ${data.project.totalBudget.toLocaleString()}`,
            `R$ ${totalSpent.toLocaleString()}`,
            `R$ ${remaining.toLocaleString()}`,
            `${budgetUsage.toFixed(1)}%`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // --- Expenses Table ---
    doc.setFontSize(12);
    doc.text('Cronograma Financeiro Detalhado', 14, (doc as any).lastAutoTable.finalY + 15);

    const expenseRows = data.expenses.map(exp => [
        exp.name,
        exp.room || '-',
        exp.paymentMethod || '-',
        exp.status === 'Paid' ? 'PAGO' : exp.status === 'Deposit' ? 'SINAL' : 'PEND',
        exp.dueDate ? new Date(exp.dueDate).toLocaleDateString('pt-BR') : '-',
        `R$ ${exp.amount.toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Item', 'Cômodo', 'Pagamento', 'Status', 'Vencimento', 'Valor']],
        body: expenseRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue 500
        alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    // --- Tasks Section ---
    if (data.tasks.length > 0) {
        if ((doc as any).lastAutoTable.finalY > 220) doc.addPage();

        doc.setFontSize(12);
        doc.text('Progresso da Obra (Tarefas)', 14, (doc as any).lastAutoTable.finalY + 15);

        const taskRows = data.tasks.map(task => [
            task.title,
            task.room || '-',
            task.status,
            `${new Date(task.startDate).toLocaleDateString('pt-BR')} - ${new Date(task.endDate).toLocaleDateString('pt-BR')}`
        ]);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [['Tarefa', 'Local', 'Status', 'Período']],
            body: taskRows,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [245, 158, 11] } // Amber 500
        });
    }

    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
            `Página ${i} de ${pageCount} | Master Control Dashboard`,
            pageWidth / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    doc.save(`Relatorio_Reforma_${new Date().toISOString().split('T')[0]}.pdf`);
};
