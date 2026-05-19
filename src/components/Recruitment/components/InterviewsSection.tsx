import { useState } from 'react';
import { Calendar, Clock, User, Star, Plus, ShieldCheck, Mail, Video, MoreVertical, CheckCircle2 } from 'lucide-react';
import { GlowButton } from './GlowButton';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'Technical Interview' | 'HR Screening' | 'Executive Round';
  interviewer: string;
  rating: number; // 0 to 5
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export default function InterviewsSection() {
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 'int-1',
      candidateName: 'Olivia Ndwiga',
      position: 'Senior Credit Analyst',
      date: '2026-05-20',
      time: '10:00 AM',
      type: 'Technical Interview',
      interviewer: 'David Kiprop (Credit Lead)',
      rating: 0,
      status: 'Scheduled'
    },
    {
      id: 'int-2',
      candidateName: 'Brian Ondieki',
      position: 'Relationship Manager',
      date: '2026-05-19',
      time: '02:30 PM',
      type: 'HR Screening',
      interviewer: 'Daniel Wambua (HR Admin)',
      rating: 4.5,
      status: 'Completed'
    },
    {
      id: 'int-3',
      candidateName: 'Mercy Jebet',
      position: 'Client Relations Specialist',
      date: '2026-05-22',
      time: '11:00 AM',
      type: 'Executive Round',
      interviewer: 'Titus Mwangi (Director)',
      rating: 0,
      status: 'Scheduled'
    },
    {
      id: 'int-4',
      candidateName: 'Evans Kiprotich',
      position: 'Junior Accountant',
      date: '2026-05-15',
      time: '09:00 AM',
      type: 'HR Screening',
      interviewer: 'Daniel Wambua (HR Admin)',
      rating: 3.0,
      status: 'Completed'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [candidate, setCandidate] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [intType, setIntType] = useState<'Technical Interview' | 'HR Screening' | 'Executive Round'>('Technical Interview');
  const [interviewer, setInterviewer] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !role) return;

    const newInt: Interview = {
      id: `int-mock-${Date.now()}`,
      candidateName: candidate,
      position: role,
      date: date || new Date().toISOString().split('T')[0],
      time: time,
      type: intType,
      interviewer: interviewer || 'HR Team Panel',
      rating: 0,
      status: 'Scheduled'
    };

    setInterviews([newInt, ...interviews]);
    setShowCreateModal(false);
    setCandidate('');
    setRole('');
  };

  const handleRatingChange = (id: string, newRating: number) => {
    setInterviews(interviews.map(i => i.id === id ? { ...i, rating: newRating, status: 'Completed' } : i));
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Interview & Evaluation Center</h3>
          <p className="text-[var(--t3)] text-[10px]">Schedule candidate video/onsite rounds and evaluate technical scores in real-time</p>
        </div>
        <GlowButton 
          icon={Plus} 
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          Schedule Interview
        </GlowButton>
      </div>

      {/* Grid of Scheduled Interviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map(i => (
          <div key={i.id} className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-5 space-y-4 hover:border-[var(--p)] hover:shadow-[0_0_15px_rgba(0,229,255,0.04)] transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{i.candidateName}</h4>
                <p className="text-[10px] text-[var(--t3)] font-semibold uppercase">{i.position}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${i.status === 'Scheduled' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : i.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {i.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--t3)] py-1 border-t border-[var(--p-line)] pt-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--p)]" />
                <span>{new Date(i.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{i.time}</span>
              </div>
            </div>

            <div className="text-[10px] text-[var(--t3)] py-1 border-b border-[var(--p-line)] pb-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-white/80">{i.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interviewer: {i.interviewer}</span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-between items-center text-[10px] pt-1">
              <span className="text-[var(--t3)] uppercase font-semibold">Evaluation score</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    onClick={() => handleRatingChange(i.id, star)}
                    className={`w-4 h-4 cursor-pointer transition-colors ${star <= i.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600 hover:text-amber-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Interview Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Schedule Interview Session</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Candidate Name</label>
                <input 
                  type="text" 
                  required
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                  placeholder="e.g. Olivia Ndwiga"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Applied Role</label>
                <input 
                  type="text" 
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                  placeholder="e.g. Senior Credit Analyst"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Time</label>
                  <input 
                    type="text" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none"
                    placeholder="10:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Interview Type</label>
                <select 
                  value={intType}
                  onChange={(e) => setIntType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)]"
                >
                  <option value="Technical Interview" className="bg-[var(--card)] text-white">Technical Interview</option>
                  <option value="HR Screening" className="bg-[var(--card)] text-white">HR Screening</option>
                  <option value="Executive Round" className="bg-[var(--card)] text-white">Executive Round</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--t2)] uppercase tracking-wider mb-2">Interviewer Panel</label>
                <input 
                  type="text" 
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)]"
                  placeholder="e.g. David Kiprop"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <GlowButton variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </GlowButton>
                <GlowButton type="submit" size="sm">
                  Schedule Session
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
