import React from 'react';
import { motion } from 'framer-motion';

interface FunnelStep {
    label: string;
    value: string | number;
    width: number; // percentage
    opacity: number;
}

const funnelData: FunnelStep[] = [
    { label: 'Applications', value: '3,210', width: 100, opacity: 0.2 },
    { label: 'Shortlisted', value: '1,924', width: 85, opacity: 0.3 },
    { label: 'Interviewed', value: '964', width: 70, opacity: 0.4 },
    { label: 'Assessed', value: '482', width: 55, opacity: 0.5 },
    { label: 'Offer stage', value: '241', width: 40, opacity: 0.62 },
    { label: 'Hired', value: '184', width: 25, opacity: 0.78 },
];

export default function RecruitmentFunnel() {
    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-[13px] font-medium text-[var(--t1)]">Recent Job Applications</h3>
                    <p className="text-[11px] text-[var(--t3)] mt-1">How many applied vs hired</p>
                </div>
                <div className="text-[10px] text-[var(--t3)] px-2 py-0.5 border border-[var(--p-line)] rounded-full bg-[var(--p-dim)]">
                    5.7% yield rate
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-1 justify-center">
                {funnelData.map((step, i) => (
                    <motion.div
                        key={step.label}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${step.width}%`, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-[24px] rounded-sm flex items-center justify-between px-3 text-[10px] font-medium"
                        style={{ 
                            backgroundColor: `rgba(0, 229, 255, ${step.opacity})`,
                            color: '#ffffff'
                        }}
                    >
                        <span>{step.label}</span>
                        <span className="font-mono">{step.value}</span>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-0 border border-[var(--p-line)] rounded-lg overflow-hidden mt-6 bg-[var(--s2)]">
                {[
                    { label: 'Time-to-hire', val: '28d' },
                    { label: 'Cost-per-hire', val: 'KES 46K' },
                    { label: 'Offer acceptance', val: '82%' }
                ].map((stat, i) => (
                    <div key={i} className="p-2.5 border-r border-[var(--p-line)] last:border-r-0">
                        <div className="text-[14px] font-medium text-[var(--t1)] tabular-nums">{stat.val}</div>
                        <div className="text-[10px] text-[var(--t4)] mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
