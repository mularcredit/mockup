import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Save,
    RefreshCw,
    Users,
    Lock,
    Unlock,
    Search,
    LayoutDashboard,
    Building2,
    Wallet,
    Settings,
    Briefcase,
    UserCog,
    CheckSquare,
    Square
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

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

const CATEGORY_ICONS: Record<string, any> = {
    'overview': LayoutDashboard,
    'workspace': Building2,
    'people-hr': Users,
    'finance': Wallet,
    'system': Settings,
    'default': Briefcase
};

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

    const getCategoryIcon = (categoryId: string) => {
        const Icon = CATEGORY_ICONS[categoryId] || CATEGORY_ICONS['default'];
        return <Icon className="w-5 h-5 text-gray-500" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin mb-4" />
                    <p className="text-[var(--t3)] font-bold text-sm uppercase tracking-widest">Loading Telemetry Control...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-[var(--t1)] p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-[var(--gold)]" />
                            <h1 className="text-2xl font-bold tracking-tight text-[var(--t1)] uppercase tracking-wider">Security Access Control</h1>
                        </div>
                        <p className="text-xs text-[var(--t3)]">
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
                                className="px-5 py-2.5 bg-[var(--gold)] text-[var(--bg)] rounded-xl font-bold hover:shadow-[0_0_16px_var(--gold-glow)] transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Save Changes</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Role Selection Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="glass-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-[var(--p-line)] bg-[var(--p-dim)] flex items-center gap-2">
                                <UserCog className="w-4 h-4 text-[var(--gold)]" />
                                <span className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Select Role Matrix</span>
                            </div>

                            <div className="p-3 space-y-1 bg-[var(--p-dim)]/50">
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
                                            className={`w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group ${isSelected
                                                ? 'bg-[rgba(200,168,75,0.08)] border border-[rgba(200,168,75,0.2)] text-[var(--t1)]'
                                                : 'border border-transparent text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--glass-h)]'
                                                }`}
                                        >
                                            <div className="min-w-0 pr-2">
                                                <span className="text-xs font-bold block truncate">{role.name}</span>
                                                <span className="text-[9px] text-[var(--t4)] block truncate mt-0.5">{role.description}</span>
                                            </div>
                                            <div className={`
                                                px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider shrink-0
                                                ${isSelected
                                                    ? 'bg-[var(--gold)] text-[var(--bg)]'
                                                    : 'bg-[var(--bg)] border border-[var(--p-line)] text-[var(--t3)] group-hover:text-[var(--t1)]'
                                                }
                                            `}>
                                                {permCount} Keys
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-[var(--p-line)] bg-[var(--p-dim)] grid grid-cols-2 gap-2">
                                <button
                                    onClick={grantAllPermissions}
                                    className="px-3 py-2.5 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 rounded-lg transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Unlock className="w-3.5 h-3.5" />
                                    Grant All
                                </button>
                                <button
                                    onClick={clearAllPermissions}
                                    className="px-3 py-2.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all flex items-center justify-center gap-1.5"
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
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-card p-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t4)]" />
                                    <input
                                        type="text"
                                        placeholder="Search module parameters..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-[var(--bg)] border border-[var(--p-line)] rounded-xl text-xs text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-[var(--gold)] transition-all"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 bg-[var(--bg)] border border-[var(--p-line)] rounded-xl text-xs font-bold text-[var(--t3)] focus:outline-none focus:border-[var(--gold)] outline-none"
                                >
                                    <option value="all">All Category Domains</option>
                                    {PERMISSION_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>
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
                                    className="flex-1 sm:flex-none px-3 py-2 bg-[var(--bg)] border border-[var(--p-line)] rounded-xl text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--gold)] outline-none"
                                >
                                    <option value="">Copy mapping from...</option>
                                    {AVAILABLE_ROLES.filter(r => r.id !== selectedRole).map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Permissions Grid */}
                        <div className="space-y-6">
                            {filteredPermissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 glass-card border-dashed">
                                    <div className="p-3 bg-[var(--p-dim)] rounded-full mb-3 border border-[var(--p-line)]">
                                        <Search className="w-6 h-6 text-[var(--t4)]" />
                                    </div>
                                    <h3 className="text-[var(--t1)] font-bold text-sm uppercase tracking-wide">No Parameters Found</h3>
                                    <p className="text-[var(--t3)] text-xs mt-1">Try modifying your telemetry filtering parameters.</p>
                                </div>
                            ) : (
                                PERMISSION_CATEGORIES.filter(cat =>
                                    selectedCategory === 'all' || selectedCategory === cat.id
                                ).map(category => {
                                    const categoryPerms = getPermissionsByCategory(category.id);
                                    if (categoryPerms.length === 0) return null;

                                    return (
                                        <div key={category.id} className="glass-card overflow-hidden">
                                            <div className="px-6 py-4 bg-[var(--p-dim)] border-b border-[var(--p-line)] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getCategoryIcon(category.id)}
                                                    <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--t1)]">{category.name} Module</h3>
                                                </div>
                                                <span className="text-[10px] font-bold text-[var(--gold)] bg-[rgba(200,168,75,0.06)] border border-[rgba(200,168,75,0.15)] px-3 py-1 rounded-full">
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
                                                                    ? 'bg-[rgba(200,168,75,0.04)] border-[rgba(200,168,75,0.25)] shadow-[0_0_12px_rgba(200,168,75,0.03)]'
                                                                    : 'bg-[var(--card)] border-[var(--p-line)] hover:border-[var(--t4)] hover:bg-[var(--glass-h)]'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`mt-0.5 transition-colors shrink-0 ${hasPermission ? 'text-[var(--gold)]' : 'text-[var(--t4)] group-hover:text-[var(--t3)]'}`}>
                                                                    {hasPermission ? <CheckSquare className="w-4.5 h-4.5" /> : <Square className="w-4.5 h-4.5" />}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-xs font-bold mb-1 transition-colors ${hasPermission ? 'text-[var(--t1)]' : 'text-[var(--t3)]'}`}>
                                                                        {permission.module_name}
                                                                    </p>
                                                                    <p className="text-[10px] text-[var(--t4)] leading-relaxed">
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
