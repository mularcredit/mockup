import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
  show: boolean;
}

export function SuccessPopup({ message, onClose, show }: SuccessPopupProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-[var(--page)]/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass-card p-10 max-w-md w-full mx-4 border border-[var(--p-line)] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-[var(--t4)] hover:text-[var(--t1)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[var(--green-d)] rounded-2xl opacity-40 animate-ping"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-[var(--green-d)] rounded-2xl border border-[var(--green-glow)]">
                  <CheckCircle className="h-9 w-9 text-[var(--green)]" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-[var(--t1)] mb-2 uppercase tracking-tight">Operation <span className="text-[var(--p)]">Success</span></h3>
              <p className="text-[11px] font-mono text-[var(--t4)] uppercase tracking-widest mb-8 leading-relaxed px-4">{message}</p>
              
              <div className="w-full bg-[var(--glass)] rounded-full h-1 relative overflow-hidden border border-[var(--p-line)]">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="bg-[var(--p)] h-full rounded-full shadow-[0_0_8px_var(--p-glow)]"
                />
              </div>
              <p className="text-[8px] font-bold text-[var(--t4)] uppercase tracking-[0.3em] mt-3">Closing Segments...</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}