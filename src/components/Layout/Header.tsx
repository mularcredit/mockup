import React, { useEffect, useState, useRef } from 'react';
import UserAvatar from '../UI/UserAvatar';
import { Bell, LogOut, X, Trash2, CheckCircle, UserPlus, UserCheck, Calendar, Image, Upload, MapPin, ChevronDown, AlertTriangle, Clock, Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useHRNotifications, fetchAdminHRNotifications, markAdminNotificationRead, type HRNotification } from '../../hooks/useHRNotifications';

interface HeaderProps {
  user?: { email: string; role: string };
  onLogout?: () => void;
  selectedTown?: string;
  onTownChange?: (town: string) => void;
  selectedRegion?: string;
  onRegionChange?: (regionName: string) => void;
  towns?: string[];
  regions?: string[];
  allTowns?: string[];
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onSSPToggle?: () => void;
}

interface NotificationItem {
  id: string;
  type: 'staff' | 'leave' | 'hr';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  hrId?: number;
}

interface NotificationState {
  staff: number;
  leave: number;
  hr: number;
  lastUpdated: Date | null;
  items: NotificationItem[];
}

interface CompanyProfile {
  id: number;
  image_url: string | null;
  company_name: string | null;
  company_tagline: string | null;
}

// Custom Premium Dropdown for Header - Defined outside to prevent re-creation and flickering
const HeaderDropdown = ({ value, options, onChange, placeholder, icon: Icon }: {
  value: string,
  options: { label: string, value: string }[],
  onChange: (val: string) => void,
  placeholder: string,
  icon?: any
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 border border-transparent ${isOpen ? 'bg-[var(--p-dim)] border-[var(--p-line)]' : 'hover:bg-[var(--glass-h)]'}`}
      >
        <div className="flex items-center gap-2 max-w-[120px]">
          {Icon && <Icon className={`w-3.5 h-3.5 ${isOpen ? 'text-[var(--p)]' : 'text-[var(--t4)]'}`} />}
          <span className={`text-[11px] font-bold truncate ${selected ? 'text-[var(--t1)]' : 'text-[var(--t4)]'}`}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--t4)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 min-w-[180px] bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl shadow-[var(--shadow-dropdown)] overflow-hidden z-[100] backdrop-blur-xl"
          >
            <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[11px] transition-colors hover:bg-[var(--p-dim)] hover:text-[var(--p)] flex items-center justify-between group ${value === opt.value ? 'bg-[var(--p-dim)] text-[var(--p)] font-bold' : 'text-[var(--t2)]'}`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <CheckCircle className="w-3.5 h-3.5 text-[var(--p)]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// ...
export default function Header({ user, onLogout, selectedTown, onTownChange, selectedRegion, onRegionChange, towns, regions, theme, onThemeToggle, onSSPToggle }: HeaderProps) {
  const [notifications, setNotifications] = useState<NotificationState>({
    staff: 0,
    leave: 0,
    hr: 0,
    lastUpdated: null,
    items: []
  });
  const { checkAndNotify } = useHRNotifications();
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newProfile, setNewProfile] = useState({
    company_name: '',
    company_tagline: ''
  });
  const navigate = useNavigate();

  // Create notification item helper
  const createNotificationItem = (type: 'staff' | 'leave', data: any): NotificationItem => {
    const timestamp = new Date(data.created_at || data.time_added || new Date());

    if (type === 'staff') {
      return {
        id: `staff-${data.id || Date.now()}`,
        type: 'staff',
        title: 'New Staff Signup Request',
        message: `A new staff member has requested to join. Email: ${data.email || 'Unknown'}`,
        timestamp,
        isRead: false
      };
    } else {
      return {
        id: `leave-${data.id || Date.now()}`,
        type: 'leave',
        title: 'New Leave Application',
        message: `Leave application submitted by ${data["First Name"] && data["Last Name"] || 'Employee'}`,
        timestamp,
        isRead: false
      };
    }
  };

  // Fetch notification counts
  const fetchNotificationCounts = async () => {
    try {
      const yesterday = new Date(Date.now() - 86400000).toISOString();

      // Fetch staff requests
      const { data: staffData, count: staffCount } = await supabase
        .from('staff_signup_requests')
        .select('*', { count: 'exact' })
        .gt('created_at', yesterday)
        .order('created_at', { ascending: false });

      // Fetch leave applications
      const { data: leaveData, count: leaveCount } = await supabase
        .from('leave_application')
        .select('*', { count: 'exact' })
        .gt('time_added', yesterday)
        .order('time_added', { ascending: false });

      // Create notification items
      const staffItems = (staffData || []).map(item => createNotificationItem('staff', item));
      const leaveItems = (leaveData || []).map(item => createNotificationItem('leave', item));

      // Fetch HR lifecycle notifications
      const hrNotifs = await fetchAdminHRNotifications();
      const hrItems: NotificationItem[] = hrNotifs.map((n: HRNotification) => ({
        id: `hr-${n.id}`,
        type: 'hr' as const,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.created_at),
        isRead: false,
        hrId: n.id,
      }));

      const allItems = [...staffItems, ...leaveItems, ...hrItems].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(prev => {
        const newCounts = {
          staff: staffCount || 0,
          leave: leaveCount || 0,
          hr: hrNotifs.length,
          lastUpdated: new Date(),
          items: allItems
        };

        if ((staffCount || 0) > prev.staff || (leaveCount || 0) > prev.leave || hrNotifs.length > prev.hr) {
          setShowNotificationDot(true);
        }

        return newCounts;
      });
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  };

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('company_logo')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        throw error;
      }

      if (data) {
        setCompanyProfile(data);
        setNewProfile({
          company_name: data.company_name || '',
          company_tagline: data.company_tagline || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Failed to load company profile');
    }
  };

  // Handle file selection for preview
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setSelectedFile(file);
  };

  // Upload logo to storage
  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('company-logo')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('company-logo')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Update company profile
  const updateCompanyProfile = async (updates: Partial<CompanyProfile>) => {
    try {
      let updatedProfile;
      let imageUrl = companyProfile?.image_url || null;

      // Upload new logo if selected
      if (selectedFile) {
        imageUrl = await uploadLogo(selectedFile);
      }

      if (companyProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('company_logo')
          .update({
            ...updates,
            image_url: imageUrl || companyProfile.image_url,
            created_at: new Date().toISOString()
          })
          .eq('id', companyProfile.id)
          .select()
          .single();

        if (error) throw error;
        updatedProfile = data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('company_logo')
          .insert([{
            ...updates,
            image_url: imageUrl,
            company_name: newProfile.company_name,
            company_tagline: newProfile.company_tagline
          }])
          .select()
          .single();

        if (error) throw error;
        updatedProfile = data;
      }

      setCompanyProfile(updatedProfile);
      toast.success('Profile updated successfully!');
      return updatedProfile;
    } catch (error) {
      console.error('Error updating company profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setUploading(true);
      await updateCompanyProfile({
        company_name: newProfile.company_name,
        company_tagline: newProfile.company_tagline
      });
      // Clear preview state after successful save
      setLogoPreview(null);
      setSelectedFile(null);
      setProfileModalOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setUploading(false);
    }
  };

  // Cancel profile editing
  const handleCancelProfile = () => {
    setLogoPreview(null);
    setSelectedFile(null);
    setProfileModalOpen(false);
    // Reset form to current company profile
    if (companyProfile) {
      setNewProfile({
        company_name: companyProfile.company_name || '',
        company_tagline: companyProfile.company_tagline || ''
      });
    }
  };

  // Setup real-time subscriptions for notifications
  useEffect(() => {
    const handleStaffUpdate = (payload: any) => {
      const newItem = createNotificationItem('staff', payload.new);
      setNotifications(prev => ({
        ...prev,
        staff: prev.staff + 1,
        lastUpdated: new Date(),
        items: [newItem, ...prev.items]
      }));
      setShowNotificationDot(true);
      toast.success('New staff signup request received');
    };

    const handleLeaveUpdate = (payload: any) => {
      const newItem = createNotificationItem('leave', payload.new);
      setNotifications(prev => ({
        ...prev,
        leave: prev.leave + 1,
        lastUpdated: new Date(),
        items: [newItem, ...prev.items]
      }));
      setShowNotificationDot(true);
      toast.success('New leave application received');
    };

    const staffChannel = supabase
      .channel('staff_signup_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'staff_signup_requests'
        },
        handleStaffUpdate
      )
      .subscribe();

    const leaveChannel = supabase
      .channel('leave_application_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leave_application'
        },
        handleLeaveUpdate
      )
      .subscribe();

    // Initial fetches
    fetchCompanyProfile();
    fetchNotificationCounts();
    checkAndNotify(); // Check for expiring contracts/probations

    // Setup polling as fallback (every 5 minutes)
    const interval = setInterval(fetchNotificationCounts, 300000);

    return () => {
      supabase.removeChannel(staffChannel);
      supabase.removeChannel(leaveChannel);
      clearInterval(interval);
      // Clean up preview URLs
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [checkAndNotify]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleBellClick = () => {
    setShowNotificationDot(false);
    setSidebarOpen(true);
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    setNotifications(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    }));

    // Navigate based on type
    if (notification.type === 'staff') {
      navigate('/adminconfirm');
      setNotifications(prev => ({ ...prev, staff: Math.max(0, prev.staff - 1) }));
    } else if (notification.type === 'leave') {
      navigate('/leaves');
      setNotifications(prev => ({ ...prev, leave: Math.max(0, prev.leave - 1) }));
    } else if (notification.type === 'hr') {
      if (notification.hrId) markAdminNotificationRead(notification.hrId);
      navigate('/hr-lifecycle');
      setNotifications(prev => ({ ...prev, hr: Math.max(0, prev.hr - 1) }));
    }

    setSidebarOpen(false);
  };

  const handleClearAll = () => {
    setNotifications(prev => ({
      ...prev,
      staff: 0,
      leave: 0,
      hr: 0,
      items: []
    }));
    toast.success('All notifications cleared');
  };

  const handleRemoveNotification = (notificationId: string) => {
    setNotifications(prev => {
      const itemToRemove = prev.items.find(item => item.id === notificationId);
      const newItems = prev.items.filter(item => item.id !== notificationId);

      const newState = {
        ...prev,
        items: newItems,
        staff: itemToRemove?.type === 'staff' ? Math.max(0, prev.staff - 1) : prev.staff,
        leave: itemToRemove?.type === 'leave' ? Math.max(0, prev.leave - 1) : prev.leave
      };

      return newState;
    });
  };

  const totalNotifications = notifications.staff + notifications.leave + notifications.hr;
  const unreadItems = notifications.items.filter(item => !item.isRead);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--sidebar)] border-b border-[var(--p-line)] h-[56px] flex items-center px-[26px] justify-between">

        {/* Tenant Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          {companyProfile?.image_url && (
            <img
              src={companyProfile.image_url}
              alt={companyProfile.company_name || 'Company'}
              className="h-7 w-auto object-contain shrink-0"
              style={{ maxWidth: 80 }}
            />
          )}
          {companyProfile?.company_name && (
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[var(--t1)] leading-none truncate">
                {companyProfile.company_name}
              </div>
              {companyProfile.company_tagline && (
                <div className="text-[9px] text-[var(--t3)] mt-0.5 truncate">
                  {companyProfile.company_tagline}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">

          {/* SSP Toggle Button (Only for Admin/Manager/Checker/HR roles) */}
          {user?.role && user.role !== 'STAFF' && onSSPToggle && (
            <button
              onClick={onSSPToggle}
              className="px-3 py-1.5 bg-[var(--p-dim)] hover:bg-[var(--p)] hover:text-white border border-[var(--p-line)] text-[var(--p)] text-[11px] font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-sm active:scale-95 mr-1"
              title="Access Staff Self-Service Portal"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Self-Service Portal (SSP)</span>
            </button>
          )}

          {/* Notifications */}
          <button
            className="relative p-2.5 text-[var(--t4)] hover:text-[var(--p)] transition-all rounded-xl hover:bg-[var(--glass-h)]"
            onClick={handleBellClick}
          >
            <Bell className="w-4 h-4" />
            {showNotificationDot && totalNotifications > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--red)] rounded-full ring-2 ring-[var(--sidebar)] animate-pulse shadow-[0_0_8px_var(--red-glow)]" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2.5 text-[var(--t4)] hover:text-[var(--p)] transition-all rounded-xl hover:bg-[var(--glass-h)] flex items-center justify-center"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Profile Control */}
          <div className="flex items-center gap-3 pl-3 border-l border-[var(--p-line)]">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[11px] font-semibold text-[var(--t1)] leading-none">{user?.email?.split('@')[0] || 'Operator'}</span>
              <span className="text-[9px] text-[var(--t4)] font-semibold mt-1">{user?.role || 'Staff member'}</span>
            </div>
            <div 
              className="cursor-pointer transition-all hover:scale-105 active:scale-95"
              onClick={() => setProfileModalOpen(true)}
            >
              <UserAvatar name={user?.email || 'Admin'} size={32} />
            </div>
          </div>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-[var(--t4)] hover:text-[var(--red)] transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Company Profile Modal - Updated with curved design */}
      <AnimatePresence>
        {profileModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelProfile}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div
                className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[15px] font-semibold text-[var(--t1)] tracking-tight">
                      {companyProfile ? 'Edit Company Profile' : 'Create Company Profile'}
                    </h2>
                    <button
                      onClick={handleCancelProfile}
                      className="text-[var(--t4)] hover:text-[var(--t1)] transition-colors rounded-lg p-1 hover:bg-[var(--glass-h)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Logo Upload */}
                  <div className="mb-5">
                    <label className="block text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Company Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {logoPreview ? (
                          <>
                            <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded-xl object-cover border border-[var(--p-line)]" />
                            <button
                              onClick={() => { setLogoPreview(null); setSelectedFile(null); }}
                              className="absolute -top-2 -right-2 bg-[var(--red)] text-white rounded-full p-1 hover:opacity-80 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : companyProfile?.image_url ? (
                          <img src={companyProfile.image_url} alt="Current Logo" className="w-16 h-16 rounded-xl object-cover border border-[var(--p-line)]" />
                        ) : (
                          <div className="w-16 h-16 bg-[var(--glass-h)] border border-[var(--p-line)] rounded-xl flex items-center justify-center">
                            <Image className="w-6 h-6 text-[var(--t4)]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <div className="px-4 py-2 bg-[var(--glass)] hover:bg-[var(--glass-h)] border border-[var(--p-line)] text-[var(--t2)] rounded-xl flex items-center gap-2 transition-colors text-[12px]">
                            <Upload className="w-4 h-4" />
                            <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
                          </div>
                        </label>
                        <p className="text-[10px] text-[var(--t4)] mt-1">Recommended: 256×256px</p>
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="mb-4">
                    <label htmlFor="company_name" className="block text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1">Company Name</label>
                    <input type="text" id="company_name" value={newProfile.company_name}
                      onChange={(e) => setNewProfile({ ...newProfile, company_name: e.target.value })}
                      className="neo-input" placeholder="Enter company name" />
                  </div>

                  {/* Company Tagline */}
                  <div className="mb-6">
                    <label htmlFor="company_tagline" className="block text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1">Tagline</label>
                    <input type="text" id="company_tagline" value={newProfile.company_tagline}
                      onChange={(e) => setNewProfile({ ...newProfile, company_tagline: e.target.value })}
                      className="neo-input" placeholder="Enter company tagline" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button onClick={handleCancelProfile} disabled={uploading}
                      className="px-4 py-2 text-[12px] font-medium text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--glass-h)] rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSaveProfile} className="f-btn"
                      disabled={uploading || (!newProfile.company_name && !newProfile.company_tagline && !selectedFile)}>
                      {uploading ? (
                        <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{companyProfile ? 'Updating...' : 'Creating...'}</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /><span>{companyProfile ? 'Update Profile' : 'Create Profile'}</span></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Sidebar - Updated with curved design */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-4 top-4 h-[95vh] w-96 bg-[var(--sidebar)] border border-[var(--p-line)] z-50 flex flex-col rounded-2xl shadow-[var(--shadow-hover)]"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--p-line)] rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[var(--t3)]" />
                    <h2 className="text-[13px] font-semibold text-[var(--t1)]">Notifications</h2>
                    {totalNotifications > 0 && (
                      <span className="bg-[var(--red-d)] text-[var(--red)] border border-[var(--red-glow)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {totalNotifications}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {notifications.items.length > 0 && (
                      <button onClick={handleClearAll} title="Clear all"
                        className="text-[var(--t4)] hover:text-[var(--red)] transition-colors rounded-lg p-1.5 hover:bg-[var(--glass-h)]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setSidebarOpen(false)}
                      className="text-[var(--t4)] hover:text-[var(--t1)] transition-colors rounded-lg p-1.5 hover:bg-[var(--glass-h)]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {notifications.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[var(--t4)] gap-3">
                    <Bell className="w-10 h-10 opacity-30" />
                    <p className="text-[13px] font-medium text-[var(--t3)]">No notifications</p>
                    <p className="text-[11px] text-[var(--t4)]">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.items.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-[var(--glass-h)] cursor-pointer transition-colors relative border-b border-[var(--p-line)]`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveNotification(notification.id); }}
                          className="absolute top-3 right-3 text-[var(--t4)] hover:text-[var(--t1)] transition-colors rounded-lg p-1 hover:bg-[var(--glass-h)]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'staff' ? 'bg-[var(--green-d)] text-[var(--green)]'
                              : notification.type === 'hr' ? 'bg-[var(--amber-d)] text-[var(--amber)]'
                              : 'bg-[var(--p-dim)] text-[var(--p)]'
                          }`}>
                            {notification.type === 'staff' ? <UserPlus className="w-4 h-4" />
                              : notification.type === 'hr' ? <Clock className="w-4 h-4" />
                              : <Calendar className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h3 className="text-[11px] font-semibold text-[var(--t1)] truncate">{notification.title}</h3>
                              {!notification.isRead && (
                                <span className="w-1 h-1 rounded-full bg-[var(--p)] animate-pulse" />
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--t3)] mt-0.5 line-clamp-2">{notification.message}</p>
                            {notification.type === 'hr' && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-[var(--amber)] bg-[var(--amber-d)] border border-[var(--p-line)] px-1.5 py-0.5 rounded-full">
                                <AlertTriangle className="w-2.5 h-2.5" /> HR Lifecycle
                              </span>
                            )}
                            <p className="text-[9px] text-[var(--t4)] mt-1">
                              {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>

                          {!notification.isRead && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                              notification.type === 'hr' ? 'bg-[var(--amber)]' : 'bg-[var(--p)]'
                            }`} />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.items.length > 0 && (
                <div className="p-4 border-t border-[var(--p-line)]">
                  <p className="text-[10px] text-[var(--t4)] text-center">
                    {unreadItems.length} unread of {notifications.items.length} total
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}