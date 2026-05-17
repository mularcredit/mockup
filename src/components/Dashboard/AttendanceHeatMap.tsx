import React from 'react';

const AttendanceHeatMap: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const vols = [12, 8, 6, 4, 5, 9, 24, 58, 92, 78, 65, 70, 62, 55, 60, 68, 72, 65, 55, 48, 40, 32, 22, 16];
  const max = Math.max(...vols);
  const factors: { [key: string]: number } = { 
    Mon: 0.8, Tue: 1.0, Wed: 0.9, Thu: 0.7, Fri: 1.1, Sat: 0.4, Sun: 0.2 
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[13px] font-semibold text-[var(--t1)] tracking-tight">Employee Attendance</div>
          <div className="text-[10px] text-[var(--t3)] mt-1 tracking-tight">When do people clock in?</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse shadow-[0_0_8px_var(--green-glow)]" />
          <span className="text-[9px] font-semibold text-[var(--green)]">Live View</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {days.map((day) => (
          <div key={day} className="hmap-row">
            <div className="hmap-lbl">{day}</div>
            <div className="hmap-grid">
              {vols.map((v, h) => {
                const f = factors[day] || 1;
                const i = Math.min(1, (v * f) / max);
                return (
                  <div
                    key={h}
                    className="hcell cursor-crosshair"
                    style={{ 
                      background: i > 0.05 ? `rgba(0, 245, 155, ${0.05 + i * 0.95})` : 'rgba(255,255,255,0.03)',
                      boxShadow: i > 0.85 ? '0 0 10px var(--green-glow)' : 'none'
                    }}
                    title={`${day} ${h}:00 · ${Math.round(v * f)} Clock-ins`}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Time Labels */}
        <div className="hmap-row mt-1 pt-1 border-t border-[var(--p-line)]">
          <div className="hmap-lbl" />
          <div className="hmap-grid">
            {vols.map((_, h) => (
              <div key={h} className="text-[7px] text-[var(--t4)] text-center font-mono">
                {h % 6 === 0 ? `${h}h` : ''}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--p-line)]">
        <div className="text-[9px] text-[var(--t4)] font-semibold">Intensity</div>
        <div className="flex items-center gap-1">
          <div className="text-[9px] text-[var(--t4)] mr-1">Lower</div>
          {[0.08, 0.28, 0.60, 1].map((op, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-[1px]"
              style={{ background: `rgba(0, 245, 155, ${op})` }}
            />
          ))}
          <div className="text-[9px] text-[var(--t4)] ml-1">Higher</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeatMap;
