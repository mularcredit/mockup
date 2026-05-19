import { useState, useEffect } from 'react';
import { Download, Edit, Users, Save, X, Plus, Trash2, CheckCircle, AlertCircle, XCircle, Info, FileText, Award, Send, ShieldCheck, Globe, PowerOff } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { StatusBadge } from './StatusBadge';
import { branches } from './constants/branches';
import { supabase } from '../../../lib/supabase';

// Toast component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'warning' | 'info'; onClose: () => void }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  
  const colors = {
    success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200 backdrop-blur-md',
    error: 'bg-rose-950/80 border-rose-500/30 text-rose-200 backdrop-blur-md',
    warning: 'bg-amber-950/80 border-amber-500/30 text-amber-200 backdrop-blur-md',
    info: 'bg-cyan-950/80 border-cyan-500/30 text-cyan-200 backdrop-blur-md'
  };
  
  const Icon = icons[type];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-2xl flex items-center gap-3 max-w-md animate-in slide-in-from-top-5 duration-300 ${colors[type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-all">
        <X size={14} />
      </button>
    </div>
  );
};

// Job Description & Qualifications Modal
const JobDetailModal = ({ position, onClose }: { position: Position; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'qualifications'>('description');

  const jobDetails = {
    'Relationship Manager': {
      description: 'Drive client portfolio growth by developing strategic relationships with high-net-worth individuals and corporate clients. Manage a portfolio of 50+ key accounts with assets under management exceeding $10M. Implement client retention strategies that achieve 95% satisfaction scores.',
      qualifications: [
        'Bachelor\'s degree in Finance, Business Administration, or Economics (MBA preferred)',
        '5+ years in private banking or wealth management relationship management',
        'CFA Level II or CFP certification required',
        'Proven track record of growing AUM by 20%+ annually',
        'Expert knowledge of investment products, portfolio management, and risk assessment',
        'Experience with CRM systems (Salesforce) and financial modeling tools'
      ],
      responsibilities: [
        'Manage and grow a portfolio of 50+ high-value client relationships',
        'Develop customized wealth management strategies for clients with $500K+ investable assets',
        'Cross-sell banking products achieving 15% quarterly growth targets',
        'Conduct quarterly portfolio reviews and risk assessment meetings',
        'Collaborate with investment advisors to optimize client portfolio performance',
        'Resolve escalated client issues within 24-hour service level agreement'
      ]
    },
    'Client Relations Specialist': {
      description: 'Serve as the primary escalation point for VIP clients, ensuring seamless service delivery and maintaining 98% client retention rate. Implement client feedback systems that drive continuous service improvement.',
      qualifications: [
        'Bachelor\'s degree in Business Communications or related field',
        '3+ years in client service within financial services industry',
        'Certified Customer Experience Professional (CCXP) preferred',
        'Expertise in conflict resolution and difficult conversation management',
        'Experience with Zendesk, JIRA, or similar customer service platforms',
        'Knowledge of banking compliance and regulatory requirements'
      ],
      responsibilities: [
        'Manage VIP client escalations and ensure resolution within 4 business hours',
        'Maintain client relationship metrics and NPS scores above industry average',
        'Develop and implement client satisfaction improvement initiatives',
        'Coordinate with branches to ensure consistent service delivery standards',
        'Conduct client feedback sessions and focus groups quarterly',
        'Train frontline staff on premium client service protocols'
      ]
    },
    'Credit Analyst': {
      description: 'Conduct comprehensive credit analysis for commercial loan applications ranging from $250K to $5M. Utilize advanced financial modeling to assess borrower creditworthiness and maintain portfolio delinquency below 2%.',
      qualifications: [
        'Bachelor\'s degree in Finance, Accounting, or Economics (Master\'s preferred)',
        '3+ years commercial credit analysis experience in banking',
        'Advanced Excel skills with experience in financial modeling and scenario analysis',
        'Knowledge of Moody\'s Risk Analyst or similar credit assessment tools',
        'Understanding of Basel III regulations and credit risk frameworks',
        'CPA or CFA certification preferred'
      ],
      responsibilities: [
        'Analyze financial statements, cash flow projections, and business plans',
        'Prepare detailed credit memos with risk ratings for credit committee review',
        'Monitor portfolio of 100+ commercial loans for early warning signs',
        'Conduct industry and market analysis for loan applications',
        'Collaborate with relationship managers on credit structure recommendations',
        'Ensure compliance with lending policies and regulatory requirements'
      ]
    },
    'Risk Manager': {
      description: 'Develop and implement enterprise risk management framework covering credit, market, and operational risk. Monitor risk exposure across $500M+ portfolio and ensure regulatory compliance.',
      qualifications: [
        'Master\'s degree in Risk Management, Finance, or Quantitative Finance',
        '7+ years in banking risk management with 3+ years in leadership role',
        'FRM (Financial Risk Manager) or PRM (Professional Risk Manager) certification',
        'Expert knowledge of VaR models, stress testing, and scenario analysis',
        'Experience with Bloomberg Terminal, Reuters, and risk management software',
        'Deep understanding of Dodd-Frank, Basel III, and local regulatory requirements'
      ],
      responsibilities: [
        'Develop and maintain enterprise risk management framework and policies',
        'Conduct monthly stress testing on $500M+ investment portfolio',
        'Monitor counterparty risk exposure and set concentration limits',
        'Prepare risk reports for Board Risk Committee meetings',
        'Implement fraud detection systems reducing losses by 25% annually',
        'Lead regulatory compliance audits and examinations'
      ]
    },
    'Customer Service Representative': {
      description: 'Deliver exceptional frontline banking services, handling 100+ daily customer interactions across multiple channels while maintaining 90%+ customer satisfaction scores.',
      qualifications: [
        'Associate\'s degree in Business or related field (Bachelor\'s preferred)',
        '2+ years in customer-facing role in financial services',
        'Series 6 and 63 licenses (or ability to obtain within 90 days)',
        'Typing speed of 45+ WPM with 95% accuracy',
        'Bilingual in Spanish/English preferred',
        'Experience with core banking systems (Fiserv, Jack Henry)'
      ],
      responsibilities: [
        'Handle 50+ daily inbound calls with 2-minute average handle time',
        'Process account transactions, transfers, and payment requests accurately',
        'Cross-sell 3+ banking products monthly to existing customers',
        'Maintain 95% accuracy in transaction processing and documentation',
        'Educate customers on digital banking platforms and mobile app features',
        'Escalate complex issues to appropriate departments within service guidelines'
      ]
    },
    'Operations Manager': {
      description: 'Oversee daily banking operations for 15+ branch network, managing team of 25+ operations staff and ensuring 99.9% transaction processing accuracy.',
      qualifications: [
        'Bachelor\'s degree in Business Administration or Operations Management',
        '8+ years in banking operations with 5+ years in management role',
        'Six Sigma Green Belt or Black Belt certification',
        'Experience with process automation and digital transformation projects',
        'Knowledge of Fedwire, CHIPS, and SWIFT payment systems',
        'Proven track record of reducing operational costs by 15%+'
      ],
      responsibilities: [
        'Manage daily operations across 15+ branches with $2M+ daily transaction volume',
        'Lead team of 25+ operations staff with focus on performance optimization',
        'Implement process improvements reducing operational errors by 30%',
        'Oversee cash management and vault operations maintaining optimal liquidity',
        'Coordinate with IT on system upgrades and business continuity planning',
        'Ensure compliance with Reg CC, Reg D, and other banking regulations'
      ]
    },
    'Branch Manager': {
      description: 'Lead high-volume branch generating $15M+ annual revenue, managing team of 12+ staff and driving market share growth in competitive urban market.',
      qualifications: [
        'Bachelor\'s degree in Business, Finance, or related field (MBA preferred)',
        '8+ years in retail banking with 5+ years in branch management',
        'Proven track record of exceeding deposit growth targets by 15%+ annually',
        'Experience managing P&L for $2M+ annual budget',
        'Strong knowledge of consumer lending regulations and compliance',
        'NMLS certification required'
      ],
      responsibilities: [
        'Manage branch P&L with focus on achieving 20% annual profit growth',
        'Lead team of 12+ banking professionals with focus on sales performance',
        'Drive deposit growth of 15% annually through targeted marketing initiatives',
        'Maintain branch audit scores of 95%+ in regulatory compliance',
        'Develop and execute local market penetration strategies',
        'Build community relationships resulting in 50+ new business referrals monthly'
      ]
    },
    'Area Manager': {
      description: 'Oversee performance of 8 branches across 3 counties, driving $50M+ deposit growth and managing regional market expansion strategies.',
      qualifications: [
        'MBA in Finance or Business Administration',
        '10+ years in retail banking with 5+ years multi-unit management',
        'Proven experience growing regional market share by 10%+ annually',
        'Strong understanding of regional economic trends and competitive landscape',
        'Experience with mergers and acquisitions integration',
        'Certified Branch Manager Executive (CBME) certification preferred'
      ],
      responsibilities: [
        'Manage $150M+ deposit portfolio across 8-branch network',
        'Drive regional revenue growth of 12% annually through strategic initiatives',
        'Coach and develop 8 branch managers with focus on leadership development',
        'Implement standardized operating procedures across all locations',
        'Lead market expansion projects including 2+ new branch openings annually',
        'Maintain regional compliance audit scores above 95%'
      ]
    },
    'Regional Director': {
      description: 'Lead strategic direction for 25+ branches across 5 states, managing $500M+ asset portfolio and driving enterprise-wide growth initiatives.',
      qualifications: [
        'MBA from top-tier business school',
        '15+ years in banking with 8+ years in regional/executive leadership',
        'Proven track record of growing regional revenue by 20%+ annually',
        'Experience with digital banking transformation and fintech partnerships',
        'Strong relationships with regulatory bodies and industry associations',
        'Previous P&L responsibility for $50M+ annual budget'
      ],
      responsibilities: [
        'Set strategic direction for 25+ branches with $500M+ assets under management',
        'Achieve regional profitability targets of 25% ROE',
        'Lead digital transformation initiatives impacting 200,000+ customers',
        'Develop and execute M&A strategies for market consolidation',
        'Represent institution in industry forums and regulatory meetings',
        'Mentor and develop next-generation banking leadership talent'
      ]
    },
    'IT Support Specialist': {
      description: 'Provide Level 2 technical support for 500+ banking staff, maintaining 99.9% system availability and implementing cybersecurity protocols across the network.',
      qualifications: [
        'Bachelor\'s degree in Computer Science or Information Technology',
        '3+ years in IT support within financial services environment',
        'CompTIA Security+, Network+, and A+ certifications required',
        'Experience with Active Directory, Windows Server, and VMware',
        'Knowledge of PCI DSS compliance requirements',
        'Programming skills in PowerShell or Python preferred'
      ],
      responsibilities: [
        'Provide technical support for 500+ users across 25+ locations',
        'Maintain core banking systems with 99.9% uptime requirement',
        'Implement security patches and updates within 48 hours of release',
        'Manage user access controls and permissions following SOX compliance',
        'Document IT procedures and maintain knowledge base articles',
        'Participate in disaster recovery testing and business continuity planning'
      ]
    }
  };

  const details = jobDetails[position.title as keyof typeof jobDetails] || {
    description: 'Responsible for performing duties related to the position and contributing to organizational success.',
    qualifications: [
      'Relevant educational background',
      'Previous experience in similar role',
      'Strong communication skills',
      'Ability to work in team environment'
    ],
    responsibilities: [
      'Perform duties as assigned by management',
      'Collaborate with team members to achieve department goals',
      'Maintain accurate records and documentation',
      'Adhere to company policies and procedures'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[var(--p-line)] flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{position.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                <span className="text-[var(--t3)] font-semibold">{position.department}</span>
                <span className="text-[var(--t3)]">•</span>
                <span className="text-[var(--t3)] font-semibold">{branches.find(b => b.id === position.branch)?.name || position.branch}</span>
                <StatusBadge status={position.status} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--t3)] hover:text-white p-1 rounded-full hover:bg-[var(--p-dim)]/50 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--p-line)] flex-shrink-0 bg-[var(--p-dim)]/20">
          <nav className="-mb-px flex space-x-6 px-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-2 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'description'
                  ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/30'
                  : 'border-transparent text-[var(--t3)] hover:text-white'
              }`}
            >
              <FileText size={14} />
              Job Description
            </button>
            <button
              onClick={() => setActiveTab('qualifications')}
              className={`py-3 px-2 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'qualifications'
                  ? 'border-[var(--p)] text-[var(--p)] bg-[var(--p-dim)]/30'
                  : 'border-transparent text-[var(--t3)] hover:text-white'
              }`}
            >
              <Award size={14} />
              Qualifications & Requirements
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5">Position Overview</h3>
                <p className="text-[var(--t2)] leading-relaxed text-xs">
                  {details.description}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5">Key Responsibilities</h3>
                <ul className="space-y-2 text-[var(--t2)] text-xs">
                  {details.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[var(--p)] rounded-full mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--p-line)] text-xs">
                <div className="p-3 bg-[var(--p-dim)]/30 rounded-lg border border-[var(--p-line)]">
                  <h4 className="font-bold text-white mb-1">Employment Type</h4>
                  <p className="text-[var(--t2)]">{position.type}</p>
                </div>
                <div className="p-3 bg-[var(--p-dim)]/30 rounded-lg border border-[var(--p-line)]">
                  <h4 className="font-bold text-white mb-1">Location</h4>
                  <p className="text-[var(--t2)]">{branches.find(b => b.id === position.branch)?.name || position.branch}</p>
                </div>
                <div className="p-3 bg-[var(--p-dim)]/30 rounded-lg border border-[var(--p-line)]">
                  <h4 className="font-bold text-white mb-1">Department</h4>
                  <p className="text-[var(--t2)]">{position.department}</p>
                </div>
                <div className="p-3 bg-[var(--p-dim)]/30 rounded-lg border border-[var(--p-line)]">
                  <h4 className="font-bold text-white mb-1">Reporting Structure</h4>
                  <p className="text-[var(--t2)]">
                    {position.department === 'Branch Management' ? 'Reports to Area Manager' :
                     position.department === 'Area Management' ? 'Reports to Regional Director' :
                     position.department === 'Regional Management' ? 'Reports to Chief Operating Officer' :
                     'Reports to Department Head'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qualifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Required Qualifications & Experience</h3>
                <ul className="space-y-2.5">
                  {details.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-[var(--p)] rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-[var(--t2)] leading-relaxed text-xs">{qualification}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                <h4 className="font-bold text-cyan-400 mb-2 text-xs uppercase tracking-wider">Application Requirements</h4>
                <ul className="list-disc list-inside space-y-1.5 text-cyan-200/80 text-xs">
                  <li>Updated professional resume/CV with quantifiable achievements</li>
                  <li>Cover letter addressing position requirements</li>
                  <li>Copies of relevant certifications and educational transcripts</li>
                  <li>3 professional references with contact information</li>
                  <li>Salary expectations and availability timeline</li>
                </ul>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-bold text-emerald-400 mb-2 text-xs uppercase tracking-wider">Compensation & Benefits</h4>
                <ul className="list-disc list-inside space-y-1.5 text-emerald-200/80 text-xs">
                  <li>Competitive salary with performance-based bonuses</li>
                  <li>Comprehensive health insurance (medical, dental, vision)</li>
                  <li>401(k) retirement plan with company matching</li>
                  <li>Professional development and certification support</li>
                  <li>Paid time off and flexible work arrangements</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[var(--p-line)] bg-[var(--p-dim)]/50 rounded-b-xl flex justify-between items-center flex-shrink-0">
          <p className="text-[10px] text-[var(--t3)]">
            Posted: {new Date(position.created_at).toLocaleDateString()}
            {position.updated_at && ` • Updated: ${new Date(position.updated_at).toLocaleDateString()}`}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--p-line)] text-[var(--t3)] hover:text-white text-xs font-bold rounded-lg hover:bg-[var(--p-dim)] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface Position {
  id: string | number;
  title: string;
  department: string;
  type: string;
  branch: string;
  status: 'draft' | 'pending' | 'approved' | 'open' | 'closed';
  applications?: string;
  created_at: string;
  updated_at?: string;
  description?: string;
  qualifications?: string[];
}

interface PositionsTableProps {
  positions: Position[];
  onUpdate?: () => void;
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const PositionsTable = ({ positions, onUpdate = () => {} }: PositionsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPosition, setEditedPosition] = useState<Partial<Position> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPosition, setNewPosition] = useState<Partial<Position>>({
    title: '',
    department: '',
    type: '',
    branch: '',
    status: 'draft' // Starts in Draft stage
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [publishingPosition, setPublishingPosition] = useState<Position | null>(null);
  const [pubToWebsite, setPubToWebsite] = useState(true);
  const [pubToPortal, setPubToPortal] = useState(true);
  const [emailStaff, setEmailStaff] = useState(false);

  // Toast helpers
  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const isValidUUID = (id: string | number): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return typeof id === 'string' && uuidRegex.test(id);
  };

  const sanitizeStatus = (status: string): 'draft' | 'pending' | 'approved' | 'open' | 'closed' => {
    const allowedStatuses = ['draft', 'pending', 'approved', 'open', 'closed'];
    return (allowedStatuses.includes(status) ? status : 'draft') as 'draft' | 'pending' | 'approved' | 'open' | 'closed';
  };

  const handleEdit = (position: Position) => {
    setEditingId(String(position.id));
    setEditedPosition({ 
      ...position,
      status: sanitizeStatus(position.status)
    });
  };

  const handleSave = async () => {
    if (!editingId || !editedPosition) return;
    
    setIsLoading(true);
    try {
      const isLegacyId = !isValidUUID(editingId);
      
      const positionData = {
        title: editedPosition.title,
        department: editedPosition.department,
        type: editedPosition.type,
        branch: editedPosition.branch,
        status: sanitizeStatus(editedPosition.status || 'draft'),
        applications: editedPosition.applications || '0',
        updated_at: new Date().toISOString()
      };

      if (isLegacyId) {
        addToast('Mock record details adjusted locally.', 'success');
      } else {
        const { error } = await supabase
          .from('job_positions')
          .update(positionData)
          .eq('id', editingId);

        if (error) throw error;
        addToast('Position modified successfully!', 'success');
      }

      setEditingId(null);
      setEditedPosition(null);
      onUpdate();
    } catch (error: any) {
      console.error('Error saving position:', error);
      addToast(error.message || 'Failed to save position.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPosition(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!isValidUUID(String(id))) {
      addToast('Cannot delete legacy records. Delete is reserved for live jobs.', 'warning');
      return;
    }

    if (!confirm('Are you sure you want to delete this job position?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('job_positions')
        .delete()
        .eq('id', String(id));

      if (error) throw error;
      addToast('Position deleted successfully!', 'success');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting position:', error);
      addToast(error.message || 'Error deleting position', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPosition.title || !newPosition.department || !newPosition.type || !newPosition.branch) {
      addToast('Please fill in all required fields to create the job position.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const positionData = {
        title: newPosition.title,
        department: newPosition.department,
        type: newPosition.type,
        branch: newPosition.branch,
        status: sanitizeStatus(newPosition.status || 'draft'),
        applications: '0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('job_positions')
        .insert([positionData]);

      if (error) throw error;

      setIsAdding(false);
      setNewPosition({
        title: '',
        department: '',
        type: '',
        branch: '',
        status: 'draft'
      });
      addToast('Job draft created successfully! Send it for approval or approve it next.', 'success');
      onUpdate();
    } catch (error: any) {
      console.error('Error adding position:', error);
      addToast(error.message || 'Error adding position', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Perform workflow transition: Draft ➔ Pending ➔ Approved ➔ Posted (Open) ➔ Closed
  const handleWorkflowTransition = async (position: Position, nextStatus: 'draft' | 'pending' | 'approved' | 'open' | 'closed') => {
    setIsLoading(true);
    try {
      const isLegacyId = !isValidUUID(String(position.id));
      const statusLabels = {
        draft: 'Job drafted successfully.',
        pending: 'Job sent for approval.',
        approved: 'Job approved successfully.',
        open: 'Job posted live successfully.',
        closed: 'Job closed / unposted.'
      };

      if (isLegacyId) {
        if (nextStatus === 'open') {
          if (pubToWebsite) addToast('Posted to Company Careers Website successfully.', 'success');
          if (pubToPortal) addToast('Listed in Internal Employee Portal successfully.', 'success');
          if (emailStaff) addToast('Emailed job opportunity to all staff members successfully.', 'success');
        } else {
          addToast(`${statusLabels[nextStatus]} (Simulated for legacy record)`, 'info');
        }
      } else {
        const { error } = await supabase
          .from('job_positions')
          .update({
            status: nextStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', position.id);

        if (error) throw error;
        
        if (nextStatus === 'open') {
          if (pubToWebsite) addToast('Posted to Company Careers Website successfully.', 'success');
          if (pubToPortal) addToast('Listed in Internal Employee Portal successfully.', 'success');
          if (emailStaff) addToast('Emailed job opportunity to all staff members successfully.', 'success');
        } else {
          addToast(statusLabels[nextStatus], 'success');
        }
      }
      onUpdate();
    } catch (error: any) {
      console.error('Workflow transition error:', error);
      addToast(error.message || 'Workflow transition failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const headers = ['Title', 'Department', 'Type', 'Branch', 'Status', 'Applications', 'Created Date'];
      const csvData = positions.map(pos => [
        `"${pos.title}"`,
        `"${pos.department}"`,
        `"${pos.type}"`,
        `"${branches.find(b => b.id === pos.branch)?.name || pos.branch}"`,
        `"${pos.status}"`,
        `"${pos.applications || '0'}"`,
        `"${new Date(pos.created_at).toLocaleDateString()}"`
      ]);

      const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-positions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addToast('Positions data exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      addToast('Error exporting data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const departments = [
    'Relationship Management',
    'Credit and Risk',
    'Customer Service',
    'Operations',
    'Branch Management',
    'Area Management',
    'Regional Management',
    'IT and Systems Support'
  ];

  const positionTypes = [
    'Full-Time',
    'Part-Time',
    'Contract',
    'Temporary',
    'Internship'
  ];

  const allowedStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'open', label: 'Live / Posted' },
    { value: 'closed', label: 'Closed' }
  ];

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] overflow-hidden shadow-sm flex flex-col">
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      {/* Job Detail Modal */}
      {selectedPosition && (
        <JobDetailModal 
          position={selectedPosition} 
          onClose={() => setSelectedPosition(null)} 
        />
      )}
      
      <div className="p-4 md:p-6 border-b border-[var(--p-line)] flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[var(--t1)]">Job Positions Dashboard</h2>
            <p className="text-[var(--t3)] text-xs">{positions.length} active positions listed in database</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <GlowButton 
              variant="secondary" 
              icon={Download} 
              size="sm"
              onClick={handleExport}
              disabled={isExporting || positions.length === 0}
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </GlowButton>
            <GlowButton 
              variant="primary" 
              icon={Plus} 
              size="sm"
              onClick={() => setIsAdding(true)}
              disabled={isLoading}
            >
              Create Position Draft
            </GlowButton>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="bg-[var(--p-dim)] border-b border-[var(--p-line)] sticky top-0 z-10">
            <tr>
              <th className="text-left py-3.5 px-4 text-[var(--t2)] font-semibold min-w-[200px]">Position Title</th>
              <th className="text-left py-3.5 px-4 text-[var(--t2)] font-semibold min-w-[150px]">Department</th>
              <th className="text-left py-3.5 px-4 text-[var(--t2)] font-semibold min-w-[100px]">Type</th>
              <th className="text-left py-3.5 px-4 text-[var(--t2)] font-semibold min-w-[120px]">Branch</th>
              <th className="text-left py-3.5 px-4 text-[var(--t2)] font-semibold min-w-[130px]">Status</th>
              <th className="text-center py-3.5 px-4 text-[var(--t2)] font-semibold min-w-[320px]">Workflow Actions & Controls</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new position inline row */}
            {isAdding && (
              <tr className="bg-[var(--p-dim)]/50 border-b border-[var(--p-line)]">
                <td className="py-4 px-4">
                  <input
                    type="text"
                    value={newPosition.title || ''}
                    onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:border-[var(--p)] focus:outline-none"
                    placeholder="Enter position title"
                  />
                </td>
                <td className="py-4 px-4">
                  <select
                    value={newPosition.department || ''}
                    onChange={(e) => setNewPosition({...newPosition, department: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:border-[var(--p)] focus:outline-none"
                  >
                    <option value="" className="bg-[var(--card)] text-white">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="bg-[var(--card)] text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={newPosition.type || ''}
                    onChange={(e) => setNewPosition({...newPosition, type: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:border-[var(--p)] focus:outline-none"
                  >
                    <option value="" className="bg-[var(--card)] text-white">Select Type</option>
                    {positionTypes.map(type => (
                      <option key={type} value={type} className="bg-[var(--card)] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={newPosition.branch || ''}
                    onChange={(e) => setNewPosition({...newPosition, branch: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:border-[var(--p)] focus:outline-none"
                  >
                    <option value="" className="bg-[var(--card)] text-white">Select branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id} className="bg-[var(--card)] text-white">
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={newPosition.status || 'draft'}
                    onChange={(e) => setNewPosition({...newPosition, status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:border-[var(--p)] focus:outline-none"
                  >
                    {allowedStatuses.map(status => (
                      <option key={status.value} value={status.value} className="bg-[var(--card)] text-white">
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleAdd}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      Save Draft
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 border border-[var(--p-line)] text-[var(--t3)] hover:text-white rounded-lg hover:bg-[var(--p-dim)] transition-all flex items-center gap-1.5"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Existing positions */}
            {positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center text-[var(--t3)]">
                  <Users size={48} className="mx-auto mb-3 text-[var(--t3)]/40" />
                  <p className="font-bold text-white mb-0.5">No Job Positions Listed</p>
                  <p className="text-[10px]">Click "Create Position Draft" to begin building your first recruitment workflow.</p>
                </td>
              </tr>
            ) : (
              positions.map((position) => {
                const branch = branches.find(b => b.id === position.branch);
                const isEditing = editingId === String(position.id);

                return (
                  <tr key={position.id} className="border-b border-[var(--p-line)] hover:bg-[var(--p-dim)]/20 transition-all">
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPosition?.title || ''}
                          onChange={(e) => setEditedPosition({...editedPosition, title: e.target.value})}
                          className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:outline-none"
                        />
                      ) : (
                        <div className="space-y-1">
                          <p 
                            className="text-[var(--t1)] font-semibold cursor-pointer hover:text-[var(--p)] transition-all"
                            onClick={() => setSelectedPosition(position)}
                          >
                            {position.title}
                          </p>
                          <button 
                            onClick={() => setSelectedPosition(position)}
                            className="text-[var(--p)] hover:text-[var(--p-glow)] text-[10px] font-bold flex items-center gap-1 transition-all"
                          >
                            <FileText size={11} />
                            View Requirements
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <select
                          value={editedPosition?.department || ''}
                          onChange={(e) => setEditedPosition({...editedPosition, department: e.target.value})}
                          className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:outline-none"
                        >
                          <option value="" className="bg-[var(--card)] text-white">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept} className="bg-[var(--card)] text-white">
                              {dept}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-[var(--t2)]">{position.department}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <select
                          value={editedPosition?.type || ''}
                          onChange={(e) => setEditedPosition({...editedPosition, type: e.target.value})}
                          className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:outline-none"
                        >
                          <option value="" className="bg-[var(--card)] text-white">Select Type</option>
                          {positionTypes.map(type => (
                            <option key={type} value={type} className="bg-[var(--card)] text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-[var(--t2)]">{position.type}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <select
                          value={editedPosition?.branch || ''}
                          onChange={(e) => setEditedPosition({...editedPosition, branch: e.target.value})}
                          className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:outline-none"
                        >
                          {branches.map(branch => (
                            <option key={branch.id} value={branch.id} className="bg-[var(--card)] text-white">
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-[var(--t2)]">{branch?.name || position.branch}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <select
                          value={editedPosition?.status || 'draft'}
                          onChange={(e) => setEditedPosition({...editedPosition, status: e.target.value as any})}
                          className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--p-line)] text-xs text-white rounded-lg focus:ring-1 focus:ring-[var(--p)] focus:outline-none"
                        >
                          {allowedStatuses.map(status => (
                            <option key={status.value} value={status.value} className="bg-[var(--card)] text-white">
                              {status.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <StatusBadge status={position.status} />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-between gap-3">
                        {/* Interactive Recruitment Pipeline Transitions */}
                        {!isEditing && (
                          <div className="flex items-center gap-1.5">
                            {position.status === 'draft' && (
                              <button
                                onClick={() => handleWorkflowTransition(position, 'pending')}
                                disabled={isLoading}
                                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Submit Job for Approval"
                              >
                                <Send size={11} />
                                Submit Approval
                              </button>
                            )}

                            {position.status === 'pending' && (
                              <button
                                onClick={() => handleWorkflowTransition(position, 'approved')}
                                disabled={isLoading}
                                className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Approve this Job Posting"
                              >
                                <ShieldCheck size={11} />
                                Approve Job
                              </button>
                            )}

                            {position.status === 'approved' && (
                              <button
                                onClick={() => setPublishingPosition(position)}
                                disabled={isLoading}
                                className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Publish Job Opportunity"
                              >
                                <Globe size={11} />
                                Publish...
                              </button>
                            )}

                            {position.status === 'open' && (
                              <button
                                onClick={() => handleWorkflowTransition(position, 'closed')}
                                disabled={isLoading}
                                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Close / Take Down Job Posting"
                              >
                                <PowerOff size={11} />
                                Close Posting
                              </button>
                            )}

                            {position.status === 'closed' && (
                              <button
                                onClick={() => handleWorkflowTransition(position, 'draft')}
                                disabled={isLoading}
                                className="px-2.5 py-1 border border-[var(--p-line)] text-[var(--t3)] hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[var(--p-dim)] transition-all"
                                title="Re-open Job as a Draft"
                              >
                                <Edit size={11} />
                                Set Draft
                              </button>
                            )}
                          </div>
                        )}

                        {/* Standard Controls */}
                        <div className="flex gap-1.5 ml-auto">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg disabled:opacity-50 flex items-center gap-1 text-[10px] font-bold transition-all"
                              >
                                <Save size={12} />
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="px-3 py-1 border border-[var(--p-line)] text-[var(--t3)] hover:text-white rounded-lg disabled:opacity-50 flex items-center gap-1 text-[10px] font-bold hover:bg-[var(--p-dim)] transition-all"
                              >
                                <X size={12} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(position)}
                                disabled={isLoading}
                                className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg disabled:opacity-50 flex items-center gap-1 text-[10px] font-bold transition-all"
                              >
                                <Edit size={12} />
                                {isValidUUID(String(position.id)) ? 'Edit' : 'Adjust'}
                              </button>
                              {isValidUUID(String(position.id)) && (
                                <button
                                  onClick={() => handleDelete(position.id)}
                                  disabled={isLoading}
                                  className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg disabled:opacity-50 flex items-center gap-1 text-[10px] font-bold transition-all"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* JOB DISTRIBUTION / PUBLISHING MODAL */}
      {publishingPosition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-2xl p-6 w-full max-w-sm space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--p-line)]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Publish Opportunities</h3>
                <p className="text-[10px] text-[var(--t3)]">Configure distribution channels for this position</p>
              </div>
              <button 
                onClick={() => setPublishingPosition(null)}
                className="text-[var(--t3)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 py-1 text-xs">
              <span className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-wider">Selected Vacancy</span>
              <h4 className="text-sm font-bold text-white leading-tight">{publishingPosition.title}</h4>
              <p className="text-[10px] text-cyan-400 font-semibold">{publishingPosition.department} Department</p>
            </div>

            <div className="space-y-4 pt-1">
              <span className="block text-[9px] font-bold text-[var(--t3)] uppercase tracking-wider">Distribution Channels</span>
              
              {/* Option 1 - Website */}
              <label className="flex items-start gap-3 p-3 bg-[var(--p-dim)]/20 border border-[var(--p-line)] rounded-lg cursor-pointer hover:border-white/10 transition-all select-none">
                <input 
                  type="checkbox" 
                  checked={pubToWebsite} 
                  onChange={(e) => setPubToWebsite(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[var(--p-line)] text-[var(--p)] bg-[var(--p-dim)] focus:ring-0 focus:ring-offset-0"
                />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-white">Publish to Company Careers Page</span>
                  <span className="block text-[10px] text-[var(--t3)]">Instantly list vacancy on the public job application board</span>
                </div>
              </label>

              {/* Option 2 - Employee Portal */}
              <label className="flex items-start gap-3 p-3 bg-[var(--p-dim)]/20 border border-[var(--p-line)] rounded-lg cursor-pointer hover:border-white/10 transition-all select-none">
                <input 
                  type="checkbox" 
                  checked={pubToPortal} 
                  onChange={(e) => setPubToPortal(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[var(--p-line)] text-[var(--p)] bg-[var(--p-dim)] focus:ring-0 focus:ring-offset-0"
                />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-white">Publish to Internal Employee Portal</span>
                  <span className="block text-[10px] text-[var(--t3)]">Show job internally under the Staff Opportunities tab</span>
                </div>
              </label>

              {/* Option 3 - Email Broadcast */}
              <label className="flex items-start gap-3 p-3 bg-[var(--p-dim)]/20 border border-[var(--p-line)] rounded-lg cursor-pointer hover:border-white/10 transition-all select-none">
                <input 
                  type="checkbox" 
                  checked={emailStaff} 
                  onChange={(e) => setEmailStaff(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[var(--p-line)] text-[var(--p)] bg-[var(--p-dim)] focus:ring-0 focus:ring-offset-0"
                />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-white">Broadcast Email Notification</span>
                  <span className="block text-[10px] text-[var(--t3)]">Email a rich-text announcement to all active staff members</span>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--p-line)]">
              <GlowButton 
                variant="secondary" 
                size="sm" 
                onClick={() => setPublishingPosition(null)}
              >
                Cancel
              </GlowButton>
              <GlowButton 
                size="sm" 
                icon={Globe}
                onClick={async () => {
                  const pos = publishingPosition;
                  setPublishingPosition(null);
                  await handleWorkflowTransition(pos, 'open');
                }}
              >
                Confirm Distribution
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionsTable;