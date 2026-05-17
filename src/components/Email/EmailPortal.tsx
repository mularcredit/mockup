
import { useState } from 'react';
import { List, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailDashboard from './EmailDashboard';
import SendEmail from './SendEmail';

export default function EmailPortal() {
    const [activeTab, setActiveTab] = useState<'compose' | 'logs'>('compose');

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--p-line)] pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--t1)] tracking-tight">Corporate Email Portal</h1>
                    <p className="text-[11px] text-[var(--t3)] mt-1">Send secure company announcements and monitor delivery logs</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-[var(--p-dim)] p-1 rounded-xl w-fit border border-[var(--p-line)]">
                <button
                    onClick={() => setActiveTab('compose')}
                    className={`flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'compose'
                        ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                        : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--glass-h)]'
                        }`}
                >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Compose & Send
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'logs'
                        ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                        : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--glass-h)]'
                        }`}
                >
                    <List className="w-3.5 h-3.5 mr-2" />
                    Email Delivery Logs
                </button>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'compose' ? (
                        <motion.div
                            key="compose"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SendEmail />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="logs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <EmailDashboard />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
