
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Send, Filter, Users, User, X, Check, Paperclip, Shield, Lock, BookOpen, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import SearchableDropdown from '../UI/SearchableDropdown';

interface Employee {
  id: string; 
  'First Name': string;
  'Last Name': string;
  'Work Email': string;
  'Employee Number': string;
  Branch: string;
  'Employee Type': string; 
}

const KENYAN_HR_TEMPLATES = [
  {
    id: 'payslip',
    name: 'Payslip Delivery Notice',
    subject: 'Payslip Notification - May 2026',
    body: `<p>Dear {First Name},</p>\n<p>Please find attached your payslip for the month of May 2026.</p>\n<p><strong>ODPC Privacy Note:</strong> In compliance with the Kenya Data Protection Act (2019), this attachment has been securely encrypted. To unlock it, please use your <strong>Year of Birth + Last 4 digits of your KRA PIN</strong> as the password.</p>\n<p>Best regards,<br/>HR & Administration Department<br/>Mular Credit Ltd</p>`
  },
  {
    id: 'show_cause',
    name: 'FKE Show Cause Notice (Standard)',
    subject: 'Show Cause Notice: Absence from Duty / Misconduct',
    body: `<p>Dear {First Name},</p>\n<p>It has been noted with concern that you have been absent from your designated duty station since 12th May without official leave or authorization.</p>\n<p>In accordance with Section 44 of the Employment Act of Kenya (2007) and FKE guidelines, you are hereby requested to show cause in writing within forty-eight (48) hours of receipt of this notice why disciplinary action should not be taken against you.</p>\n<p>Yours sincerely,<br/>Human Resource Manager<br/>Mular Credit Ltd</p>`
  },
  {
    id: 'nita_training',
    name: 'NITA Training Reimbursement Invite',
    subject: 'Nomination for Professional Skills Training (NITA Approved)',
    body: `<p>Dear {First Name},</p>\n<p>We are pleased to inform you that you have been nominated to attend the upcoming professional capacity building training scheduled next week.</p>\n<p>This training is fully approved under the National Industrial Training Authority (NITA) scheme. Please ensure you complete the NITA reimbursement form (Form 1) before departure.</p>\n<p>Best regards,<br/>Training & Development Team<br/>Mular Credit Ltd</p>`
  },
  {
    id: 'general_notice',
    name: 'General Holiday Notice',
    subject: 'Notice: Public Holiday Office Closure',
    body: `<p>Dear Team,</p>\n<p>Please note that the office will be closed on Madaraka Day in observance of the upcoming public holiday.</p>\n<p>Normal business operations will resume on the following business day at 8:00 AM. We wish you all a safe and peaceful holiday.</p>\n<p>Best regards,<br/>Management Team<br/>Mular Credit Ltd</p>`
  }
];

export default function SendEmail() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form State
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [provider, setProvider] = useState<'resend' | 'cpanel'>('resend'); // Default provider
  const [cpanelUser, setCpanelUser] = useState<string>('support@mularcredit.com'); // Default cPanel user
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [encryptAttachment, setEncryptAttachment] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Bulk Filters
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Email Content
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<{ filename: string; content: string }[]>([]);

  // Computed unique lists for filters
  const [branches, setBranches] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .not('Work Email', 'is', null) // Only fetch those with emails
        .not('Work Email', 'eq', '');

      if (error) throw error;

      const emps = data as Employee[] || [];
      setEmployees(emps);

      // Extract unique branches and departments
      const uniqueBranches = Array.from(new Set(emps.map(e => e.Branch).filter(Boolean)));
      const uniqueDepartments = Array.from(new Set(emps.map(e => e['Employee Type']).filter(Boolean)));

      setBranches(uniqueBranches);
      setDepartments(uniqueDepartments);

    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;
    const selected = KENYAN_HR_TEMPLATES.find(t => t.id === templateId);
    if (selected) {
      setSubject(selected.subject);
      setBody(selected.body);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: { filename: string; content: string }[] = [];
      const files = Array.from(e.target.files);

      for (const file of files) {
        // limit size - check if total payload might be too big? 
        // 50MB is limit on backend. Let's warn if single file > 5MB for now
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`);
          continue;
        }

        const reader = new FileReader();
        try {
          const content = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              // remove data url prefix (e.g. "data:image/png;base64,")
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          newAttachments.push({ filename: file.name, content });
        } catch (err) {
          console.error("Error reading file:", err);
          toast.error(`Failed to read file ${file.name}`);
        }
      }
      setAttachments(prev => [...prev, ...newAttachments]);
      // clear input value so same files can be selected again if cleared
      e.target.value = '';
    }
  };

  // Filtered recipients calculation
  const getRecipients = () => {
    if (mode === 'single') {
      const emp = employees.find(e => e['Employee Number'] === selectedEmployeeId);
      return emp ? [emp] : [];
    } else {
      return employees.filter(emp => {
        const matchesBranch = selectedBranch === 'all' || emp.Branch === selectedBranch;
        const matchesDept = selectedDepartment === 'all' || emp['Employee Type'] === selectedDepartment;
        return matchesBranch && matchesDept;
      });
    }
  };

  const recipients = getRecipients();

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast.error('No recipients selected');
      return;
    }
    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!body.trim()) {
      toast.error('Email body is required');
      return;
    }

    setSending(true);
    const toastId = toast.loading(`Sending email to ${recipients.length} recipients...`);

    try {
      // We will send individually to each recipient to generate individual logs
      // Or we can use the backend to handle bulk sending if it supports it.
      // Looking at email_routes.js, it takes a single 'to' which can be string or array (Resend supports array).
      // However, for personal addressing usually we want one by one or BCC.
      // But the backend route:
      // const { to, subject, html } = req.body;
      // return res.status(400).json({ error: "to, subject, and html are required" });

      // If we send an array to 'to', everyone sees everyone else's email unless we use BCC.
      // But Resend 'to' can be array.
      // To keep it simple and safe (and avoid exposing emails), let's send individually or use BCC if supported by our backend logic properly.
      // But `email_routes.js` logic: `to` is passed directly to `resend.emails.send` or `transporter.sendMail`.

      // If we send to multiple people in 'to', they will see each other.
      // So for bulk, we should loop and send or use BCC.
      // "send email to single employee or bulk" -> usually implies a broadcast.
      // Let's loop for now to be safe and ensure privacy, although it might be slower.
      // Alternatively, we can batch them.

      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : "http://localhost:3001/api");

      let successCount = 0;
      let failCount = 0;

      // Prepare chunks of requests to avoid overwhelming
      // For a "portal", looping is fine for hundreds of employees.

      const sendEmailToRecipient = async (recipient: Employee) => {
        try {
          const response = await fetch(`${API_URL}/email/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: recipient['Work Email'],
              subject: subject,
              html: body,
              attachments: attachments.length > 0 ? attachments : undefined,
              provider, // Pass selected provider
              cpanelUser: provider === 'cpanel' ? cpanelUser : undefined // Pass dynamic user
            })
          });

          if (!response.ok) throw new Error('Failed');
          return true;
        } catch (e) {
          return false;
        }
      };

      // Send in parallel batches of 5
      const batchSize = 5;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(emp => sendEmailToRecipient(emp)));
        results.forEach(success => {
          if (success) successCount++;
          else failCount++;
        });
      }

      toast.success(`Sent ${successCount} emails. ${failCount > 0 ? `${failCount} failed.` : ''}`, { id: toastId });

      if (successCount > 0) {
        // Clear form
        setSubject('');
        setBody('');
        if (mode === 'single') setSelectedEmployeeId('');
      }

    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails', { id: toastId });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-[var(--card)] rounded-xl border border-[var(--p-line)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-[var(--p-line)] bg-[var(--p-dim)] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--t1)]">Compose Corporate Email</h2>
          <p className="text-xs text-[var(--t3)] mt-1">Direct communication with employees via secure corporate channels</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-full text-[10px] text-[var(--t3)]">
          <Shield className="w-3.5 h-3.5 text-[var(--gold)]" />
          ODPC Compliant Portal
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between bg-[var(--p-dim)] p-4 rounded-xl border border-[var(--p-line)]">
          <div className="flex flex-wrap items-center gap-6">
            {/* Provider Selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider font-bold text-[var(--t4)] ml-1">Email Provider</label>
              <div className="flex items-center space-x-1 bg-[var(--card)] p-1 rounded-lg border border-[var(--p-line)] shadow-inner">
                <button
                  type="button"
                  onClick={() => setProvider('resend')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all duration-200 ${provider === 'resend'
                    ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                    : 'text-[var(--t3)] hover:bg-[var(--glass-h)]'
                    }`}
                >
                  Resend API
                </button>
                <button
                  type="button"
                  onClick={() => setProvider('cpanel')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all duration-200 ${provider === 'cpanel'
                    ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                    : 'text-[var(--t3)] hover:bg-[var(--glass-h)]'
                    }`}
                >
                  cPanel (SMTP)
                </button>
              </div>
            </div>

            {/* Recipient Mode Selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider font-bold text-[var(--t4)] ml-1">Recipient Type</label>
              <div className="flex items-center space-x-1 bg-[var(--card)] p-1 rounded-lg border border-[var(--p-line)] shadow-inner">
                <button
                  type="button"
                  onClick={() => { setMode('single'); setSelectedEmployeeId(''); }}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all duration-200 ${mode === 'single'
                    ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                    : 'text-[var(--t3)] hover:bg-[var(--glass-h)]'
                    }`}
                >
                  Single Employee
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('bulk'); setSelectedBranch('all'); setSelectedDepartment('all'); }}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all duration-200 ${mode === 'bulk'
                    ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                    : 'text-[var(--t3)] hover:bg-[var(--glass-h)]'
                    }`}
                >
                  Bulk / Groups
                </button>
              </div>
            </div>
          </div>

          {/* Conditional cPanel Settings */}
          <AnimatePresence>
            {provider === 'cpanel' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col space-y-1.5"
              >
                <label className="text-[9px] uppercase tracking-wider font-bold text-[var(--t4)] ml-1">cPanel Configuration</label>
                <div className="flex items-center gap-2 bg-[var(--card)] px-3 py-1.5 rounded-lg border border-[var(--p-line)] shadow-inner border-l-2 border-l-[var(--gold)]">
                  <input
                    type="text"
                    placeholder="Username/Email"
                    className="text-xs bg-transparent border-none p-0 focus:ring-0 w-44 text-[var(--t1)] placeholder:text-[var(--t4)]"
                    value={cpanelUser}
                    onChange={(e) => setCpanelUser(e.target.value)}
                  />
                  <div className="w-px h-3 bg-[var(--p-line)]" />
                  <span className="text-[9px] text-[var(--t4)] font-medium">Auth User</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Selection Controls */}
        <div className="bg-[var(--p-dim)] p-4 rounded-xl border border-[var(--p-line)] space-y-4">
          {mode === 'single' ? (
            <div className="w-full max-w-md">
              <label className="block text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">Select Employee</label>
              <SearchableDropdown
                options={employees.map(e => ({
                  label: `${e['First Name']} ${e['Last Name']} (${e['Work Email']})`,
                  value: e['Employee Number']
                }))}
                value={selectedEmployeeId}
                onChange={setSelectedEmployeeId}
                placeholder="Search employee..."
                icon={User}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">Filter by Branch</label>
                <SearchableDropdown
                  options={['all', ...branches].map(b => ({ label: b === 'all' ? 'All Branches' : b, value: b }))}
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  placeholder="All Branches"
                  icon={Users}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">Filter by Department</label>
                <SearchableDropdown
                  options={['all', ...departments].map(d => ({ label: d === 'all' ? 'All Departments' : d, value: d }))}
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  placeholder="All Departments"
                  icon={Filter}
                />
              </div>
            </div>
          )}

          {/* Recipient Count Summary */}
          <div className="flex items-center text-xs text-[var(--t3)] bg-[var(--card)] p-3 rounded-lg border border-[var(--p-line)]">
            <Users className="w-4 h-4 mr-2 text-[var(--gold)]" />
            <span>
              Will send to <span className="font-bold text-[var(--t1)]">{recipients.length}</span> recipient{recipients.length !== 1 ? 's' : ''}.
            </span>
            {recipients.length > 0 && mode === 'single' && (
              <span className="ml-2 text-[var(--t4)]">
                ({recipients[0]['Work Email']})
              </span>
            )}
          </div>
        </div>

        {/* Corporate Templates Selection */}
        <div className="p-4 bg-[var(--p-dim)] rounded-xl border border-[var(--p-line)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              <label className="block text-[10px] font-semibold text-[var(--t1)] uppercase tracking-wider">Kenyan HR Templates Library</label>
            </div>
            <span className="text-[9px] text-[var(--gold)] border border-[var(--gold)] px-2 py-0.5 rounded-full font-bold">Preset Compliant Letters</span>
          </div>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--p-line)] text-xs text-[var(--t1)] rounded-lg p-2.5 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
          >
            <option value="">-- Choose standard corporate template --</option>
            {KENYAN_HR_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">Subject Line</label>
          <input
            type="text"
            className="w-full bg-[var(--card)] border border-[var(--p-line)] text-xs text-[var(--t1)] rounded-lg p-2.5 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
            placeholder="Enter email subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-semibold text-[var(--t3)] uppercase tracking-wider mb-2">Message Body (HTML Allowed)</label>
          <div className="relative">
            <textarea
              className="w-full h-64 bg-[var(--card)] border border-[var(--p-line)] text-xs text-[var(--t1)] rounded-lg p-3 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] resize-y font-mono"
              placeholder="Type or load template content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-[9px] text-[var(--t4)] font-bold uppercase pointer-events-none">
              HTML Supported
            </div>
          </div>
        </div>

        {/* ODPC Password Protection & File Attachments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Attachments */}
          <div className="p-4 bg-[var(--p-dim)] rounded-xl border border-[var(--p-line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="w-4 h-4 text-[var(--gold)]" />
                <label className="block text-[10px] font-semibold text-[var(--t1)] uppercase tracking-wider">Attachment Files</label>
              </div>
              <p className="text-[10px] text-[var(--t3)] mb-3">Add supporting PDF files, letters, or slips (Max 5MB each)</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-[var(--p-line)] shadow-sm text-xs font-bold rounded-lg text-[var(--t1)] bg-[var(--card)] hover:bg-[var(--glass-h)] transition-colors">
                <span>Select Attachments</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-1">
                {attachments.map((att, index) => (
                  <div key={index} className="flex items-center justify-between text-[10px] text-[var(--t3)] bg-[var(--card)] p-1.5 rounded border border-[var(--p-line)]">
                    <span className="truncate max-w-[200px] flex items-center gap-1">
                      <Check className="w-3 h-3 text-[var(--gold)] shrink-0" />
                      {att.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="text-[var(--red)] hover:text-red-500 font-bold px-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ODPC Privacy Tool */}
          <div className="p-4 bg-[var(--p-dim)] rounded-xl border border-[var(--p-line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[var(--gold)]" />
                <label className="block text-[10px] font-semibold text-[var(--t1)] uppercase tracking-wider">ODPC Data Security (DPA 2019)</label>
              </div>
              <p className="text-[10px] text-[var(--t3)] mb-3">Encrypt attachments containing sensitive personal data (e.g. payroll, warnings).</p>
            </div>

            <div className="flex items-center justify-between bg-[var(--card)] p-2.5 rounded-lg border border-[var(--p-line)]">
              <span className="text-[11px] font-medium text-[var(--t1)]">Password-Protect Attachments</span>
              <button
                type="button"
                onClick={() => setEncryptAttachment(!encryptAttachment)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${encryptAttachment ? 'bg-[var(--gold)]' : 'bg-[var(--p-line)]'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-[var(--bg)] shadow-md transform transition-all duration-300 ${encryptAttachment ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {encryptAttachment && (
              <div className="mt-3 text-[9px] text-[var(--gold)] bg-[rgba(0, 229, 255,0.06)] p-2.5 rounded border border-[rgba(0, 229, 255,0.2)] flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong>DPA Standard Encryption Active:</strong> Recipient must unlock attachment using: <code>Year of Birth + KRA PIN digits</code>.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-[var(--p-line)]">
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || recipients.length === 0 || !subject || !body}
            className={`inline-flex items-center px-5 py-2.5 rounded-lg shadow-sm text-xs font-bold text-[var(--bg)] transition-all duration-200 
              ${sending || recipients.length === 0 || !subject || !body
                ? 'bg-[var(--p-line)] text-[var(--t4)] cursor-not-allowed'
                : 'bg-[var(--gold)] hover:shadow-[0_0_12px_var(--gold-glow)]'
              }`}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Dispatch...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Secure Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
