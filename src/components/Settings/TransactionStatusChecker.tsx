import React, { useState } from 'react';
import { Search, RefreshCw, CheckCircle, XCircle, Clock, Copy, Trash2, Zap, Database, Info, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TransactionResult {
    transactionID: string;
    status: 'pending' | 'success' | 'failed' | 'checking';
    resultCode?: number;
    resultDesc?: string;
    conversationID?: string;
    originatorConversationID?: string;
    error?: string;
}

const TransactionStatusChecker: React.FC = () => {
    const [singleCode, setSingleCode] = useState('');
    const [bulkCodes, setBulkCodes] = useState('');
    const [results, setResults] = useState<TransactionResult[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

    const checkSingleStatus = async () => {
        if (!singleCode.trim()) {
            toast.error('Please enter a Transaction ID');
            return;
        }

        setIsChecking(true);
        const toastId = toast.loading('Checking M-Pesa transaction status...');

        try {
            const newResult: TransactionResult = {
                transactionID: singleCode.trim(),
                status: 'checking'
            };
            setResults(prev => [newResult, ...prev]);

            const response = await fetch('https://mpesa-22p0.onrender.com/api/mpesa/check-transaction-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionID: singleCode.trim(),
                    remarks: 'Manual status check from ZiraPro',
                    occasion: 'StatusCheck'
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Check Request Sent', { id: toastId });
                setResults(prev => prev.map(r =>
                    r.transactionID === singleCode.trim()
                        ? {
                            ...r,
                            status: 'pending',
                            conversationID: result.data?.ConversationID,
                            originatorConversationID: result.data?.OriginatorConversationID
                        }
                        : r
                ));
                setSingleCode('');
            } else {
                toast.error('Failed: ' + (result.message || 'M-Pesa API Unresponsive'), { id: toastId });
                setResults(prev => prev.map(r =>
                    r.transactionID === singleCode.trim()
                        ? { ...r, status: 'failed', error: result.message }
                        : r
                ));
            }
        } catch (error) {
            toast.error('Network Error: Could not connect to API', { id: toastId });
            setResults(prev => prev.map(r =>
                r.transactionID === singleCode.trim()
                    ? { ...r, status: 'failed', error: 'Network Connection Failed' }
                    : r
            ));
        } finally {
            setIsChecking(false);
        }
    };

    const checkBulkStatus = async () => {
        const codes = bulkCodes
            .split(/[\n,;]/)
            .map(code => code.trim())
            .filter(code => code.length > 0);

        if (codes.length === 0) {
            toast.error('Please enter at least one Transaction ID');
            return;
        }

        setIsChecking(true);
        const toastId = toast.loading(`Checking bulk status: ${codes.length} transactions`);

        try {
            const newResults: TransactionResult[] = codes.map(code => ({
                transactionID: code,
                status: 'checking'
            }));
            setResults(prev => [...newResults, ...prev]);

            let successCount = 0;
            let failCount = 0;

            const batchSize = 5;
            for (let i = 0; i < codes.length; i += batchSize) {
                const batch = codes.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(async (code) => {
                        try {
                            const response = await fetch('https://mpesa-22p0.onrender.com/api/mpesa/check-transaction-status', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    transactionID: code,
                                    remarks: 'Bulk automated status check',
                                    occasion: 'BulkStatusCheck'
                                }),
                            });

                            const result = await response.json();
                            if (result.success) {
                                successCount++;
                                setResults(prev => prev.map(r =>
                                    r.transactionID === code
                                        ? {
                                            ...r,
                                            status: 'pending',
                                            conversationID: result.data?.ConversationID,
                                            originatorConversationID: result.data?.OriginatorConversationID
                                        }
                                        : r
                                ));
                            } else {
                                failCount++;
                                setResults(prev => prev.map(r =>
                                    r.transactionID === code
                                        ? { ...r, status: 'failed', error: result.message }
                                        : r
                                ));
                            }
                        } catch (error) {
                            failCount++;
                            setResults(prev => prev.map(r =>
                                r.transactionID === code
                                    ? { ...r, status: 'failed', error: 'Connection Error' }
                                    : r
                            ));
                        }
                    })
                );
                if (i + batchSize < codes.length) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }

            toast.success(`Bulk Check Complete: ${successCount} Successful`, { id: toastId });
            setBulkCodes('');
        } catch (error) {
            toast.error('Bulk Check Interrupted', { id: toastId });
        } finally {
            setIsChecking(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to Clipboard');
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'success': return 'bg-[var(--green-d)] text-[var(--green)] border border-[var(--green-glow)]';
            case 'failed': return 'bg-[var(--red-d)] text-[var(--red)] border border-[var(--red-glow)]';
            case 'pending': return 'bg-[var(--amber-d)] text-[var(--amber)] border border-[var(--amber-d)]';
            case 'checking': return 'bg-[var(--p-dim)] text-[var(--p)] border border-[var(--p-line)]';
            default: return 'bg-[var(--glass)] text-[var(--t3)] border border-[var(--p-line)]';
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Input Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl p-6 flex flex-col gap-6">

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTab('single')}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors border ${activeTab === 'single'
                                    ? 'bg-[var(--p-dim)] text-[var(--p)] border-[var(--p-line)]'
                                    : 'bg-[var(--card)] text-[var(--t3)] border-[var(--p-line)] hover:bg-[var(--glass-h)] hover:text-[var(--t1)]'
                                    }`}
                            >
                                <Zap className="w-3.5 h-3.5" /> Single Lookup
                            </button>
                            <button
                                onClick={() => setActiveTab('bulk')}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors border ${activeTab === 'bulk'
                                    ? 'bg-[var(--p-dim)] text-[var(--p)] border-[var(--p-line)]'
                                    : 'bg-[var(--card)] text-[var(--t3)] border-[var(--p-line)] hover:bg-[var(--glass-h)] hover:text-[var(--t1)]'
                                    }`}
                            >
                                <Database className="w-3.5 h-3.5" /> Bulk Lookup
                            </button>
                        </div>

                        {/* Input Area */}
                        <div>
                            {activeTab === 'single' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">
                                            Transaction ID (M-Pesa Receipt Number)
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t4)]" />
                                            <input
                                                type="text"
                                                value={singleCode}
                                                onChange={(e) => setSingleCode(e.target.value.toUpperCase())}
                                                onKeyPress={(e) => e.key === 'Enter' && checkSingleStatus()}
                                                placeholder="e.g. SAA0XXXXXX"
                                                className="w-full pl-11 pr-4 py-2 bg-[var(--card)] border border-[var(--p-line)] rounded-xl text-xs focus:ring-1 focus:ring-[var(--p)] focus:outline-none uppercase font-mono text-[var(--t1)]"
                                                disabled={isChecking}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={checkSingleStatus}
                                        disabled={isChecking || !singleCode.trim()}
                                        className="text-xs w-full py-3 bg-[var(--p)] hover:bg-[var(--p-glow)] text-[var(--card)] rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                        Check Status
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">
                                            Multiple Transaction IDs (One per line)
                                        </label>
                                        <textarea
                                            value={bulkCodes}
                                            onChange={(e) => setBulkCodes(e.target.value.toUpperCase())}
                                            placeholder="SAA0XXXXXX&#10;SAB1XXXXXX&#10;SAC2XXXXXX"
                                            rows={6}
                                            className="w-full p-4 bg-[var(--card)] border border-[var(--p-line)] rounded-xl text-xs focus:ring-1 focus:ring-[var(--p)] focus:outline-none font-mono uppercase text-[var(--t1)] resize-none"
                                            disabled={isChecking}
                                        />
                                    </div>

                                    <button
                                        onClick={checkBulkStatus}
                                        disabled={isChecking || !bulkCodes.trim()}
                                        className="text-xs w-full py-3 bg-[var(--p)] hover:bg-[var(--p-glow)] text-[var(--card)] rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                                        Check {bulkCodes.split(/[\n,;]/).filter(c => c.trim()).length || 0} Transactions
                                    </button>
                                </div>
                            )}

                            {/* Info Callout */}
                            <div className="mt-6 p-4 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-xl flex gap-3 text-[var(--t2)] text-xs">
                                <Info className="w-4 h-4 text-[var(--p)] shrink-0 mt-0.5" />
                                <p>
                                    This tool sends a server-to-server request directly to Safaricom's B2C API to query the
                                    Transaction Status. If successful, Safaricom will queue a callback to the system within a few minutes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Results List */}
                <div className="lg:col-span-7">
                    <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl h-full flex flex-col min-h-[500px] overflow-hidden">
                        <div className="px-6 py-5 flex items-center justify-between border-b border-[var(--p-line)]">
                            <h3 className="text-xs font-semibold text-[var(--t3)] uppercase tracking-wide flex items-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5 text-[var(--t4)]" /> Result History
                            </h3>
                            {results.length > 0 && (
                                <button
                                    onClick={() => setResults([])}
                                    className="text-xs text-[var(--red)] hover:text-[var(--t1)] font-medium flex items-center gap-1 transition-colors hover:bg-[var(--red-d)] px-3 py-1.5 rounded-xl border border-transparent hover:border-[var(--red-glow)]"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Clear History
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[600px] flex flex-col gap-3">
                            {results.length > 0 ? (
                                results.map((result) => (
                                    <div key={result.transactionID} className="bg-[var(--glass)] border border-[var(--p-line)] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[var(--p-glow)]">
                                        <div className="flex items-center gap-4">
                                            {/* Status Icon */}
                                            <div className="shrink-0 bg-[var(--p-dim)] w-10 h-10 rounded-full flex items-center justify-center border border-[var(--p-line)]">
                                                {result.status === 'checking' ? <RefreshCw className="w-5 h-5 text-[var(--p)] animate-spin" /> :
                                                    result.status === 'success' ? <CheckCircle className="w-5 h-5 text-[var(--green)]" /> :
                                                        result.status === 'failed' ? <XCircle className="w-5 h-5 text-[var(--red)]" /> :
                                                            <Clock className="w-5 h-5 text-[var(--amber)]" />}
                                            </div>

                                            {/* Details */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[var(--t1)] font-mono text-sm">
                                                        {result.transactionID}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(result.transactionID)}
                                                        className="text-[var(--t4)] hover:text-[var(--p)] p-1 hover:bg-[var(--glass-h)] rounded-full transition-colors"
                                                        title="Copy ID"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <p className="text-[var(--t3)] mt-0.5 text-xs">
                                                    Conv ID: {result.originatorConversationID || 'Waiting...'}
                                                </p>
                                                {result.error && (
                                                    <p className="text-[var(--red)] mt-1 text-xs font-medium">{result.error}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badge & Remove Action */}
                                        <div className="flex items-center justify-between sm:justify-end gap-3 ml-14 sm:ml-0">
                                            <span className={`px-3 py-1.5 inline-flex text-[10px] font-bold tracking-wider rounded-xl uppercase ${getStatusStyles(result.status)}`}>
                                                {result.status}
                                            </span>
                                            <button
                                                onClick={() => setResults(prev => prev.filter(r => r.transactionID !== result.transactionID))}
                                                className="text-[var(--t4)] hover:text-[var(--red)] p-1.5 hover:bg-[var(--red-d)] rounded-full transition-colors"
                                                title="Remove from list"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-20 text-[var(--t4)]">
                                    <Database className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-sm font-medium text-[var(--t3)]">No recent status checks.</p>
                                    <p className="mt-1 text-xs text-center">Enter a transaction ID on the left to query safaricom.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TransactionStatusChecker;
