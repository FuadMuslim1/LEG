import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { UserProfile } from '../types';

interface SkillProps {
  user: UserProfile;
}

export const Skill: React.FC<SkillProps> = ({ user }) => {
  const navigate = useNavigate();

  const skillItems = [
    { label: 'P', name: 'PRONUNCIATION', status: 'ready' },
    { label: 'V', name: 'VOCABULARY', status: 'coming_soon' },
    { label: 'G', name: 'GRAMMAR', status: 'ready' },
    { label: 'S', name: 'SPEAKING', status: 'ready' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Header: Logo & Back Button */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-10 h-10 rounded-full border-2 border-pink-500 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]">
           <div className="w-full h-full bg-indigo-900 rounded-full flex items-center justify-center text-[10px] font-bold">
             GEUWAT
           </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-20 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
        Build Your English Skills
      </h1>

      {/* Skills Container */}
      <div className="flex gap-8 md:gap-16 items-start relative">
        {skillItems.map((skill, index) => (
          <div key={index} className="flex flex-col items-center group relative">
            
            {/* Gear Icon Container */}
            <div className={`
              relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center
              bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl rotate-45
              shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400/50
              hover:scale-110 transition-all duration-300 cursor-pointer
            `}>
              <span className="text-4xl md:text-5xl font-black -rotate-45 italic select-none">
                {skill.label}
              </span>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Special Indicator for Vocabulary (seperti di foto Aa) */}
            {skill.name === 'VOCABULARY' && (
              <div className="absolute top-full mt-2 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
                {/* Vertical Line */}
                <div className="w-[2px] h-12 bg-gradient-to-b from-cyan-400 to-transparent shadow-[0_0_8px_cyan]"></div>
                
                {/* Coming Soon Box */}
                <div className="mt-[-2px] border border-cyan-400 px-4 py-1.5 rounded-md bg-black/80 backdrop-blur-sm shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <span className="text-cyan-400 text-xs font-bold tracking-tighter">
                    Coming Soon!
                  </span>
                </div>

                {/* Skill Name Shadow Text */}
                <div className="mt-8">
                  <span className="text-lg md:text-xl font-black tracking-[0.2em] text-cyan-400/80 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] italic">
                    {skill.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};
