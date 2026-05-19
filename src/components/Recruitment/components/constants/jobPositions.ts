export const jobPositions = [
  {
    id: 'pos-1',
    title: 'Senior Credit Analyst',
    department: 'Credit',
    type: 'Full-time',
    branch: 'nairobi',
    status: 'draft',
    applications: '0',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: 'Perform comprehensive credit reviews, cash flow modeling, and risk assessments for large commercial loan portfolios.',
    qualifications: ['Bachelor\'s degree in Finance or Accounting', '3+ years credit analysis experience', 'Advanced Excel skills']
  },
  {
    id: 'pos-2',
    title: 'Relationship Manager',
    department: 'Sales & Marketing',
    type: 'Full-time',
    branch: 'mombasa',
    status: 'pending',
    applications: '0',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Grow and maintain a high-net-worth customer portfolio while delivering outstanding client relations.',
    qualifications: ['Bachelor\'s degree in Business or Economics', '5+ years in private wealth management', 'Excellent negotiation skills']
  },
  {
    id: 'pos-3',
    title: 'Lead Operations Officer',
    department: 'Operations',
    type: 'Full-time',
    branch: 'kisumu',
    status: 'approved',
    applications: '0',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Oversee daily cash vaults, customer queues, and teller operations to meet high compliance and service benchmarks.',
    qualifications: ['Bachelor\'s degree in Business Operations', '3+ years in retail bank management', 'Superb process optimization skills']
  },
  {
    id: 'pos-4',
    title: 'Client Relations Specialist',
    department: 'Customer Experience',
    type: 'Full-time',
    branch: 'nakuru',
    status: 'open',
    applications: '12',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Serve as the key point of contact for resolving elevated corporate client requests and inquiries.',
    qualifications: ['Degree in Public Relations or Marketing', '2+ years customer care experience', 'Familiarity with CRM tools']
  },
  {
    id: 'pos-5',
    title: 'Junior Accountant (Intern)',
    department: 'Finance',
    type: 'Internship',
    branch: 'eldoret',
    status: 'closed',
    applications: '45',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Support senior accounts team members with ledger reconciliations, invoice bookings, and petty cash reports.',
    qualifications: ['Undergraduate in Accounting or related field', 'CPA-K or ongoing certification', 'Attention to detail']
  }
];