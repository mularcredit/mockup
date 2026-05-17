import React from 'react';
import { motion } from 'framer-motion';

const GrowthRunway: React.FC = () => {
  const runwayItems = [
    { step: 'Q1', label: 'Current QTR', val: 'KES 87.4M', sub: 'Baseline payroll liability', fill: '88%', color: 'var(--p)' },
    { step: 'Q2', label: 'Next QTR', val: 'KES 94M', sub: 'Projected (+8% headcount)', fill: '92%', color: 'var(--green)' },
    { step: 'Q3', label: 'H2 2026', val: 'KES 102M', sub: 'Stretch target budget', fill: '100%', color: 'var(--green)' },
    { step: 'Q4', label: 'E-O-Y Forecast', val: 'KES 120M', sub: 'Variance warning limit', fill: '75%', color: 'var(--amber)' },
  ];

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[13px] font-semibold text-[var(--t1)]">Payroll Projection</div>
          <div className="text-[10px] text-[var(--t3)] mt-1">Expected payroll cost for the rest of the year</div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-[var(--p-dim)] rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--p)] animate-pulse" />
          <span className="text-[9px] font-semibold text-[var(--p)]">AI Modeler</span>
        </div>
      </div>

      <div className="space-y-4">
        {runwayItems.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold shrink-0 border"
              style={{ 
                background: item.step === '04' ? 'rgba(232,160,48,0.1)' : item.color, 
                color: item.step === '04' ? 'var(--amber)' : 'var(--sidebar)',
                borderColor: item.step === '04' ? 'var(--amber-d)' : 'transparent'
              }}
            >
              {item.step}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1">
                <div className="text-[9px] font-semibold text-[var(--t4)]">{item.label}</div>
                <div className="text-[11px] font-semibold text-[var(--t1)]">{item.val}</div>
              </div>
              <div className="text-[9px] text-[var(--t3)] mb-2">{item.sub}</div>
              <div className="h-1 bg-[var(--p-line)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: item.fill }} 
                  transition={{ duration: 1, delay: i * 0.2 }} 
                  className="h-full rounded-full" 
                  style={{ background: item.color }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-[10px] text-[var(--t3)] leading-relaxed bg-[var(--glass)] p-3 rounded-xl border border-[var(--p-line)]">
        Based on current <span className="font-semibold text-[var(--t1)]">monthly hiring (+12 staff)</span>, payroll will hit <span className="font-semibold text-[var(--t1)]">KES 102M/mo</span> in Q3. 
        Reaching Q4 thresholds requires a <span className="text-[var(--red)] font-semibold">budget increase of 4.2%</span>.
      </div>
    </div>
  );
};

export default GrowthRunway;
