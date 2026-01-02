import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Lock, Sparkles } from 'lucide-react';

interface SkillOption {
  id: string;
  label: string;
  key: string; // P, V, G, S
  color: string;
  shadowColor: string;
  isActiveFeature: boolean;
}

export const Skill: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  
  // State untuk toggle tooltip "Coming Soon"
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const skills: SkillOption[] = [
    { 
      id: 'pronunciation', 
      label: 'PRONUNCIATION', 
      key: 'P', 
      color: 'text-cyan-400 border-cyan-400', 
      shadowColor: 'shadow-cyan-400',
      isActiveFeature: true 
    },
    { 
      id: 'vocabulary', 
      label: 'VOCABULARY', 
      key: 'V', 
      color: 'text-fuchsia-400 border-fuchsia-400', 
      shadowColor: 'shadow-fuchsia-400',
      isActiveFeature: false 
    },
    { 
      id: 'grammar', 
      label: 'GRAMMAR', 
      key: 'G', 
      color: 'text-violet-400 border-violet-400', 
      shadowColor: 'shadow-violet-400',
      isActiveFeature: false 
    },
    { 
      id: 'speaking', 
      label: 'SPEAKING', 
      key: 'S', 
      color: 'text-rose-400 border-rose-400', 
      shadowColor: 'shadow-rose-400',
      isActiveFeature: false 
    },
  ];

  const handleSkillClick = (skill: SkillOption) => {
    if (skill.isActiveFeature) {
      console.log("Navigating to Pronunciation...");
      // navigate('/learning/pronunciation'); 
    } else {
      // Toggle Coming Soon
      setActiveTooltip(activeTooltip === skill.id ? null : skill.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black pb-20">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* --- [UPDATED] HEADER CONTROLS --- */}
      {/* Angel ubah justify-between jadi justify-start biar tombolnya di kiri */}
      {/* Angel hapus logo GW-nya sesuai request Aa */}
      <div className="w-full max-w-6xl px-6 pt-6 flex justify-start items-center z-20 relative">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)] group"
        >
          <ArrowLeft className="text-black group-hover:-translate-x-0.5 transition-transform" size={20} />
        </button>
      </div>

      {/* --- TITLE --- */}
      <div className="mt-12 md:mt-20 mb-12 text-center z-10 px-4 animate-in fade-in slide-in-from-top-10 duration-700">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
          Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Skills</span>
        </h1>
        <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Pilih modul pembelajaran di bawah ini untuk meningkatkan kemampuan Bahasa Inggris Anda.
        </p>
      </div>

      {/* --- SKILLS GRID --- */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-x-6 gap-y-12 md:gap-16 relative z-10 px-4 max-w-4xl w-full">
        {skills.map((skill) => {
          const isActive = skill.isActiveFeature;
          const isTooltipOpen = activeTooltip === skill.id;

          return (
            <div key={skill.id} className="flex flex-col items-center group relative">
              
              {/* BUTTON WRAPPER */}
              <button
                onClick={() => handleSkillClick(skill)}
                className={`
                  relative w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center
                  transition-all duration-300 ease-out
                  ${isActive ? 'cursor-pointer hover:scale-110 hover:-translate-y-2' : 'cursor-not-allowed grayscale-[0.5] hover:grayscale-0'}
                `}
              >
                {/* Glow Effect Background */}
                <div className={`
                    absolute inset-0 rounded-full blur-xl opacity-20 transition-opacity duration-500
                    ${isActive ? `bg-${skill.color.split('-')[1]}-500 group-hover:opacity-60` : 'bg-slate-700 opacity-0'}
                `}></div>
                
                {/* Outer Ring (Gear) */}
                <div className={`
                    relative w-full h-full bg-slate-950 rounded-full border-2 
                    flex items-center justify-center shadow-2xl z-10
                    ${isActive ? `${skill.color} ${skill.shadowColor}/30 shadow-lg` : 'border-slate-700 shadow-none'}
                `}>
                    {/* Rotating Gear Icon */}
                    <Settings 
                        className={`
                            absolute w-[130%] h-[130%] opacity-30
                            ${isActive ? `text-${skill.color.split('-')[1]}-400 animate-[spin_10s_linear_infinite]` : 'text-slate-600'}
                        `} 
                        strokeWidth={0.5}
                    />

                    {/* Inner Circle (The Letter) */}
                    <div className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-full border bg-slate-900 flex items-center justify-center z-20 relative overflow-hidden
                        ${isActive ? `${skill.color} shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]` : 'border-slate-700 text-slate-500'}
                    `}>
                        {/* Lock Icon for Inactive */}
                        {!isActive && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                                <Lock size={14} className="text-slate-400" />
                            </div>
                        )}

                        <span className={`
                            text-2xl md:text-3xl font-black
                            ${isActive ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'text-slate-600'}
                        `}>
                            {skill.key}
                        </span>
                        
                        {/* Shine Effect */}
                        {isActive && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>}
                    </div>
                </div>
              </button>

              {/* LABEL */}
              <div className={`
                  mt-4 text-center transition-all duration-300
                  ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-60'}
              `}>
                  <p className={`
                      text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase
                      ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500'}
                  `}>
                      {skill.label}
                  </p>
                  
                  {isActive ? (
                      <div className="flex items-center justify-center gap-1 mt-1">
                          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-[8px] text-green-500/80 font-mono">ONLINE</span>
                      </div>
                  ) : (
                      <div className="mt-1 text-[8px] text-slate-600 font-mono border border-slate-800 rounded px-1 inline-block">
                          LOCKED
                      </div>
                  )}
              </div>

              {/* TOOLTIP */}
              <div className={`
                  absolute top-full mt-2 w-32 z-50 pointer-events-none transition-all duration-300 ease-out flex flex-col items-center
                  ${isTooltipOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}
              `}>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800 relative top-[1px]"></div>
                  
                  <div className="bg-slate-800 border border-slate-700 text-white p-3 rounded-lg shadow-xl text-center">
                      <div className="mb-1 flex justify-center text-amber-400">
                          <Sparkles size={16} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-300 leading-tight">
                          Modul ini sedang disiapkan.
                      </p>
                      <p className="text-[8px] text-cyan-400 font-bold mt-1 animate-pulse">
                          COMING SOON
                      </p>
                  </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
