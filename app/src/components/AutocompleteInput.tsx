import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  label,
  placeholder,
  required,
  error,
  className,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setIsOpen(filtered.length > 0);
    } else {
      setIsOpen(false);
    }
  }, [value, suggestions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            onChange(filteredSuggestions[highlightedIndex]);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [isOpen, filteredSuggestions, highlightedIndex, onChange]
  );

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={className}>
      {label && (
        <Label className="text-xs uppercase text-gray-500">
          {label}
          {required && <span className="text-gray-400 ml-1">(OBLIGATOIRE)</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`mt-1 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {isOpen && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === highlightedIndex
                    ? 'bg-[#2196F3] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
