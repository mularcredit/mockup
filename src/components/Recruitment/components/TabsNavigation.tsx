interface TabsNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  jobPositionsCount: number;
  applicationsCount: number;
  branchesCount: number;
}

export const TabsNavigation = ({
  selectedTab,
  setSelectedTab,
  jobPositionsCount,
  applicationsCount,
  branchesCount,
}: TabsNavigationProps) => {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] overflow-hidden shadow-sm">
      <div className="border-b border-[var(--p-line)]">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setSelectedTab('positions')}
            className={`py-4 px-6 text-center border-b-2 font-semibold text-xs transition-all ${selectedTab === 'positions' ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/20' : 'border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'}`}
          >
            Open Positions ({jobPositionsCount})
          </button>
          <button
            onClick={() => setSelectedTab('applications')}
            className={`py-4 px-6 text-center border-b-2 font-semibold text-xs transition-all ${selectedTab === 'applications' ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/20' : 'border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'}`}
          >
            Applications ({applicationsCount})
          </button>
          <button
            onClick={() => setSelectedTab('public-board')}
            className={`py-4 px-6 text-center border-b-2 font-semibold text-xs transition-all ${selectedTab === 'public-board' ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/20' : 'border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'}`}
          >
            Simulated Careers Portal (Jobs Board)
          </button>
          <button
            onClick={() => setSelectedTab('assessments')}
            className={`py-4 px-6 text-center border-b-2 font-semibold text-xs transition-all ${selectedTab === 'assessments' ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/20' : 'border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'}`}
          >
            Screening Assessments
          </button>
          <button
            onClick={() => setSelectedTab('interviews')}
            className={`py-4 px-6 text-center border-b-2 font-semibold text-xs transition-all ${selectedTab === 'interviews' ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/20' : 'border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'}`}
          >
            Interview Scheduler
          </button>
          <button
            onClick={() => setSelectedTab('branches')}
            className={`py-4 px-6 text-center border-b-2 font-semibold text-xs transition-all ${selectedTab === 'branches' ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/20' : 'border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'}`}
          >
            Branches ({branchesCount})
          </button>
        </nav>
      </div>
    </div>
  );
};