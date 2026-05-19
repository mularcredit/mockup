import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  UserPlus,
  Shield,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  MoreVertical,
  Key,
  Mail,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Lock
} from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserAvatar from '../UI/UserAvatar';

// Role definitions
const ROLES = {
  ADMIN: {
    label: 'Admin',
    description: 'Full access to all features and settings across all locations',
    requiresLocation: false
  },
  REGIONAL: {
    label: 'Regional Manager',
    description: 'Can manage users across multiple locations or regions',
    requiresLocation: true
  },
  MANAGER: {
    label: 'Manager',
    description: 'Can manage users and content for specific locations',
    requiresLocation: true
  },
  OPERATIONS: {
    label: 'Operations',
    description: 'Can manage operational tasks for specific locations',
    requiresLocation: true
  },
  STAFF: {
    label: 'Staff',
    description: 'Standard access with limited permissions for specific locations',
    requiresLocation: true
  },
  HR: {
    label: 'HR',
    description: 'Read-only access to location-specific features',
    requiresLocation: true
  },
  CHECKER: {
    label: 'Checker',
    description: 'Read-only access to location-specific features',
    requiresLocation: true
  }
};

// Valid roles for Mular Credit emails
const MULAR_CREDIT_ROLES = ['MANAGER', 'REGIONAL', 'OPERATIONS'];

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
      status === 'ACTIVE' 
        ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' 
        : status === 'SUSPENDED' 
          ? 'bg-amber-500/10 border-amber-500/15 text-amber-400' 
          : 'bg-red-500/10 border-red-500/15 text-red-400'
    }`}>
      <span className={`w-1 h-1 rounded-full ${
        status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : status === 'SUSPENDED' ? 'bg-amber-400' : 'bg-red-400'
      }`} />
      {status === 'ACTIVE' ? 'Active' : status === 'SUSPENDED' ? 'Suspended' : 'Deactivated'}
    </span>
  );
};

const RoleBadge = ({ role }: { role: keyof typeof ROLES }) => {
  const roleInfo = ROLES[role] || ROLES.STAFF;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/40 border border-cyan-500/15 text-cyan-400 rounded-full text-[10px] font-bold">
      {roleInfo.label}
    </span>
  );
};

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
  avatarFamily
}: {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onResetPassword: (user: any) => void;
  avatarFamily: 'notionists' | 'open-peeps' | 'rings' | 'shapes' | 'glass' | 'initials' | 'thumbs' | 'lorelei' | 'bottts';
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const isMularCreditEmail = user.email.toLowerCase().endsWith('@mularcredit.com');
  const needsRoleUpdate = isMularCreditEmail && !MULAR_CREDIT_ROLES.includes(user.role);

  return (
    <div className={`
      relative bg-[var(--card)] border rounded-xl p-5 shadow-sm transition-all duration-300 hover:border-cyan-500/30 group
      ${needsRoleUpdate ? 'border-amber-500/30 bg-amber-950/5' : 'border-white/[0.08] hover:shadow-[0_0_15px_rgba(0,229,255,0.02)]'}
    `}>
      {needsRoleUpdate && (
        <div className="flex items-center gap-1.5 mb-3 p-2 bg-amber-500/10 border border-amber-500/15 text-amber-400 rounded-lg text-[10px] font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Needs Role Update</span>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3.5 min-w-0">
          <UserAvatar 
            name={user.email} 
            size={40} 
            showStatus={user.account_status === 'ACTIVE'} 
            family={avatarFamily}
          />
          <div className="min-w-0">
            <h3 className="font-bold text-white text-xs truncate" title={user.email}>
              {user.email}
            </h3>
            <p className="text-[10px] text-[var(--t3)] truncate mt-0.5">
              {user.last_sign_in_at ? `Last active: ${new Date(user.last_sign_in_at).toLocaleDateString()}` : 'Never active'}
            </p>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-[var(--t3)] hover:text-white p-1 rounded-lg hover:bg-white/[0.04] transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-xl border border-white/[0.08] shadow-lg z-20 overflow-hidden py-1">
                <button
                  onClick={() => {
                    onEdit(user);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--t3)] hover:text-white hover:bg-white/[0.04] w-full text-left"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit User
                </button>
                <button
                  onClick={() => {
                    onResetPassword(user);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-cyan-400 hover:bg-cyan-500/10 w-full text-left"
                >
                  <Key className="w-3.5 h-3.5" />
                  Reset Password
                </button>
                <button
                  onClick={() => {
                    onDelete(user);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 w-full text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete User
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1">Status</p>
          <StatusBadge status={user.account_status} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1">Role</p>
          <RoleBadge role={user.role || 'STAFF'} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.08] flex justify-between items-center text-[10px] text-[var(--t3)]">
        <span>Created Parameter</span>
        <span className="font-bold text-white">
          {new Date(user.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void
}) => {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[var(--p-dim)]/20">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-white/[0.08] rounded-lg text-xs font-bold text-[var(--t3)] hover:text-white bg-[var(--card)] disabled:opacity-5 transition-all"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="ml-3 px-4 py-2 border border-white/[0.08] rounded-lg text-xs font-bold text-[var(--t3)] hover:text-white bg-[var(--card)] disabled:opacity-5 transition-all"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-[var(--t3)]">
            Showing page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-lg overflow-hidden shadow-sm border border-white/[0.08]" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 text-[var(--t3)] hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-all border-r border-white/[0.08]"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-3 py-2 text-xs font-bold transition-all border-r border-white/[0.08] ${
                  currentPage === page
                    ? 'bg-[var(--p)] text-black'
                    : 'text-[var(--t3)] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 text-[var(--t3)] hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-all"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const RoleToggle = ({
  role,
  active,
  onChange
}: {
  role: keyof typeof ROLES;
  active: boolean;
  onChange: (role: keyof typeof ROLES, active: boolean) => void
}) => {
  const roleInfo = ROLES[role];

  return (
    <div className="flex items-center justify-between p-4 border border-white/[0.08] rounded-xl bg-[var(--p-dim)]/5 hover:border-cyan-500/20 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/10 text-cyan-400">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-white text-xs">{roleInfo.label} Parameters</h4>
          <p className="text-[10px] text-[var(--t3)] leading-relaxed mt-0.5">{roleInfo.description}</p>
        </div>
      </div>

      <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
        <input
          type="checkbox"
          checked={active}
          onChange={() => onChange(role, !active)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
      </label>
    </div>
  );
};

interface UserData {
  email: string;
  role: string;
  password?: string;
  confirmPassword?: string;
  location: string | null;
  account_status: string;
}

const UserEditModal = ({
  user,
  onClose,
  onSave
}: {
  user: UserData | null;
  onClose: () => void;
  onSave: (user: UserData) => void
}) => {
  const [editedUser, setEditedUser] = useState<UserData>(user ? {
    ...user,
    password: '',
    confirmPassword: ''
  } : {
    email: '',
    role: 'STAFF',
    password: '',
    confirmPassword: '',
    location: null,
    account_status: 'ACTIVE'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user, password: '', confirmPassword: '' });
    }
  }, [user]);

  // Auto-detect Mular Credit domain and set role to MANAGER by default
  useEffect(() => {
    if (editedUser.email && editedUser.email.toLowerCase().endsWith('@mularcredit.com')) {
      // Only auto-set if not already a valid Mular Credit role
      if (!MULAR_CREDIT_ROLES.includes(editedUser.role)) {
        setEditedUser(prev => ({ ...prev, role: 'MANAGER' }));
      }
    }
  }, [editedUser.email]);

  const handleRoleChange = (role: keyof typeof ROLES) => {
    setEditedUser({ ...editedUser, role });
  };

  const validatePassword = () => {
    if (!user && !editedUser.password) {
      setPasswordError('Password is required');
      return false;
    }

    if (editedUser.password && editedUser.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }

    if (editedUser.password !== editedUser.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSave = () => {
    if (!validatePassword()) return;

    // Don't include password fields if not creating a new user
    const userToSave = user ? {
      ...editedUser,
      password: undefined,
      confirmPassword: undefined
    } : editedUser;

    onSave(userToSave);
  };

  const isMularCreditEmail = editedUser.email.toLowerCase().endsWith('@mularcredit.com');
  const currentRoleIsValidForMular = isMularCreditEmail && MULAR_CREDIT_ROLES.includes(editedUser.role);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-white/[0.08] shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-white/[0.08] bg-white/[0.01]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {user ? 'Modify User Profile' : 'Provision User Session'}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-white p-1 rounded-lg hover:bg-white/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">User Identity (Email Address)</label>
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full bg-[var(--p-dim)]/40 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              placeholder="user@example.com"
              disabled={!!user}
            />
            {isMularCreditEmail && (
              <p className="text-[10px] text-cyan-400 mt-2 flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                Mular Credit key domain identified. Enforcing regional scopes.
              </p>
            )}
          </div>

          {!user && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Access Cryptokey (Password)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editedUser.password}
                    onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                    className="w-full bg-[var(--p-dim)]/40 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-cyan-500"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--t3)] hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Verify Cryptokey</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={editedUser.confirmPassword}
                  onChange={(e) => setEditedUser({ ...editedUser, confirmPassword: e.target.value })}
                  className="w-full bg-[var(--p-dim)]/40 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••"
                />
              </div>

              {passwordError && (
                <p className="text-[10px] text-red-400 font-bold">{passwordError}</p>
              )}
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Assign Privilege Matrix</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {(Object.keys(ROLES) as Array<keyof typeof ROLES>).map((role) => {
                const roleInfo = ROLES[role];
                const isMularCreditRole = MULAR_CREDIT_ROLES.includes(role);
                const isAllowedForMular = !isMularCreditEmail || isMularCreditRole;
                const isSelected = editedUser.role === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    disabled={!isAllowedForMular}
                    className={`p-2 border rounded-lg text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-400'
                        : 'border-white/[0.08] bg-white/[0.01] text-[var(--t3)] hover:text-white hover:bg-white/[0.04]'
                    } ${!isAllowedForMular ? 'opacity-30 cursor-not-allowed' : ''}`}
                    title={!isAllowedForMular ? 'Mular Credit keys must be Manager, Regional Manager or Operations' : ''}
                  >
                    {roleInfo.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Session Control Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEditedUser({ ...editedUser, account_status: 'ACTIVE' })}
                className={`p-2 border rounded-lg text-[10px] font-bold transition-all ${editedUser.account_status === 'ACTIVE' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : 'border-white/[0.08] text-[var(--t3)] hover:text-white bg-white/[0.01]'}`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setEditedUser({ ...editedUser, account_status: 'SUSPENDED' })}
                className={`p-2 border rounded-lg text-[10px] font-bold transition-all ${editedUser.account_status === 'SUSPENDED' ? 'border-amber-500 bg-amber-950/40 text-amber-400' : 'border-white/[0.08] text-[var(--t3)] hover:text-white bg-white/[0.01]'}`}
              >
                Suspended
              </button>
              <button
                type="button"
                onClick={() => setEditedUser({ ...editedUser, account_status: 'DEACTIVATED' })}
                className={`p-2 border rounded-lg text-[10px] font-bold transition-all ${editedUser.account_status === 'DEACTIVATED' ? 'border-red-500 bg-red-950/40 text-red-400' : 'border-white/[0.08] text-[var(--t3)] hover:text-white bg-white/[0.01]'}`}
              >
                Revoked
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-white/[0.08] bg-white/[0.01] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.04] text-[var(--t3)] hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isMularCreditEmail && !currentRoleIsValidForMular}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              isMularCreditEmail && !currentRoleIsValidForMular
                ? 'bg-white/[0.05] text-white/30 cursor-not-allowed border border-white/[0.05]'
                : 'bg-[var(--p)] text-black hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]'
            }`}
          >
            <Check className="w-4 h-4" />
            {user ? 'Save Changes' : 'Initialize Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordModal = ({
  user,
  onClose,
  onReset
}: {
  user: any | null;
  onClose: () => void;
  onReset: (email: string) => void
}) => {
  const [resetMethod, setResetMethod] = useState<'email' | 'manual'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = () => {
    if (resetMethod === 'manual') {
      if (!newPassword) {
        setPasswordError('Password is required');
        return false;
      }

      if (newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
    }

    setPasswordError('');
    return true;
  };

  const handleReset = () => {
    if (!validatePassword()) return;

    if (resetMethod === 'email') {
      onReset(user.email);
    } else {
      onReset(newPassword);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-white/[0.08] shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-white/[0.08] bg-white/[0.01]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Reset Password Matrix
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-white p-1 rounded-lg hover:bg-white/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-cyan-500/10 border border-cyan-500/15 rounded-xl p-3.5 flex gap-3 text-cyan-400">
            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs text-white">Cryptokey Recovery</h5>
              <p className="text-[10px] leading-relaxed mt-0.5">
                Configure credential restoration parameters for <span className="font-bold text-cyan-400">{user?.email}</span>.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3.5 p-3.5 border border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.02] transition-all">
              <input
                type="radio"
                name="resetMethod"
                value="email"
                checked={resetMethod === 'email'}
                onChange={() => setResetMethod('email')}
                className="text-cyan-500 focus:ring-cyan-500 bg-black border-white/20"
              />
              <div>
                <p className="text-xs font-bold text-white">Broadcast Link to Email</p>
                <p className="text-[10px] text-[var(--t3)] mt-0.5">
                  Sends secure recovery parameters directly to the user's primary inbox
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-3.5 border border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.02] transition-all">
              <input
                type="radio"
                name="resetMethod"
                value="manual"
                checked={resetMethod === 'manual'}
                onChange={() => setResetMethod('manual')}
                className="text-cyan-500 focus:ring-cyan-500 bg-black border-white/20"
              />
              <div>
                <p className="text-xs font-bold text-white">Overwrite Access Key Manually</p>
                <p className="text-[10px] text-[var(--t3)] mt-0.5">
                  Directly sets a new access code on the master database immediately
                </p>
              </div>
            </label>
          </div>

          {resetMethod === 'manual' && (
            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[var(--p-dim)]/40 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-cyan-500"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--t3)] hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[var(--p-dim)]/40 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••"
                />
              </div>

              {passwordError && (
                <p className="text-[10px] text-red-400 font-bold">{passwordError}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/[0.08] bg-white/[0.01] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.04] text-[var(--t3)] hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            <Key className="w-4 h-4" />
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

const BulkUpdateModal = ({
  usersToUpdate,
  onClose,
  onConfirm,
  avatarFamily
}: {
  usersToUpdate: any[];
  onClose: () => void;
  onConfirm: (role: 'MANAGER' | 'REGIONAL') => void;
  avatarFamily: 'notionists' | 'open-peeps' | 'rings' | 'shapes' | 'glass' | 'initials' | 'thumbs' | 'lorelei' | 'bottts';
}) => {
  const [selectedRole, setSelectedRole] = useState<'MANAGER' | 'REGIONAL'>('MANAGER');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-white/[0.08] shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-white/[0.08] bg-white/[0.01]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Bulk Upgrades Controller
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--t3)] hover:text-white p-1 rounded-lg hover:bg-white/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/15 rounded-xl p-3.5 flex gap-3 text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h5 className="font-bold text-xs text-white">Privilege Overwrites Pending</h5>
              <p className="text-[10px] leading-relaxed mt-0.5">
                Upgrading <span className="font-bold text-amber-400">{usersToUpdate.length} pending user sessions</span> identified with @mularcredit.com domains to appropriate regional key levels.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2.5">Select Elevation privilege Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3.5 p-4 border border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.02] transition-all bg-[var(--p-dim)]/5">
                <input
                  type="radio"
                  name="bulkRole"
                  value="MANAGER"
                  checked={selectedRole === 'MANAGER'}
                  onChange={() => setSelectedRole('MANAGER')}
                  className="text-cyan-500 focus:ring-cyan-500 bg-black border-white/20"
                />
                <div>
                  <RoleBadge role="MANAGER" />
                  <p className="text-xs font-bold text-white mt-1.5">Branch Manager</p>
                  <p className="text-[10px] text-[var(--t3)]">Single branch authorization parameters</p>
                </div>
              </label>

              <label className="flex items-center gap-3.5 p-4 border border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.02] transition-all bg-[var(--p-dim)]/5">
                <input
                  type="radio"
                  name="bulkRole"
                  value="REGIONAL"
                  checked={selectedRole === 'REGIONAL'}
                  onChange={() => setSelectedRole('REGIONAL')}
                  className="text-cyan-500 focus:ring-cyan-500 bg-black border-white/20"
                />
                <div>
                  <RoleBadge role="REGIONAL" />
                  <p className="text-xs font-bold text-white mt-1.5">Regional Administrator</p>
                  <p className="text-[10px] text-[var(--t3)]">Multi-branch and operational overlays</p>
                </div>
              </label>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto border border-white/[0.08] rounded-xl bg-white/[0.01] p-2 space-y-1.5">
            {usersToUpdate.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-3">
                  <UserAvatar 
                    name={user.email} 
                    size={32} 
                    showStatus={user.account_status === 'ACTIVE'} 
                    family={avatarFamily}
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{user.email}</p>
                    <p className="text-[10px] text-[var(--t3)]">Currently: {user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--t3)]">→</span>
                  <RoleBadge role={selectedRole} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-white/[0.08] bg-white/[0.01] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.04] text-[var(--t3)] hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedRole)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            <RefreshCw className="w-4 h-4" />
            Migrate {usersToUpdate.length} Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserRolesSettings() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [avatarFamily, setAvatarFamily] = useState<'notionists' | 'open-peeps' | 'rings' | 'shapes' | 'glass' | 'initials' | 'thumbs' | 'lorelei' | 'bottts'>('notionists');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [resettingPasswordUser, setResettingPasswordUser] = useState<any | null>(null);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);
  const navigate = useNavigate();

  // MFA Settings
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaFetched, setMfaFetched] = useState(false);

  // Fetch MFA setting from DB
  useEffect(() => {
    const fetchMfaSetting = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data, error } = await supabase
          .from('system_settings')
          .select('mfa_enabled')
          .eq('id', 1)
          .single();
        if (!error && data) {
          setMfaEnabled(data.mfa_enabled ?? false);
        }
      } catch (e) {
        console.error('Failed to fetch MFA setting:', e);
      } finally {
        setMfaFetched(true);
      }
    };
    fetchMfaSetting();
  }, []);

  const handleMfaToggle = async () => {
    const newValue = !mfaEnabled;
    setMfaLoading(true);
    try {
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase
        .from('system_settings')
        .update({ mfa_enabled: newValue })
        .eq('id', 1);
      if (error) throw error;
      setMfaEnabled(newValue);
      toast.success(`MFA verification ${newValue ? 'enabled' : 'disabled'} successfully.`);
    } catch (e: any) {
      toast.error('Failed to update MFA setting: ' + (e.message || 'Unknown error'));
    } finally {
      setMfaLoading(false);
    }
  };

  // Get users that need role updates
  const usersNeedingUpdate = users.filter(user =>
    user.email.toLowerCase().endsWith('@mularcredit.com') && !MULAR_CREDIT_ROLES.includes(user.role)
  );

  // Early return if no admin client
  if (!supabaseAdmin) {
    return (
      <div className="p-8 bg-black min-h-screen flex items-center justify-center">
        <div className="bg-[var(--card)] border border-white/[0.08] p-8 max-w-md text-center rounded-2xl">
          <Shield className="w-10 h-10 text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Admin Cryptokey Required</h2>
          <p className="text-[var(--t3)] text-xs leading-relaxed mb-4">
            Security parameters require master service scopes. Check environment telemetry settings.
          </p>
          <p className="text-[10px] text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/40 p-2 rounded-lg">
            Ensure VITE_SUPABASE_SERVICE_ROLE_KEY is active.
          </p>
        </div>
      </div>
    );
  }

  // Fetch users from Supabase - FIXED to get all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let allUsers: any[] = [];
        let page = 1;
        let hasMore = true;

        // Fetch all users with pagination
        while (hasMore) {
          const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
            page: page,
            perPage: 100 // Maximum per page
          });

          if (error) throw error;

          if (users.length === 0) {
            hasMore = false;
          } else {
            allUsers = [...allUsers, ...users];
            page++;
          }
        }

        const formattedUsers = allUsers.map((user: any) => ({
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'STAFF',
          account_status: user.user_metadata?.account_status || (!user.banned_at && user.email_confirmed_at !== null ? 'ACTIVE' : 'DEACTIVATED'),
          last_sign_in_at: user.last_sign_in_at,
          created_at: user.created_at,
          location: user.user_metadata?.location || null,
          user_metadata: user.user_metadata
        }));

        setUsers(formattedUsers);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        toast.error(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || user.account_status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

      if (error) throw error;

      setUsers(users.filter(u => u.id !== user.id));
      toast.success(`User ${user.email} deleted successfully`);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (user: any, passwordOrEmail: string) => {
    try {
      setLoading(true);

      if (typeof passwordOrEmail === 'string' && passwordOrEmail.includes('@')) {
        const { error } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: passwordOrEmail,
        });

        if (error) throw error;

        toast.success(`Password reset email sent to ${user.email}`);
      } else {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          {
            password: passwordOrEmail
          }
        );

        if (error) throw error;

        toast.success(`Password updated successfully for ${user.email}`);
      }

      setResettingPasswordUser(null);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      // Auto-detect Mular Credit domain and enforce valid role
      let finalRole = userData.role;
      if (userData.email.toLowerCase().endsWith('@mularcredit.com')) {
        if (!MULAR_CREDIT_ROLES.includes(userData.role)) {
          finalRole = 'MANAGER'; // Default fallback
        }
      }

      const finalUserData = {
        ...userData,
        role: finalRole
      };

      if (editingUser) {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          editingUser.id,
          {
            email: finalUserData.email,
            user_metadata: {
              ...editingUser.user_metadata,
              role: finalUserData.role,
              account_status: finalUserData.account_status,
              ...(ROLES[finalUserData.role as keyof typeof ROLES]?.requiresLocation ? {
                location: finalUserData.location || null
              } : { location: null })
            },
            ban_duration: finalUserData.account_status === 'ACTIVE' ? 'none' : (finalUserData.account_status === 'SUSPENDED' ? '876000h' : 'permanent')
          }
        );

        if (error) throw error;

        setUsers(users.map(u => u.id === editingUser.id ? {
          ...u,
          email: finalUserData.email,
          role: finalUserData.role,
          account_status: finalUserData.account_status,
          location: finalUserData.location || null
        } : u));
        setEditingUser(null);
        toast.success(`User ${finalUserData.email} updated successfully`);
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: finalUserData.email,
          password: finalUserData.password,
          email_confirm: true, // Mark email as confirmed
          user_metadata: {
            role: finalUserData.role,
            account_status: finalUserData.account_status,
            ...(ROLES[finalUserData.role as keyof typeof ROLES]?.requiresLocation ? {
              location: finalUserData.location || null
            } : {})
          }
        });

        if (error) throw error;

        setUsers([...users, {
          id: data.user.id,
          email: finalUserData.email,
          role: finalUserData.role,
          account_status: finalUserData.account_status || 'ACTIVE',
          last_sign_in_at: null,
          created_at: new Date().toISOString(),
          location: finalUserData.location || null
        }]);
        setShowAddUserModal(false);
        toast.success(`User ${finalUserData.email} created successfully`);
      }
    } catch (err: any) {
      console.error('Error saving user:', err);
      toast.error(err.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    }
  };

  const handleBulkUpdate = async (selectedRole: 'MANAGER' | 'REGIONAL') => {
    try {
      setLoading(true);

      const updatePromises = usersNeedingUpdate.map(async (user) => {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          {
            user_metadata: {
              ...user.user_metadata,
              role: selectedRole
            }
          }
        );

        if (error) throw error;
        return user.id;
      });

      await Promise.all(updatePromises);

      setUsers(users.map(user =>
        user.email.toLowerCase().endsWith('@mularcredit.com') && !MULAR_CREDIT_ROLES.includes(user.role)
          ? { ...user, role: selectedRole }
          : user
      ));

      setShowBulkUpdateModal(false);
      toast.success(`Successfully updated ${usersNeedingUpdate.length} users to ${selectedRole === 'MANAGER' ? 'Manager' : 'Regional Manager'} role`);
    } catch (err: any) {
      console.error('Error in bulk update:', err);
      toast.error(err.message || 'Failed to update users in bulk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  return (
    <div className="min-h-screen text-[var(--t1)] p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/[0.08]">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase tracking-wider">User Sessions & Security Settings</h1>
            <p className="text-[11px] text-[var(--t3)] mt-1">
              Configure master multi-branch privilege levels, security enforcement scopes, and provision account credentials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {usersNeedingUpdate.length > 0 && (
              <button
                onClick={() => setShowBulkUpdateModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Resolve {usersNeedingUpdate.length} Conflicts
              </button>
            )}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--p)] text-black rounded-lg text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Provision User
            </button>
          </div>
        </div>

        {/* MFA Security Settings Card */}
        <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.08] bg-[var(--p-dim)]/30 flex items-center gap-3">
            <span className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider">Global Session Verification Control</span>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 p-2 rounded-lg transition-all shrink-0 ${mfaEnabled ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-400' : 'bg-white/[0.02] border border-white/[0.05] text-[var(--t3)]'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Two-Factor Authentication Enforcement (MFA)</p>
                  <p className="text-[10px] text-[var(--t3)] leading-relaxed mt-1 max-w-2xl">
                    When active, all Admin and Checker roles are strictly prompted to verify their sessions using a secure SMS dynamic passcode during portal access checkpoints. 
                  </p>
                  <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${mfaEnabled
                    ? 'bg-cyan-950/40 border-cyan-500/10 text-cyan-400'
                    : 'bg-white/[0.02] border-white/[0.05] text-[var(--t3)]'
                    }`}>
                    <span className={`w-1 h-1 rounded-full ${mfaEnabled ? 'bg-cyan-400 animate-pulse' : 'bg-white/30'}`} />
                    {mfaFetched ? (mfaEnabled ? 'MFA Security Overlay Active' : 'MFA Verification Bypassed') : 'Loading telemetric parameters...'}
                  </div>
                </div>
              </div>
              <button
                id="mfa-toggle-btn"
                onClick={handleMfaToggle}
                disabled={mfaLoading || !mfaFetched}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${mfaEnabled ? 'bg-cyan-500' : 'bg-white/[0.08]'}`}
                role="switch"
                aria-checked={mfaEnabled}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${mfaEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Update Warning Alert */}
        {usersNeedingUpdate.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/15 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <p className="text-[11px] text-amber-200">
                <strong>Domain policy warning:</strong> {usersNeedingUpdate.length} user session(s) mapped to @mularcredit.com domains are operating outside approved branch administrative keys. Elevate privileges immediately.
              </p>
            </div>
            <button
              onClick={() => setShowBulkUpdateModal(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-[10px] font-bold transition-all shrink-0"
            >
              Resolve Matrix
            </button>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Search User Registry</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
                <input
                  type="text"
                  placeholder="Query user email parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Filter Category Privilege</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs font-bold text-[var(--t3)] focus:outline-none focus:border-cyan-500 cursor-pointer outline-none appearance-none"
                >
                  <option value="ALL" className="bg-[var(--card)] text-white">All Active Matrices</option>
                  {(Object.keys(ROLES) as Array<keyof typeof ROLES>).map((role) => (
                    <option key={role} value={role} className="bg-[var(--card)] text-white">{ROLES[role].label} Privilege</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Filter Session Status</label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs font-bold text-[var(--t3)] focus:outline-none focus:border-cyan-500 cursor-pointer outline-none appearance-none"
                >
                  <option value="ALL" className="bg-[var(--card)] text-white">All Session States</option>
                  <option value="ACTIVE" className="bg-[var(--card)] text-white">Active Sessions</option>
                  <option value="SUSPENDED" className="bg-[var(--card)] text-white">Suspended</option>
                  <option value="DEACTIVATED" className="bg-[var(--card)] text-white">Revoked</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Avatar Style Family</label>
              <div className="relative">
                <select
                  value={avatarFamily}
                  onChange={(e) => setAvatarFamily(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[var(--p-dim)]/40 border border-white/[0.08] rounded-lg text-xs font-bold text-[var(--t3)] focus:outline-none focus:border-cyan-500 cursor-pointer outline-none appearance-none"
                >
                  <option value="notionists" className="bg-[var(--card)] text-white">Notionists (Minimalist)</option>
                  <option value="open-peeps" className="bg-[var(--card)] text-white">Open Peeps (Hand-Drawn)</option>
                  <option value="rings" className="bg-[var(--card)] text-white">Concentric Rings (Glowing NOC)</option>
                  <option value="shapes" className="bg-[var(--card)] text-white">Abstract Shapes (Geometric)</option>
                  <option value="glass" className="bg-[var(--card)] text-white">Glass Sphere (Glassmorphic)</option>
                  <option value="initials" className="bg-[var(--card)] text-white">Initials (Monograms)</option>
                  <option value="thumbs" className="bg-[var(--card)] text-white">Thumbs (Dynamic Badges)</option>
                  <option value="lorelei" className="bg-[var(--card)] text-white">Lorelei (Curated Illustrations)</option>
                  <option value="bottts" className="bg-[var(--card)] text-white">Bottts (High-Tech Robots)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/20 transition-all duration-300">
            <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Total User Profiles</p>
            <p className="text-xl font-bold text-white">{users.length}</p>
          </div>

          <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/20 transition-all duration-300">
            <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Active Session Parameters</p>
            <p className="text-xl font-bold text-white">{users.filter(u => u.account_status === 'ACTIVE').length}</p>
          </div>

          <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/20 transition-all duration-300">
            <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Mular Credit Overlays</p>
            <p className="text-xl font-bold text-white">{users.filter(u => u.email.toLowerCase().endsWith('@mularcredit.com')).length}</p>
          </div>

          <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-5 space-y-1.5 hover:border-cyan-500/20 transition-all duration-300">
            <p className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-wider">Elevation Warnings</p>
            <p className="text-xl font-bold text-amber-400">{usersNeedingUpdate.length}</p>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-24 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
            {/* Ambient Background Glow */}
            <div className="absolute w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px] -z-10 animate-pulse" />
            
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
            
            <p className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-1">Loading Telemetry</p>
            <p className="text-[var(--t3)] text-[9px] font-medium tracking-[0.1em]">Initializing secure registry handshake...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={setEditingUser}
                    onDelete={handleDeleteUser}
                    onResetPassword={setResettingPasswordUser}
                    avatarFamily={avatarFamily}
                  />
                ))
              ) : (
                <div className="col-span-full bg-[var(--card)] rounded-xl border border-white/[0.08] p-16 text-center">
                  <p className="text-[var(--t3)] text-xs">No active user registry entries matched the filter criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] overflow-hidden shadow-sm">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Role Permissions Section */}
        <div className="bg-[var(--card)] rounded-xl border border-white/[0.08] p-6 shadow-sm">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Privilege Domain Telemetry Map</h2>
          <div className="space-y-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/10 rounded-xl text-cyan-400 text-xs">
              <span className="font-bold text-white">Privilege Protocol Exception:</span> Users carrying @mularcredit.com domains are restricted strictly to multi-branch overlays or regional administrative credentials. 
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(ROLES) as Array<keyof typeof ROLES>).map((role) => (
                <RoleToggle
                  key={role}
                  role={role}
                  active={true}
                  onChange={(r, a) => console.log(`Role ${r} active: ${a}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddUserModal && (
        <UserEditModal
          user={null}
          onClose={() => setShowAddUserModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {resettingPasswordUser && (
        <ResetPasswordModal
          user={resettingPasswordUser}
          onClose={() => setResettingPasswordUser(null)}
          onReset={(passwordOrEmail) => handleResetPassword(resettingPasswordUser, passwordOrEmail)}
        />
      )}

      {showBulkUpdateModal && (
        <BulkUpdateModal
          usersToUpdate={usersNeedingUpdate}
          onClose={() => setShowBulkUpdateModal(false)}
          onConfirm={handleBulkUpdate}
          avatarFamily={avatarFamily}
        />
      )}
    </div>
  );
}