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
                clsx("bg-card backdrop-blur-md border border-border shadow-sm rounded-xl p-6 transition-all duration-200", className)
            )}
            {...props}
        >
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
