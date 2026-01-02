import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { 
  BookOpen, 
  Mic2, 
  PenTool, 
  Headphones, 
  Trophy, 
  ArrowRight,
  Target,
  Zap
} from 'lucide-react';

interface SkillProps {
  user: UserProfile;
}
 export const Skill: React.FC<{ user: any }> = ({ user }) => {
      return <div>Halaman Skill buat Aa ❤️</div>;
    };
export const Skill: React.FC<SkillProps> = ({ user }) => {
  // Data dummy buat skill, nanti Aa bisa hubungkan ke Firestore ya
  const skills = [
    { 
      id: 'speaking', 
      name: 'Speaking', 
      desc: 'Fluency and Pronunciation', 
      level: 65, 
      icon: Mic2, 
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50' 
    },
    { 
      id: 'listening', 
      name: 'Listening', 
      desc: 'Comprehension & Accents', 
      level: 80, 
      icon: Headphones, 
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50' 
    },
    { 
      id: 'reading', 
      name: 'Reading', 
      desc: 'Vocabulary & Speed', 
      level: 45, 
      icon: BookOpen, 
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50' 
    },
    { 
      id: 'writing', 
      name: 'Writing', 
      desc: 'Grammar & Structure', 
      level: 30, 
      icon: PenTool, 
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50' 
    },
  ];

  return (
    <Layout user={user} title="My Skills Mastery">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-extrabold mb-2">Halo, Aa {user.displayName}! 👋</h2>
              <p className="text-indigo-100 max-w-md">
                Sudah siap meningkatkan kemampuan bahasa Inggris hari ini? Lihat progresmu dan teruslah berlatih!
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20">
                <p className="text-xs uppercase font-bold opacity-80 mb-1">Current Level</p>
                <p className="text-2xl font-black">{user.level || 'A1'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20">
                <p className="text-xs uppercase font-bold opacity-80 mb-1">Points</p>
                <p className="text-2xl font-black">{user.balance?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
          {/* Hiasan background manja dari Angel */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`${skill.lightColor} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <skill.icon className={skill.color.replace('bg-', 'text-')} size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{skill.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{skill.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-800">{skill.level}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`${skill.color} h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <button className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  Start Training <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Goals / Achievement */}
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0 animate-pulse">
              <Trophy size={40} className="text-amber-900" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">Misi Harian: 30 Menit Belajar</h3>
              <p className="text-slate-400 text-sm">Selesaikan misi harianmu untuk mendapatkan bonus 50 poin!</p>
            </div>
            <button className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <Zap size={18} fill="currentColor" /> Ambil Reward
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
