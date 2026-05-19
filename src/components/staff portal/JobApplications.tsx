import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Search,
    X,
    Send,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Building2,
    FileText,
    Eye,
    Trash2,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface JobPosting {
    id: string;
    job_title: string;
    department: string;
    location: string | null;
    job_type: string;
    job_level: string | null;
    description: string;
    requirements: string;
    responsibilities: string | null;
    salary_range: string | null;
    benefits: string | null;
    application_deadline: string | null;
    status: string;
    posted_at: string;
}

interface JobApplication {
    id: string;
    job_posting_id: string;
    cover_letter: string | null;
    status: string;
    applied_at: string;
    job_posting?: JobPosting;
}

const JOB_TYPES = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    temporary: 'Temporary'
};

const APPLICATION_STATUS = {
    pending: { label: 'Pending', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    under_review: { label: 'Under Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    shortlisted: { label: 'Shortlisted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    interview_scheduled: { label: 'Interview Scheduled', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    accepted: { label: 'Accepted', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    withdrawn: { label: 'Withdrawn', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
};

const JobApplications = () => {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [jobTypeFilter, setJobTypeFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'browse' | 'my-applications'>('browse');
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [departments, setDepartments] = useState<string[]>([]);

    useEffect(() => {
        fetchEmployeeNumber();
        fetchJobs();
    }, []);

    useEffect(() => {
        if (employeeNumber) {
            fetchMyApplications();
        }
    }, [employeeNumber]);

    const fetchEmployeeNumber = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) return;

            const { data } = await supabase
                .from('employees')
                .select('"Employee Number"')
                .eq('"Work Email"', user.email)
                .single();

            if (data) {
                setEmployeeNumber(data['Employee Number']);
            }
        } catch (error) {
            console.error('Error fetching employee number:', error);
        }
    };

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('job_postings')
                .select('*')
                .eq('status', 'open')
                .gte('application_deadline', new Date().toISOString().split('T')[0])
                .order('posted_at', { ascending: false });

            if (error) throw error;

            setJobs(data || []);

            // Extract unique departments
            const uniqueDepts = [...new Set((data || []).map(job => job.department))];
            setDepartments(uniqueDepts);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load job postings');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select(`
          *,
          job_posting:job_postings(*)
        `)
                .eq('employee_number', employeeNumber)
                .order('applied_at', { ascending: false });

            if (error) throw error;
            setMyApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load your applications');
        }
    };

    const handleApply = (job: JobPosting) => {
        // Check if already applied
        const hasApplied = myApplications.some(app => app.job_posting_id === job.id);
        if (hasApplied) {
            toast.error('You have already applied for this position');
            return;
        }

        setSelectedJob(job);
        setShowApplicationModal(true);
    };

    const submitApplication = async () => {
        if (!coverLetter.trim()) {
            toast.error('Please provide a cover letter');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('job_applications')
                .insert({
                    job_posting_id: selectedJob!.id,
                    employee_number: employeeNumber,
                    cover_letter: coverLetter.trim(),
                    additional_info: additionalInfo.trim() || null,
                    status: 'pending'
                });

            if (error) throw error;

            toast.success('Application submitted successfully!');
            setShowApplicationModal(false);
            setCoverLetter('');
            setAdditionalInfo('');
            setSelectedJob(null);

            // Refresh applications
            await fetchMyApplications();
        } catch (error: any) {
            console.error('Error submitting application:', error);
            if (error.message?.includes('duplicate')) {
                toast.error('You have already applied for this position');
            } else {
                toast.error('Failed to submit application');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const withdrawApplication = async (applicationId: string) => {
        if (!confirm('Are you sure you want to withdraw this application?')) return;

        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: 'withdrawn' })
                .eq('id', applicationId);

            if (error) throw error;

            toast.success('Application withdrawn');
            await fetchMyApplications();
        } catch (error) {
            console.error('Error withdrawing application:', error);
            toast.error('Failed to withdraw application');
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
        const matchesType = jobTypeFilter === 'all' || job.job_type === jobTypeFilter;

        return matchesSearch && matchesDepartment && matchesType;
    });

    const hasApplied = (jobId: string) => {
        return myApplications.some(app => app.job_posting_id === jobId);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--p)]"></div>
            </div>
        );
    }

    return (
        <div className="p-0">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-[var(--t1)]">Internal Job Opportunities</h1>
                    <p className="text-xs text-[var(--t3)] mt-0.5">
                        Explore and apply for open positions within the company
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 border-b border-[var(--p-line)]">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`pb-3 px-1 text-xs font-semibold border-b-2 transition-all flex items-center ${activeTab === 'browse'
                                ? 'border-[var(--p)] text-[var(--p)]'
                                : 'border-transparent text-[var(--t3)] hover:text-[var(--t1)]'
                            }`}
                    >
                        <Briefcase className="h-3.5 w-3.5 mr-2" />
                        Browse Jobs ({filteredJobs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('my-applications')}
                        className={`pb-3 px-1 text-xs font-semibold border-b-2 transition-all flex items-center ${activeTab === 'my-applications'
                                ? 'border-[var(--p)] text-[var(--p)]'
                                : 'border-transparent text-[var(--t3)] hover:text-[var(--t1)]'
                            }`}
                    >
                        <FileText className="h-3.5 w-3.5 mr-2" />
                        My Applications ({myApplications.length})
                    </button>
                </div>

                {/* Browse Jobs Tab */}
                {activeTab === 'browse' && (
                    <>
                        {/* Filters */}
                        <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-4 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[var(--t3)]" />
                                    <input
                                        type="text"
                                        placeholder="Search jobs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-[var(--t1)] placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] transition-colors"
                                    />
                                </div>
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="px-4 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] transition-colors"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                <select
                                    value={jobTypeFilter}
                                    onChange={(e) => setJobTypeFilter(e.target.value)}
                                    className="px-4 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] transition-colors"
                                >
                                    <option value="all">All Job Types</option>
                                    {Object.entries(JOB_TYPES).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Job Listings */}
                        {filteredJobs.length === 0 ? (
                            <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-12 text-center">
                                <Briefcase className="mx-auto h-10 w-10 text-[var(--t3)] mb-2" />
                                <h3 className="text-sm font-semibold text-[var(--t1)]">No jobs found</h3>
                                <p className="text-xs text-[var(--t3)] mt-1">
                                    Try adjusting your filters or check back later for new opportunities.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredJobs.map((job) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-6 hover:border-[var(--p)] hover:shadow-[0_0_15px_rgba(0,229,255,0.06)] transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2.5">
                                                <div className="flex items-center gap-2.5 flex-wrap">
                                                    <h3 className="text-base font-bold text-white group-hover:text-[var(--p)] transition-colors">{job.job_title}</h3>
                                                    {hasApplied(job.id) && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Applied
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--t3)]">
                                                    <span className="flex items-center">
                                                        <Building2 className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                                        {job.department}
                                                    </span>
                                                    {job.location && (
                                                        <span className="flex items-center">
                                                            <MapPin className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                                            {job.location}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center">
                                                        <Clock className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                                        {JOB_TYPES[job.job_type as keyof typeof JOB_TYPES]}
                                                    </span>
                                                    {job.salary_range && (
                                                        <span className="flex items-center">
                                                            <DollarSign className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                                            {job.salary_range}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-[var(--t3)] leading-relaxed line-clamp-2">{job.description}</p>

                                                {job.application_deadline && (
                                                    <div className="flex items-center text-[10px] text-rose-400 font-semibold">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        Apply by {new Date(job.application_deadline).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 self-start w-full md:w-auto pt-2 md:pt-0 border-t border-[var(--p-line)] md:border-0">
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                    }}
                                                    className="flex-1 md:flex-initial px-3 py-1.5 text-xs text-[var(--p)] hover:text-white border border-[var(--p-line)] hover:border-[var(--p)] rounded-lg font-bold transition-all flex items-center justify-center"
                                                >
                                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                                    View Details
                                                </button>
                                                {!hasApplied(job.id) && (
                                                    <button
                                                        onClick={() => handleApply(job)}
                                                        className="flex-1 md:flex-initial px-4 py-1.5 bg-gradient-to-r from-[var(--p)] to-blue-600 hover:from-[var(--p-glow)] hover:to-blue-500 text-black text-xs font-black rounded-lg transition-all flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                                                    >
                                                        <Send className="h-3.5 w-3.5 mr-1.5" />
                                                        Apply Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* My Applications Tab */}
                {activeTab === 'my-applications' && (
                    <div className="space-y-4">
                        {myApplications.length === 0 ? (
                            <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-12 text-center">
                                <FileText className="mx-auto h-10 w-10 text-[var(--t3)] mb-2" />
                                <h3 className="text-sm font-semibold text-[var(--t1)]">No applications yet</h3>
                                <p className="text-xs text-[var(--t3)] mt-1">
                                    Start browsing job opportunities and submit your first application.
                                </p>
                                <button
                                    onClick={() => setActiveTab('browse')}
                                    className="mt-4 px-4 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] text-[var(--p)] hover:text-white text-xs font-bold rounded-lg transition-all"
                                >
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            myApplications.map((app) => (
                                <div
                                    key={app.id}
                                    className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <h3 className="text-base font-bold text-white">
                                                {app.job_posting?.job_title}
                                            </h3>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.color
                                                    }`}>
                                                    {APPLICATION_STATUS[app.status as keyof typeof APPLICATION_STATUS]?.label}
                                                </span>
                                                <span className="text-xs text-[var(--t3)]">
                                                    Applied on {new Date(app.applied_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {app.cover_letter && (
                                                <div className="p-3.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg">
                                                    <p className="text-[10px] font-bold text-[var(--p)] uppercase tracking-wider mb-1">Cover Letter</p>
                                                    <p className="text-xs text-[var(--t3)] leading-relaxed line-clamp-3">{app.cover_letter}</p>
                                                </div>
                                            )}
                                        </div>
                                        {app.status === 'pending' && (
                                            <button
                                                onClick={() => withdrawApplication(app.id)}
                                                className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/20 text-xs font-bold rounded-lg transition-colors flex items-center justify-center self-start"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                Withdraw
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showApplicationModal && selectedJob && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-[var(--p-line)] sticky top-0 bg-[var(--card)] z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-white">Apply for {selectedJob.job_title}</h3>
                                    <button
                                        onClick={() => {
                                            setShowApplicationModal(false);
                                            setCoverLetter('');
                                            setAdditionalInfo('');
                                        }}
                                        className="text-[var(--t3)] hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                                        Cover Letter <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        rows={8}
                                        placeholder="Explain why you're interested in this position and what makes you a great fit..."
                                        className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                                        Additional Information (Optional)
                                    </label>
                                    <textarea
                                        value={additionalInfo}
                                        onChange={(e) => setAdditionalInfo(e.target.value)}
                                        rows={4}
                                        placeholder="Any additional information you'd like to share..."
                                        className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] transition-colors"
                                    />
                                </div>

                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 mr-2.5 flex-shrink-0" />
                                        <p className="text-[11px] text-blue-300 leading-relaxed">
                                            Your application will be reviewed directly by the recruiting team. You will be notified of all status updates via the notifications system.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-[var(--p-line)] bg-[var(--p-dim)] flex justify-end space-x-3 rounded-b-xl">
                                <button
                                    onClick={() => {
                                        setShowApplicationModal(false);
                                        setCoverLetter('');
                                        setAdditionalInfo('');
                                    }}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 border border-[var(--p-line)] text-[var(--t3)] hover:text-white text-xs font-bold rounded-lg hover:bg-[var(--card)] transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitApplication}
                                    disabled={isSubmitting || !coverLetter.trim()}
                                    className="px-4 py-2 bg-gradient-to-r from-[var(--p)] to-blue-600 hover:from-[var(--p-glow)] hover:to-blue-500 text-black text-xs font-black rounded-lg transition-all disabled:opacity-50 flex items-center shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-black mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-3.5 w-3.5 mr-2" />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Job Details Modal */}
            <AnimatePresence>
                {selectedJob && !showApplicationModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-[var(--p-line)] sticky top-0 bg-[var(--card)] z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-white">{selectedJob.job_title}</h3>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="text-[var(--t3)] hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--t3)]">
                                    <span className="flex items-center">
                                        <Building2 className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                        {selectedJob.department}
                                    </span>
                                    {selectedJob.location && (
                                        <span className="flex items-center">
                                            <MapPin className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                            {selectedJob.location}
                                        </span>
                                    )}
                                    <span className="flex items-center">
                                        <Clock className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                        {JOB_TYPES[selectedJob.job_type as keyof typeof JOB_TYPES]}
                                    </span>
                                    {selectedJob.salary_range && (
                                        <span className="flex items-center">
                                            <DollarSign className="h-3.5 w-3.5 mr-1 text-[var(--p)]" />
                                            {selectedJob.salary_range}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-[var(--t2)] uppercase tracking-wider">Description</h4>
                                    <p className="text-xs text-[var(--t3)] leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-[var(--t2)] uppercase tracking-wider">Requirements</h4>
                                    <p className="text-xs text-[var(--t3)] leading-relaxed whitespace-pre-wrap">{selectedJob.requirements}</p>
                                </div>

                                {selectedJob.responsibilities && (
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-bold text-[var(--t2)] uppercase tracking-wider">Responsibilities</h4>
                                        <p className="text-xs text-[var(--t3)] leading-relaxed whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                                    </div>
                                )}

                                {selectedJob.benefits && (
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-bold text-[var(--t2)] uppercase tracking-wider">Benefits</h4>
                                        <p className="text-xs text-[var(--t3)] leading-relaxed whitespace-pre-wrap">{selectedJob.benefits}</p>
                                    </div>
                                )}

                                {selectedJob.application_deadline && (
                                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
                                        <div className="flex items-center text-xs text-rose-400 font-semibold">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Application deadline: {new Date(selectedJob.application_deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-[var(--p-line)] bg-[var(--p-dim)] flex justify-end space-x-3 rounded-b-xl">
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="px-4 py-2 border border-[var(--p-line)] text-[var(--t3)] hover:text-white text-xs font-bold rounded-lg hover:bg-[var(--card)] transition-colors"
                                >
                                    Close
                                </button>
                                {!hasApplied(selectedJob.id) && (
                                    <button
                                        onClick={() => {
                                            setShowApplicationModal(true);
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-[var(--p)] to-blue-600 hover:from-[var(--p-glow)] hover:to-blue-500 text-black text-xs font-black rounded-lg transition-all flex items-center shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                                    >
                                        <Send className="h-3.5 w-3.5 mr-2" />
                                        Apply for this Position
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobApplications;
