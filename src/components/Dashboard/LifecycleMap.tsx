import React from 'react';
import { UserSearch, ClipboardCheck, DoorOpen, Flame, Rocket, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stages = [
    {
        id: 'attract',
        number: '01',
        label: 'Talent sourcing',
        sublabel: 'Candidate discovery & recruitment',
        icon: <UserSearch strokeWidth={1} className="w-8 h-8" />,
        path: '/recruitment'
    },
    {
        id: 'select',
        number: '02',
        label: 'Selection process',
        sublabel: 'Interviews, evaluations & hiring',
        icon: <ClipboardCheck strokeWidth={1} className="w-8 h-8" />,
        path: '/recruitment'
    },
    {
        id: 'onboard',
        number: '03',
        label: 'Onboarding',
        sublabel: 'Welcoming and integrating new hires',
        icon: <DoorOpen strokeWidth={1} className="w-8 h-8" />,
        path: '/employees'
    },
    {
        id: 'develop',
        number: '04',
        label: 'Growth & development',
        sublabel: 'Learning, mentorship & career progression',
        icon: <Flame strokeWidth={1} className="w-8 h-8" />,
        path: '/training'
    },
    {
        id: 'perform',
        number: '05',
        label: 'Managing performance',
        sublabel: 'Performance reviews, goals & feedback',
        icon: <Rocket strokeWidth={1} className="w-8 h-8" />,
        path: '/performance'
    },
    {
        id: 'transition',
        number: '06',
        label: 'Transition & alumni',
        sublabel: 'Offboarding and continued engagement',
        icon: <HeartHandshake strokeWidth={1} className="w-8 h-8" />,
        path: '/employees'
    }
];

export default function LifecycleMap() {
    const navigate = useNavigate();

    return (
        <div className="border border-[#C8A84B]/20 rounded-[24px] p-6 mb-6 relative overflow-hidden bg-white/[0.01]">
            <div className="mb-6">
                <h2 className="text-[14px] font-medium tracking-[-0.03em] text-white/92 leading-tight">
                    Employee journey map
                </h2>
            </div>

            <div className="relative grid grid-cols-6 gap-2">


                {stages.map((stage, index) => (
                    <div 
                        key={stage.id} 
                        className="relative z-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-0.5 group cursor-pointer"
                        onClick={() => navigate(stage.path)}
                    >
                        {/* Segmented Connector Line (stops exactly before the next circle) */}
                        {index < stages.length - 1 && (
                            <>
                                <div className="absolute top-[20px] left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-[#C8A84B]/40 z-0" />
                                {/* Center Dot for visual interest */}
                                <div className="absolute top-[20px] left-[100%] w-1.5 h-1.5 rounded-full bg-[#C8A84B]/80 -translate-y-1/2 -translate-x-1/2 z-0" />
                            </>
                        )}
                        
                        {/* Icon Container */}
                        <div className="h-[40px] w-[40px] rounded-full border border-[#C8A84B]/20 bg-white/[0.03] backdrop-blur-sm flex items-center justify-center mb-3 transition-all duration-500 group-hover:border-[#C8A84B]/50 group-hover:bg-[#C8A84B]/5">
                            <div className="text-[#C8A84B]/60 group-hover:text-[#C8A84B] transition-colors duration-500">
                                {React.cloneElement(stage.icon as React.ReactElement, { className: 'w-4 h-4', strokeWidth: 1.2 })}
                            </div>
                        </div>

                        {/* Stage Number */}
                        <span className="text-[7px] font-medium tracking-[0.2em] text-[#C8A84B]/60 mb-1.5 block">
                            {stage.number}
                        </span>

                        {/* Text Content */}
                        <h3 className="text-[13px] font-medium tracking-[-0.02em] text-white/90 mb-0.5">
                            {stage.label}
                        </h3>
                        <p className="text-[10px] leading-tight text-white/25 font-light px-1">
                            {stage.sublabel}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
