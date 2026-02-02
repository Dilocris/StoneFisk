import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, className, type, maxLength, ...props }: FormInputProps) {
  // Apply default maxLength of 200 for text inputs
  const effectiveMaxLength = maxLength ?? (type === 'text' || type === undefined ? 200 : undefined);

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        maxLength={effectiveMaxLength}
        className={`w-full p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${className || ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
