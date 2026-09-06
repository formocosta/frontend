import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-md border outline-none transition-all text-sm 
              ${leftIcon ? 'pl-10' : 'px-3'} 
              ${rightIcon ? 'pr-10' : 'px-3'}
              py-2.5 
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50'
                : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 bg-slate-50 focus:bg-white'
              }
              text-slate-800 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
