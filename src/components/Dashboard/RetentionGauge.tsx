import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeProps {
    value: number;
    label: string;
    sublabel: string;
}

export default function RetentionGauge({ value, label, sublabel }: GaugeProps) {
    // Data for a thick, professional donut chart
    const data = [
        { name: 'Retained', value: value },
        { name: 'Turnover', value: 100 - value }
    ];

    // Colors: Gold for retained, transparent/dark line for the remainder
    const COLORS = ['var(--gold)', 'rgba(255, 255, 255, 0.05)'];

    return (
        <div className="glass-card p-5 flex flex-col gap-4 relative overflow-hidden h-full">
            {/* Header */}
            <div>
                <h3 className="text-[12px] font-semibold text-[var(--t1)] tracking-wide">{label}</h3>
                <p className="text-[10px] text-[var(--t3)]">{sublabel}</p>
            </div>

            {/* Main Donut Row */}
            <div className="flex items-center gap-6 justify-center my-auto">
                {/* Thick Donut Chart */}
                <div className="relative shrink-0" style={{ width: 90, height: 90 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={28}
                                outerRadius={42}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index]} 
                                        stroke="none"
                                        style={{
                                            filter: index === 0 ? 'drop-shadow(0 0 5px var(--gold-glow))' : 'none'
                                        }}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[15px] font-bold text-[var(--t1)] tabular-nums leading-none">{value}%</span>
                    </div>
                </div>

                {/* Plain-English Legend */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] shadow-[0_0_6px_var(--gold-glow)]" />
                        <div>
                            <div className="text-[10px] text-[var(--t3)]">Staff Retained</div>
                            <div className="text-[13px] font-bold text-[var(--t1)] tabular-nums">{value}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--p-line)]" />
                        <div>
                            <div className="text-[10px] text-[var(--t3)]">Target Retention</div>
                            <div className="text-[13px] font-bold text-[var(--t1)] tabular-nums">98.0%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Attrition strip */}
            <div className="border-t border-[var(--p-line)] pt-3 flex items-center justify-between">
                <div className="text-[10px] text-[var(--t3)]">Staff Turnover Rate</div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--red)] animate-pulse" />
                    <span className="text-[13px] font-bold text-[var(--red)] tabular-nums">3.2%</span>
                </div>
            </div>
        </div>
    );
}
