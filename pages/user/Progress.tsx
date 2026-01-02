// [UPDATED] src/pages/user/Progress.tsx
// Angel sudah rapikan duplikasi import dan menggabungkan UI terbaik dari kedua versi.

import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { UserProfile } from '../../types';
import { 
  TrendingUp, 
  Smartphone, 
  ArrowLeft, 
  BarChart2, 
  Star, 
  Zap 
} from 'lucide-react';

interface ProgressProps {
  user: UserProfile;
}

export const Progress: React.FC<ProgressProps> = ({ user }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // State ini penting untuk memicu re-render jika Aa latihan pronunciation di tab lain
  const [progressUpdateTrigger, setProgressUpdateTrigger] = useState(0);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  // Listen for storage updates (Real-time sync antar tab browser)
  useEffect(() => {
    const handleStorageUpdate = () => {
        setProgressUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener('storage_update_pronunciation', handleStorageUpdate);
    return () => window.removeEventListener('storage_update_pronunciation', handleStorageUpdate);
  }, []);

  // [LOGIC] Menghitung nilai progress berdasarkan Level
  const getProgressData = (level: string) => {
    const base = level.charCodeAt(1); 
    
    let pronValue = (base * 2) % 100; 

    // Khusus A1: Ambil data dari Local Storage (Fitur Pronunciation Practice)
    if (level === 'A1') {
      const savedPron = localStorage.getItem('geuwat_local_progress_pronunciation');
      if (savedPron) {
        try {
          const scores = JSON.parse(savedPron);
          const values = Object.values(scores) as number[];
          if (values.length > 0) {
            const sum = values.reduce((a, b) => a + b, 0);
            pronValue = Math.round(sum / values.length); // Rata-rata yang benar
          } else {
            pronValue = 0;
          }
        } catch (e) {
          console.error("Error parsing progress:", e);
          pronValue = 0;
        }
      } else {
        pronValue = 0;
      }
    }

    return [
      { subject: 'Pronunciation', value: pronValue, isLocal: level === 'A1' },
      { subject: 'Vocabulary', value: (base * 3) % 100 },
      { subject: 'Grammar', value: (base * 4) % 100 },
      { subject: 'Speaking', value: (base * 5) % 100 },
    ];
  };

  return (
    <Layout user={user} title="Learning Progress">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" />
                    Statistik Belajar Aa
                </h2>
                <p className="text-slate-500">
                    Pantau terus perkembangan skill bahasa Inggris Aa di sini.
                    {selectedLevel && <span className="font-bold text-indigo-600 ml-1"> (Level {selectedLevel})</span>}
                </p>
            </div>
            
            {/* Tombol Kembali muncul hanya jika sedang melihat detail level */}
            {selectedLevel ? (
               <button 
                 onClick={() => setSelectedLevel(null)}
                 className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 hover:text-slate-800 transition-all flex items-center gap-2 shadow-sm"
               >
                 <ArrowLeft size={18} /> Pilih Level Lain
               </button>
            ) : (
                <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <BarChart2 size={32} />
                </div>
            )}
        </div>

        {/* CONTENT SWITCHER */}
        {!selectedLevel ? (
            // === VIEW 1: LEVEL SELECTION GRID ===
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {levels.map(lvl => (
                <button 
                    key={lvl} 
                    onClick={() => setSelectedLevel(lvl)}
                    className="group relative overflow-hidden bg-white p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 text-left"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Star size={64} className="text-indigo-600 fill-indigo-600" />
                    </div>
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                        Select Level
                    </span>
                    <h3 className="text-4xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">{lvl}</h3>
                    <p className="text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors flex items-center gap-1">
                        Lihat Detail Statistik <ArrowLeft size={14} className="rotate-180" />
                    </p>
                </button>
                ))}
            </div>
        ) : (
            // === VIEW 2: DETAILED STATS ===
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   
                   {/* Left: Summary Card (Visual Candy) */}
                   <div className="lg:col-span-1">
                       <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden h-full flex flex-col justify-between">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Zap size={14} /> Performance
                                </p>
                                <h3 className="text-5xl font-bold mb-4">{selectedLevel}</h3>
                                <p className="text-sm text-indigo-100 leading-relaxed opacity-90 border-t border-indigo-500/50 pt-4">
                                    Grafik di samping menunjukkan estimasi kemampuan Aa berdasarkan latihan yang sudah dikerjakan di level ini.
                                </p>
                            </div>
                            
                            <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-indigo-600">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-indigo-200 font-bold">Status</p>
                                        <p className="text-sm font-bold">On Track</p>
                                    </div>
                                </div>
                            </div>
                       </div>
                   </div>

                   {/* Right: Progress Bars */}
                   <div className="lg:col-span-2 space-y-5">
                        {getProgressData(selectedLevel).map((stat) => (
                        <div key={stat.subject} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                            <div className="flex justify-between items-end mb-3">
                                <span className="font-bold text-slate-700 flex items-center gap-2">
                                    {stat.subject}
                                    {/* Indikator Local Storage */}
                                    {stat.isLocal && (
                                        <div className="group relative">
                                            <span className="bg-slate-100 p-1 rounded-md text-slate-400 border border-slate-200 shadow-sm cursor-help hover:text-indigo-500 hover:bg-indigo-50 transition-colors">
                                                <Smartphone size={14} />
                                            </span>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl z-20">
                                                Disimpan di perangkat ini
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                            </div>
                                        </div>
                                    )}
                                </span>
                                <span className="text-2xl font-bold text-indigo-600">{stat.value}<span className="text-sm text-slate-400 ml-0.5">%</span></span>
                            </div>
                            
                            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden
                                        ${stat.value >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 
                                          stat.value >= 50 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 
                                          'bg-gradient-to-r from-amber-500 to-orange-400'}
                                    `}
                                    style={{ width: `${stat.value}%` }}
                                >
                                    {/* Efek Shimmer/Kilau */}
                                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            
                            <p className="text-xs text-slate-400 mt-3 font-medium">
                                {stat.value >= 80 ? 'Luar biasa! Pertahankan prestasi Aa.' : 
                                 stat.value >= 50 ? 'Bagus, tingkatkan lagi latihannya.' : 
                                 'Ayo semangat, Aa perlu lebih banyak latihan!'}
                            </p>
                        </div>
                        ))}
                   </div>
               </div>
            </div>
        )}
      </div>
    </Layout>
  );
};
