import { ProjectData } from '@/lib/types';

/**
 * Type guard to validate if an unknown value is valid ProjectData.
 * Checks for required keys, project object structure, and array collections.
 */
export function isValidProjectData(body: unknown): body is ProjectData {
    if (!body || typeof body !== 'object') return false;

    const data = body as Record<string, unknown>;
    const requiredKeys: (keyof ProjectData)[] = ['project', 'expenses', 'tasks', 'assets', 'suppliers', 'progressLog'];

    // Check for missing keys
    if (!requiredKeys.every(key => key in data)) return false;

    // Check 'project' object specifically
    const project = data.project as Record<string, unknown> | null;
    if (
        typeof project !== 'object' ||
        project === null ||
        typeof project.name !== 'string' ||
        typeof project.totalBudget !== 'number'
    ) {
        return false;
    }

    // Ensure all collections are arrays
    const collections: (keyof ProjectData)[] = ['expenses', 'tasks', 'assets', 'suppliers', 'progressLog'];
    if (!collections.every(key => Array.isArray(data[key]))) return false;

    return true;
}
