import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, MapPin, CheckCircle2, AlertTriangle, XCircle, 
  Settings, Users, ShieldAlert, Award, FileSpreadsheet, 
  Map, UserCheck, Play, Power, Calendar, RefreshCw,
  Search, Sliders, ChevronRight, Check, X, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import KPIStrip from '../Dashboard/KPIStrip';

// Types representing frontend state
interface AttendanceRecord {
  id: string;
  name: string;
  avatar?: string;
  employeeNo: string;
  jobTitle: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  otHours: number;
  otType?: 'Ordinary' | 'Special';
  status: 'Present' | 'Late' | 'Absent' | 'Off-Duty';
  locationIn: { lat: number; lng: number; status: 'Inside' | 'Outside' };
  locationOut?: { lat: number; lng: number; status: 'Inside' | 'Outside' };
}

interface OvertimeRequest {
  id: string;
  name: string;
  employeeNo: string;
  avatar?: string;
  date: string;
  hours: number;
  type: 'Ordinary (1.5x)' | 'Special (2.0x)';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const TimeAttendance: React.FC = () => {
  // Navigation & Sub-Tabs
  const [activeTab, setActiveTab] = useState<'portal' | 'operations' | 'overtime' | 'settings'>('portal');

  // Time Portal State
  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [mockGPS, setMockGPS] = useState<{ lat: number; lng: number; status: 'Inside' | 'Outside' }>({
    lat: -1.2921,
    lng: 36.8219,
    status: 'Inside'
  });
  const [isSimulatingGPS, setIsSimulatingGPS] = useState<boolean>(false);

  // Configuration settings (default values mapped dynamically)
  const [settings, setSettings] = useState({
    startTime: '08:00',
    endTime: '17:00',
    gracePeriod: 15,
    geofenceEnabled: true,
    geofenceRadius: 100,
    geofenceLat: -1.292184,
    geofenceLng: 36.821932,
    blockOutside: false,
    otEnabled: true,
    otApprovalRequired: true,
    otApproversCount: 2,
    workingDays: [1, 2, 3, 4, 5] // Mon-Fri
  });

  // Today's Clocking Logs for active staff
  const [portalLogs, setPortalLogs] = useState<{ action: string; time: string; location: string }[]>([]);

  // Ticking time effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate Geo GPS Capture
  const handleGPSCapture = () => {
    setIsSimulatingGPS(true);
    setTimeout(() => {
      // Create a minor offset from standard Nairobi branch lat/lng
      const isInside = Math.random() > 0.25;
      const offsetLat = isInside ? 0.0002 : 0.0018;
      const currentLat = settings.geofenceLat + (Math.random() - 0.5) * offsetLat;
      const currentLng = settings.geofenceLng + (Math.random() - 0.5) * offsetLat;
      
      setMockGPS({
        lat: Number(currentLat.toFixed(6)),
        lng: Number(currentLng.toFixed(6)),
        status: isInside ? 'Inside' : 'Outside'
      });
      setIsSimulatingGPS(false);
      toast.success('GPS coordinates validated successfully');
    }, 1200);
  };

  // Clock In/Out handlers
  const handleClockAction = () => {
    if (isSimulatingGPS) return;

    if (settings.geofenceEnabled && mockGPS.status === 'Outside' && settings.blockOutside && !clockedIn) {
      toast.error('Clock-in blocked: You are outside the authorized geofence radius!');
      return;
    }

    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    if (!clockedIn) {
      setClockedIn(true);
      setClockInTime(timeString);
      setPortalLogs(prev => [
        { action: 'Clocked In', time: timeString, location: `${mockGPS.status} Geofence (${mockGPS.lat}, ${mockGPS.lng})` },
        ...prev
      ]);
      
      // Determine lateness based on config settings
      const [startHour, startMin] = settings.startTime.split(':').map(Number);
      const graceTime = new Date();
      graceTime.setHours(startHour, startMin + settings.gracePeriod, 0);
      
      if (currentTime > graceTime) {
        toast.error('Clocked In: Marked as LATE (Grace period exceeded)');
      } else {
        toast.success('Clocked in successfully within schedule!');
      }
    } else {
      setClockedIn(false);
      setPortalLogs(prev => [
        { action: 'Clocked Out', time: timeString, location: `${mockGPS.status} Geofence (${mockGPS.lat}, ${mockGPS.lng})` },
        ...prev
      ]);
      toast.success('Clocked out successfully. Shift summary logged.');
    }
  };

  // Static Mock Data for Team Attendance List
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-1',
      name: 'James Sammy',
      employeeNo: 'EMP-001',
      jobTitle: 'Regional Manager',
      date: '2026-05-19',
      checkIn: '07:54 AM',
      checkOut: '05:08 PM',
      totalHours: 9.2,
      otHours: 1.2,
      otType: 'Ordinary',
      status: 'Present',
      locationIn: { lat: -1.2921, lng: 36.8219, status: 'Inside' }
    },
    {
      id: 'att-2',
      name: 'Amos Mutua',
      employeeNo: 'EMP-014',
      jobTitle: 'Field Officer',
      date: '2026-05-19',
      checkIn: '08:24 AM',
      checkOut: '--:--',
      totalHours: 8.0,
      otHours: 0.0,
      status: 'Late',
      locationIn: { lat: -1.2935, lng: 36.8231, status: 'Outside' }
    },
    {
      id: 'att-3',
      name: 'Sarah Mwangi',
      employeeNo: 'EMP-029',
      jobTitle: 'HR Associate',
      date: '2026-05-19',
      checkIn: '07:45 AM',
      checkOut: '05:00 PM',
      totalHours: 9.0,
      otHours: 1.0,
      otType: 'Ordinary',
      status: 'Present',
      locationIn: { lat: -1.2920, lng: 36.8218, status: 'Inside' }
    },
    {
      id: 'att-4',
      name: 'Phyllis Chebet',
      employeeNo: 'EMP-041',
      jobTitle: 'Senior Accountant',
      date: '2026-05-19',
      checkIn: '--:--',
      checkOut: '--:--',
      totalHours: 0,
      otHours: 0,
      status: 'Absent',
      locationIn: { lat: 0, lng: 0, status: 'Outside' }
    }
  ]);

  // Static Mock Data for Overtime requests
  const [otRequests, setOtRequests] = useState<OvertimeRequest[]>([
    {
      id: 'ot-1',
      name: 'James Sammy',
      employeeNo: 'EMP-001',
      date: '2026-05-18',
      hours: 2.5,
      type: 'Ordinary (1.5x)',
      reason: 'End of month portfolio verification & balance reconciliation.',
      status: 'Pending'
    },
    {
      id: 'ot-2',
      name: 'Sarah Mwangi',
      employeeNo: 'EMP-029',
      date: '2026-05-17',
      hours: 4.0,
      type: 'Special (2.0x)',
      reason: 'Urgent system data cleanup and branch onboarding support on Sunday.',
      status: 'Pending'
    }
  ]);

  // Handle Overtime Actions
  const handleOtStatus = (id: string, approve: boolean) => {
    setOtRequests(prev => prev.map(req => {
      if (req.id === id) {
        toast.success(approve ? 'Overtime approved and loaded to payroll!' : 'Overtime rejected');
        return { ...req, status: approve ? 'Approved' : 'Rejected' };
      }
      return req;
    }));
  };

  // Unified KPI Dashboard values
  const kpiItems = [
    { label: 'Present', value: attendanceRecords.filter(r => r.status === 'Present').length, trend: 'In geofence', trendType: 'up' as const },
    { label: 'Late', value: attendanceRecords.filter(r => r.status === 'Late').length, trend: 'Grace exceeded', trendType: 'warn' as const },
    { label: 'Absent', value: attendanceRecords.filter(r => r.status === 'Absent').length, trend: 'No log today', trendType: 'dn' as const },
    { label: 'Pending OT', value: otRequests.filter(r => r.status === 'Pending').length, trend: 'Awaiting HR action', trendType: 'warn' as const },
    { label: 'Authorized OT Hours', value: '7.5 Hrs', trend: 'Ordinary & Special', trendType: 'up' as const },
    { label: 'Outside geofence logs', value: attendanceRecords.filter(r => r.locationIn.status === 'Outside' && r.checkIn !== '--:--').length, trend: 'Flagged check-ins', trendType: 'warn' as const }
  ];

  return (
    <div className="p-4 space-y-6 bg-[var(--page)] min-h-screen max-w-screen-2xl mx-auto text-[var(--t1)]">
      {/* Header Section */}
      <div className="glass-card p-6 border border-[var(--p-line)] relative overflow-hidden shadow-2xl rounded-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--p-dim)] rounded-full blur-[50px] pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--t1)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--p)]" />
              Time & Attendance Portal
            </h1>
            <p className="text-xs text-[var(--t3)] mt-1">
              Geolocated check-in endpoints, branch geofencing validation, and Kenya labor code compliant overtime tracking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-[var(--s1)] border border-[var(--p-line)] rounded-xl">
              <span className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {clockedIn ? 'Status: checked IN' : 'Status: checked OUT'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip - Visual Parity with Dashboard */}
      <div className="mb-7">
        <KPIStrip items={kpiItems} columns={6} />
      </div>

      {/* Dynamic Subtabs Navigation */}
      <div className="bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl p-1 flex items-center shadow-lg overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 w-full min-w-max">
          {[
            { id: 'portal', label: 'Self-Service Time Clock', icon: Clock },
            { id: 'operations', label: 'Supervisor Operations Control', icon: Users },
            { id: 'overtime', label: 'Overtime Approvals Panel', icon: Award },
            { id: 'settings', label: 'Attendance Telemetry Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-[var(--p)] text-white shadow-lg' 
                  : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--glass)]'}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Interactive Clock Card */}
              <div className="glass-card p-6 border border-[var(--p-line)] rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-24 h-24 bg-[var(--p-dim)] rounded-full blur-[40px] pointer-events-none" />
                
                {/* Live Ticking Time */}
                <span className="text-sm font-semibold text-[var(--t3)] tracking-wider uppercase mb-1">
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                
                <h2 className="text-4xl font-extrabold text-white tracking-tight tabular-nums mb-6">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>

                {/* Simulated Geofencing GPS Box */}
                <div className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[var(--t3)] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--p)]" />
                      GPS Signal State
                    </span>
                    <button 
                      onClick={handleGPSCapture}
                      disabled={isSimulatingGPS}
                      className="px-2 py-1 text-[10px] font-bold bg-[var(--glass)] border border-[var(--p-line)] rounded-lg hover:text-[var(--p)] hover:border-[var(--p-line)] transition-all flex items-center gap-1"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isSimulatingGPS ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>

                  {isSimulatingGPS ? (
                    <div className="h-6 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-[var(--p)] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-[var(--t3)]">Verifying orbital satellite GPS lock...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">Latitude: {mockGPS.lat}</p>
                        <p className="font-semibold text-white">Longitude: {mockGPS.lng}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1
                        ${mockGPS.status === 'Inside' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'}`}
                      >
                        {mockGPS.status === 'Inside' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {mockGPS.status === 'Inside' ? 'Inside Geofence' : 'Outside Geofence'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Big Dynamic Circle Click Trigger Button */}
                <button
                  onClick={handleClockAction}
                  disabled={isSimulatingGPS}
                  className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 relative group shadow-2xl
                    ${clockedIn 
                      ? 'bg-rose-500/10 border-rose-500/50 hover:bg-rose-500/20 hover:border-rose-500' 
                      : 'bg-[var(--p)]/10 border-[var(--p)]/50 hover:bg-[var(--p)]/20 hover:border-[var(--p)]'}`}
                >
                  {/* Outer breathing ring effect */}
                  <span className={`absolute inset-0 rounded-full border border-dashed animate-spin duration-[15s]
                    ${clockedIn ? 'border-rose-500/30' : 'border-[var(--p)]/30'}`} 
                  />
                  
                  <Power className={`w-10 h-10 mb-2 transition-transform duration-300 group-hover:scale-110
                    ${clockedIn ? 'text-rose-400' : 'text-[var(--p)]'}`} 
                  />
                  
                  <span className="text-sm font-extrabold uppercase tracking-widest text-white">
                    {clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                  </span>
                  <span className="text-[10px] text-[var(--t3)] font-semibold mt-1">
                    {clockedIn ? `Checked In: ${clockInTime}` : 'Start Daily Shift'}
                  </span>
                </button>
              </div>

              {/* Right Column: Portal Logs Table */}
              <div className="glass-card p-6 border border-[var(--p-line)] rounded-xl lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--p)]" />
                    Today's Activity Ledger
                  </h3>
                  <p className="text-xs text-[var(--t3)] mt-1">
                    Raw sequential check-in and check-out tracking with georeference hashes.
                  </p>
                </div>

                <div className="overflow-hidden border border-[var(--p-line)] rounded-xl bg-[var(--s1)]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--p-line)] bg-[var(--sidebar)] text-[var(--t3)] font-semibold">
                        <th className="p-3">Sequence</th>
                        <th className="p-3">Trigger Event</th>
                        <th className="p-3">Logged Timestamp</th>
                        <th className="p-3">Geographic Node</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--p-line)]">
                      {portalLogs.length > 0 ? (
                        portalLogs.map((log, index) => (
                          <tr key={index} className="hover:bg-[var(--glass-h)] transition-colors">
                            <td className="p-3 font-semibold text-white">#{portalLogs.length - index}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase
                                ${log.action === 'Clocked In' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : 'bg-rose-500/10 text-rose-400'}`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-white">{log.time}</td>
                            <td className="p-3 text-[var(--t3)] font-mono">{log.location}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-[var(--t4)]">
                            No shift logs recorded for today yet. Use the clock dial to register your presence.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Supervisor Control Options */}
              <div className="glass-card p-6 border border-[var(--p-line)] rounded-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--t1)]">Supervisor Control Console</h3>
                    <p className="text-xs text-[var(--t3)] mt-1">Real-time oversight of check-ins, lateness statistics, and geo validation overrides.</p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--t4)]" />
                      <input 
                        type="text" 
                        placeholder="Filter staff by name..." 
                        className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[var(--p)] transition-colors"
                      />
                    </div>
                    <button className="px-3.5 py-2 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl hover:text-[var(--p)] hover:border-[var(--p-line)] transition-all flex items-center gap-1.5 text-xs font-semibold">
                      <Sliders className="w-3.5 h-3.5" />
                      Configure
                    </button>
                  </div>
                </div>

                {/* Team Roster Grid */}
                <div className="overflow-hidden border border-[var(--p-line)] rounded-xl bg-[var(--s1)] mt-6">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--p-line)] bg-[var(--sidebar)] text-[var(--t3)] font-semibold">
                        <th className="p-4">Employee Details</th>
                        <th className="p-4">Shift Date</th>
                        <th className="p-4">Check-In</th>
                        <th className="p-4">Check-Out</th>
                        <th className="p-4">Hours Logged</th>
                        <th className="p-4">GPS Node Status</th>
                        <th className="p-4">Status Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--p-line)]">
                      {attendanceRecords.map(record => (
                        <tr key={record.id} className="hover:bg-[var(--glass-h)] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--p-dim)] border border-[var(--p-line)] flex items-center justify-center font-bold text-[var(--p)]">
                                {record.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-white">{record.name}</p>
                                <p className="text-[10px] text-[var(--t3)]">{record.employeeNo} • {record.jobTitle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-[var(--t2)]">{record.date}</td>
                          <td className="p-4 font-bold text-white">{record.checkIn}</td>
                          <td className="p-4 font-bold text-white">{record.checkOut}</td>
                          <td className="p-4 font-bold text-white">
                            {record.totalHours} Hrs
                            {record.otHours > 0 && (
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                                +{record.otHours} OT ({record.otType})
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit
                              ${record.locationIn.status === 'Inside' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                            >
                              <MapPin className="w-2.5 h-2.5" />
                              {record.locationIn.status} Geofence
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase
                              ${record.status === 'Present' && 'bg-emerald-500/10 text-emerald-400'}
                              ${record.status === 'Late' && 'bg-amber-500/10 text-amber-400'}
                              ${record.status === 'Absent' && 'bg-rose-500/10 text-rose-400'}
                              ${record.status === 'Off-Duty' && 'bg-slate-500/10 text-slate-400'}`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'overtime' && (
            <motion.div
              key="overtime"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Overtime requests lists */}
              <div className="glass-card p-6 border border-[var(--p-line)] rounded-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--t1)]">Pending Overtime Approvals</h3>
                  <p className="text-xs text-[var(--t3)] mt-1">
                    Calculate pay-rate triggers compliant with standard employment guidelines (1.5x weekdays / 2.0x special weekend cycles).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otRequests.filter(r => r.status === 'Pending').length > 0 ? (
                    otRequests.filter(r => r.status === 'Pending').map(req => (
                      <div key={req.id} className="bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-5 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/10 text-amber-400 border-b border-l border-[var(--p-line)] rounded-bl-xl text-[10px] font-bold uppercase tracking-wider">
                          {req.type}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--p-dim)] flex items-center justify-center font-bold text-[var(--p)]">
                            {req.name[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{req.name}</h4>
                            <p className="text-[10px] text-[var(--t3)]">{req.employeeNo} • Applied Date: {req.date}</p>
                          </div>
                        </div>

                        <div className="bg-[var(--glass)] border border-[var(--p-line)] rounded-lg p-3 text-xs space-y-1">
                          <p className="text-[var(--t3)] font-semibold">Overtime Duration:</p>
                          <p className="text-lg font-extrabold text-white">{req.hours} Hours Requested</p>
                          <p className="text-[10px] text-[var(--t4)] leading-relaxed mt-2">{req.reason}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleOtStatus(req.id, true)}
                            className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleOtStatus(req.id, false)}
                            className="px-3.5 py-2 bg-rose-600/10 border border-rose-500/30 text-rose-400 font-bold rounded-xl text-xs hover:bg-rose-600/20 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-12 text-center border border-dashed border-[var(--p-line)] rounded-xl text-[var(--t3)]">
                      <CheckCircle2 className="w-8 h-8 text-[var(--p)] mx-auto mb-2" />
                      <p className="text-xs font-semibold">No pending overtime approvals remaining</p>
                      <p className="text-[10px] text-[var(--t4)] mt-1">All processed logs are pushed directly to payroll pipelines.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Geofencing Settings Panel */}
              <div className="glass-card p-6 border border-[var(--p-line)] rounded-xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                    <Map className="w-4 h-4 text-[var(--p)]" />
                    Geofencing & Validation Coordinates
                  </h3>
                  <p className="text-xs text-[var(--t3)] mt-1">Configuring virtual geozones and authorization thresholds per branch.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--p-line)] pb-3">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-white">Enable Geofence Validation</label>
                      <p className="text-[10px] text-[var(--t3)]">Restricts or flags clock-ins based on branch coordinates.</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, geofenceEnabled: !prev.geofenceEnabled }))}
                      className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 relative focus:outline-none
                        ${settings.geofenceEnabled ? 'bg-[var(--p)]' : 'bg-[var(--s1)]'}`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300
                        ${settings.geofenceEnabled ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--t3)] uppercase">Branch Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        value={settings.geofenceLat}
                        onChange={(e) => setSettings(prev => ({ ...prev, geofenceLat: Number(e.target.value) }))}
                        className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--t3)] uppercase">Branch Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        value={settings.geofenceLng}
                        onChange={(e) => setSettings(prev => ({ ...prev, geofenceLng: Number(e.target.value) }))}
                        className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--t3)]">
                      <span>Geofence Boundary Radius</span>
                      <span className="text-white font-extrabold">{settings.geofenceRadius} Meters</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="1000" 
                      step="50"
                      value={settings.geofenceRadius}
                      onChange={(e) => setSettings(prev => ({ ...prev, geofenceRadius: Number(e.target.value) }))}
                      className="w-full accent-[var(--p)] h-1.5 bg-[var(--s1)] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-white">Block Non-Compliant Attempts</label>
                      <p className="text-[10px] text-[var(--t3)]">Completely blocks clock-ins from coordinates outside the zone.</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, blockOutside: !prev.blockOutside }))}
                      className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 relative focus:outline-none
                        ${settings.blockOutside ? 'bg-[var(--p)]' : 'bg-[var(--s1)]'}`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300
                        ${settings.blockOutside ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Working Hours & Shift Rules */}
              <div className="glass-card p-6 border border-[var(--p-line)] rounded-xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[var(--p)]" />
                    Shift Windows & Overtime Calculations
                  </h3>
                  <p className="text-xs text-[var(--t3)] mt-1">Specify default hours, lateness triggers, and overtime parameters.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--t3)] uppercase">Standard Shift Start</label>
                      <input 
                        type="time" 
                        value={settings.startTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--t3)] uppercase">Standard Shift End</label>
                      <input 
                        type="time" 
                        value={settings.endTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Lateness Grace Window (Minutes)</label>
                    <p className="text-[10px] text-[var(--t3)] mb-2">Duration after the shift start when staff are not flagged as Late.</p>
                    <input 
                      type="number" 
                      value={settings.gracePeriod}
                      onChange={(e) => setSettings(prev => ({ ...prev, gracePeriod: Number(e.target.value) }))}
                      className="w-full bg-[var(--s1)] border border-[var(--p-line)] rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--p-line)] pt-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-white">Calculate Automatic Overtime</label>
                      <p className="text-[10px] text-[var(--t3)]">Compute extra hours post Shift-End automatically.</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, otEnabled: !prev.otEnabled }))}
                      className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 relative focus:outline-none
                        ${settings.otEnabled ? 'bg-[var(--p)]' : 'bg-[var(--s1)]'}`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300
                        ${settings.otEnabled ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimeAttendance;
