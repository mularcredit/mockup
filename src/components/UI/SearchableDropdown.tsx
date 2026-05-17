import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
    label: string;
    value: string;
}

interface SearchableDropdownProps {
    options: (string | DropdownOption)[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    icon?: React.ElementType;
    disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
    icon: Icon,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Normalize options to DropdownOption format
    const normalizedOptions: DropdownOption[] = options.map(option =>
        typeof option === 'string'
            ? { label: option, value: option }
            : option
    );

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = normalizedOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('all');
    };

    // Find label for current value
    const currentLabel = value === 'all'
        ? placeholder
        : normalizedOptions.find(o => o.value === value)?.label || value;

    return (
        <div className={`relative ${className} ${isOpen ? 'z-50' : 'z-auto'}`} ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full h-[32px] bg-[var(--glass)] border border-[var(--p-line)] rounded-md px-2.5 py-1.5 text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:shadow-[0_0_15px_var(--p-dim)] hover:bg-[var(--card)] transition-all duration-200 flex items-center justify-between text-left group ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--sidebar)]' : ''}`}
            >
                <div className="flex items-center gap-2 truncate flex-1">
                    {Icon && <Icon size={13} className={`text-[var(--t4)] flex-shrink-0 ${!disabled && 'group-hover:text-[var(--p)]'} transition-colors`} />}
                    <span className={`truncate text-xs ${value === 'all' ? 'text-[var(--t3)]' : 'text-[var(--t1)] font-medium'}`}>
                        {currentLabel}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {value !== 'all' && !disabled && (
                        <div onClick={clearSelection} className="p-0.5 hover:bg-[var(--glass-h)] rounded-full text-[var(--t4)] hover:text-red-500 transition-colors">
                            <X size={12} />
                        </div>
                    )}
                    <ChevronDown size={14} className={`text-[var(--t4)] ${!disabled && 'group-hover:text-[var(--p)]'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-[100] w-full mt-2 bg-[var(--card)] border border-[var(--p-line)] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden ring-1 ring-[var(--p-line)]"
                    >
                        <div className="p-3 border-b border-[var(--p-line)] bg-[var(--glass)]">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--t4)]" />
                                <input
                                    type="text"
                                    placeholder="Search options..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full pl-9 pr-3 py-2 bg-[var(--card)] border border-[var(--p-line)] rounded-xl text-xs focus:outline-none focus:border-[var(--p)] focus:ring-4 focus:ring-[var(--p-dim)] transition-all text-[var(--t1)] placeholder-[var(--t4)]"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5 thin-scrollbar">
                            <button
                                className={`w-full text-left px-4 py-2.5 text-xs rounded-xl transition-all mb-0.5 flex items-center justify-between
                    ${value === 'all' ? 'bg-[var(--p-dim)] text-[var(--p)] font-bold' : 'text-[var(--t2)] hover:bg-[var(--sidebar)]'}`}
                                onClick={() => handleSelect('all')}
                            >
                                <span>{placeholder}</span>
                                {value === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--p)]" />}
                            </button>
                            {filteredOptions.map((option) => (
                                option.value !== 'all' && (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full text-left px-4 py-2.5 text-xs rounded-xl transition-all mb-0.5 flex items-center justify-between
                        ${value === option.value ? 'bg-[var(--p-dim)] text-[var(--p)] font-bold' : 'text-[var(--t2)] hover:bg-[var(--sidebar)] hover:text-[var(--p)]'}`}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-[var(--p)]" />}
                                    </button>
                                )
                            ))}
                            {filteredOptions.length === 0 && (
                                <div className="px-4 py-10 text-center text-[var(--t4)] text-xs italic">
                                    <p>No matches found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchableDropdown;
