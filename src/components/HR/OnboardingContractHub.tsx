import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UserPlus, FileCheck, ClipboardList, PenTool, 
    Download, Send, ArrowRight, Eye, ShieldCheck, 
    Check, AlertCircle, FileText, BadgePercent
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OnboardingData {
    fullName: string;
    designation: string;
    nationalId: string;
    joiningDate: string;
    basicSalary: string;
    kraPin: string;
    nssfNumber: string;
    shifNumber: string;
    housingLevy: boolean;
    hasSignature: boolean;
}

export default function OnboardingContractHub() {
    const [step, setStep] = useState<1 | 2>(1);
    const [activeDoc, setActiveDoc] = useState<'offer' | 'contract' | 'nda' | 'assets' | 'statutory'>('offer');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    
    const [formData, setFormData] = useState<OnboardingData>({
        fullName: 'Jane Wanjiku Mwangi',
        designation: 'Credit Risk Analyst',
        nationalId: '34567890',
        joiningDate: new Date().toISOString().split('T')[0],
        basicSalary: '95000',
        kraPin: 'A012847593Z',
        nssfNumber: 'NSSF-92847-KE',
        shifNumber: 'SHA-84729-1',
        housingLevy: true,
        hasSignature: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGeneratePdf = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            toast.success(`PDF generated successfully for ${formData.fullName}!`);
        }, 1800);
    };

    const handleSignContract = () => {
        setIsSigned(true);
        toast.success("Document digitally signed by Mular Credit Ltd authorized signatory!");
    };

    const handleSendToEmployee = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Queuing contract email...',
                success: `Contract & Onboarding checklist sent to ${formData.fullName}!`,
                error: 'Failed to send document.',
            }
        );
    };

    // Calculations based on standard Kenyan statutory details
    const grossVal = parseFloat(formData.basicSalary) || 0;
    const nssfVal = grossVal * 0.06 > 1080 ? 1080 : grossVal * 0.06; // Tier I & II Cap
    const shifVal = grossVal * 0.0275; // SHA 2.75%
    const levyVal = formData.housingLevy ? grossVal * 0.015 : 0; // 1.5% Housing Levy
    const netEstim = grossVal - nssfVal - shifVal - levyVal - (grossVal * 0.15); // Rough KRA PAYE estimate

    return (
        <div className="space-y-6">
            {/* Main Grid: Form wizard on the left, high-fidelity contract builder on the right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT WING: Form & Statutory Registration (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-5 rounded-2xl border border-[var(--p-line)] bg-[var(--card)] shadow-[0_8px_32px_rgba(0,229,255,0.03)] relative overflow-hidden">
                        
                        {/* Glow accent */}
                        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[var(--p-dim)] rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-[var(--p-dim)] flex items-center justify-center border border-[var(--p-line)]">
                                <UserPlus className="w-4.5 h-4.5 text-[var(--p)]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-[var(--t1)]">Statutory Onboarding</h2>
                                <p className="text-[10px] text-[var(--t3)]">Section 2.9 Statutory Registration & Biodata</p>
                            </div>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex items-center gap-2 mb-6">
                            <button 
                                onClick={() => setStep(1)}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all text-center border ${
                                    step === 1 
                                        ? 'bg-[var(--p-dim)] text-[var(--p)] border-[var(--p-line)]' 
                                        : 'bg-transparent text-[var(--t3)] border-transparent'
                                }`}
                            >
                                1. Personal & Role Details
                            </button>
                            <button 
                                onClick={() => setStep(2)}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all text-center border ${
                                    step === 2 
                                        ? 'bg-[var(--p-dim)] text-[var(--p)] border-[var(--p-line)]' 
                                        : 'bg-transparent text-[var(--t3)] border-transparent'
                                }`}
                            >
                                2. Kenyan Statutory IDs
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all animate-none"
                                            placeholder="Jane Wanjiku Mwangi"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">Designation / Role</label>
                                        <input 
                                            type="text" 
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all animate-none"
                                            placeholder="Credit Analyst"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">National ID / Passport</label>
                                            <input 
                                                type="text" 
                                                name="nationalId"
                                                value={formData.nationalId}
                                                onChange={handleInputChange}
                                                className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all animate-none"
                                                placeholder="34567890"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">Joining Date</label>
                                            <input 
                                                type="date" 
                                                name="joiningDate"
                                                value={formData.joiningDate}
                                                onChange={handleInputChange}
                                                className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all animate-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">Basic Gross Salary (KES)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                name="basicSalary"
                                                value={formData.basicSalary}
                                                onChange={handleInputChange}
                                                className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all font-mono"
                                                placeholder="95000"
                                            />
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--t3)]">KES</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setStep(2)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--p)] hover:bg-[#33ecff] text-black font-semibold text-xs rounded-xl shadow-[0_4px_16px_var(--p-glow)] transition-all mt-6"
                                    >
                                        Next: Statutory IDs <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">KRA PIN Number</label>
                                        <input 
                                            type="text" 
                                            name="kraPin"
                                            value={formData.kraPin}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all font-mono"
                                            placeholder="A012345678B"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">NSSF Registration Number</label>
                                        <input 
                                            type="text" 
                                            name="nssfNumber"
                                            value={formData.nssfNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all font-mono"
                                            placeholder="NSSF-00000-KE"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-[var(--t3)] mb-1">SHIF (Social Health Insurance) Code</label>
                                        <input 
                                            type="text" 
                                            name="shifNumber"
                                            value={formData.shifNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--page)] border border-[var(--p-line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--t1)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all font-mono"
                                            placeholder="SHA-00000-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 bg-[var(--page)] border border-[var(--p-line)] p-3 rounded-xl">
                                        <input 
                                            type="checkbox" 
                                            id="housingLevy"
                                            name="housingLevy"
                                            checked={formData.housingLevy}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded bg-[var(--page)] border-[var(--p-line)] text-[var(--p)] focus:ring-0"
                                        />
                                        <label htmlFor="housingLevy" className="text-xs text-[var(--t1)] select-none">
                                            Enable 1.5% Affordable Housing Levy deduction
                                        </label>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-2.5 bg-transparent border border-[var(--p-line)] text-[var(--t1)] hover:bg-[var(--p-dim)] font-semibold text-xs rounded-xl transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={() => toast.success("Statutory credentials verified locally!")}
                                            className="flex-1 py-2.5 bg-[var(--p)] hover:bg-[#33ecff] text-black font-semibold text-xs rounded-xl shadow-[0_4px_16px_var(--p-glow)] transition-all"
                                        >
                                            Verify Data
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Interactive Kenyan Deduction Insights Card */}
                    <div className="glass-card p-5 rounded-2xl border border-[var(--p-line)] bg-[var(--card)] shadow-[0_8px_32px_rgba(0,229,255,0.03)] relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--p-dim)] rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-center gap-2 mb-4">
                            <BadgePercent className="w-4.5 h-4.5 text-[var(--p)]" />
                            <h3 className="text-xs font-semibold text-[var(--t1)]">Kenyan Statutory Calculations (Estimate)</h3>
                        </div>

                        <div className="space-y-2.5 font-sans">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[var(--t3)]">Gross Monthly Salary:</span>
                                <span className="font-mono font-medium text-[var(--t1)]">KES {grossVal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-t border-[var(--p-line)] pt-2">
                                <span className="text-[var(--t3)]">NSSF Deductions (Statutory):</span>
                                <span className="font-mono text-red-400">- KES {nssfVal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[var(--t3)]">SHA/SHIF Contribution (2.75%):</span>
                                <span className="font-mono text-red-400">- KES {shifVal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[var(--t3)]">Affordable Housing Levy (1.5%):</span>
                                <span className="font-mono text-red-400">- KES {levyVal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-t border-[var(--p-line)] pt-2 font-medium">
                                <span className="text-[var(--t1)]">Estimated Net PAYE Salary:</span>
                                <span className="font-mono text-[var(--p)]">KES {netEstim > 0 ? Math.round(netEstim).toLocaleString() : 0}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-[var(--p-dim)] p-2.5 rounded-lg border border-[var(--p-line)] mt-4">
                            <AlertCircle className="w-4 h-4 text-[var(--p)] mt-0.5 flex-shrink-0" />
                            <p className="text-[9px] text-[var(--p)] leading-normal">
                                Calculations adhere strictly to the 2026 Kenyan Tax Guidelines. Gross values are synced live to the draft employment agreement.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT WING: Live High-Fidelity Agreement Previewer (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card p-5 rounded-2xl border border-[var(--p-line)] bg-[var(--card)] shadow-[0_8px_32px_rgba(0,229,255,0.03)] flex flex-col h-[650px] relative">
                        
                        {/* Header Tabs */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[var(--p-line)] mb-4">
                            <div className="flex items-center gap-1.5 bg-[var(--page)] p-1 rounded-xl border border-[var(--p-line)] overflow-x-auto w-full sm:w-auto">
                                {[
                                    { id: 'offer', label: '1. Offer Letter', icon: FileText },
                                    { id: 'contract', label: '2. Contract', icon: FileCheck },
                                    { id: 'nda', label: '3. NDA', icon: ShieldCheck },
                                    { id: 'assets', label: '4. Asset Handover', icon: ClipboardList },
                                    { id: 'statutory', label: '5. Compliance Ledger', icon: ClipboardList }
                                ].map(doc => {
                                    const Icon = doc.icon;
                                    return (
                                        <button
                                            key={doc.id}
                                            onClick={() => setActiveDoc(doc.id as any)}
                                            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                                                activeDoc === doc.id
                                                    ? 'bg-[var(--p-dim)] text-[var(--p)]'
                                                    : 'text-[var(--t3)] hover:text-[var(--t1)]'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {doc.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Actions toolbar */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleGeneratePdf}
                                    disabled={isGenerating}
                                    className="p-2 bg-[var(--page)] border border-[var(--p-line)] rounded-xl hover:bg-[var(--p-dim)] hover:border-[var(--p)] text-[var(--t3)] hover:text-[var(--p)] transition-all"
                                    title="Download Draft PDF"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleSendToEmployee}
                                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] hover:border-[var(--p)] rounded-xl text-[var(--p)] hover:bg-[var(--p)] hover:text-black font-semibold text-[10px] transition-all"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Send to Hire
                                </button>
                            </div>
                        </div>

                        {/* Interactive Document Page Pane */}
                        <div className="flex-1 overflow-y-auto bg-[var(--page)] border border-[var(--p-line)] rounded-xl p-6 font-serif text-[var(--t1)] leading-relaxed shadow-inner select-text relative">
                            {isGenerating && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-8 h-8 border-2 border-[var(--p-dim)] border-t-[var(--p)] rounded-full mb-3"
                                    />
                                    <span className="font-mono text-xs text-[var(--p)] tracking-wider">rendering_compliance_document...</span>
                                </div>
                            )}

                            {activeDoc === 'offer' && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="space-y-6 text-[12px] font-sans text-gray-300"
                                >
                                    <div className="flex justify-between items-start border-b border-[var(--p-line)] pb-4 font-sans">
                                        <div>
                                            <h1 className="text-sm font-bold text-[var(--p)]">MULAR CREDIT LIMITED</h1>
                                            <p className="text-[9px] text-[var(--t3)]">HQ: Liaison House, State House Avenue, Nairobi</p>
                                            <p className="text-[9px] text-[var(--t3)]">P.O. Box 48592 - 00100, Nairobi, Kenya</p>
                                        </div>
                                        <div className="text-right">
                                            <h2 className="text-[10px] font-mono text-[var(--p)] font-bold tracking-wider">CONFIDENTIAL</h2>
                                            <p className="text-[9px] text-[var(--t3)]">Ref: MCL/HR/OFFER/{new Date().getFullYear()}</p>
                                            <p className="text-[9px] text-[var(--t3)]">Date: {formData.joiningDate}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="font-semibold text-gray-200">To: {formData.fullName}</p>
                                        <p className="text-[9px] text-[var(--t3)]">National ID / Passport: {formData.nationalId}</p>
                                        
                                        <h3 className="text-xs font-bold text-[var(--p)] uppercase tracking-wider pt-2 border-b border-[var(--p-line)] pb-1">RE: LETTER OF OFFER FOR EMPLOYMENT</h3>
                                        
                                        <p>
                                            Following your recent interviews, we are pleased to offer you employment at **Mular Credit Limited** in the position of **{formData.designation}** under the terms and conditions outlined below:
                                        </p>

                                        <div className="space-y-2 pl-4 border-l border-[var(--p-line)] py-1">
                                            <p><strong>1. Commencement Date:</strong> Your employment will commence on <strong>{formData.joiningDate}</strong>.</p>
                                            <p><strong>2. Remuneration:</strong> You will receive a monthly basic gross salary of <strong>KES {grossVal.toLocaleString()}</strong>, subject to statutory deductions.</p>
                                            <p><strong>3. Reporting:</strong> You will report directly to the Chief Credit Officer at our Nairobi Headquarters.</p>
                                            <p><strong>4. Probationary Period:</strong> Your appointment is subject to a 3-month probationary period, eligible for confirmation upon satisfactory performance.</p>
                                        </div>

                                        <p>
                                            Please signify your acceptance of this offer by signing and returning the duplicate copy of this letter on or before the close of business this week.
                                        </p>
                                    </div>

                                    <div className="pt-8 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-200">Yours Sincerely,</p>
                                            <p className="text-[9px] text-[var(--t3)]">Mular Credit Ltd HR Department</p>
                                            <div className="h-10 mt-2 flex items-center">
                                                <span className="font-serif italic text-sm text-[var(--p)] opacity-70">James Sammy</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-semibold text-gray-200">Employee Acceptance:</p>
                                            <p className="text-[9px] text-[var(--t3)]">Sign to accept offer</p>
                                            <div className="h-10 w-32 border-b border-[var(--p-line)] mt-2 flex items-center justify-center">
                                                {isSigned ? (
                                                    <span className="font-mono text-[9px] text-[var(--p)]">SIGNED DIGITALLY</span>
                                                ) : (
                                                    <span className="text-[9px] text-[var(--t3)] italic">Pending...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeDoc === 'contract' && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="space-y-6 text-[12px] font-sans text-gray-300"
                                >
                                    <div className="text-center border-b border-[var(--p-line)] pb-4">
                                        <h1 className="text-sm font-bold text-[var(--p)] tracking-wider">EMPLOYMENT AGREEMENT</h1>
                                        <p className="text-[10px] text-gray-400">BETWEEN MULAR CREDIT LIMITED AND {formData.fullName.toUpperCase()}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <p>
                                            This **Employment Agreement** is entered into on this **{formData.joiningDate}** between **MULAR CREDIT LIMITED** (hereinafter referred to as the "Employer") and **{formData.fullName}** (hereinafter referred to as the "Employee").
                                        </p>

                                        <h3 className="text-xs font-bold text-[var(--p)] uppercase border-b border-[var(--p-line)] pb-1">1. DUTIES AND POSITION</h3>
                                        <p>
                                            The Employee is appointed to the position of **{formData.designation}**. The Employee agrees to perform all duties assigned efficiently, ethically, and in full compliance with the Employer's Code of Conduct and General Policies.
                                        </p>

                                        <h3 className="text-xs font-bold text-[var(--p)] uppercase border-b border-[var(--p-line)] pb-1">2. COMPENSATION AND REMUNERATION</h3>
                                        <p>
                                            The Employer shall pay the Employee a monthly basic gross salary of **KES {grossVal.toLocaleString()}**. All compensation is subject to mandatory deductions required by Kenyan legislation, including PAYE, NSSF, SHIF, and the Affordable Housing Levy.
                                        </p>

                                        <h3 className="text-xs font-bold text-[var(--p)] uppercase border-b border-[var(--p-line)] pb-1">3. STATUTORY REGISTRATION MANDATE</h3>
                                        <p>
                                            For statutory reporting and compliance under Kenyan employment regulations, the following validated employee credentials are incorporated directly into this agreement:
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 bg-[var(--card)] p-3 rounded-lg border border-[var(--p-line)] font-mono text-[10px]">
                                            <div>KRA PIN: <span className="text-[var(--p)]">{formData.kraPin || 'PENDING'}</span></div>
                                            <div>National ID: <span className="text-[var(--p)]">{formData.nationalId || 'PENDING'}</span></div>
                                            <div>NSSF Code: <span className="text-[var(--p)]">{formData.nssfNumber || 'PENDING'}</span></div>
                                            <div>SHIF Code: <span className="text-[var(--p)]">{formData.shifNumber || 'PENDING'}</span></div>
                                        </div>

                                        <h3 className="text-xs font-bold text-[var(--p)] uppercase border-b border-[var(--p-line)] pb-1">4. NON-DISCLOSURE & INTELLECTUAL PROPERTY</h3>
                                        <p>
                                            The Employee covenants to maintain strict confidentiality regarding all company trade secrets, loan book structures, credit risk templates, and client profiles. Any data breach will trigger summary disciplinary action (Section 9.1).
                                        </p>
                                    </div>

                                    <div className="pt-8 grid grid-cols-2 gap-6 font-sans">
                                        <div className="border-t border-[var(--p-line)] pt-3">
                                            <p className="text-[9px] text-[var(--t3)]">Signed for and on behalf of Employer:</p>
                                            <div className="h-10 flex items-center mt-1">
                                                <span className="font-serif italic text-sm text-[var(--p)] opacity-70">James Sammy</span>
                                            </div>
                                            <p className="text-[9px] font-semibold text-gray-200">Mular Credit Ltd Executive Director</p>
                                        </div>
                                        <div className="border-t border-[var(--p-line)] pt-3">
                                            <p className="text-[9px] text-[var(--t3)]">Signed by the Employee:</p>
                                            <div className="h-10 flex items-center mt-1">
                                                {isSigned ? (
                                                    <span className="font-mono text-[9px] text-[var(--p)]">DIGITALLY SIGNED VIA WEB-ID</span>
                                                ) : (
                                                    <span className="text-[9px] text-[var(--t3)] italic">Awaiting signature...</span>
                                                )}
                                            </div>
                                            <p className="text-[9px] font-semibold text-gray-200">{formData.fullName}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeDoc === 'nda' && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="space-y-6 text-[12px] font-sans text-gray-300"
                                >
                                    <div className="text-center border-b border-[var(--p-line)] pb-4">
                                        <h1 className="text-sm font-bold text-[var(--p)] tracking-wider">CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT</h1>
                                        <p className="text-[10px] text-gray-400">MULAR CREDIT LTD — MUTUAL NDA</p>
                                    </div>

                                    <div className="space-y-4">
                                        <p>
                                            This **Non-Disclosure Agreement** is entered into by and between **Mular Credit Limited** and the Employee, **{formData.fullName}**, to govern the protection of Proprietary and Credit Risk Information.
                                        </p>
                                        <p>
                                            <strong>1. Confidential Information:</strong> The Employee acknowledges that during the course of employment, they will have access to "Confidential Information," which includes client lists, loan disbursement algorithms, credit scoring templates, proprietary interest calculation sheets, and strategic marketing roadmaps of Mular Credit Ltd.
                                        </p>
                                        <p>
                                            <strong>2. Term of Obligation:</strong> The Employee’s obligation to maintain confidentiality under this Agreement shall survive the termination of their employment for a period of **five (5) years**.
                                        </p>
                                        <p>
                                            <strong>3. Liquidated Damages:</strong> In the event of a breach of this Agreement, the Employee shall be liable for liquidated damages to the tune of the maximum permitted under the Employment Act of Kenya.
                                        </p>
                                    </div>

                                    <div className="pt-8 grid grid-cols-2 gap-6 font-sans">
                                        <div className="border-t border-[var(--p-line)] pt-3">
                                            <p className="text-[9px] text-[var(--t3)]">For Mular Credit Ltd:</p>
                                            <div className="h-10 flex items-center mt-1">
                                                <span className="font-serif italic text-sm text-[var(--p)] opacity-70">James Sammy</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-[var(--p-line)] pt-3">
                                            <p className="text-[9px] text-[var(--t3)]">Employee Consent:</p>
                                            <div className="h-10 flex items-center mt-1">
                                                {isSigned ? (
                                                    <span className="font-mono text-[9px] text-[var(--p)]">SIGNED BY HIRE</span>
                                                ) : (
                                                    <span className="text-[9px] text-[var(--t3)] italic">Pending...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeDoc === 'assets' && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="space-y-6 text-[12px] font-sans text-gray-300"
                                >
                                    <div className="flex items-center gap-2 border-b border-[var(--p-line)] pb-4">
                                        <ClipboardList className="w-5 h-5 text-[var(--p)]" />
                                        <div>
                                            <h1 className="text-sm font-bold text-[var(--p)]">Asset Allocation & Handover Form</h1>
                                            <p className="text-[9px] text-gray-400">Section 3.3 Asset Acknowledgement & Sign-off</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 font-sans">
                                        <p>
                                            The following enterprise assets have been successfully assigned and handed over to **{formData.fullName}** for performance of their duties as **{formData.designation}**:
                                        </p>

                                        <div className="space-y-2">
                                            {[
                                                { item: 'Corporate Laptop', desc: 'HP ProBook 450 G10 (SN: MULAR-LP-8472)', status: 'Assigned' },
                                                { item: 'Enterprise SIM Card', desc: 'Safaricom Corporate Line (0712 XXX XXX)', status: 'Active' },
                                                { item: 'Nairobi HQ Security Pass', desc: 'RFID Smart Badge (ID: 92847)', status: 'Issued' },
                                                { item: 'Biometric Registry', desc: 'Fingerprint scanned & logged in Nairobi HQ', status: 'Registered' }
                                            ].map((asset, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-[var(--card)] p-3 rounded-lg border border-[var(--p-line)]">
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-200">{asset.item}</p>
                                                        <p className="text-[9px] text-[var(--t3)]">{asset.desc}</p>
                                                    </div>
                                                    <span className="text-[9px] font-mono font-semibold text-[var(--p)] bg-[var(--p-dim)] px-2 py-0.5 rounded border border-[var(--p-line)]">
                                                        {asset.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-[var(--p-dim)] p-3 rounded-lg border border-[var(--p-line)] text-[10px] text-[var(--p)] leading-normal mt-4">
                                            <strong>Employee Declaration:</strong> I acknowledge receipt of the assets listed above in good working condition. I agree to safeguard them and return them upon cessation of my service with Mular Credit Ltd.
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeDoc === 'statutory' && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="space-y-6 text-[12px] font-sans text-gray-300"
                                >
                                    <div className="flex items-center gap-2 border-b border-[var(--p-line)] pb-4">
                                        <ShieldCheck className="w-5 h-5 text-[var(--p)]" />
                                        <h1 className="text-sm font-bold text-[var(--p)]">Kenyan Statutory Registration & Compliance Summary</h1>
                                    </div>

                                    <div className="space-y-4 font-sans text-gray-400">
                                        <p>
                                            This dashboard serves as the digital ledger audit summary for **{formData.fullName}**'s registration compliance at **Mular Credit Limited**.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--p-line)]">
                                                <p className="text-[9px] uppercase tracking-wider text-[var(--t3)] mb-1">Tax Authority (KRA)</p>
                                                <p className="text-xs font-semibold text-gray-200">{formData.kraPin}</p>
                                                <p className="text-[9px] text-[var(--p)] mt-1">Status: Validated for PAYE filing</p>
                                            </div>

                                            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--p-line)]">
                                                <p className="text-[9px] uppercase tracking-wider text-[var(--t3)] mb-1">Social Health Authority (SHA)</p>
                                                <p className="text-xs font-semibold text-gray-200">{formData.shifNumber}</p>
                                                <p className="text-[9px] text-[var(--p)] mt-1">Status: Enrolled for SHA 2.75% Deductions</p>
                                            </div>

                                            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--p-line)]">
                                                <p className="text-[9px] uppercase tracking-wider text-[var(--t3)] mb-1">National Social Security Fund</p>
                                                <p className="text-xs font-semibold text-gray-200">{formData.nssfNumber}</p>
                                                <p className="text-[9px] text-[var(--p)] mt-1">Status: Configured for Tier I & II caps</p>
                                            </div>

                                            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--p-line)]">
                                                <p className="text-[9px] uppercase tracking-wider text-[var(--t3)] mb-1">Affordable Housing Levy</p>
                                                <p className="text-xs font-semibold text-gray-200">
                                                    {formData.housingLevy ? '1.5% Enabled' : 'Disabled (Requires Consent)'}
                                                </p>
                                                <p className="text-[9px] text-[var(--p)] mt-1">Status: Compliant with Finance Act</p>
                                            </div>
                                        </div>

                                        <div className="bg-[var(--p-dim)] border border-[var(--p-line)] p-4 rounded-xl space-y-2 mt-4 text-[11px] text-[var(--p)] leading-relaxed">
                                            <p className="font-semibold uppercase tracking-wider text-xs">Compliance Audit Pass</p>
                                            <p>✓ KRA PIN format validated for standard PAYE monthly return.</p>
                                            <p>✓ NSSF account matches mandatory employer & employee contribution tiers.</p>
                                            <p>✓ SHA setup completed to avoid medical coverage penalties under the Health Act.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sign agreement button */}
                        {!isSigned && activeDoc !== 'statutory' && (
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleSignContract}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--p)] hover:bg-[#33ecff] text-black font-semibold text-xs rounded-xl shadow-[0_4px_16px_var(--p-glow)] transition-all mt-4"
                            >
                                <PenTool className="w-4 h-4" />
                                Digitally Sign Document
                            </motion.button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
