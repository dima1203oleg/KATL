import React from 'react';

// Crisp 3D-styled SVG render of CATL Container (TENER / EnerOne)
export const CatlContainerGraphic: React.FC<{
  type?: 'tener' | 'tener-h' | 'tener-s' | 'tener-flex' | 'enerone' | 'sodium' | 'stack';
  className?: string;
  isLarge?: boolean;
}> = ({ type = 'tener-h', className = 'w-full h-44', isLarge = false }) => {
  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 480 240"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="containerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="containerSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0077ff" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="240" cy="215" rx="200" ry="16" fill="#000000" fillOpacity="0.3" filter="blur(6px)" />

        {/* 3D Isometric / Orthographic Container Body */}
        {/* Roof */}
        <polygon points="90,75 350,55 410,75 150,95" fill="url(#roofGrad)" stroke="#94a3b8" strokeWidth="1.5" />
        
        {/* Right Side Wall */}
        <polygon points="350,55 410,75 410,185 350,165" fill="url(#containerSide)" stroke="#475569" strokeWidth="1.5" />
        {/* Right side door panels & vents */}
        <line x1="370" y1="67" x2="370" y2="175" stroke="#334155" strokeWidth="1.5" />
        <line x1="390" y1="71" x2="390" y2="179" stroke="#334155" strokeWidth="1.5" />
        {/* Cooling fans on side */}
        <circle cx="380" cy="95" r="9" fill="#1e293b" />
        <circle cx="380" cy="120" r="9" fill="#1e293b" />
        <circle cx="380" cy="145" r="9" fill="#1e293b" />

        {/* Front Wall */}
        <polygon points="90,75 350,55 350,165 90,190" fill="url(#containerGrad)" stroke="#64748b" strokeWidth="2" filter="url(#shadow)" />

        {/* Corrugated Vertical Lines / Panel Grooves on Front */}
        {[115, 140, 165, 190, 215, 240, 265, 290, 315, 335].map((x, i) => {
          const topY = 75 - (i * 2);
          const bottomY = 190 - (i * 2.5);
          return (
            <line
              key={i}
              x1={x}
              y1={topY}
              x2={x}
              y2={bottomY}
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />
          );
        })}

        {/* Vertical panel dividers (Doors) */}
        <line x1="170" y1="70" x2="170" y2="182" stroke="#475569" strokeWidth="2.5" />
        <line x1="250" y1="63" x2="250" y2="174" stroke="#475569" strokeWidth="2.5" />
        <line x1="330" y1="57" x2="330" y2="167" stroke="#475569" strokeWidth="2.5" />

        {/* Door latches / handles */}
        <rect x="162" y="125" width="4" height="14" rx="1" fill="#334155" />
        <rect x="174" y="125" width="4" height="14" rx="1" fill="#334155" />
        <rect x="242" y="120" width="4" height="14" rx="1" fill="#334155" />
        <rect x="254" y="120" width="4" height="14" rx="1" fill="#334155" />

        {/* CATL Brand on Container */}
        <g transform="translate(195, 95)">
          <text
            x="0"
            y="0"
            fill="#0052cc"
            fontFamily="'Unbounded', 'Manrope', sans-serif"
            fontWeight="900"
            fontSize="24"
            letterSpacing="2"
          >
            CATL
          </text>
          <text
            x="3"
            y="14"
            fill="#0284c7"
            fontFamily="'Manrope', sans-serif"
            fontWeight="700"
            fontSize="9"
            letterSpacing="3"
          >
            {type === 'tener-h' ? 'TENER H' : type === 'tener-s' ? 'TENER S' : type === 'enerone' ? 'EnerOne+' : type === 'sodium' ? 'SODIUM' : 'TENER'}
          </text>
        </g>

        {/* Corner Castings (ISO Container Corners) */}
        <rect x="86" y="71" width="10" height="10" fill="#334155" rx="1" />
        <rect x="86" y="184" width="10" height="10" fill="#334155" rx="1" />
        <rect x="344" y="52" width="10" height="10" fill="#334155" rx="1" />
        <rect x="344" y="160" width="10" height="10" fill="#334155" rx="1" />
        <rect x="404" y="71" width="10" height="10" fill="#1e293b" rx="1" />
        <rect x="404" y="179" width="10" height="10" fill="#1e293b" rx="1" />

        {/* Warning / Cert Labels */}
        <rect x="105" y="100" width="10" height="12" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
        <rect x="105" y="118" width="10" height="8" fill="#ef4444" />
      </svg>
    </div>
  );
};

// Architecture Diagram Graphic matching screenshots
export const ArchitectureFlowGraphic: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0e17] rounded-xl p-4 sm:p-6 border border-white/10 text-white">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Step 1: Solar / Wind */}
        <div className="flex-1 bg-[#121826] p-4 rounded-xl border border-white/10 text-center w-full">
          <div className="h-16 flex items-center justify-center text-amber-400 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="font-bold text-xs text-white">Відновлювана генерація</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Сонячні та вітрові електростанції</div>
        </div>

        <div className="text-neutral-500 font-bold text-lg hidden lg:block">→</div>

        {/* Step 2: PCS Inverter */}
        <div className="flex-1 bg-[#121826] p-4 rounded-xl border border-white/10 text-center w-full">
          <div className="h-16 flex items-center justify-center text-cyan-400 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 9h6v6H9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6" />
            </svg>
          </div>
          <div className="font-bold text-xs text-white">PCS</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Перетворення енергії (AC/DC)</div>
        </div>

        <div className="text-neutral-500 font-bold text-lg hidden lg:block">→</div>

        {/* Step 3: CATL TENER H BESS */}
        <div className="flex-1 bg-[#0f2444] p-4 rounded-xl border-2 border-blue-500 text-center w-full shadow-lg shadow-blue-500/10">
          <div className="h-16 flex items-center justify-center text-blue-400 mb-2">
            <CatlContainerGraphic type="tener-h" className="w-28 h-14" />
          </div>
          <div className="font-bold text-xs text-blue-300">CATL TENER H BESS</div>
          <div className="text-[11px] text-blue-200/80 mt-0.5">Накопичення енергії та стабілізація</div>
        </div>

        <div className="text-neutral-500 font-bold text-lg hidden lg:block">→</div>

        {/* Step 4: Transformer */}
        <div className="flex-1 bg-[#121826] p-4 rounded-xl border border-white/10 text-center w-full">
          <div className="h-16 flex items-center justify-center text-emerald-400 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="8" cy="12" r="5" strokeWidth="1.5" />
              <circle cx="16" cy="12" r="5" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="font-bold text-xs text-white">Трансформатор</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">та switchgear (10/35 кВ)</div>
        </div>

        <div className="text-neutral-500 font-bold text-lg hidden lg:block">→</div>

        {/* Step 5: Grid / Consumer */}
        <div className="flex-1 bg-[#121826] p-4 rounded-xl border border-white/10 text-center w-full">
          <div className="h-16 flex items-center justify-center text-amber-300 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="font-bold text-xs text-white">Мережа / Споживач</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Стабільне енергопостачання</div>
        </div>

      </div>
    </div>
  );
};
