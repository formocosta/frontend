import React, { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      label,
      error,
      helpText,
      id,
      ...props
    },
    ref
  ) => {
    const fallbackId = React.useId();
    const textareaId = id || fallbackId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full rounded-sm border outline-none transition-all text-sm px-3 py-2.5 resize-none
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50'
              : 'border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 bg-slate-50 focus:bg-white'
            }
            text-slate-800 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {(error || helpText) && (
          <p className={`text-xs mt-0.5 ${error ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
            {error || helpText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
