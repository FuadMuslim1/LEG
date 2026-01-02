// START OF FILE: src/pages/user/Progress.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout'; // Pastikan path import sesuai
import { UserProfile } from '../../types';
import { TrendingUp, Smartphone, ArrowLeft, BarChart3 } from 'lucide-react';

interface Props {
  user: UserProfile;
}

export const Progress: React.FC<Props> = ({ user }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Trigger update jika ada perubahan local storage (untuk pronunciation A1)
  const [progressUpdateTrigger, setProgressUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleStorageUpdate = () => {
        setProgressUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener('storage_update_pronunciation', handleStorageUpdate);
    return () => window.removeEventListener('storage_update_pronunciation', handleStorageUpdate);
  }, []);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  // Logika perhitungan nilai (Dipindahkan dari Layout.tsx)
  const getProgressData = (level: string) => {
    const base = level.charCodeAt(1); 
    
    let pronValue = (base * 2) % 100; 

    if (level === 'A1') {
      const savedPron = localStorage.getItem('geuwat_local_progress_pronunciation');
      if (savedPron) {
        const scores = JSON.parse(savedPron);
        const values = Object.values(scores) as number[];
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          pronValue = Math.round(sum / 4); 
        } else {
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
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <TrendingUp className="text-emerald-500" />
             Statistik Belajar
           </h2>
           <p className="text-slate-500 text-sm mt-1">Pantau perkembangan kemampuan bahasa Inggris Aa di sini.</p>
        </div>
        {selectedLevel && (
           <button 
             onClick={() => setSelectedLevel(null)}
             className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
           >
             <ArrowLeft size={16} /> Pilih Level Lain
           </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!selectedLevel ? (
            // LEVEL SELECTOR VIEW
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {levels.map(lvl => (
                <button 
                  key={lvl} 
                  onClick={() => setSelectedLevel(lvl)}
                  className="group relative bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                     <BarChart3 size={64} />
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">Level</span>
                  <div className="text-4xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{lvl}</div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-400 font-medium group-hover:text-emerald-600">
                    Lihat Detail <ArrowLeft size={16} className="rotate-180" />
                  </div>
                </button>
              ))}
            </div>
        ) : (
            // DETAIL STATS VIEW
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left: Summary Card */}
               <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-2">Selected Level</p>
                        <h1 className="text-6xl font-bold mb-6">{selectedLevel}</h1>
                        <p className="text-sm text-emerald-50 leading-relaxed opacity-90">
                           Grafik ini menunjukkan estimasi kemampuan Aa berdasarkan latihan yang sudah dikerjakan.
                        </p>
                      </div>
                      <div className="absolute -bottom-10 -right-10 text-white opacity-20 rotate-12">
                         <TrendingUp size={180} />
                      </div>
                  </div>
               </div>

               {/* Right: Progress Bars */}
               <div className="lg:col-span-2 space-y-6">
                 {getProgressData(selectedLevel).map((stat) => (
                   <div key={stat.subject} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <div className="flex justify-between items-end mb-3">
                       <span className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                         {stat.subject}
                         {stat.isLocal && (
                            <span className="bg-slate-100 p-1 rounded-md text-slate-400" title="Disimpan di perangkat ini">
                                <Smartphone size={14} />
                            </span>
                         )}
                       </span>
                       <span className="font-bold text-2xl text-emerald-600">{stat.value}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                       <div 
                         className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg relative" 
                         style={{ width: `${stat.value}%` }}
                       >
                          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
        )}
      </div>
    </Layout>
  );
};
