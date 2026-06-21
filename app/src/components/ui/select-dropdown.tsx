import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  name: string;
  value: string;
}

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function SelectDropdown({ value, onChange, options, placeholder, className = '' }: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value)?.name ?? placeholder ?? options[0]?.name;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-10 px-3 border border-border rounded-lg bg-background text-sm text-foreground flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{current}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Click-away backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="listbox"
            className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-overlay max-h-52 overflow-auto"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full px-3 py-2 text-sm text-left transition-colors hover:bg-accent ${
                  opt.value === value ? 'text-blue font-medium' : 'text-foreground'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
