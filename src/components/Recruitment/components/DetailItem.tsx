import { Download } from 'lucide-react';

interface DetailItemProps {
  label: string;
  value: string | null;
  isTextArea?: boolean;
  isPdf?: boolean;
  fileName?: string;
  onViewPdf?: (fileName: string) => void;
}

export const DetailItem = ({ 
  label, 
  value, 
  isTextArea = false,
  isPdf = false,
  fileName = '',
}: DetailItemProps) => {
  if (!value && !isPdf) return null;
  
  if (isPdf) {
    return (
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">{label}</label>
        <div className="flex gap-2">
          <a 
            href={value || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3.5 py-2 border border-[var(--p-line)] rounded-lg text-xs font-bold text-[var(--p)] bg-[var(--p-dim)]/20 hover:bg-[var(--p-dim)]/40 hover:border-[var(--p)] transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            {fileName || 'Download Resume'}
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">{label}</label>
      {isTextArea ? (
        <textarea 
          readOnly 
          className="w-full bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white rounded-lg px-3 py-2 text-xs h-24 focus:outline-none"
          value={value ?? ''}
        />
      ) : (
        <input 
          type="text" 
          readOnly 
          className="w-full bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white rounded-lg px-3 py-2 text-xs focus:outline-none" 
          value={value ?? ''}
        />
      )}
    </div>
  );
};