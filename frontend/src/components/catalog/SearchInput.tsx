import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'O que você quer comprar hoje? Ex: Café, Frutas, Sabão...',
  debounceMs = 350,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <label htmlFor="catalog-search-input" className="sr-only">
        Buscar produtos no catálogo
      </label>
      <input
        id="catalog-search-input"
        type="search"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white text-slate-800 placeholder:text-slate-400 pl-11 pr-10 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-slate-200 focus:border-mateus-sky-500 focus:outline-none shadow-xs transition"
      />
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar termo de busca"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
