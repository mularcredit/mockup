import React from 'react';

const nbData = [
    { label: 'High potential\nlow perform', val: 182, color: 'rgba(0,212,126,.07)', textCol: 'var(--green)' },
    { label: 'High potential\nmid perform', val: 640, color: 'rgba(0, 229, 255, .07)', textCol: 'var(--gold)' },
    { label: 'Star performers', val: 380, color: 'rgba(0,212,126,.18)', textCol: '#000' },
    { label: 'Mid potential\nlow perform', val: 510, color: 'rgba(255,255,255,.02)', textCol: 'var(--t3)' },
    { label: 'Core contributors', val: 3240, color: 'rgba(74,143,212,.07)', textCol: 'var(--blue)' },
    { label: 'High perform\nmid potential', val: 1820, color: 'rgba(0,212,126,.06)', textCol: 'var(--green)' },
    { label: 'At risk', val: 204, color: 'rgba(217,95,95,.08)', textCol: 'var(--red)' },
    { label: 'Reliable\nperformers', val: 1120, color: 'rgba(200, 144, 10,.07)', textCol: 'var(--amber)' },
    { label: 'Future leaders', val: 316, color: 'rgba(139,126,248,.18)', textCol: '#000' },
];

export default function NineBoxMatrix() {
    return (
        <div className="glass-card p-6 h-full">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-[13px] font-medium text-[var(--t1)]">Employee Performance Ratings</h3>
                    <p className="text-[11px] text-[var(--t3)] mt-1">Latest performance review results</p>
                </div>
            </div>

            <div className="grid grid-cols-3 grid-rows-3 gap-1 h-[220px]">
                {nbData.map((cell, i) => (
                    <div 
                        key={i} 
                        className="rounded-md flex flex-col items-center justify-center p-2 text-center transition-all hover:scale-[1.02] cursor-default border border-[var(--p-line)]"
                        style={{ backgroundColor: cell.color }}
                    >
                        <div className="text-[16px] font-bold tabular-nums leading-none" style={{ color: cell.textCol }}>
                            {cell.val}
                        </div>
                        <div className="text-[8px] leading-tight mt-1 opacity-70 whitespace-pre-line" style={{ color: cell.textCol === '#000' ? 'rgba(0,0,0,0.6)' : 'var(--t3)' }}>
                            {cell.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-[9px] text-[var(--t4)] mt-3">
                <span>← Low performance</span>
                <span>High performance →</span>
            </div>
        </div>
    );
}
