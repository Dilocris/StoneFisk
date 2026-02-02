import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function FormTextarea({ label, error, className, ...props }: FormTextareaProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <textarea
        className={`w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none ${className || ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
