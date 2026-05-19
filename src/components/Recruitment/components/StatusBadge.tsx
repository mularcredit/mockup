interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusClasses = {
    'Critically Needed': 'bg-red-500/10 text-red-400 border border-red-500/20',
    'Urgent': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'Normal': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'Future Hiring': 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    'New': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    'Interview': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    'Shortlisted': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border border-red-500/20',
    'draft': 'bg-gray-500/15 text-gray-300 border border-gray-500/20',
    'Draft': 'bg-gray-500/15 text-gray-300 border border-gray-500/20',
    'pending': 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    'Pending': 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    'approved': 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    'Approved': 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    'open': 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    'Open': 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    'closed': 'bg-red-500/15 text-red-400 border border-red-500/20',
    'Closed': 'bg-red-500/15 text-red-400 border border-red-500/20',
  };

  const getLabel = (s: string) => {
    if (s === 'open') return 'Live / Posted';
    if (s === 'pending') return 'Pending Approval';
    return s;
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {getLabel(status)}
    </span>
  );
};