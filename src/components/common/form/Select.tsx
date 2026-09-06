import React, { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      label,
      error,
      helpText,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const fallbackId = React.useId();
    const selectId = id || fallbackId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full rounded-md border outline-none transition-all text-sm px-3 py-2.5 appearance-none
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50'
                : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 bg-slate-50 focus:bg-white'
              }
              text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed
              ${className}
            `}
            defaultValue={placeholder ? "" : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom Dropdown Arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        {(error || helpText) && (
          <p className={`text-xs mt-0.5 ${error ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
            {error || helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
