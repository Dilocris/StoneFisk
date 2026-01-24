export type Category =
    | 'Mão de Obra'
    | 'Materiais de Construção'
    | 'Marmoraria'
    | 'Marcenaria'
    | 'Vidraçaria'
    | 'Gesso / Drywall'
    | 'Pintura'
    | 'Elétrica / Hidráulica'
    | 'Climatização'
    | 'Esquadrias'
    | 'Revestimentos'
    | 'Mobiliário'
    | 'Iluminação'
    | 'Decoração'
    | 'Demolição'
    | 'Outros';

export const CATEGORIES: Category[] = [
    'Mão de Obra',
    'Materiais de Construção',
    'Marmoraria',
    'Marcenaria',
    'Vidraçaria',
    'Gesso / Drywall',
    'Pintura',
    'Elétrica / Hidráulica',
    'Climatização',
    'Esquadrias',
    'Revestimentos',
    'Mobiliário',
    'Iluminação',
    'Decoração',
    'Demolição',
    'Outros'
];

export type Room = 'Cozinha' | 'Sala de Estar' | 'Quarto Principal' | 'Banheiro' | 'Escritório' | 'Varanda' | 'Entrada' | 'Outros';

export const ROOMS: Room[] = ['Cozinha', 'Sala de Estar', 'Quarto Principal', 'Banheiro', 'Escritório', 'Varanda', 'Entrada', 'Outros'];

export interface Project {
    name: string;
    totalBudget: number;
    startDate: string;
    endDate?: string;
}

export interface Expense {
    id: string;
    name: string;
    category: Category;
    room?: Room;
    amount: number;
    status: 'Paid' | 'Deposit' | 'Pending';
    date: string;
    dueDate: string; // Payment deadline
    paymentMethod?: string; // e.g., PIX, Boleto, Cartão
    orderId?: string; // Grouping for installments
    installmentInfo?: { current: number, total: number };
    supplierId?: string; // Link to Supplier
    attachments?: string[];
}

export interface Task {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
    category: Category;
    room?: Room;
    attachments?: string[];
}

export interface Asset {
    id: string;
    name: string;
    status: 'Purchased' | 'Delivered';
    supplierId?: string; // Link to Supplier
}

export interface ProgressEntry {
    date: string;
    note: string;
    attachments?: string[];
}

export interface Supplier {
    id: string;
    name: string;
    phone1: string;
    phone2?: string;
    email?: string;
    website?: string;
    category: Category;
    rating?: number;
    notes?: string;
}

export interface ProjectData {
    project: Project;
    expenses: Expense[];
    tasks: Task[];
    assets: Asset[];
    suppliers: Supplier[];
    progressLog: ProgressEntry[];
}
