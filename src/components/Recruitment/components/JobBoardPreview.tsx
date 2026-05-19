import { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, User, Mail, Phone, FileText, Upload, Sparkles, CheckCircle } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { branches } from './constants/branches';

interface Position {
  id: string | number;
  title: string;
  department: string;
  type: string;
  branch: string;
  status: 'draft' | 'pending' | 'approved' | 'open' | 'closed';
  applications?: string;
  created_at: string;
  description?: string;
  qualifications?: string[];
}

interface JobBoardPreviewProps {
  positions: Position[];
  onApplySubmitted: (newApp: any) => void;
}

export default function JobBoardPreview({ positions, onApplySubmitted }: JobBoardPreviewProps) {
  const [selectedJob, setSelectedJob] = useState<Position | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Only show positions that are currently live/open
  const livePositions = positions.filter(pos => pos.status === 'open');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !selectedJob) return;

    const newApplication = {
      id: `app-mock-${Date.now()}`,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone || '+254 700 000000',
      position: selectedJob.title,
      department: selectedJob.department,
      preferred_location: branches.find(b => b.id === selectedJob.branch)?.name || selectedJob.branch,
      status: 'New',
      applied_at: new Date().toISOString(),
      cover_letter: coverLetter || 'I am excited to apply for this opportunity.',
      resume_url: resumeName || 'Candidate_Resume.pdf'
    };

    onApplySubmitted(newApplication);
    setIsSubmitted(true);

    // Reset Form
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedJob(null);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCoverLetter('');
      setResumeName('');
    }, 2000);
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || branchId;
  };

  return (
    <div className="space-y-6">
      {/* Careers Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-[var(--p-line)] p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/10 text-cyan-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Simulated Careers Portal
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Join Our High-Performance Team</h2>
          <p className="text-[var(--t3)] text-xs leading-relaxed">
            Browse active career openings at ZiraHR. Explore roles in finance, operations, credit engineering, and help build the future of unified workforce management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Live Postings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Job Postings ({livePositions.length})</h3>
            <span className="text-[10px] text-[var(--t3)]">External candidates see these live</span>
          </div>

          {livePositions.length === 0 ? (
            <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-10 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-[var(--t3)] mx-auto opacity-40" />
              <p className="text-xs text-[var(--t3)]">No live positions currently posted. Go to the "Open Positions" tab and click "Post Live" on approved vacancies.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {livePositions.map(pos => (
                <div 
                  key={pos.id}
                  onClick={() => setSelectedJob(pos)}
                  className={`bg-[var(--card)] rounded-xl border p-5 transition-all cursor-pointer ${selectedJob?.id === pos.id ? 'border-[var(--p)] shadow-[0_0_15px_rgba(0,229,255,0.08)] bg-[var(--p-dim)]/10' : 'border-[var(--p-line)] hover:border-white/20'}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white hover:text-[var(--p)] transition-colors">{pos.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-[var(--t3)] font-medium">
                        <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-500/10 px-2 py-0.5 rounded-full font-bold">{pos.department}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[var(--p)]" />
                          {getBranchName(pos.branch)} Branch
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {pos.type}
                        </div>
                      </div>
                    </div>
                    <button className="text-xs text-[var(--p)] hover:text-white font-bold flex items-center gap-1 group/btn ml-auto sm:ml-0">
                      View details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Job Details & Interactive Apply Portal */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 space-y-6 sticky top-4">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Application Received!</h4>
                  <p className="text-[11px] text-[var(--t3)]">Your application has been routed directly into the recruiters "Applications" list.</p>
                </div>
              ) : (
                <>
                  <div className="border-b border-[var(--p-line)] pb-4 space-y-2">
                    <h3 className="text-xs font-bold text-[var(--p)] uppercase tracking-wider">Job Specification</h3>
                    <h4 className="text-base font-bold text-white">{selectedJob.title}</h4>
                    <p className="text-[10px] text-[var(--t3)] font-semibold uppercase">{selectedJob.department} • {selectedJob.type}</p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Role Overview</h5>
                    <p className="text-[11px] text-[var(--t3)] leading-relaxed">{selectedJob.description || 'Join ZiraHR as a critical addition to our expanding office operations. We seek individuals with passion, technical competence, and a collaborative team attitude.'}</p>
                  </div>

                  {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Key Requirements</h5>
                      <ul className="space-y-1 list-disc pl-4 text-[11px] text-[var(--t3)]">
                        {selectedJob.qualifications.map((qual, idx) => (
                          <li key={idx}>{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Apply Form */}
                  <form onSubmit={handleApply} className="border-t border-[var(--p-line)] pt-4 space-y-3.5">
                    <h5 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      Direct Application Form
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-[var(--t2)] uppercase mb-1">First Name</label>
                        <input 
                          type="text" 
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-2.5 py-2 bg-[var(--p-dim)]/50 border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                          placeholder="e.g. John"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[var(--t2)] uppercase mb-1">Last Name</label>
                        <input 
                          type="text" 
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-2.5 py-2 bg-[var(--p-dim)]/50 border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                          placeholder="e.g. Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-[var(--t2)] uppercase mb-1">Work Email</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2.5 py-2 bg-[var(--p-dim)]/50 border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-[var(--t2)] uppercase mb-1">Phone</label>
                        <input 
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-2.5 py-2 bg-[var(--p-dim)]/50 border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                          placeholder="+254..."
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[var(--t2)] uppercase mb-1">Resume Upload</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setResumeName(e.target.files[0].name);
                              }
                            }}
                            className="hidden" 
                            id="file-upload-prev"
                          />
                          <label 
                            htmlFor="file-upload-prev"
                            className="w-full px-2.5 py-2 bg-[var(--p-dim)]/50 border border-[var(--p-line)] rounded-lg text-xs text-[var(--t3)] flex items-center justify-between cursor-pointer hover:border-white/20 transition-all"
                          >
                            <span className="truncate max-w-[80px]">{resumeName || 'Attach PDF'}</span>
                            <Upload className="w-3.5 h-3.5 text-[var(--p)]" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-[var(--t2)] uppercase mb-1">Cover Note</label>
                      <textarea 
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full px-2.5 py-2 bg-[var(--p-dim)]/50 border border-[var(--p-line)] rounded-lg text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)] resize-none"
                        rows={2}
                        placeholder="Brief pitch..."
                      />
                    </div>

                    <GlowButton 
                      type="submit"
                      icon={ArrowRight}
                      size="sm"
                      className="w-full"
                    >
                      Submit Candidate Application
                    </GlowButton>
                  </form>
                </>
              )}
            </div>
          ) : (
            <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-8 text-center space-y-3 sticky top-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Candidate Hub</h4>
              <p className="text-[11px] text-[var(--t3)]">Select any open job posting from the catalog on the left to review responsibilities, credentials, and submit a candidate application form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
