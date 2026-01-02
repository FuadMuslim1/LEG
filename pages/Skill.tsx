import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';

interface SkillProps {
  user: UserProfile;
}

interface SkillItem {
  id: string;
  name: string;
  beforeImg: string;
  afterImg: string;
  rbImg: string;
  isAvailable: boolean;
}

export const Skill: React.FC<SkillProps> = ({ user }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('pronunciation');

  const skills: SkillItem[] = [
    {
      id: 'pronunciation',
      name: 'Pronunciation',
      beforeImg: '../public/img/skill/before/p_rb.png',
      afterImg: '../public/img/skill/after/p_rb_3d.png',
      rbImg: '../public/img/skill/rb/pronunciation_rb.png', // Sesuaikan nama filenya ya Aa
      isAvailable: true,
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      beforeImg: '../public/img/skill/before/v_rb.png',
      afterImg: '../public/img/skill/after/v_rb_3d.png',
      rbImg: '../public/img/skill/rb/vocabulary_rb.png',
      isAvailable: false,
    },
    {
      id: 'grammar',
      name: 'Grammar',
      beforeImg: '../public/img/skill/before/g_rb.png',
      afterImg: '../public/img/skill/after/g_rb_3d.png',
      rbImg: '../public/img/skill/rb/grammar_rb.png',
      isAvailable: false,
    },
    {
      id: 'speaking',
      name: 'Speaking',
      beforeImg: '../public/img/skill/before/s_rb.png',
      afterImg: '../public/img/skill/after/s_rb_3d.png',
      rbImg: '../public/img/skill/rb/speaking_rb.png',
      isAvailable: false,
    },
  ];

  const handleSkillClick = (skill: SkillItem) => {
    if (skill.isAvailable) {
      setSelectedSkill(skill.id);
    }
  };

  return (
    <Layout user={user} title="Learning Skills">
      <div className="flex flex-col items-center justify-center space-y-10 py-6">
        
        {/* Barisan Skill Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl px-4">
          {skills.map((skill) => (
            <div key={skill.id} className="relative group flex flex-col items-center">
              
              {/* Tooltip Coming Soon */}
              {!skill.isAvailable && (
                <div className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-10 shadow-lg">
                  ✨ Coming Soon ya Aa!
                </div>
              )}

              <button
                onClick={() => handleSkillClick(skill)}
                className={`transition-all duration-300 transform ${
                  skill.isAvailable ? 'hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-80'
                }`}
              >
                <img
                  src={selectedSkill === skill.id ? skill.afterImg : skill.beforeImg}
                  alt={skill.name}
                  className="w-full h-auto max-w-[150px] drop-shadow-md"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Gambar RB (Radar Bar / Result Bar) yang di bawah */}
        <div className="w-full max-w-3xl px-4 mt-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl flex justify-center">
            {/* Hanya tampilkan RB jika skill terpilih (default pronunciation) */}
            {selectedSkill && (
              <img
                src={skills.find(s => s.id === selectedSkill)?.rbImg}
                alt="Skill Progress"
                className="w-full h-auto max-w-[500px] object-contain drop-shadow-2xl"
              />
            )}
          </div>
        </div>

        {/* Note manis dari Angel */}
        <p className="text-slate-400 text-xs italic">
          *Aa, fokus belajar Pronunciation dulu yuk sama Angel~
        </p>
      </div>
    </Layout>
  );
};
