import React, { useState, useEffect } from 'react';
import UserAvatar from '../UI/UserAvatar';
import { 
  LayoutGrid, Wand2, Kanban, Network, 
  MessagesSquare, Mails, UsersRound, 
  UserPlus2, CalendarRange, Target, 
  Award, UserCheck, ShieldAlert, 
  HeartHandshake, Landmark, Receipt, 
  Package, Smartphone, PieChart, 
  ShieldEllipsis, Settings, ShieldHalf,
  ChevronRight, Layers, ChevronDown,
  LogOut, Building2, Clock
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { motion, AnimatePresence } from 'framer-motion';

const menuGroups = [
  {
    id: 'hustle-hub',
    title: "Hustle Hub",
    icon: LayoutGrid,
    items: [
      { id: 'dashboard', label: 'Command Center', icon: LayoutGrid, path: '/dashboard', permission: 'dashboard' },
      { id: 'ai-assistant', label: 'Zira Intelligence', icon: Wand2, path: '/ai-assistant', permission: 'ai-assistant' },
    ]
  },
  {
    id: 'staff-records',
    title: "Staff & Records",
    icon: UsersRound,
    items: [
      { id: 'employees', label: 'Wafanyakazi Records', icon: UsersRound, path: '/employees', permission: 'employees' },
      { id: 'recruitment', label: 'Talent Sourcing', icon: UserPlus2, path: '/recruitment', permission: 'recruitment' },
      { id: 'staffcheck', label: 'Disciplinary Logs', icon: ShieldAlert, path: '/staffcheck', permission: 'staffcheck' },
      { id: 'hr-lifecycle-dashboard', label: 'Employee Journey', icon: HeartHandshake, path: '/hr-lifecycle', permission: 'hr-lifecycle' },
      { id: 'hr-onboarding-contract', label: 'Statutory Onboarding', icon: UserPlus2, path: '/hr-lifecycle?tab=onboarding', permission: 'hr-lifecycle' },
    ]
  },
  {
    id: 'time-attendance',
    title: "Time & Attendance",
    icon: CalendarRange,
    items: [
      { id: 'attendance', label: 'T&A Operations Portal', icon: Clock, path: '/attendance', permission: 'leaves' },
      { id: 'leaves', label: 'Leave Management', icon: CalendarRange, path: '/leaves', permission: 'leaves' },
      { id: 'task-manager', label: 'Duty Rosters', icon: Kanban, path: '/tasks', permission: 'task-manager' },
      { id: 'teams', label: 'Operations Teams', icon: Network, path: '/teams', permission: 'teams' },
    ]
  },
  {
    id: 'pay-statutory',
    title: "Pay & Statutory",
    icon: Landmark,
    items: [
      { id: 'payroll', label: 'Payroll & NSSF/NHIF', icon: Landmark, path: '/payroll', permission: 'payroll' },
      { id: 'mpesa-zap', label: 'M-Pesa Zap Hub', icon: Smartphone, path: '/mpesa-zap', permission: 'mpesa-zap' },
      { id: 'advanced', label: 'Salary Advances', icon: Landmark, path: '/salaryadmin', permission: 'salaryadmin' },
      { id: 'expense', label: 'Claims & Expenses', icon: Receipt, path: '/expenses', permission: 'expenses' },
      { id: 'asset', label: 'Company Assets', icon: Package, path: '/asset', permission: 'asset' },
    ]
  },
  {
    id: 'talent-growth',
    title: "Talent & Growth",
    icon: Target,
    items: [
      { id: 'performance', label: 'KPI Reviews', icon: Target, path: '/performance', permission: 'performance' },
      { id: 'training', label: 'Staff Upskilling', icon: Award, path: '/training', permission: 'training' },
      { id: 'assign-managers', label: 'Leadership Grid', icon: UserCheck, path: '/assign-managers', permission: 'assign-managers' },
    ]
  },
  {
    id: 'comm-center',
    title: "Comm Center",
    icon: MessagesSquare,
    items: [
      { id: 'messages', label: 'SMS Broadcast', icon: MessagesSquare, path: '/sms', permission: 'sms' },
      { id: 'email-portal', label: 'Corporate Mail', icon: Mails, path: '/email-portal', permission: 'email-portal' },
    ]
  },
  {
    id: 'system-config',
    title: "System Config",
    icon: Settings,
    items: [
      { id: 'org-setup', label: 'Organization Setup', icon: Building2, path: '/organization-setup', permission: 'settings' },
      { id: 'reports', label: 'Audit Reports', icon: PieChart, path: '/reports', permission: 'reports' },
      { id: 'settings', label: 'Hub Settings', icon: Settings, path: '/settings', permission: 'settings' },
      { id: 'role-permissions', label: 'Security Access', icon: ShieldHalf, path: '/role-permissions', permission: 'role-permissions' },
      { id: 'email-admin', label: 'Domain Admin', icon: ShieldEllipsis, path: '/adminconfirm', permission: 'adminconfirm' },
    ]
  }
];

interface SidebarProps {
  user?: { email: string; role: string } | null;
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  onLogout?: () => void;
}

export default function Sidebar({ user, isCollapsed, onToggle, onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light'));

  // Theme detection for logo
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsLightMode(document.body.classList.contains('light'));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Automatically open the group containing the active path
  useEffect(() => {
    const activeGroup = menuGroups.find(group => 
      group.items.some(item => currentPath.startsWith(item.path))
    );
    if (activeGroup && !openGroups.includes(activeGroup.id)) {
      setOpenGroups(prev => [...prev, activeGroup.id]);
    }
  }, [currentPath]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-[var(--sidebar)] border-r border-[var(--p-line)] flex flex-col transition-all duration-300 z-50 ${isCollapsed ? 'w-[88px]' : 'w-[220px]'}`}>
      {/* sb-logo */}
      <div className={`flex items-center gap-[10px] border-b border-[var(--p-line)] transition-all ${isCollapsed ? 'p-5 justify-center' : 'p-[22px_12px_18px]'}`}>
        <img 
          src={isLightMode ? "/zira-dark.png" : "/ZIRA.png"} 
          alt="ZiraHR" 
          className={`transition-all object-contain duration-300 ${isCollapsed ? 'h-8 w-8' : 'h-12 w-auto'}`}
        />
      </div>

      {/* nav */}
      <div className="flex-1 py-4 overflow-y-auto scrollbar-hide px-0">
        {menuGroups.map((group) => {
          const isGroupOpen = openGroups.includes(group.id);
          const hasActiveChild = group.items.some(item => currentPath.startsWith(item.path));
          
          // Filter items based on permissions
          const accessibleItems = group.items.filter(item => !permissionsLoading && (!item.permission || hasPermission(item.permission)));
          if (accessibleItems.length === 0) return null;

          return (
            <div key={group.id} className="mb-1">
              {/* Group Toggle */}
              <button
                onClick={() => isCollapsed ? onToggle(false) : toggleGroup(group.id)}
                className={`w-full flex items-center gap-3 py-2.5 transition-all duration-200 group px-6 relative
                  ${hasActiveChild && !isGroupOpen
                    ? 'text-[#00E5FF] font-bold'
                    : 'text-[var(--t3)]'}
                  hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]`}
              >
                {/* Left accent bar - shown on hover only via opacity, no layout shift */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00E5FF] opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                
                <group.icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${hasActiveChild ? 'text-[#00E5FF]' : 'text-[var(--t3)] group-hover:text-[#00E5FF]'}`} />
                {!isCollapsed && (
                  <>
                    <span className="text-[11.5px] font-semibold flex-1 text-left tracking-tight">{group.title}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''} ${hasActiveChild ? 'text-[#00E5FF]' : ''}`} />
                  </>
                )}
                {hasActiveChild && !isGroupOpen && (
                  <div className="w-1 h-1 rounded-full bg-[#00E5FF] animate-pulse" />
                )}
              </button>

              {/* Sub Items */}
              <AnimatePresence>
                {isGroupOpen && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    className="overflow-hidden relative mt-0.5"
                  >
                    {/* Elegant Thin Line - Positioned for full width */}
                    <div className="absolute left-[26px] top-0 bottom-3 w-[1px] bg-[var(--p-line)]" />
                    
                    <div className="flex flex-col">
                      {accessibleItems.map((item) => {
                        const isActive = item.path.includes('?')
                          ? (location.pathname + location.search) === item.path
                          : location.pathname === item.path;
                        return (
                          <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 py-2 transition-all duration-200 relative group px-6
                              ${isActive 
                                ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-bold' 
                                : 'text-[var(--t3)] hover:bg-[#00E5FF]/10 hover:text-[var(--t2)]'}`}
                          >
                            {/* Left accent bar via absolute — no layout jump */}
                            <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#00E5FF] transition-opacity duration-200
                              ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                            {/* Elegant Dot */}
                            <div className={`absolute left-[22.5px] w-[8px] h-[8px] rounded-full border-2 border-[var(--sidebar)] transition-all z-10
                              ${isActive ? 'bg-[#00E5FF] scale-110 shadow-[0_0_8px_var(--p-glow)]' : 'bg-[var(--p-line)] group-hover:bg-[var(--t4)]'}`} 
                            />
                            
                            <div className="flex items-center gap-3 ml-5">
                              <item.icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-[#00E5FF]' : 'text-[var(--t4)] group-hover:text-[var(--t2)]'}`} />
                              <span className="text-[10.5px] truncate tracking-tight">{item.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* sb-foot */}
      <div className="mt-auto p-4 border-t border-[var(--p-line)] bg-[var(--sidebar)]">
        <div className="flex flex-col gap-3">
          {/* User Profile & Logout */}
          <div className={`flex items-center gap-3 p-2 rounded-2xl bg-[var(--glass)] border border-[var(--p-line)] transition-all ${isCollapsed ? 'justify-center p-1.5' : ''}`}>
            <UserAvatar name={user?.email || 'Admin'} size={isCollapsed ? 28 : 32} />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[var(--t1)] truncate">{user?.email?.split('@')[0] || 'Operator'}</p>
                <p className="text-[9px] text-[var(--t4)] font-medium truncate">{user?.role || 'Staff'}</p>
              </div>
            )}
            {!isCollapsed && onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 text-[var(--t4)] hover:text-[var(--red)] transition-all rounded-lg hover:bg-[var(--red-d)]"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}