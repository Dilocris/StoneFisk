import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'image/heic'
];

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Size Validation
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File too large (Max 5MB)' }, { status: 400 });
        }

        // 2. Type Validation
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type (JPG, PNG, WEBP, PDF, HEIC only)' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // 3. Safer Filename Generation
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Remove spaces and special chars, keep only basic alphanumeric and extension
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
        const filename = `${uniqueSuffix}-${safeName}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        await fs.writeFile(filepath, buffer);

        // Return the relative URL (publicly accessible)
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const url = typeof body?.url === 'string' ? body.url : '';
        if (!url) {
            return NextResponse.json({ error: 'No file url provided' }, { status: 400 });
        }

        const cleanUrl = url.split('?')[0];
        const filename = path.basename(cleanUrl);
        if (!filename || filename === '.' || filename === '..') {
            return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
        }

        const filepath = path.join(UPLOAD_DIR, filename);
        const resolvedPath = path.resolve(filepath);
        if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
        }

        try {
            await fs.unlink(resolvedPath);
        } catch (error: unknown) {
            if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
                throw error;
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
