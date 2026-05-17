import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, Search, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmailLog {
    id: string;
    from: string;
    to: string[];
    subject: string;
    html: string;
    created_at: string;
    last_event: string;
    status: 'sent' | 'delivered' | 'bounced' | 'complaint' | 'opened' | 'clicked';
    bcc?: string[] | null;
    cc?: string[] | null;
    reply_to?: string[] | null;
}

interface EmailDetails extends EmailLog {
    text?: string | null;
}

export default function EmailDashboard() {
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'delivered' | 'bounced'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const itemsPerPage = 20;

    const fetchLogs = async (page: number = 1) => {
        setLoading(true);
        try {
            // Use same API URL logic as other components
            const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : "http://localhost:3001/api");
            const url = `${API_URL}/email/logs?limit=${itemsPerPage}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch email logs from Resend');
            }

            const resendData = await response.json();
            // Resend API returns { object: 'list', data: [...], has_more: boolean }
            const emails = resendData.data || [];
            setHasMore(resendData.has_more || false);

            // Map Resend data to our interface
            const mappedLogs: EmailLog[] = emails.map((log: any) => ({
                id: log.id,
                from: log.from,
                to: log.to,
                subject: log.subject,
                html: '',
                created_at: log.created_at,
                last_event: log.last_event,
                status: log.last_event || 'sent',
                bcc: log.bcc,
                cc: log.cc,
                reply_to: log.reply_to
            }));

            setLogs(mappedLogs);
            setCurrentPage(page);
            toast.success(`Loaded ${mappedLogs.length} emails from Resend`);
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Failed to load email logs from Resend');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmailDetails = async (emailId: string) => {
        setLoadingDetails(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : "http://localhost:3001/api");
            const response = await fetch(`${API_URL}/email/logs/${emailId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch email details');
            }

            const details = await response.json();
            setSelectedEmail(details);
        } catch (error) {
            console.error('Error fetching email details:', error);
            toast.error('Failed to load email details');
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesFilter = filter === 'all' ||
            (filter === 'delivered' && log.status === 'delivered') ||
            (filter === 'bounced' && (log.status === 'bounced' || log.status === 'complaint'));

        const toAddress = log.to[0] || '';

        const matchesSearch =
            toAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.subject.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[rgba(16,185,129,0.06)] text-[#10b981] border border-[rgba(16,185,129,0.15)] shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        DELIVERED
                    </span>
                );
            case 'bounced':
            case 'complaint':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[rgba(239,68,68,0.06)] text-[#ef4444] border border-[rgba(239,68,68,0.15)] shadow-sm">
                        <XCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        BOUNCED
                    </span>
                );
            case 'opened':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[rgba(200,168,75,0.06)] text-[var(--gold)] border border-[rgba(200,168,75,0.15)] shadow-sm">
                        <Eye className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        OPENED
                    </span>
                );
            case 'clicked':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[rgba(59,130,246,0.06)] text-[#3b82f6] border border-[rgba(59,130,246,0.15)] shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        CLICKED
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[rgba(156,163,175,0.06)] text-[var(--t3)] border border-[rgba(156,163,175,0.15)] shadow-sm">
                        <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        {status ? status.toUpperCase() : 'PENDING'}
                    </span>
                );
        }
    };

    return (
        <>
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-[var(--p-line)] bg-[var(--p-dim)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-[var(--t1)]">Email Delivery Logs</h2>
                            <p className="text-xs text-[var(--t3)]">Real-time status tracking for secure corporate transmissions</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchLogs(currentPage)}
                                disabled={loading}
                                className="inline-flex items-center px-3.5 py-2 border border-[var(--p-line)] shadow-sm text-xs font-bold rounded-lg text-[var(--t1)] bg-[var(--card)] hover:bg-[var(--glass-h)] focus:outline-none transition-all"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin text-[var(--gold)]' : ''}`} />
                                Refresh Status
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-[var(--t4)]" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-[var(--p-line)] rounded-lg text-xs bg-[var(--card)] text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-[var(--gold)]"
                                placeholder="Search by recipient email or subject line..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative inline-block text-left">
                                <div className="flex items-center gap-1 bg-[var(--card)] rounded-lg p-1 border border-[var(--p-line)]">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${filter === 'all'
                                            ? 'bg-[var(--gold)] text-[var(--bg)] shadow'
                                            : 'text-[var(--t3)] hover:text-[var(--t1)]'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setFilter('delivered')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${filter === 'delivered'
                                            ? 'bg-[var(--gold)] text-[var(--bg)] shadow'
                                            : 'text-[var(--t3)] hover:text-[var(--t1)]'
                                            }`}
                                    >
                                        Delivered
                                    </button>
                                    <button
                                        onClick={() => setFilter('bounced')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${filter === 'bounced'
                                            ? 'bg-[var(--gold)] text-[var(--bg)] shadow'
                                            : 'text-[var(--t3)] hover:text-[var(--t1)]'
                                            }`}
                                    >
                                        Bounced
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--p-line)]">
                        <thead className="bg-[var(--p-dim)]">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 text-left text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">
                                    Recipient / Subject Line
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">
                                    Dispatched At
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-right text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-[var(--p-line)]">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-[var(--t3)]">
                                        <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin text-[var(--gold)]" />
                                        Querying Resend dispatch log telemetry...
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-[var(--t3)]">
                                        No matching logs discovered in Resend history.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[var(--glass-h)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(log.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[var(--t1)]">{log.to.join(', ')}</span>
                                                <span className="text-[11px] text-[var(--t3)] truncate max-w-xs mt-0.5">{log.subject}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--t3)]">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                                            <button
                                                onClick={() => fetchEmailDetails(log.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-[var(--p-line)] shadow-sm text-[11px] font-bold rounded text-[var(--t1)] bg-[var(--card)] hover:bg-[var(--glass-h)] focus:outline-none transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5 text-[var(--gold)]" />
                                                View Payload
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-[var(--p-dim)] px-6 py-3.5 flex items-center justify-between border-t border-[var(--p-line)]">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => fetchLogs(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className="relative inline-flex items-center px-4 py-2 border border-[var(--p-line)] text-xs font-bold rounded-md text-[var(--t1)] bg-[var(--card)] hover:bg-[var(--glass-h)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => fetchLogs(currentPage + 1)}
                            disabled={!hasMore || loading}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-[var(--p-line)] text-xs font-bold rounded-md text-[var(--t1)] bg-[var(--card)] hover:bg-[var(--glass-h)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs text-[var(--t3)]">
                                Active Page <span className="font-bold text-[var(--t1)]">{currentPage}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => fetchLogs(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--p-line)] bg-[var(--card)] text-sm font-medium text-[var(--t3)] hover:bg-[var(--glass-h)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-4.5 w-4.5" />
                                </button>
                                <button
                                    onClick={() => fetchLogs(currentPage + 1)}
                                    disabled={!hasMore || loading}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--p-line)] bg-[var(--card)] text-sm font-medium text-[var(--t3)] hover:bg-[var(--glass-h)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-4.5 w-4.5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Details Modal */}
            {selectedEmail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[var(--bg)] border border-[var(--p-line)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--p-line)] bg-[var(--p-dim)] flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-[var(--t1)]">Email Payload Details</h3>
                                <p className="text-[10px] text-[var(--t3)] mt-0.5 font-mono">{selectedEmail.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="text-[var(--t4)] hover:text-[var(--t1)] p-1 rounded hover:bg-[var(--glass-h)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-8rem)] space-y-4">
                            {loadingDetails ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3 md:col-span-2">
                                        <div className="grid grid-cols-2 gap-4 bg-[var(--p-dim)] p-3 rounded-lg border border-[var(--p-line)]">
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">Status</label>
                                                <div className="mt-1">
                                                    {getStatusBadge(selectedEmail.last_event)}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">Dispatched At</label>
                                                <p className="mt-1 text-xs text-[var(--t1)] font-medium">{new Date(selectedEmail.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-[var(--p-dim)] rounded-lg border border-[var(--p-line)]">
                                        <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">Sender (From)</label>
                                        <p className="mt-1 text-xs text-[var(--t1)] font-medium font-mono">{selectedEmail.from}</p>
                                    </div>

                                    <div className="p-3 bg-[var(--p-dim)] rounded-lg border border-[var(--p-line)]">
                                        <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">Recipient (To)</label>
                                        <p className="mt-1 text-xs text-[var(--t1)] font-medium font-mono">{selectedEmail.to.join(', ')}</p>
                                    </div>

                                    {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                                        <div className="p-3 bg-[var(--p-dim)] rounded-lg border border-[var(--p-line)]">
                                            <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">CC</label>
                                            <p className="mt-1 text-xs text-[var(--t1)] font-medium font-mono">{selectedEmail.cc.join(', ')}</p>
                                        </div>
                                    )}

                                    {selectedEmail.bcc && selectedEmail.bcc.length > 0 && (
                                        <div className="p-3 bg-[var(--p-dim)] rounded-lg border border-[var(--p-line)]">
                                            <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">BCC</label>
                                            <p className="mt-1 text-xs text-[var(--t1)] font-medium font-mono">{selectedEmail.bcc.join(', ')}</p>
                                        </div>
                                    )}

                                    <div className="md:col-span-2 p-3 bg-[var(--p-dim)] rounded-lg border border-[var(--p-line)]">
                                        <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)]">Subject Line</label>
                                        <p className="mt-1 text-xs text-[var(--t1)] font-semibold">{selectedEmail.subject}</p>
                                    </div>

                                    {selectedEmail.html && (
                                        <div className="md:col-span-2">
                                            <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--t4)] mb-2">Secure Message Body Preview</label>
                                            <div className="border border-[var(--p-line)] rounded-lg overflow-hidden bg-white max-h-96">
                                                <iframe
                                                    srcDoc={selectedEmail.html}
                                                    className="w-full min-h-[280px] bg-white text-black"
                                                    sandbox="allow-same-origin"
                                                    title="Email Preview"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-[var(--p-line)] bg-[var(--p-dim)] flex justify-end">
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="px-4 py-2 border border-[var(--p-line)] rounded-lg shadow-sm text-xs font-bold text-[var(--t1)] bg-[var(--card)] hover:bg-[var(--glass-h)] focus:outline-none transition-all"
                            >
                                Close Payload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
