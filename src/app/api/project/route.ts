import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ProjectData } from '@/lib/types';
import { formatDateInput } from '@/lib/date';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
async function ensureDb() {
    try {
        await fs.access(DB_PATH);
    } catch {
        const initialData: ProjectData = {
            project: {
                name: "StoneFisk Project",
                totalBudget: 50000,
                startDate: formatDateInput(new Date())
            },
            expenses: [],
            tasks: [],
            assets: [],
            suppliers: [],
            progressLog: []
        };
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

function isValidProjectData(body: any): body is ProjectData {
    if (!body || typeof body !== 'object') return false;
    const requiredKeys: (keyof ProjectData)[] = ['project', 'expenses', 'tasks', 'assets', 'suppliers', 'progressLog'];

    // Check for missing keys
    if (!requiredKeys.every(key => key in body)) return false;

    // Check 'project' object specifically
    if (typeof body.project !== 'object' || !body.project.name || typeof body.project.totalBudget !== 'number') {
        return false;
    }

    // Ensure all collections are arrays
    const collections: (keyof ProjectData)[] = ['expenses', 'tasks', 'assets', 'suppliers', 'progressLog'];
    if (!collections.every(key => Array.isArray(body[key]))) return false;

    return true;
}

export async function GET() {
    await ensureDb();
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await ensureDb();
    try {
        const body = await request.json();

        if (!isValidProjectData(body)) {
            return NextResponse.json({ error: 'Invalid project data structure' }, { status: 400 });
        }

        await fs.writeFile(DB_PATH, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
