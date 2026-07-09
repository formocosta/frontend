import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backButton?: React.ReactNode;
}

export default function PageHeader({ title, description, action, backButton }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
      <div className="flex items-center gap-4">
        {backButton && (
          <div className="shrink-0">
            {backButton}
          </div>
        )}
        <div className="w-1.5 h-10 bg-gradient-to-b from-[#42b883] to-[#3aa374] rounded-sm hidden sm:block"></div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
          {description && (
            <p className="text-[13px] text-gray-500 mt-1 font-medium leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
