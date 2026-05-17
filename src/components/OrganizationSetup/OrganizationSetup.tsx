import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  CalendarDays, 
  ShieldCheck, 
  Network, 
  Users, 
  Briefcase, 
  Wallet, 
  UserCircle, 
  Clock, 
  Settings2, 
  Banknote, 
  Lock, 
  KeyRound, 
  History, 
  Plug, 
  ChevronRight,
  Save,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

import OrganizationProfile from './Foundation/OrganizationProfile';
import OrganizationStructure from './Structure/OrganizationStructure';
import OrgChart from './Structure/OrgChart';
import { 
  BrandingConfig, BranchesConfig, CalendarConfig, PoliciesConfig,
  JobGroupsConfig, CostCentersConfig, EmploymentTypesConfig,
  LeaveTypesConfig, ShiftRulesConfig, StatutoryConfig,
  EarningsDeductionsConfig, SalaryStructuresConfig, RolesConfig,
  PermissionsConfig, AuditLogsConfig, IntegrationsConfig
} from './SettingsPages';

const NAV_CATEGORIES = [
  {
    title: "Foundation",
    items: [
      { id: 'org-profile', label: 'Organization Profile', icon: Building2, component: OrganizationProfile },
      { id: 'branding', label: 'Branding', icon: Settings2, component: BrandingConfig },
      { id: 'branches', label: 'Branches', icon: MapPin, component: BranchesConfig },
      { id: 'calendar', label: 'Calendar & Holidays', icon: CalendarDays, component: CalendarConfig },
      { id: 'policies', label: 'Policies', icon: ShieldCheck, component: PoliciesConfig },
    ]
  },
  {
    title: "Structure",
    items: [
      { id: 'departments', label: 'Departments', icon: Network, component: OrganizationStructure },
      { id: 'org-chart', label: 'Org Chart', icon: Users, component: OrgChart },
      { id: 'job-groups', label: 'Job Roles & Titles', icon: Briefcase, component: JobGroupsConfig },
      { id: 'cost-centers', label: 'Cost Centers', icon: Wallet, component: CostCentersConfig },
    ]
  },
  {
    title: "Workforce",
    items: [
      { id: 'employment-types', label: 'Employment Types', icon: UserCircle, component: EmploymentTypesConfig },
      { id: 'leave-types', label: 'Leave Types', icon: CalendarDays, component: LeaveTypesConfig },
      { id: 'shift-rules', label: 'Shift Rules', icon: Clock, component: ShiftRulesConfig },
    ]
  },
  {
    title: "Payroll",
    items: [
      { id: 'statutory', label: 'Statutory Config', icon: Building2, component: StatutoryConfig },
      { id: 'earnings', label: 'Earnings & Deductions', icon: Banknote, component: EarningsDeductionsConfig },
      { id: 'salary-structures', label: 'Salary Structures', icon: Briefcase, component: SalaryStructuresConfig },
    ]
  },

  {
    title: "Integrations",
    items: [
      { id: 'apis', label: 'Connected Apps', icon: Plug, component: IntegrationsConfig },
    ]
  }
];

export default function OrganizationSetup() {
  const [activeSection, setActiveSection] = useState('org-profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    NAV_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.title]: true }), {})
  );

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleSave = () => {
    // Mock save
    setHasChanges(false);
  };

  const handleDiscard = () => {
    // Mock discard
    setHasChanges(false);
  };

  // Find active component
  let ActiveComponent = OrganizationProfile;
  let activeTitle = "Organization Profile";
  let activeCategory = "Foundation";

  for (const category of NAV_CATEGORIES) {
    for (const item of category.items) {
      if (item.id === activeSection) {
        ActiveComponent = item.component;
        activeTitle = item.label;
        activeCategory = category.title;
        break;
      }
    }
  }

  // Filter navigation based on search
  const filteredCategories = NAV_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="org-setup flex flex-col h-full space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* ── TOP HEADER AREA ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--t4)] uppercase tracking-wider mb-1">
            <span>System Setup</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--p)]">{activeCategory}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--t1)] tracking-tight">Organization Configuration</h1>
          <p className="text-[13px] text-[var(--t3)] mt-1">Manage your enterprise structure, policies, and operational settings.</p>
        </div>


      </div>

      {/* ── MAIN LAYOUT (Left Nav + Content) ── */}
      <div className="flex gap-6 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="w-[280px] shrink-0 flex flex-col gap-4 sticky top-6">
          


          {/* Navigation Menu (Accordion) */}
          <div className="flex flex-col max-h-[calc(100vh-200px)]">
            <div className="overflow-y-auto custom-scrollbar py-2 space-y-1">
              {filteredCategories.map((category, idx) => {
                const isExpanded = expandedCategories[category.title] || searchQuery.length > 0;
                const hasActiveChild = category.items.some(item => activeSection === item.id);
                
                return (
                  <div key={idx} className="mb-1">
                    {/* Mother Menu Toggle */}
                    <button 
                      onClick={() => toggleCategory(category.title)}
                      className={`w-full flex items-center gap-3 py-2.5 transition-all duration-200 px-6 relative cursor-pointer
                        ${hasActiveChild && !isExpanded ? 'text-[var(--p)] font-bold' : 'text-[var(--t3)]'}`}
                    >
                      <span className="text-[11.5px] font-semibold flex-1 text-left tracking-tight">{category.title}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${hasActiveChild ? 'text-[var(--p)]' : ''}`} />
                      
                      {hasActiveChild && !isExpanded && (
                        <div className="w-1 h-1 rounded-full bg-[var(--p)] animate-pulse ml-2" />
                      )}
                    </button>
                    
                    {/* Dropdown Items */}
                    <div className={`overflow-hidden relative transition-all duration-300 ${isExpanded ? 'max-h-[500px] mt-0.5' : 'max-h-0'}`}>
                      {/* Elegant Thin Line */}
                      <div className="absolute left-[26px] top-0 bottom-3 w-[1px] bg-[var(--p-line)]" />
                      
                      <div className="flex flex-col">
                        {category.items.map((item) => {
                          const isActive = activeSection === item.id;
                          const Icon = item.icon;
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveSection(item.id)}
                              className={`flex items-center gap-3 py-2 transition-all duration-200 relative px-6 w-full text-left
                                ${isActive 
                                  ? 'text-[var(--p)] font-bold' 
                                  : 'text-[var(--t3)]'}`}
                            >
                              {/* Elegant Dot */}
                              <div className={`absolute left-[22.5px] w-[8px] h-[8px] rounded-full border-2 border-[var(--glass)] transition-all z-10
                                ${isActive ? 'bg-[var(--p)] scale-110 shadow-[0_0_8px_var(--p-glow)]' : 'bg-[var(--p-line)]'}`} 
                              />
                              
                              <div className="flex items-center gap-3 ml-5">
                                <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-[var(--p)]' : 'text-[var(--t4)]'}`} />
                                <span className="text-[10.5px] truncate tracking-tight">{item.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-[var(--t4)] text-[12px]">
                  No settings found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 pb-20">
          
          {/* Active Section Header */}
          <div className="glass-card px-6 py-4 flex items-center justify-between rounded-lg">
            <div>
              <h2 className="text-lg font-bold text-[var(--t1)]">{activeTitle}</h2>
              <p className="text-[12px] text-[var(--t3)] mt-0.5">Configure {activeTitle.toLowerCase()} settings and preferences.</p>
            </div>
            
            {/* Sticky Actions (visible when changes are made, but for demo we can show them or add a toggle) */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setHasChanges(true)}
                className="px-4 py-2 text-[12px] font-medium text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--glass-h)] rounded-lg transition-colors"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSave}
                className="f-btn flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Save Configuration
              </button>
            </div>
          </div>

          {/* Dynamic Component Content */}
          <div className="relative">
            <ActiveComponent onChange={() => setHasChanges(true)} />
          </div>

        </div>
      </div>
      
    </div>
  );
}
