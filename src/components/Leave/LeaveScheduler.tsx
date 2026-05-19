
import { useState, useEffect, useMemo, useRef } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    isWeekend,
    differenceInDays,
    parseISO,
    isBefore,
    startOfDay
} from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Loader2,
    Search,
    Download,
    X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../UI/LoadingSpinner';

interface LeaveSchedulerProps {
    selectedTown?: string;
    onSelectDate?: (employeeNumber: string, date: Date) => void;
    onAssignLeave?: () => void;
}

// CORRECTED TYPE DEFINITION MATCHING 'EmployeeList.tsx'
type Employee = {
    id: string;
    "Employee Number": string;
    "First Name": string;
    "Last Name": string;
    "Middle Name"?: string;
    Branch: string;     // Matches 'office' logic
    Town: string;
    "Employee Type": string; // Matches 'department' logic usually
    "Job Title": string;
    "Work Email": string;
    "Mobile Number": string;
    avatar_url?: string;
};

type LeaveApplication = {
    id: string;
    "Employee Number": string;
    "Start Date": string;
    "End Date": string;
    "Leave Type": string;
    Status: string;
    Reason?: string;
};

// Distinct colors for leave types
const LEAVE_TYPE_STYLES = {
    sick: {
        bg: 'bg-rose-500/80 backdrop-blur-sm',
        border: 'border-rose-400/50',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]'
    },
    annual: {
        bg: 'bg-[var(--p)]/80 backdrop-blur-sm',
        border: 'border-[var(--p-line)]',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_var(--p-glow)]'
    },
    maternity: {
        bg: 'bg-purple-600/80 backdrop-blur-sm',
        border: 'border-purple-400/50',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_rgba(147,51,234,0.4)]'
    },
    paternity: {
        bg: 'bg-indigo-600/80 backdrop-blur-sm',
        border: 'border-indigo-400/50',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_rgba(79,70,229,0.4)]'
    },
    study: {
        bg: 'bg-cyan-500/80 backdrop-blur-sm',
        border: 'border-cyan-400/50',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]'
    },
    compassionate: {
        bg: 'bg-amber-500/80 backdrop-blur-sm',
        border: 'border-amber-400/50',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]'
    },
    unpaid: {
        bg: 'bg-slate-600/80 backdrop-blur-sm',
        border: 'border-slate-400/50',
        text: 'text-white',
        shadow: 'shadow-[0_0_12px_rgba(71,85,105,0.4)]'
    }
};

const getLeaveStyle = (leaveType: string, status: string) => {
    const typeKey = (leaveType || '').toLowerCase();
    let baseStyle = LEAVE_TYPE_STYLES.unpaid;

    if (typeKey.includes('sick')) baseStyle = LEAVE_TYPE_STYLES.sick;
    else if (typeKey.includes('ann')) baseStyle = LEAVE_TYPE_STYLES.annual;
    else if (typeKey.includes('mat')) baseStyle = LEAVE_TYPE_STYLES.maternity;
    else if (typeKey.includes('pat')) baseStyle = LEAVE_TYPE_STYLES.paternity;
    else if (typeKey.includes('stud') || typeKey.includes('exam')) baseStyle = LEAVE_TYPE_STYLES.study;
    else if (typeKey.includes('comp') || typeKey.includes('bereav')) baseStyle = LEAVE_TYPE_STYLES.compassionate;
    else if (typeKey.includes('unp')) baseStyle = LEAVE_TYPE_STYLES.unpaid;
    else {
        baseStyle = {
            bg: 'bg-blue-500/80 backdrop-blur-sm',
            border: 'border-blue-400/50',
            text: 'text-white',
            shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]'
        };
    }

    if ((status || '').toLowerCase() === 'pending') {
        return {
            ...baseStyle,
            border: 'border-dashed border-amber-300 border-2',
            shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
        };
    }

    return baseStyle;
};

const LeaveScheduler = ({ selectedTown, onSelectDate, onAssignLeave }: LeaveSchedulerProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- Search & Auto-Suggest State ---
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchWrapperRef = useRef<HTMLDivElement>(null);

    // Derived state for calendar grid
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [monthStart, monthEnd]);

    useEffect(() => {
        fetchData();
    }, [selectedTown, currentDate]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Employees
            let employeeQuery = supabase
                .from('employees')
                .select('*');

            if (selectedTown && selectedTown !== 'ADMIN_ALL') {
                employeeQuery = employeeQuery.eq('Town', selectedTown);
            }

            const { data: empData, error: empError } = await employeeQuery;
            if (empError) throw empError;

            // 2. Fetch Leaves
            const { data: leaveData, error: leaveError } = await supabase
                .from('leave_application')
                .select('*')
                .neq('Status', 'rejected')
                .lte('Start Date', monthEnd.toISOString())
                .gte('End Date', monthStart.toISOString());

            if (leaveError) throw leaveError;

            // Sort employees by name (Accessing correct columns)
            const sortedEmps = (empData || []).sort((a, b) =>
                (a["First Name"] || '').localeCompare(b["First Name"] || '')
            );

            setEmployees(sortedEmps);
            setLeaves(leaveData || []);

        } catch (err) {
            console.error("Error fetching scheduler data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        const lowerTerm = searchTerm.toLowerCase();

        return employees.filter(emp => {
            // Correct Column Mapping
            const first = (emp["First Name"] || '').toLowerCase();
            const last = (emp["Last Name"] || '').toLowerCase();
            const middle = (emp["Middle Name"] || '').toLowerCase();
            const fullName = `${first} ${middle} ${last}`;

            const empNo = (emp["Employee Number"] || '').toLowerCase();
            const dept = (emp["Employee Type"] || '').toLowerCase(); // Assuming Employee Type maps closely to department
            const email = (emp["Work Email"] || '').toLowerCase();
            const position = (emp["Job Title"] || '').toLowerCase();

            return fullName.includes(lowerTerm) ||
                empNo.includes(lowerTerm) ||
                dept.includes(lowerTerm) ||
                email.includes(lowerTerm) ||
                position.includes(lowerTerm);
        });
    }, [employees, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true);
    };

    const handleSelectEmployee = (emp: Employee) => {
        setSearchTerm(`${emp["First Name"]} ${emp["Last Name"]}`);
        setShowSuggestions(false);
    };

    // --- Gantt Bar Calculation ---
    const getLeaveBars = (employeeNumber: string) => {
        // Both tables use "Employee Number" so this maps correctly
        const empLeaves = leaves.filter(l => l["Employee Number"] === employeeNumber);

        return empLeaves.map(leave => {
            const startDate = parseISO(leave["Start Date"]);
            const endDate = parseISO(leave["End Date"]);

            const effectiveStart = startDate < monthStart ? monthStart : startDate;
            const effectiveEnd = endDate > monthEnd ? monthEnd : endDate;

            if (effectiveStart > effectiveEnd) return null;

            const duration = differenceInDays(effectiveEnd, effectiveStart) + 1;
            const startOffset = differenceInDays(effectiveStart, monthStart);

            return {
                ...leave,
                startOffset,
                duration,
                isPartialStart: startDate < monthStart,
                isPartialEnd: endDate > monthEnd
            };
        }).filter((bar): bar is NonNullable<typeof bar> => Boolean(bar));
    };

    const getInitials = (first: string, last: string) => {
        const f = first || '';
        const l = last || '';
        return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="glass-card border border-[var(--p-line)] flex flex-col h-[calc(100vh-180px)] overflow-hidden shadow-2xl">

            {/* 1. Header Toolbar */}
            <div className="p-4 border-b border-[var(--p-line)] flex flex-col sm:flex-row justify-between items-center bg-[var(--sidebar)] backdrop-blur-md gap-4 z-20 sticky top-0">

                {/* Date Navigation */}
                <div className="flex items-center gap-4 bg-[var(--glass)] p-1.5 rounded-xl border border-[var(--p-line)] shadow-inner">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:bg-[var(--glass-h)] rounded-lg transition-all text-[var(--t3)] hover:text-[var(--p)]"
                        title="Previous Month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 min-w-[160px] justify-center">
                        <CalendarIcon className="w-4 h-4 text-[var(--p)]" />
                        <span className="text-sm font-bold text-[var(--t2)] tracking-wide">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                    </div>
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 hover:bg-[var(--glass-h)] rounded-lg transition-all text-[var(--t3)] hover:text-[var(--p)]"
                        title="Next Month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group flex-1 sm:flex-none" ref={searchWrapperRef}>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--t4)] group-focus-within:text-[var(--p)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(true)}
                            className="pl-9 pr-4 py-2 w-full sm:w-72 border border-[var(--p-line)] bg-[var(--glass)] rounded-xl text-sm text-[var(--t2)] focus:bg-[var(--sidebar)] focus:ring-2 focus:ring-[var(--p)]/20 focus:border-[var(--p-line)] transition-all shadow-inner"
                        />

                        {/* Suggestion Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl shadow-2xl z-[100] max-h-80 overflow-hidden ring-1 ring-[var(--p-line)] flex flex-col"
                                >
                                    {filteredEmployees.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2.5 text-xs font-medium text-[var(--t4)] bg-[var(--glass)] sticky top-0 backdrop-blur-sm border-b border-[var(--p-line)] flex justify-between items-center">
                                                <span>Suggested staff</span>
                                                <button
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="p-1 hover:bg-[var(--glass-h)] rounded-lg transition-colors text-[var(--t3)]"
                                                >
                                                    <CloseIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="overflow-y-auto custom-scrollbar p-1">
                                                {filteredEmployees.map(emp => (
                                                    <div
                                                        key={emp.id}
                                                        onClick={() => handleSelectEmployee(emp)}
                                                        className="px-3 py-2.5 hover:bg-[var(--p-dim)] cursor-pointer flex items-center gap-3 rounded-lg transition-all border-b border-[var(--p-line)] last:border-0 group"
                                                    >
                                                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--p-dim)] flex items-center justify-center text-xs font-bold text-[var(--p)] overflow-hidden ring-2 ring-[var(--p-line)] shadow-sm group-hover:ring-[var(--p)] transition-all">
                                                            {emp.avatar_url ? (
                                                                <img src={emp.avatar_url} alt="" className="w-full h-full object-cover" />
                                                            ) : getInitials(emp["First Name"], emp["Last Name"])}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-bold text-[var(--t1)] truncate group-hover:text-[var(--p)]">
                                                                {emp["First Name"]} {emp["Last Name"]}
                                                            </div>
                                                            <div className="text-[10px] text-[var(--t4)] truncate flex items-center gap-1.5 mt-0.5">
                                                                <span className="font-mono bg-[var(--glass)] px-1 rounded border border-[var(--p-line)] text-[var(--t3)]">
                                                                    {emp["Employee Number"]}
                                                                </span>
                                                                <span className="text-[var(--p)] font-medium italic opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    Click to focus
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-[var(--t4)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--p)] transition-all -translate-x-2 group-hover:translate-x-0" />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="px-4 py-10 text-center bg-[var(--glass)]">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--sidebar)] border border-[var(--p-line)] mb-3 text-[var(--t4)]">
                                                <Search className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold text-[var(--t1)]">No staff found</p>
                                            <p className="text-xs text-[var(--t4)] mt-1">We couldn't find anyone matching "{searchTerm}"</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={onAssignLeave}
                        className="flex items-center gap-1.5 bg-[var(--p)] hover:opacity-90 text-white px-4 py-2 rounded-xl transition-all active:scale-[0.98] shadow-[0_4px_12px_var(--p-glow)] whitespace-nowrap text-xs font-medium"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Assign Leave</span>
                    </button>

                    <button className="p-2 text-[var(--t3)] hover:bg-[var(--glass-h)] rounded-lg border border-[var(--p-line)] transition-colors hover:text-[var(--p)]">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* --- Scheduler Layout --- */}
            <div className="flex-1 overflow-hidden relative flex bg-[var(--glass)]">

                {loading ? (
                    <div className="absolute inset-0 z-50">
                        <LoadingSpinner message="Syncing Schedule..." />
                    </div>
                ) : (
                    <>
                        {/* 1. Sticky Sidebar: Employees */}
                        <div className="flex flex-col border-r border-[var(--p-line)] bg-[var(--sidebar)] z-20 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.03)] w-[280px] min-w-[280px]">
                            {/* Sidebar Header */}
                            <div className="h-14 border-b border-[var(--p-line)] bg-[var(--glass)] flex items-center px-6 font-medium text-[var(--t4)] text-xs justify-between">
                                <span>Staff member</span>
                                <span className="bg-[var(--sidebar)] px-2 py-0.5 rounded-md shadow-sm border border-[var(--p-line)] text-[10px] text-[var(--p)] font-medium">{filteredEmployees.length}</span>
                            </div>

                            {/* Employee List */}
                            <div className="overflow-y-hidden hover:overflow-y-auto custom-scrollbar flex-1 bg-[var(--sidebar)]">
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp, idx) => (
                                        <div
                                            key={emp.id}
                                            className={`h-16 border-b border-[var(--p-line)] flex items-center px-4 transition-all group cursor-pointer 
                                                ${idx % 2 === 0 ? 'bg-[var(--sidebar)]' : 'bg-[var(--glass)]'} 
                                                hover:bg-[var(--p-dim)] border-l-4 border-l-transparent hover:border-l-[var(--p)]`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[var(--p-dim)] border border-[var(--p-line)] flex items-center justify-center text-[var(--t2)] mr-3 overflow-hidden flex-shrink-0">
                                                {emp.avatar_url ? (
                                                    <img src={emp.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold">{getInitials(emp["First Name"], emp["Last Name"])}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-semibold text-[var(--t1)] truncate group-hover:text-[var(--p)] transition-colors">
                                                    {emp["First Name"]} {emp["Last Name"]}
                                                </div>
                                                <div className="text-[10px] text-[var(--t4)] truncate flex items-center gap-1.5 mt-0.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-[var(--p)] shadow-[0_0_6px_var(--p-glow)]`}></div>
                                                    <span className="truncate">{emp["Job Title"] || emp["Employee Type"] || 'Staff Member'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-[var(--sidebar)]">
                                        <div className="w-12 h-12 bg-[var(--glass)] border border-[var(--p-line)] rounded-full flex items-center justify-center mb-3">
                                            <Search className="w-6 h-6 text-[var(--t4)]" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[var(--t1)]">No staff found</h3>
                                        <p className="text-xs text-[var(--t4)] mt-1 max-w-[150px] mx-auto">Try adjusting your search filters or clearing the search.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Scrollable Timeline Grid */}
                        <div className="flex-1 overflow-auto bg-[var(--sidebar)] relative custom-scrollbar" ref={scrollContainerRef}>
                            <div className="min-w-max">

                                {/* Fixed Date Header */}
                                <div className="flex h-14 border-b border-[var(--p-line)] bg-[var(--sidebar)] sticky top-0 z-10 shadow-sm">
                                    {daysInMonth.map(day => {
                                        const isToday = isSameDay(day, new Date());
                                        const isWeekendDay = isWeekend(day);
                                        const isPast = isBefore(day, startOfDay(new Date()));

                                        return (
                                            <div
                                                key={day.toISOString()}
                                                className={`flex-shrink-0 w-14 flex flex-col items-center justify-center border-r border-[var(--p-line)] relative group transition-colors duration-300
                                                    ${isPast ? 'bg-[var(--glass)] cursor-not-allowed opacity-60' : isWeekendDay ? 'bg-[var(--glass)]/40' : 'bg-[var(--sidebar)]'}
                                                `}
                                            >
                                                {/* Today Marker Line */}
                                                {isToday && <div className="absolute top-0 w-full h-1 bg-[var(--p)] z-20 shadow-[0_0_8px_var(--p-glow)]"></div>}

                                                <span className={`text-[10px] font-medium mb-0.5 ${isToday ? 'text-[var(--p)] font-semibold' : isPast ? 'text-[var(--t4)]' : 'text-[var(--t3)]'}`}>
                                                    {format(day, 'EEE')}
                                                </span>
                                                <div className={`
                                                    w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300
                                                    ${isToday ? 'bg-[var(--p)] text-white shadow-lg shadow-[var(--p-glow)] scale-110 ring-2 ring-[var(--p-line)]' : isPast ? 'text-[var(--t4)]' : 'text-[var(--t2)] group-hover:bg-[var(--glass-h)]'}
                                                `}>
                                                    {format(day, 'd')}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Timeline Rows */}
                                <div className="relative bg-[var(--sidebar)]">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-0 flex pointer-events-none bg-[var(--sidebar)]">
                                        {daysInMonth.map((day, i) => (
                                            <div
                                                key={`grid-${i}`}
                                                className={`flex-shrink-0 w-14 border-r border-[var(--p-line)] h-full ${isBefore(day, startOfDay(new Date())) ? 'bg-[var(--glass)]/20' : isWeekend(day) ? 'bg-[var(--glass)]/10' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Employee Rows */}
                                    {filteredEmployees.map((emp, idx) => (
                                        <div key={emp.id} className={`h-16 border-b border-[var(--p-line)] relative flex items-center group
                                            ${idx % 2 === 0 ? 'bg-[var(--sidebar)]' : 'bg-[var(--glass)]/20'}`}
                                        >
                                            {/* Render Leave Bars (Gantt Style) */}
                                            <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                                                <div className="relative w-full h-full">
                                                    {getLeaveBars(emp["Employee Number"]).map((bar) => {
                                                        const style = getLeaveStyle(bar["Leave Type"], bar.Status);
                                                        const leftPos = bar.startOffset * 3.5; // 3.5rem = w-14
                                                        const width = bar.duration * 3.5;

                                                        return (
                                                            <div
                                                                key={bar.id}
                                                                className={`
                                      absolute top-1/2 transform -translate-y-1/2 h-10 rounded-lg
                                      ${style.bg} ${style.shadow} border-y-[1px] border-white/10 ${style.border} 
                                      flex items-center px-1.5 z-20 pointer-events-auto cursor-pointer
                                      hover:brightness-105 transition-all hover:scale-[1.02] hover:shadow-lg shadow-sm
                                    `}
                                                                style={{
                                                                    left: `${leftPos}rem`,
                                                                    width: `${width}rem`,
                                                                    marginLeft: '3px',
                                                                    marginRight: '3px'
                                                                }}
                                                                title={`${bar["Leave Type"]} - ${bar.Status}\n${format(parseISO(bar["Start Date"]), 'MMM d')} - ${format(parseISO(bar["End Date"]), 'MMM d')}`}
                                                            >
                                                                <div className="flex flex-col leading-none overflow-hidden w-full">
                                                                    <div className="flex items-center justify-between mb-0.5">
                                                                        <span className="text-[8px] font-bold text-white/80 uppercase tracking-wider">{bar.Status.slice(0, 3)}</span>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis truncate w-full">
                                                                        {bar["Leave Type"].split(' ')[0]}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Interactive Click Grid */}
                                            {daysInMonth.map((day, i) => {
                                                const isPast = isBefore(day, startOfDay(new Date()));
                                                return (
                                                    <div
                                                        key={`cell-${i}`}
                                                        className={`flex-shrink-0 w-14 h-full z-0 border-transparent border-r box-border transition-colors duration-75 
                                                            ${isPast
                                                                ? 'cursor-not-allowed bg-[var(--glass)]'
                                                                : 'hover:bg-[var(--p-dim)] hover:border-r hover:border-[var(--p-line)] cursor-cell'
                                                            }`}
                                                        title={isPast ? "Cannot schedule in the past" : `Schedule leave for ${emp["First Name"]}`}
                                                        onClick={() => {
                                                            if (!isPast && onSelectDate) {
                                                                onSelectDate(emp["Employee Number"], day);
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* --- Footer Legend --- */}
            <div className="p-4 border-t border-[var(--p-line)] bg-[var(--sidebar)] text-xs text-[var(--t3)] flex items-center justify-between shadow-2xl z-20">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[var(--p)] shadow-[0_0_8px_var(--p-glow)]"></div>
                        <span className="font-semibold text-[var(--t2)]">Approved Leave</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]"></div>
                        <span className="font-semibold text-[var(--t2)]">Pending Approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                        <span className="font-semibold text-[var(--t2)]">Rejected</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--p)] bg-[var(--glass)] px-3 py-1.5 rounded-full border border-[var(--p-line)] shadow-inner">
                    <Plus className="w-3.5 h-3.5" />
                    <span className="font-bold tracking-wider uppercase text-[9px]">Click any cell to assign</span>
                </div>
            </div>
        </div>
    );
};

export default LeaveScheduler;
