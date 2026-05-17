import React from 'react';

interface KPIItem {
    label: string;
    value: string | number;
    trend: string;
    trendType: 'up' | 'dn' | 'warn';
    color?: string;
}

export default function KPIStrip({ items, columns = 6, size = 'default' }: { items: KPIItem[], columns?: number, size?: 'default' | 'sm' }) {
    const lgCols = {
        4: 'lg:grid-cols-4',
        6: 'lg:grid-cols-6',
        8: 'lg:grid-cols-8'
    }[columns] || 'lg:grid-cols-6';

    return (
        <div className={`grid grid-cols-2 md:grid-cols-4 ${lgCols} border border-[var(--p-line)] rounded-xl overflow-hidden mb-7 bg-[var(--s1)] shadow-2xl backdrop-blur-sm`}>
            {items.map((item, i) => (
                <div 
                    key={i} 
                    className={`${size === 'sm' ? 'p-3 md:p-3' : 'p-4 md:p-5'} border-r border-[var(--p-line)] last:border-r-0 hover:bg-white/5 transition-colors group relative overflow-hidden`}
                >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className={`${size === 'sm' ? 'text-[15px] md:text-[16px]' : 'text-[20px] md:text-[22px]'} font-medium text-[var(--t1)] tracking-tight tabular-nums leading-none mb-1.5`} style={{ color: item.color }}>
                        {item.value}
                    </div>
                    <div className="text-[10px] text-[var(--t3)] tracking-wider font-medium">
                        {item.label}
                    </div>
                    <div className={`text-[10px] mt-1.5 font-medium flex items-center gap-1.5 ${
                        item.trendType === 'up' ? 'text-[var(--green)]' : 
                        item.trendType === 'dn' ? 'text-[var(--red)]' : 
                        'text-[var(--amber)]'
                    }`}>
                        <span className="opacity-80">
                            {item.trendType === 'up' ? '↑' : item.trendType === 'dn' ? '↓' : '•'}
                        </span>
                        {item.trend}
                    </div>
                </div>
            ))}
        </div>
    );
}
