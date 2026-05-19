import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    RefreshCw,
    Lock,
    Unlock,
    Search,
    CheckSquare,
    Square,
    Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { GlowButton } from '../Recruitment/components/GlowButton';

interface Permission {
    id: string;
    module_name: string;
    module_id: string;
    description: string;
    category: string;
}

const AVAILABLE_ROLES = [
    { id: 'ADMIN', name: 'Administrator', description: 'Full system access & configuration' },
    { id: 'HR', name: 'Human Resources', description: 'Employee & payroll management' },
    { id: 'CHECKER', name: 'Checker', description: 'Verification & approval workflows' },
    { id: 'MANAGER', name: 'Manager', description: 'Team oversight & reporting' },
    { id: 'REGIONAL', name: 'Regional Manager', description: 'Multi-branch supervision' },
    { id: 'OPERATIONS', name: 'Operations', description: 'Day-to-day system operations' },
    { id: 'STAFF', name: 'Staff', description: 'Basic portal access' },
];

const PERMISSION_CATEGORIES = [
    { id: 'overview', name: 'Overview' },
    { id: 'workspace', name: 'Workspace' },
    { id: 'people-hr', name: 'People & HR' },
    { id: 'finance', name: 'Finance & Assets' },
    { id: 'system', name: 'System' },
];

export default function RolePermissions() {
    const [selectedRole, setSelectedRole] = useState<string>('ADMIN');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchPermissions();
        fetchRolePermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const { data, error } = await supabase
                .from('permissions')
                .select('*')
                .order('category', { ascending: true })
                .order('module_name', { ascending: true });

            if (error) throw error;
            setPermissions(data || []);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Failed to load permissions');
        }
    };

    const fetchRolePermissions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('role_permissions')
                .select('*');

            if (error) throw error;

            const permissionsMap: Record<string, string[]> = {};
            (data || []).forEach((rp: any) => {
                permissionsMap[rp.role_name] = rp.permissions || [];
            });

            setRolePermissions(permissionsMap);
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            toast.error('Failed to load role permissions');
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (moduleId: string) => {
        setHasChanges(true);
        setRolePermissions(prev => {
            const currentPermissions = prev[selectedRole] || [];
            const hasPermission = currentPermissions.includes(moduleId);

            return {
                ...prev,
                [selectedRole]: hasPermission
                    ? currentPermissions.filter(p => p !== moduleId)
                    : [...currentPermissions, moduleId]
            };
        });
    };

    const savePermissions = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('role_permissions')
                .upsert({
                    role_name: selectedRole,
                    permissions: rolePermissions[selectedRole] || [],
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'role_name'
                });

            if (error) throw error;

            toast.success(`Permissions saved for ${selectedRole}`);
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving permissions:', error);
            toast.error('Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    const copyPermissionsFrom = async (sourceRole: string) => {
        if (window.confirm(`Copy all permissions from ${sourceRole} to ${selectedRole}?`)) {
            setRolePermissions(prev => ({
                ...prev,
                [selectedRole]: [...(prev[sourceRole] || [])]
            }));
            setHasChanges(true);
            toast.success(`Permissions copied from ${sourceRole}`);
        }
    };

    const clearAllPermissions = () => {
        if (window.confirm(`Remove all permissions for ${selectedRole}?`)) {
            setRolePermissions(prev => ({
                ...prev,
                [selectedRole]: []
            }));
            setHasChanges(true);
            toast.success('All permissions cleared');
        }
    };

    const grantAllPermissions = () => {
        if (window.confirm(`Grant all permissions to ${selectedRole}?`)) {
            setRolePermissions(prev => ({
                ...prev,
                [selectedRole]: permissions.map(p => p.module_id)
            }));
            setHasChanges(true);
            toast.success('All permissions granted');
        }
    };

    const filteredPermissions = permissions.filter(p => {
        const matchesSearch = p.module_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const currentRolePermissions = rolePermissions[selectedRole] || [];

    const getPermissionsByCategory = (category: string) => {
        return filteredPermissions.filter(p => p.category === category);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[65vh] w-full relative overflow-hidden backdrop-blur-sm">
                {/* Ambient Background Glow */}
                <div className="absolute w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px] -z-10 animate-pulse" />
                
                <div className="flex flex-col items-center justify-center">
                    {/* Multi-Ring Elegant Spinner */}
                    <div className="relative w-16 h-16 mb-6">
                        {/* Outer Spin Ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-cyan-500/40 animate-spin" style={{ animationDuration: '1.2s' }} />
                        {/* Inner Pulse Ring */}
                        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 animate-pulse" />
                        {/* Inner Spin Ring Counter */}
                        <div className="absolute inset-3 rounded-full border border-transparent border-b-cyan-400 border-l-cyan-400/20 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
                        {/* Center Glow */}
                        <div className="absolute inset-5 rounded-full bg-cyan-500/20 animate-pulse" />
                    </div>
                    
                    <p className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-1">Loading Access Node</p>
                    <p className="text-[var(--t3)] text-[9px] font-medium tracking-[0.1em]">Re-verifying privilege matrix signatures...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-[var(--t1)] p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/[0.08]">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white uppercase tracking-wider">Security Access Control</h1>
                        <p className="text-[11px] text-[var(--t3)] mt-1">
                            Configure enterprise-grade role privileges, access keys, and system execution scopes.
                        </p>
                    </div>

                    <AnimatePresence>
                        {hasChanges && (
                            <motion.button
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onClick={savePermissions}
                                disabled={saving}
                                className="px-4 py-2 bg-[var(--p)] text-black rounded-lg font-bold hover:shadow-[0_0_16px_var(--p-glow)] transition-all flex items-center gap-2 disabled:opacity-50 text-xs"
                            >
                                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                <span>Save Changes</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Telemetry Metrics Board */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Security Access Level</p>
                        <p className="text-white text-sm font-bold">
                            {selectedRole === 'ADMIN' ? 'Level 5 (Unrestricted Administration)' : 
                             ['HR', 'CHECKER', 'MANAGER', 'REGIONAL'].includes(selectedRole) ? 'Level 3 (Departmental Authority)' : 
                             'Level 1 (Basic Portal Authorization)'}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/40 border border-cyan-500/15 text-cyan-400 rounded-full text-[9px] font-bold">
                            ODPC Compliant (DPA 2019)
                        </span>
                    </div>

                    <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Active System Keypairs</p>
                        <p className="text-white text-sm font-bold">
                            {currentRolePermissions.length} / {permissions.length} Modules Authorized
                        </p>
                        <div className="w-full bg-[var(--p-dim)]/50 h-1.5 rounded-full overflow-hidden mt-1">
                            <div 
                                className="bg-[var(--p)] h-1.5 rounded-full transition-all duration-500" 
                                style={{ width: `${permissions.length > 0 ? (currentRolePermissions.length / permissions.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Policy Enforcement Scope</p>
                        <p className="text-white text-sm font-bold">
                            {selectedRole === 'ADMIN' ? 'Global Network Overlay' : 
                             selectedRole === 'REGIONAL' ? 'Multi-Branch Sub-Network' : 
                             'Single Node Sessions'}
                        </p>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            ● Session Cryptography Active
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Role Selection Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-white/[0.08] bg-[var(--p-dim)]/30 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Select Role Matrix</span>
                            </div>

                            <div className="p-3 space-y-1.5 bg-[var(--p-dim)]/10">
                                {AVAILABLE_ROLES.map((role) => {
                                    const permCount = (rolePermissions[role.id] || []).length;
                                    const isSelected = selectedRole === role.id;

                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => {
                                                if (hasChanges && !window.confirm('You have unsaved changes. Continue?')) return;
                                                setSelectedRole(role.id);
                                                setHasChanges(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${isSelected
                                                ? 'bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white shadow-[0_0_15px_rgba(0,229,255,0.04)]'
                                                : 'border border-transparent text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]/10'
                                                }`}
                                        >
                                            <div className="min-w-0 pr-2">
                                                <span className="text-xs font-bold block truncate">{role.name}</span>
                                                <span className="text-[9px] text-[var(--t3)] block truncate mt-0.5">{role.description}</span>
                                            </div>
                                            <div className={`
                                                px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider shrink-0
                                                ${isSelected
                                                    ? 'bg-[var(--p)] text-black'
                                                    : 'bg-[var(--p-dim)]/40 border border-white/[0.08] text-[var(--t3)]'
                                                }
                                            `}>
                                                {permCount} Keys
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-white/[0.08] bg-[var(--p-dim)]/30 grid grid-cols-2 gap-2">
                                <button
                                    onClick={grantAllPermissions}
                                    className="px-3 py-2 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 rounded-lg transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Unlock className="w-3.5 h-3.5" />
                                    Grant All
                                </button>
                                <button
                                    onClick={clearAllPermissions}
                                    className="px-3 py-2 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Lock className="w-3.5 h-3.5" />
                                    Revoke All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Controls Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--card)] rounded-xl border border-white/[0.08] p-4 shadow-sm">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
                                    <input
                                        type="text"
                                        placeholder="Search module parameters..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--p)] transition-all"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs font-bold text-[var(--t3)] focus:outline-none focus:border-[var(--p)] outline-none cursor-pointer"
                                >
                                    <option value="all" className="bg-[var(--card)] text-white">All Category Domains</option>
                                    {PERMISSION_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-[var(--card)] text-white">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <span className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider whitespace-nowrap">Cloning Controller:</span>
                                <select
                                    onChange={(e) => e.target.value && copyPermissionsFrom(e.target.value)}
                                    value=""
                                    className="flex-1 sm:flex-none px-3 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] outline-none cursor-pointer"
                                >
                                    <option value="" className="bg-[var(--card)] text-white">Copy mapping from...</option>
                                    {AVAILABLE_ROLES.filter(r => r.id !== selectedRole).map(role => (
                                        <option key={role.id} value={role.id} className="bg-[var(--card)] text-white">{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Permissions Grid */}
                        <div className="space-y-6">
                            {filteredPermissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-[var(--card)] rounded-xl border border-[var(--p-line)] border-dashed">
                                    <div className="p-3 bg-[var(--p-dim)]/40 rounded-full mb-3 border border-[var(--p-line)]">
                                        <Search className="w-5 h-5 text-[var(--t3)]" />
                                    </div>
                                    <h3 className="text-white font-bold text-xs uppercase tracking-wide">No Parameters Found</h3>
                                    <p className="text-[var(--t3)] text-[10px] mt-1">Try modifying your telemetry filtering parameters.</p>
                                </div>
                            ) : (
                                PERMISSION_CATEGORIES.filter(cat =>
                                    selectedCategory === 'all' || selectedCategory === cat.id
                                ).map(category => {
                                    const categoryPerms = getPermissionsByCategory(category.id);
                                    if (categoryPerms.length === 0) return null;

                                    return (
                                        <div key={category.id} className="bg-[var(--card)] rounded-xl border border-white/[0.08] overflow-hidden shadow-sm">
                                            <div className="px-6 py-4 bg-[var(--p-dim)]/30 border-b border-white/[0.08] flex items-center justify-between">
                                                <h3 className="font-bold text-xs uppercase tracking-wider text-white">{category.name} Module</h3>
                                                <span className="text-[10px] font-bold text-[var(--p)] bg-cyan-950/40 border border-cyan-500/15 px-3 py-1 rounded-full">
                                                    {categoryPerms.filter(p => currentRolePermissions.includes(p.module_id)).length} of {categoryPerms.length} Active Key{categoryPerms.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {categoryPerms.map(permission => {
                                                    const hasPermission = currentRolePermissions.includes(permission.module_id);

                                                    return (
                                                        <div
                                                            key={permission.id}
                                                            onClick={() => togglePermission(permission.module_id)}
                                                            className={`
                                                                cursor-pointer relative p-4 rounded-xl border text-left transition-all duration-200 group
                                                                ${hasPermission
                                                                    ? 'bg-[var(--p-dim)]/20 border-cyan-500/25 shadow-[0_0_12px_rgba(0,229,255,0.03)]'
                                                                    : 'bg-[var(--p-dim)]/5 border border-white/[0.05] hover:border-white/10 hover:bg-[var(--p-dim)]/10'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`mt-0.5 transition-colors shrink-0 ${hasPermission ? 'text-[var(--p)]' : 'text-[var(--t3)]'}`}>
                                                                    {hasPermission ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4.5 h-4.5" />}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-xs font-bold mb-1 transition-colors ${hasPermission ? 'text-white' : 'text-[var(--t3)]'}`}>
                                                                        {permission.module_name}
                                                                    </p>
                                                                    <p className="text-[10px] text-[var(--t3)] leading-relaxed">
                                                                        {permission.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
