import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  error?: string;
}

export default function CustomInput({
  icon,
  label,
  placeholder,
  type,
  error,
  ...rest
}: CustomInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/40">
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </label>
  );
}
