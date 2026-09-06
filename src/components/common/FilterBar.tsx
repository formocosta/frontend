import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Input } from './form/Input';
import { Select, SelectOption } from './form/Select';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectOptions?: SelectOption[];
  selectValue?: string;
  onSelectChange?: (value: string) => void;
  extraFilters?: React.ReactNode;
}

export function FilterBar({
  searchPlaceholder = 'Pesquisar...',
  searchValue,
  onSearchChange,
  selectOptions,
  selectValue,
  onSelectChange,
  extraFilters
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gray-200">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2.5 rounded-md border border-gray-100">
          <Filter size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Filtros</span>
        </div>

        {selectOptions && onSelectChange && (
          <div className="w-full sm:w-56">
            <Select
              options={selectOptions}
              value={selectValue || ''}
              onChange={(e) => onSelectChange(e.target.value)}
            />
          </div>
        )}

        {extraFilters}
      </div>

      <div className="w-full sm:w-[350px]">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search size={16} className="text-[#42b883]" />}
          className="text-[13px] font-semibold border-gray-200 focus:border-[#42b883] rounded-md transition-colors"
        />
      </div>
    </div>
  );
}
