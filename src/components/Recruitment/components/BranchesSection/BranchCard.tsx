import { StatusBadge } from '../StatusBadge';

interface BranchCardProps {
  branch: any;
  positions: any[];
}

export const BranchCard = ({ branch, positions }: BranchCardProps) => {
  const criticalPositions = positions.filter((p) => p.status === 'Critically Needed').length;
  const urgentPositions = positions.filter((p) => p.status === 'Urgent').length;
  
  return (
    <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl p-5 hover:border-[var(--p)] hover:shadow-[0_0_15px_rgba(0,229,255,0.06)] transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-bold text-white">{branch.name}</h3>
        <StatusBadge status={branch.hiringStatus} />
      </div>
      <p className="text-[var(--t3)] text-xs mb-4 font-semibold">{branch.location}</p>
      
      <div className="space-y-2 border-t border-[var(--p-line)] pt-3">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--t3)]">Total Open Positions:</span>
          <span className="font-bold text-white">{positions.length}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-red-400 font-bold">Critically Needed:</span>
          <span className="font-bold text-white">{criticalPositions}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-amber-400 font-bold">Urgent Positions:</span>
          <span className="font-bold text-white">{urgentPositions}</span>
        </div>
      </div>
    </div>
  );
};