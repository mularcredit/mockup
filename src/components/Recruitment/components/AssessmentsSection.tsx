import { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, Play, HelpCircle, Users, BarChart3, Plus, Sparkles } from 'lucide-react';
import { GlowButton } from './GlowButton';

interface Assessment {
  id: string;
  name: string;
  department: string;
  questionsCount: number;
  timeLimit: number; // in minutes
  completedCount: number;
  averageScore: number; // percentage
  status: 'Active' | 'Draft';
}

export default function AssessmentsSection() {
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: 'as-1',
      name: 'Credit Analyst Professional Assessment',
      department: 'Credit',
      questionsCount: 25,
      timeLimit: 45,
      completedCount: 18,
      averageScore: 78,
      status: 'Active'
    },
    {
      id: 'as-2',
      name: 'Customer Experience & NPS Aptitude Quiz',
      department: 'Customer Experience',
      questionsCount: 20,
      timeLimit: 30,
      completedCount: 34,
      averageScore: 85,
      status: 'Active'
    },
    {
      id: 'as-3',
      name: 'Branch Teller Compliance & Cash Audit test',
      department: 'Operations',
      questionsCount: 30,
      timeLimit: 60,
      completedCount: 8,
      averageScore: 92,
      status: 'Active'
    },
    {
      id: 'as-4',
      name: 'Senior Relationship Manager Sales Pitch Assessment',
      department: 'Sales & Marketing',
      questionsCount: 15,
      timeLimit: 20,
      completedCount: 0,
      averageScore: 0,
      status: 'Draft'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Credit');
  const [newTime, setNewTime] = useState(30);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newAss: Assessment = {
      id: `as-mock-${Date.now()}`,
      name: newTitle,
      department: newDept,
      questionsCount: 15,
      timeLimit: Number(newTime),
      completedCount: 0,
      averageScore: 0,
      status: 'Draft'
    };

    setAssessments([newAss, ...assessments]);
    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 space-y-1 hover:border-white/10 transition-all">
          <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Total Active Assessments</p>
          <div className="flex items-center justify-between">
            <p className="text-white text-2xl font-bold">{assessments.filter(a => a.status === 'Active').length}</p>
            <Award className="w-5 h-5 text-[var(--p)]" />
          </div>
        </div>
        <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 space-y-1 hover:border-white/10 transition-all">
          <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Total Quizzes Taken</p>
          <div className="flex items-center justify-between">
            <p className="text-white text-2xl font-bold">
              {assessments.reduce((acc, curr) => acc + curr.completedCount, 0)}
            </p>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
        </div>
        <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 space-y-1 hover:border-white/10 transition-all">
          <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Average Candidate Score</p>
          <div className="flex items-center justify-between">
            <p className="text-white text-2xl font-bold">81.4%</p>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Skills & Screening Assessment Templates</h3>
          <p className="text-[var(--t3)] text-[10px]">Verify candidate competencies automatically before launching physical interviews</p>
        </div>
        <GlowButton 
          icon={Plus} 
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          Add Assessment
        </GlowButton>
      </div>

      {/* Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map(ass => (
          <div key={ass.id} className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 space-y-4 hover:border-[var(--p)] hover:shadow-[0_0_15px_rgba(0,229,255,0.04)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-bold px-2 py-0.5 bg-[var(--p-dim)]/30 border border-[var(--p-line)] rounded-full text-[var(--p)] uppercase tracking-wider">
                  {ass.department}
                </span>
                <h4 className="text-xs font-bold text-white pt-1">{ass.name}</h4>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${ass.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {ass.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[var(--p-line)] text-center text-[10px] text-[var(--t3)]">
              <div>
                <p className="font-semibold text-white/80">{ass.questionsCount} Questions</p>
                <p className="text-[9px]">Length</p>
              </div>
              <div>
                <p className="font-semibold text-white/80">{ass.timeLimit} Mins</p>
                <p className="text-[9px]">Time Limit</p>
              </div>
              <div>
                <p className="font-semibold text-white/80">{ass.completedCount > 0 ? `${ass.averageScore}%` : 'N/A'}</p>
                <p className="text-[9px]">Avg Score</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 text-[10px]">
              <span className="text-[var(--t3)] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {ass.completedCount} candidates tested
              </span>
              <button 
                onClick={() => {
                  alert(`Starting mock edit for: ${ass.name}`);
                }}
                className="text-[var(--p)] hover:text-white font-bold flex items-center gap-1 transition-colors"
              >
                Configure Questions <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              New Assessment Template
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Test Name</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                  placeholder="e.g. Sales Executive Competency Test"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Department</label>
                  <select 
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)]"
                  >
                    <option value="Credit" className="bg-[var(--card)] text-white">Credit</option>
                    <option value="Customer Experience" className="bg-[var(--card)] text-white">Customer Experience</option>
                    <option value="Operations" className="bg-[var(--card)] text-white">Operations</option>
                    <option value="Sales & Marketing" className="bg-[var(--card)] text-white">Sales & Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Time Limit (mins)</label>
                  <input 
                    type="number" 
                    value={newTime}
                    onChange={(e) => setNewTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <GlowButton variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </GlowButton>
                <GlowButton type="submit" size="sm">
                  Create Template
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
