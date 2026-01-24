import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
}

export function Card({ children, className, title, action, ...props }: CardProps) {
    return (
        <div
            className={twMerge(
                clsx("bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-6 dark:bg-slate-800/70 dark:border-slate-700", className)
            )}
            {...props}
        >
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-sm dark:text-slate-400">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
