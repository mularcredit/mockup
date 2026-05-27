import React, { useState, useEffect, useRef } from "react";
import { Users, CalendarDays, Wallet, NotepadText, Phone, AlertCircle, Settings, HelpCircle, MapPin, RefreshCw, Cake, Video, BookOpen, FileText, TrendingUp, ChevronRight, Crown, Send, Network, Layers, Target, BarChart2, ClipboardCheck, UserCog, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase"
import { TownProps } from '../../types/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import StatsCard from './StatsCard';
import AttendanceHeatMap from './AttendanceHeatMap';
import GrowthRunway from './GrowthRunway';
import KPIStrip from './KPIStrip';
import RecruitmentFunnel from './RecruitmentFunnel';
import NineBoxMatrix from './NineBoxMatrix';
import RetentionGauge from './RetentionGauge';
import LifecycleMap from './LifecycleMap';
import HRDashboard from './HRDashboard';
import PayrollDashboardView from './PayrollDashboardView';
import ManagerDashboard from './ManagerDashboard';
import ESSDashboard from './ESSDashboard';
import RecruitmentView from './RecruitmentView';
import ComplianceDashboard from './ComplianceDashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Quotes } from "@phosphor-icons/react";
import LoadingSpinner from '../UI/LoadingSpinner';

const trafficData = [
  { time: '00:00', in: 200, out: 800 },
  { time: '04:00', in: 150, out: 600 },
  { time: '08:00', in: 500, out: 1800 },
  { time: '12:00', in: 900, out: 2400 },
  { time: '16:00', in: 800, out: 2100 },
  { time: '20:00', in: 1100, out: 2800 },
  { time: '23:59', in: 400, out: 1200 },
];

const loadData = [
  { name: 'SALES', value: 85 },
  { name: 'CREDIT', value: 65 },
  { name: 'TECH', value: 45 },
  { name: 'SUPPORT', value: 30 },
  { name: 'HR', value: 75 },
];

const payrollData = [
  { month: 'Jan', base: 28, bonus: 20, overtime: 14 },
  { month: 'Feb', base: 30, bonus: 21, overtime: 15 },
  { month: 'Mar', base: 31, bonus: 22, overtime: 15 },
  { month: 'Apr', base: 30, bonus: 21, overtime: 16 },
  { month: 'May', base: 33, bonus: 23, overtime: 17 },
  { month: 'Jun', base: 35, bonus: 24, overtime: 17 },
  { month: 'Jul', base: 36, bonus: 25, overtime: 18 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--sidebar)] border border-[var(--p-line)] p-3 rounded-lg shadow-2xl">
        <p className="text-[10px] font-mono text-[var(--t4)] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface AreaTownMapping {
  [area: string]: string[];
}

interface BranchAreaMapping {
  [branch: string]: string;
}

interface NewsItem {
  id: number;
  type: 'birthday' | 'conference' | 'training' | 'payslip' | 'report';
  title: string;
  description?: string;
  date: string;
  time?: string;
  participants?: string;
}

interface ActivityItem {
  id: string;
  type: 'leave' | 'advance' | 'expense';
  title: string;
  subtitle: string;
  status: string;
  date: string;
  amount?: number;
}


const DASHBOARD_VARIANTS = [
  { id: 'executive', label: 'Executive', icon: Crown },
  { id: 'hr', label: 'HR Dashboard', icon: Users },
  { id: 'payroll', label: 'Payroll', icon: Wallet },
  { id: 'manager', label: 'Manager', icon: UserCog },
  { id: 'ess', label: 'ESS', icon: LayoutDashboard },
  { id: 'recruitment', label: 'Recruitment', icon: Users },
  { id: 'compliance', label: 'Compliance', icon: ClipboardCheck },
];

const AI_INSIGHTS = [
  { type: 'warn', text: 'Sales Division showing burnout risk increase of 18% — review OT patterns' },
  { type: 'alert', text: '3 employees flagged as high attrition risk this quarter' },
  { type: 'info', text: 'Next payroll forecast: KES 12.8M (+3.2% from last month)' },
  { type: 'warn', text: 'Leave concentration detected: 6 staff off same week in Finance Dept' },
  { type: 'info', text: 'Recruitment pipeline: 2 offers pending acceptance beyond SLA' },
];

export default function DashboardMain({ selectedTown, onTownChange, selectedRegion }: TownProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDashboard, setActiveDashboard] = useState("executive");
  const [aiInsightIndex, setAiInsightIndex] = useState(0);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [showUnauthorizedPopup, setShowUnauthorizedPopup] = useState(false);
  const [stats, setStats] = useState({
    employees: 678,
    leaveRequests: 231,
    activeBranches: 48,
    departments: 12
  });
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
  const [currentTown, setCurrentTown] = useState<string>(selectedTown || '');
  const [areaTownMapping, setAreaTownMapping] = useState<AreaTownMapping>({});
  const [branchAreaMapping, setBranchAreaMapping] = useState<BranchAreaMapping>({});
  const [isArea, setIsArea] = useState<boolean>(false);
  const [townsInArea, setTownsInArea] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isSendingBirthdaySMS, setIsSendingBirthdaySMS] = useState(false);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light'));

  const navigate = useNavigate();

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

  // Phone formatting function for SMS
  const formatPhoneNumberForSMS = (phone: string): string => {
    if (!phone) return '';

    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') && cleaned.length === 9) {
      cleaned = '254' + cleaned;
    } else if (cleaned.startsWith('254') && cleaned.length === 12) {
      // Keep as is
    } else if (cleaned.startsWith('+254') && cleaned.length === 13) {
      cleaned = cleaned.substring(1);
    }

    if (cleaned.length === 12 && cleaned.startsWith('254')) {
      return cleaned;
    }

    return '';
  };

  // Send birthday SMS function
  const sendBirthdaySMS = async (employeeName: string, phoneNumber: string) => {
    try {
      const formattedPhone = formatPhoneNumberForSMS(phoneNumber);

      if (!formattedPhone) {
        throw new Error(`Invalid phone number: ${phoneNumber}`);
      }

      const birthdayMessage = `Happy Birthday ${employeeName}! 🎉 Wishing you a fantastic year ahead from Mular Credit Team`;
      const apiKey = '17323514aa8ce2613e358ee029e65d99';
      const partnerID = '928';
      const shortcode = 'MularCredit';
      const encodedMessage = encodeURIComponent(birthdayMessage);

      const url = `https://isms.celcomafrica.com/api/services/sendsms/?apikey=${apiKey}&partnerID=${partnerID}&message=${encodedMessage}&shortcode=${shortcode}&mobile=${formattedPhone}`;

      console.log('Sending birthday SMS to:', formattedPhone);

      await fetch(url, {
        method: 'GET',
        mode: 'no-cors'
      });

      // Log to database
      await supabase.from('sms_logs').insert({
        recipient_phone: formattedPhone,
        message: birthdayMessage,
        status: 'sent',
        sender_id: shortcode,
        created_at: new Date().toISOString()
      });

      return { success: true, message: 'SMS sent successfully' };

    } catch (error) {
      console.error('SMS Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Send birthday SMS to all today's birthdays
  const sendAllBirthdaySMS = async () => {
    setIsSendingBirthdaySMS(true);

    try {
      // Find birthday employees
      const { data: employees } = await supabase
        .from('employees')
        .select('"First Name", "Last Name", "Mobile Number", "Personal Mobile", "Work Mobile", "Date of Birth"')
        .not('Date of Birth', 'is', null);

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();

      const birthdayEmployees = employees?.filter(emp => {
        if (!emp['Date of Birth']) return false;
        try {
          const birthDate = new Date(emp['Date of Birth']);
          return birthDate.getMonth() + 1 === currentMonth &&
            birthDate.getDate() === currentDay;
        } catch (e) {
          return false;
        }
      }).map(emp => {
        const rawPhone = emp['Mobile Number'] || emp['Personal Mobile'] || emp['Work Mobile'] || '';
        const phone = formatPhoneNumberForSMS(rawPhone);
        const fullName = `${emp['First Name'] || ''} ${emp['Last Name'] || ''}`.trim();

        return { name: fullName, phone: phone };
      }).filter(emp => emp.phone && emp.phone.length === 12 && emp.phone.startsWith('254'));

      if (!birthdayEmployees || birthdayEmployees.length === 0) {
        toast.error('No birthdays with valid phone numbers today');
        setIsSendingBirthdaySMS(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < birthdayEmployees.length; i++) {
        const employee = birthdayEmployees[i];

        try {
          const result = await sendBirthdaySMS(employee.name, employee.phone);

          if (result.success) {
            successCount++;
            toast.success(`Sent to ${employee.name}`, { duration: 1500 });
          } else {
            failCount++;
          }

          // Wait between SMS
          if (i < birthdayEmployees.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`🎉 Sent ${successCount} birthday SMS successfully!`);
      }
      if (failCount > 0) {
        toast.error(`Failed to send ${failCount} SMS`);
      }

    } catch (error) {
      toast.error('Error sending birthday SMS');
      console.error(error);
    } finally {
      setIsSendingBirthdaySMS(false);
      // Refresh news
      fetchBirthdayNews();
    }
  };

  // Fetch birthday news from employees table
  const fetchBirthdayNews = async () => {
    setIsNewsLoading(true);
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();

      const { data: employees, error } = await supabase
        .from('employees')
        .select('"First Name", "Last Name", "Mobile Number", "Date of Birth", Town, Branch');

      if (error) {
        console.error('Error fetching employees for birthdays:', error);
        return;
      }

      // Filter employees with birthdays today
      const todaysBirthdays = employees?.filter(employee => {
        if (!employee['Date of Birth']) return false;

        try {
          const birthDate = new Date(employee['Date of Birth']);
          const birthMonth = birthDate.getMonth() + 1;
          const birthDay = birthDate.getDate();

          return birthMonth === currentMonth && birthDay === currentDay;
        } catch (e) {
          return false;
        }
      }) || [];

      // Create birthday news item
      const birthdayNewsItem: NewsItem = {
        id: 1,
        type: 'birthday',
        title: 'Today\'s Birthdays',
        description: todaysBirthdays.length > 0
          ? `${todaysBirthdays.slice(0, 3).map(emp => `${emp['First Name']} ${emp['Last Name']}`).join(', ')}${todaysBirthdays.length > 3 ? ` and ${todaysBirthdays.length - 3} others` : ''}`
          : 'No birthdays today',
        date: 'Today',
        time: 'All day'
      };

      // Check for upcoming birthdays (next 7 days)
      const upcomingBirthdays = employees?.filter(employee => {
        if (!employee['Date of Birth']) return false;

        try {
          const birthDate = new Date(employee['Date of Birth']);
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);

          const birthDateThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

          return birthDateThisYear > today && birthDateThisYear <= nextWeek;
        } catch (e) {
          return false;
        }
      }) || [];

      const upcomingNewsItem: NewsItem = {
        id: 2,
        type: 'birthday',
        title: 'Upcoming Birthdays',
        description: upcomingBirthdays.length > 0
          ? `${upcomingBirthdays.length} employees have birthdays next week`
          : 'No upcoming birthdays',
        date: 'Next week'
      };

      // Other static news items
      const otherNewsItems: NewsItem[] = [
        {
          id: 3,
          type: 'conference',
          title: 'Quarterly Review Meeting',
          description: 'All managers required to attend the virtual conference',
          date: 'Tomorrow',
          time: '10:00 AM'
        },
        {
          id: 4,
          type: 'training',
          title: 'New Safety Training',
          description: 'Mandatory training session for all employees',
          date: 'Next Monday',
          time: '2:00 PM'
        },
        {
          id: 5,
          type: 'payslip',
          title: 'Payslips Available',
          description: 'March payroll processed and available for download',
          date: 'Available now'
        }
      ];

      setNewsItems([birthdayNewsItem, upcomingNewsItem, ...otherNewsItems]);

    } catch (error) {
      console.error('Error in fetchBirthdayNews:', error);
    } finally {
      setIsNewsLoading(false);
    }
  };

  // Fetch recent activity data
  const fetchRecentActivity = async (branchFilter?: string) => {
    try {
      let leaveQuery = supabase.from('leave_application').select('*').order('created_at', { ascending: false }).limit(8);

      if (branchFilter && branchFilter !== 'ADMIN_ALL') {
        leaveQuery = leaveQuery.ilike('Office Branch', `%${branchFilter}%`);
      }

      const [
        { data: leaves }
      ] = await Promise.all([leaveQuery]);

      const activities: ActivityItem[] = [];

      (leaves || []).forEach((l: any) => {
        activities.push({
          id: `leave-${l.id}`,
          type: 'leave',
          title: `Leave: ${l['Leave Type'] || 'General'}`,
          subtitle: l['Employee Name'] || `Emp #${l['Employee Number']}`,
          status: l.Status || 'Pending',
          date: l.created_at || l['Start Date'] || new Date().toISOString()
        });
      });

      // Sort by date desc and take top 8
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(activities.slice(0, 8));
    } catch (err) {
      console.error("Error fetching recent activity:", err);
    }
  };

  // Load area-town mapping and saved town from localStorage on component mount
  useEffect(() => {
    const loadMappings = async () => {
      try {
        // Fetch the area-town mapping from the database
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('Branch, Town');

        if (employeesError) {
          console.error("Error loading area-town mapping:", employeesError);
          return;
        }

        // Convert the data to a mapping object
        const mapping: AreaTownMapping = {};
        employeesData?.forEach(item => {
          if (item.Branch && item.Town) {
            if (!mapping[item.Branch]) {
              mapping[item.Branch] = [];
            }
            mapping[item.Branch].push(item.Town);
          }
        });

        setAreaTownMapping(mapping);
        setDebugInfo("Mappings loaded successfully");
      } catch (error) {
        console.error("Error in loadMappings:", error);
        setDebugInfo(`Error loading mappings: ${error.message}`);
      }
    };

    loadMappings();

    const savedTown = localStorage.getItem('selectedTown');
    if (savedTown && (!selectedTown || selectedTown === 'ADMIN_ALL')) {
      setCurrentTown(savedTown);
      if (onTownChange) {
        onTownChange(savedTown);
      }
      setDebugInfo(`Loaded saved town from storage: "${savedTown}"`);
    } else if (selectedTown) {
      setCurrentTown(selectedTown);
      localStorage.setItem('selectedTown', selectedTown);
      setDebugInfo(`Using town from props: "${selectedTown}"`);
    }
  }, [selectedTown, onTownChange]);

  // Check if current selection is an area and get its towns
  useEffect(() => {
    if (currentTown && areaTownMapping[currentTown]) {
      setIsArea(true);
      setTownsInArea(areaTownMapping[currentTown]);
      setDebugInfo(`"${currentTown}" is an area containing towns: ${areaTownMapping[currentTown].join(', ')}`);
    } else {
      setIsArea(false);
      setTownsInArea([]);
    }
  }, [currentTown, areaTownMapping]);

  const fetchIdRef = useRef(0);

  // Fetch data from Supabase with town/area filtering
  useEffect(() => {
    const currentFetchId = ++fetchIdRef.current;

    // Slight debounce so we don't fetch intermediate states
    const timer = setTimeout(() => {
      if (currentFetchId === fetchIdRef.current) {
        fetchDashboardData(currentFetchId);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentTown, townsInArea, isArea]);

  // Load news when component mounts
  useEffect(() => {
    fetchBirthdayNews();
  }, []);

  // Fetch ALL data for dashboard
  const fetchDashboardData = async (fetchId: number) => {
    setIsLoading(true);
    console.log('🔍 Fetching data for:', currentTown);

    try {
      // If ADMIN_ALL or no town selected, fetch all data
      if (currentTown === 'ADMIN_ALL' || !currentTown) {
        await fetchAllData(fetchId);
      } else if (isArea && townsInArea.length > 0) {
        await fetchDataForArea(fetchId);
      } else if (!isArea) {
        await fetchDataForTown(fetchId);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Fetch all data (admin view)
  const fetchAllData = async (fetchId: number) => {
    try {
      // Fetch all counts
      const [
        { count: employeesCount },
        { count: leaveRequestsCount },
        { count: branchesCount }
      ] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('leave_application').select('*', { count: 'exact', head: true }),
        supabase.from('kenya_branches').select('*', { count: 'exact', head: true })
      ]);

      if (fetchId !== fetchIdRef.current) return;

      setStats({
        employees: employeesCount || 678,
        leaveRequests: leaveRequestsCount || 231,
        activeBranches: branchesCount || 48,
        departments: 12
      });

      setDebugInfo(`Showing ALL data | Employees: ${employeesCount} | Leaves: ${leaveRequestsCount} | Branches: ${branchesCount}`);

      await fetchRecentActivity('ADMIN_ALL');
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  };

  // Fetch data for specific town
  const fetchDataForTown = async (fetchId: number) => {
    try {
      console.log('Fetching data for town:', currentTown);

      // Try multiple approaches to filter data
      let employeesCount = 0;
      let leaveRequestsCount = 0;
      let salaryAdvancesCount = 0;
      let expensesCount = 0;

      // 1. Try exact match in Town column
      let { count: townEmployees, error: townError } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('Town', currentTown);

      if (!townError && (townEmployees || 0) > 0) {
        console.log('Found employees by Town column:', townEmployees);
        employeesCount = townEmployees || 0;

        // Try to find branch for this town
        const { data: branchData } = await supabase
          .from('kenya_branches')
          .select('"Branch Office"')
          .ilike('Area', `%${currentTown}%`)
          .limit(1);

        const branch = branchData?.[0]?.['Branch Office'];

        if (branch) {
          console.log('Using branch for filtering:', branch);

          const [
            { count: leaves },
            { count: advances },
            { count: exp }
          ] = await Promise.all([
            supabase.from('leave_application').select('*', { count: 'exact', head: true }).eq('Office Branch', branch),
            supabase.from('salary_advance').select('*', { count: 'exact', head: true }).eq('Office Branch', branch),
            supabase.from('expenses').select('*', { count: 'exact', head: true }).eq('branch', branch)
          ]);

          leaveRequestsCount = leaves || 0;
          salaryAdvancesCount = advances || 0;
          expensesCount = exp || 0;
        }
      }
      // 2. Try Branch column if Town didn't work
      else {
        console.log('Trying Branch column...');
        const { count: branchEmployees, error: branchError } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('Branch', currentTown);

        if (!branchError && (branchEmployees || 0) > 0) {
          console.log('Found employees by Branch column:', branchEmployees);
          employeesCount = branchEmployees || 0;

          const [
            { count: leaves },
            { count: advances },
            { count: exp }
          ] = await Promise.all([
            supabase.from('leave_application').select('*', { count: 'exact', head: true }).ilike('Office Branch', `%${currentTown}%`),
            supabase.from('salary_advance').select('*', { count: 'exact', head: true }).ilike('Office Branch', `%${currentTown}%`),
            supabase.from('expenses').select('*', { count: 'exact', head: true }).ilike('branch', `%${currentTown}%`)
          ]);

          leaveRequestsCount = leaves || 0;
          salaryAdvancesCount = advances || 0;
          expensesCount = exp || 0;
        }
        // 3. Try partial match as last resort
        else {
          console.log('Trying partial match...');
          const { count: partialEmployees, error: partialError } = await supabase
            .from('employees')
            .select('*', { count: 'exact', head: true })
            .ilike('Town', `%${currentTown}%`);

          if (!partialError) {
            employeesCount = partialEmployees || 0;

            const [
              { count: leaves },
              { count: advances },
              { count: exp }
            ] = await Promise.all([
              supabase.from('leave_application').select('*', { count: 'exact', head: true }).ilike('Office Branch', `%${currentTown}%`),
              supabase.from('salary_advance').select('*', { count: 'exact', head: true }).ilike('Office Branch', `%${currentTown}%`),
              supabase.from('expenses').select('*', { count: 'exact', head: true }).ilike('branch', `%${currentTown}%`)
            ]);

            leaveRequestsCount = leaves || 0;
            salaryAdvancesCount = advances || 0;
            expensesCount = exp || 0;
          }
        }
      }

      // If everything is 0, fetch all data
      if (employeesCount === 0 && leaveRequestsCount === 0) {
        console.log('No data found for town, fetching all data...');
        await fetchAllData(fetchId);
        return;
      }

      if (fetchId !== fetchIdRef.current) return;

      setStats({
        employees: employeesCount || 678,
        leaveRequests: leaveRequestsCount || 231,
        activeBranches: 1,
        departments: 12
      });

      setDebugInfo(`Town: "${currentTown}" | Employees: ${employeesCount} | Leaves: ${leaveRequestsCount}`);

      await fetchRecentActivity(currentTown);

    } catch (error) {
      console.error('Error in fetchDataForTown:', error);
      // On error, try to fetch all data
      await fetchAllData(fetchId);
    }
  };

  // Fetch data for area
  const fetchDataForArea = async (fetchId: number) => {
    try {
      console.log('Fetching data for area:', currentTown, 'Towns:', townsInArea);

      if (!townsInArea.length) {
        await fetchAllData(fetchId);
        return;
      }

      // Fetch employees for all towns in area
      const { count: employeesCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .in('Town', townsInArea);

      // For other tables, we need to find branches for these towns
      const { data: branchesData } = await supabase
        .from('kenya_branches')
        .select('"Branch Office"')
        .in('Area', townsInArea);

      const branches = branchesData?.map(b => b['Branch Office']).filter(Boolean) || [];

      let leaveRequestsCount = 0;
      let salaryAdvancesCount = 0;
      let expensesCount = 0;

      if (branches.length > 0) {
        const [
          { count: leaves },
          { count: advances },
          { count: exp }
        ] = await Promise.all([
          supabase.from('leave_application').select('*', { count: 'exact', head: true }).in('Office Branch', branches),
          supabase.from('salary_advance').select('*', { count: 'exact', head: true }).in('Office Branch', branches),
          supabase.from('expenses').select('*', { count: 'exact', head: true }).in('branch', branches)
        ]);

        leaveRequestsCount = leaves || 0;
        salaryAdvancesCount = advances || 0;
        expensesCount = exp || 0;
      }

      if (fetchId !== fetchIdRef.current) return;

      setStats({
        employees: employeesCount || 678,
        leaveRequests: leaveRequestsCount || 231,
        activeBranches: branches.length || townsInArea.length || 48,
        departments: 12
      });

      setDebugInfo(`Area: "${currentTown}" (${townsInArea.length} towns) | Employees: ${employeesCount} | Leaves: ${leaveRequestsCount}`);

      await fetchRecentActivity(currentTown);

    } catch (error) {
      console.error('Error in fetchDataForArea:', error);
      await fetchAllData(fetchId);
    }
  };

  // Cycle active AI insight every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAiInsightIndex(i => (i + 1) % AI_INSIGHTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    const currentFetchId = ++fetchIdRef.current;
    fetchDashboardData(currentFetchId);
    fetchBirthdayNews();
  };

  // Get town/area display name
  const getDisplayName = () => {
    if (!currentTown) return "All Towns";
    if (currentTown === 'ADMIN_ALL') return "All Towns";

    if (isArea) {
      return `${currentTown} Region`;
    }

    return currentTown;
  };

  // Get icon for news type
  const getNewsIcon = (type: NewsItem['type']) => {
    switch (type) {
      case 'birthday': return <Cake className="w-4 h-4" />;
      case 'conference': return <Video className="w-4 h-4" />;
      case 'training': return <BookOpen className="w-4 h-4" />;
      case 'payslip': return <FileText className="w-4 h-4" />;
      case 'report': return <TrendingUp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Get background color for news type
  const getNewsBgColor = (type: NewsItem['type']) => {
    switch (type) {
      case 'birthday': return 'bg-pink-50';
      case 'conference': return 'bg-blue-50';
      case 'training': return 'bg-green-50';
      case 'payslip': return 'bg-purple-50';
      case 'report': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  // Get text color for news type
  const getNewsTextColor = (type: NewsItem['type']) => {
    switch (type) {
      case 'birthday': return 'text-pink-600';
      case 'conference': return 'text-blue-600';
      case 'training': return 'text-green-600';
      case 'payslip': return 'text-purple-600';
      case 'report': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  // Mock trends for "Silicon Valley" look
  const getTrend = (value: number, type: 'up' | 'down' | 'neutral') => {
    const isPositive = type === 'up';
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center ${isPositive ? 'bg-green-100 text-green-700' : type === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
        {type === 'neutral' ? <div className="w-2 h-2 rounded-full bg-gray-400 mr-1" /> : isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
        {type === 'neutral' ? '0%' : `${Math.floor(Math.random() * 20) + 5}%`}
      </span>
    );
  };

  return (
    <div className="w-full animate-pgIn">

      {/* Toasts */}
      <AnimatePresence>
        {showUnauthorizedPopup && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-5 right-5 flex items-center gap-2 px-4 py-3 bg-[var(--red-d)] border border-[var(--red-glow)] rounded-xl z-[1000] shadow-2xl">
            <AlertCircle className="w-4 h-4 text-[var(--red)]" />
            <span className="text-[11px] font-bold text-[var(--red)] tracking-widest">Access Denied</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <LoadingSpinner message="Loading" />
      ) : (
        <>
          {/* ── DASHBOARD VARIANT SELECTOR ── */}
          <div className="flex items-center gap-1 mb-5 overflow-x-auto scrollbar-hide pb-1">
            {DASHBOARD_VARIANTS.map(v => {
              const Icon = v.icon;
              const isActive = activeDashboard === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveDashboard(v.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all border shrink-0
                    ${isActive
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                      : 'border-[var(--p-line)] text-[var(--t3)] hover:text-[var(--t1)] hover:border-[var(--t4)] bg-transparent'
                    }`}
                >
                  <Icon className="w-3 h-3" />
                  {v.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse ml-0.5" />}
                </button>
              );
            })}
          </div>

          {/* ── AI INSIGHTS ROW ── */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide pb-0.5">
            {AI_INSIGHTS.map((insight, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg shrink-0 transition-opacity ${
                  i === aiInsightIndex ? 'opacity-100' : 'opacity-40'
                }`}
                style={{ background: 'var(--glass)' }}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  insight.type === 'alert' ? 'bg-[var(--red)]' :
                  insight.type === 'warn' ? 'bg-[var(--amber)]' : 'bg-[#00E5FF]'
                }`} />
                <span className="text-[10px] text-[var(--t2)] whitespace-nowrap">{insight.text}</span>
              </div>
            ))}
          </div>

          {/* ── ROLE DASHBOARD VIEWS ── */}
          {activeDashboard === 'hr' && <HRDashboard />}
          {activeDashboard === 'payroll' && <PayrollDashboardView />}
          {activeDashboard === 'manager' && <ManagerDashboard />}
          {activeDashboard === 'ess' && <ESSDashboard />}
          {activeDashboard === 'recruitment' && <RecruitmentView />}
          {activeDashboard === 'compliance' && <ComplianceDashboard />}

          {(activeDashboard === 'executive' || activeDashboard === 'learning') && <>

          {/* ── KPI STRIP (Refined Density) ── */}
          <KPIStrip
            items={[
              { label: 'Total Employees', value: stats.employees.toLocaleString(), trend: '+12 this month', trendType: 'up' },
              { label: 'On Leave Today', value: '38', trend: '→ View Department Impact', trendType: 'up' },
              { label: "Payroll Processed", value: 'KES 12.4M', trend: '→ 5 Exceptions Pending', trendType: 'warn' },
              { label: 'Open Positions', value: '14', trend: '→ 5 Delayed Beyond SLA', trendType: 'warn' },
              { label: 'Expiring Contracts', value: '12', trend: '→ 4 Require Immediate Action', trendType: 'warn' },
              { label: 'Compliance Score', value: '98%', trend: '→ 2 Pending Filings', trendType: 'up' },
              { label: 'Attrition Risk', value: '16', trend: 'Employees Flagged High Risk', trendType: 'dn' },
              { label: 'Attendance Rate', value: '94.7%', trend: 'Workforce Present Today', trendType: 'up' },
            ]}
            columns={8}
          />

          {/* ── LIFECYCLE MAP (Employee Journey) ── */}
          <LifecycleMap />

          {/* ── INSIGHT BAND (Integrated from claude.html) ── */}
          <div className="grid grid-cols-10 gap-px bg-[var(--p-line)] border border-[var(--p-line)] rounded-xl overflow-hidden mb-7 shadow-xl">
            {[
              { label: 'PAYE Deducted', val: 'Kes 1.4m', sub: 'Ready for iTax', color: 'var(--t1)' },
              { label: 'NSSF Deducted', val: 'Kes 420k', sub: 'Tier I & II', color: 'var(--t1)' },
              { label: 'SHA Deducted', val: 'Kes 341k', sub: '2.75% applied', color: 'var(--t1)' },
              { label: 'Housing Levy', val: 'Kes 186k', sub: 'Ready for Boma Yangu', color: 'var(--t1)' },
              { label: 'Net Salaries to Pay', val: 'Kes 10.1m', sub: 'To Bank / M-Pesa', color: 'var(--green)' },
            ].map((ib, i) => (
              <div key={i} className="col-span-10 md:col-span-2 bg-[var(--card)] p-4 hover:bg-[var(--card-h)] transition-colors group">
                <div className="text-[9px] font-bold text-[var(--t2)] mb-2 tracking-widest">{ib.label}</div>
                <div className="text-[17px] font-bold tracking-tight tabular-nums" style={{ color: ib.color }}>{ib.val}</div>
                <div className="text-[9px] text-[var(--t3)] mt-1 font-medium">{ib.sub}</div>
              </div>
            ))}
          </div>

          {/* ── ROW 1.5: Heatmap & Growth Runway ── */}
          <div className="grid grid-cols-12 gap-3 mb-7">
            <div className="col-span-12 lg:col-span-5">
              <AttendanceHeatMap />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <GrowthRunway />
            </div>
          </div>

          {/* ── ROW 1.6: Recruitment Funnel & Nine Box Matrix & Retention Gauge ── */}
          <div className="grid grid-cols-12 gap-3 mb-7">
            <div className="col-span-12 lg:col-span-4">
              <RecruitmentFunnel />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <NineBoxMatrix />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <RetentionGauge 
                label="Retention Index" 
                sublabel="Rolling 12-month average"
                value={96.8}
              />
            </div>
          </div>

          {/* ── ROW 2: Compensation Trends & Flight Risk ── */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="glass-card col-span-12 lg:col-span-8" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)' }}>Payroll Trends</div>
                  <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '2px' }}>Total salaries paid over the last 7 months (in KES)</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 500, color: 'var(--gold)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />Audited
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                {[['var(--p)', 'Base Pay'], ['var(--green)', 'Bonuses'], ['rgba(0, 229, 255,0.8)', 'Overtime']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--t2)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={payrollData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--p)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--p)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gBonus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--green)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gOvertime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(0, 229, 255,0.8)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="rgba(0, 229, 255,0.8)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
                  <XAxis dataKey="month" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="base" stroke="var(--p)" fill="url(#gBase)" strokeWidth={1.5} name="BASE PAY (M)" />
                  <Area type="monotone" dataKey="bonus" stroke="var(--green)" fill="url(#gBonus)" strokeWidth={1.5} name="BONUSES (M)" />
                  <Area type="monotone" dataKey="overtime" stroke="rgba(0, 229, 255,0.8)" fill="url(#gOvertime)" strokeWidth={1.5} name="OVERTIME (M)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card col-span-12 lg:col-span-4" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)', marginBottom: '4px' }}>Headcount by Department</div>
              <div style={{ fontSize: '10px', color: 'var(--t3)', marginBottom: '14px' }}>Where are your employees placed?</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={loadData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="var(--t4)" fontSize={10} tickLine={false} axisLine={false} width={55} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--glass)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10}>
                    {loadData.map((_, idx) => {
                      const cols = ['#FF4D4D', '#00E5FF', '#FFB300', '#00F59B', '#00E5FF'];
                      return <Cell key={idx} fill={cols[idx % cols.length]} fillOpacity={0.8} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Trio footer */}
              <div style={{ display: 'flex', borderTop: '1px solid var(--p-line)', marginTop: '12px', paddingTop: '12px' }}>
                {[['712', 'Total Staff'], ['4', 'New this month'], ['2', 'Left this month']].map(([n, l]) => (
                  <div key={l} style={{ flex: 1, textAlign: 'center', borderLeft: 'none' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)' }}>{n}</div>
                    <div style={{ fontSize: '9px', color: 'var(--t3)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* ── ROW 4: Operational Action Center + News Bulletins + Quick Stats ── */}
          <div className="grid grid-cols-12 gap-3">
            {/* Operational Action Center */}
            <div className="glass-card col-span-12 lg:col-span-5" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '18px', borderBottom: '1px solid var(--p-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)' }}>Operational Action Center</div>
                  <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: 2 }}>Items requiring your attention now</div>
                </div>
                <span style={{ fontSize: '9px', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.08em' }}>ACTION NEEDED</span>
              </div>
              <div style={{ padding: '12px 18px', overflowY: 'auto', maxHeight: 320 }} className="custom-scrollbar">
                {[
                  { category: 'Approvals', items: [
                    { act: 'Leave request — S. Kiprono', time: 'Since yesterday', col: 'var(--amber)' },
                    { act: 'Payroll run approval pending', time: 'Due today', col: 'var(--amber)' },
                  ]},
                  { category: 'Critical Alerts', items: [
                    { act: 'Probation ending — A. Ochieng (3 days)', time: 'Action needed', col: 'var(--red)' },
                    { act: '12 contracts expiring this month', time: '4 critical', col: 'var(--red)' },
                  ]},
                  { category: 'Compliance Warnings', items: [
                    { act: 'SHA numbers missing for 4 new hires', time: 'Before payroll', col: 'var(--p)' },
                    { act: '2 statutory filings overdue', time: 'PAYE + NSSF', col: 'var(--p)' },
                  ]},
                  { category: 'Workforce Risks', items: [
                    { act: 'H. Njoroge — missed clock-in today', time: 'Absent', col: 'var(--red)' },
                    { act: 'Burnout risk: Sales Division OT spike', time: '+18% this week', col: 'var(--amber)' },
                  ]},
                  { category: 'Recruitment Delays', items: [
                    { act: '5 open positions beyond SLA', time: '>14 days', col: 'var(--amber)' },
                  ]},
                ].map((group, gi) => (
                  <div key={gi} className="mb-1">
                    <div style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--t4)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 0 4px' }}>{group.category}</div>
                    {group.items.map((log, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '7px 0', borderBottom: '1px solid var(--glass)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: log.col, marginTop: 4, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.act}</div>
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--t4)', whiteSpace: 'nowrap' }}>{log.time}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Briefs */}
            <div className="glass-card col-span-12 lg:col-span-4" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '18px', borderBottom: '1px solid var(--p-line)' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)' }}>Company Announcements</div>
                <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: 2 }}>Notice board</div>
              </div>
              <div style={{ padding: '12px 18px', overflowY: 'auto', maxHeight: 300 }} className="custom-scrollbar">
                {isNewsLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ height: 40, background: 'var(--glass)', borderRadius: 8, animation: 'blink 1.6s ease infinite' }} />)}
                  </div>
                ) : newsItems.slice(0, 5).map(news => (
                  <div key={news.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--glass)', cursor: 'pointer' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sidebar)', border: '1px solid var(--p-line)', color: 'var(--p)' }}>
                      {getNewsIcon(news.type)}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{news.title}</div>
                      <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 2 }}>{news.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick metric tiles */}
            <div className="glass-card col-span-12 lg:col-span-3" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)', marginBottom: 14 }}>Statutory & Action Items</div>
              {[
                { label: 'Missing KRA PINs', val: '2', color: 'var(--amber)' },
                { label: 'Pending SHA Numbers', val: '14', color: 'var(--red)' },
                { label: 'Exp. Contracts', val: '3', color: 'var(--p)' },
                { label: 'P9A Forms Ready', val: '100%', color: 'var(--green)' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--glass)' }}>
                  <span style={{ fontSize: 11, color: 'var(--t2)' }}>{m.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.val}</span>
                </div>
              ))}
              <button
                onClick={sendAllBirthdaySMS}
                disabled={isSendingBirthdaySMS}
                className="f-btn shimmer w-full mt-4"
                style={{ fontSize: '11px', padding: '10px 0', justifyContent: 'center' }}
              >
                <Send className="w-3.5 h-3.5" />
                {isSendingBirthdaySMS ? 'Sending...' : 'Send Birthday SMS'}
              </button>
            </div>
          </div>

          </>}
        </>
      )}
    </div>
  );
}
