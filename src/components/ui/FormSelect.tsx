import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormSelect({ label, error, className, children, ...props }: FormSelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <select
        className={`w-full p-3 bg-secondary text-foreground rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${className || ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
