// FILE: src/pages/user/Reward.tsx
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { UserProfile } from '../../types';
import { Gift, Coins, Trophy, Copy, Check, History, Star, ArrowRight } from 'lucide-react';

interface RewardProps {
  user: UserProfile;
}

export const Reward: React.FC<RewardProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  // Helper biar kodenya rapi (DRY Principle)
  const formatNumber = (num?: number) => {
    return num ? new Intl.NumberFormat('id-ID').format(num) : '0';
  };

  const handleCopy = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout user={user} title="Reward Center">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* --- SECTION 1: STATS HERO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kartu Saldo (Gold Theme - Diambil dari Kode 1 karena lebih Premium) */}
          <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-200/50 group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Gift size={140} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 opacity-90">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                   <Coins size={16} className="text-white" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Geuwat Points</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-sm">
                {formatNumber(user.balance)}
              </h2>
              <p className="text-sm font-medium opacity-90 max-w-md leading-relaxed">
                Tukarkan poinmu dengan fitur premium atau merchandise eksklusif. Semakin rajin belajar, semakin banyak poinnya!
              </p>
            </div>
          </div>

          {/* Kartu Level (Diambil dari Kode 1 karena ada Progress Bar) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <div>
               <div className="flex items-center gap-2 text-indigo-600 mb-3">
                 <Trophy size={20} />
                 <span className="font-bold text-xs uppercase tracking-wider">Current Rank</span>
               </div>
               <h3 className="text-4xl font-bold text-slate-800 mb-1">{user.level || 'Rookie'}</h3>
               <p className="text-xs text-slate-400">Tingkatkan terus levelmu!</p>
             </div>
             
             {/* Visual Progress Bar Placeholder */}
             <div className="mt-6 relative z-10">
               <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>70%</span>
               </div>
               <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full w-[70%] rounded-full" /> 
               </div>
               <p className="text-[10px] text-slate-400 mt-2 font-medium">
                 Butuh 300 poin lagi untuk naik rank.
               </p>
             </div>
          </div>
        </div>

        {/* --- SECTION 2: REFERRAL CODE --- */}
        {/* (Diambil dari Kode 2 karena UI Dashed Box-nya lebih modern buat copy-paste) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <Star size={18} className="text-amber-500 fill-amber-500" /> Referral Code
              </h3>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                Bonus Point Active
              </span>
           </div>
           <div className="p-6 md:p-8 text-center">
              <p className="text-sm text-slate-500 mb-6 max-w-xl mx-auto">
                 Bagikan kode unik ini ke teman-teman Aa. Jika mereka mendaftar, Aa dan teman Aa akan sama-sama mendapatkan <strong>Bonus 500 Poin!</strong>
              </p>
              
              <div 
                onClick={handleCopy}
                className="max-w-lg mx-auto group cursor-pointer relative bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl p-6 transition-all duration-300 active:scale-95"
              >
                  <div className="text-3xl font-mono font-bold text-slate-700 group-hover:text-indigo-600 tracking-widest transition-colors">
                     {user.referralCode || '-'}
                  </div>
                  
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                     {copied ? <Check size={24} className="text-emerald-500" /> : <Copy size={24} />}
                  </div>
              </div>
              
              <div className="h-6 mt-2">
                {copied && (
                    <p className="text-xs font-bold text-emerald-600 animate-in fade-in slide-in-from-top-1 flex items-center justify-center gap-1">
                       <Check size={12}/> Berhasil disalin ke clipboard!
                    </p>
                )}
              </div>
           </div>
        </div>

        {/* --- SECTION 3: REWARD CATALOG --- */}
        {/* (Diambil dari Kode 1 biar halamannya gak sepi) */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Gift className="text-rose-500" size={20} />
                Katalog Penukaran
             </h3>
             <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight size={14}/>
             </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer">
                <div className="aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center group-hover:bg-indigo-50 transition-colors relative overflow-hidden">
                  <Gift size={40} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Premium Access</h4>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Hot
                    </span>
                </div>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    Dapatkan akses penuh ke seluruh materi C1 & C2 selama 1 bulan.
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                  <span className="text-amber-600 font-bold text-sm flex items-center gap-1">
                    <Coins size={16} className="fill-amber-600 stroke-amber-700" /> {formatNumber(5000)}
                  </span>
                  <button className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
                    Tukar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 4: HISTORY (Empty State) --- */}
        {/* (Diambil dari Kode 2 untuk melengkapi fitur) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 ring-4 ring-slate-50">
               <History size={32} />
            </div>
            <h4 className="font-bold text-slate-700 mb-1">Riwayat Transaksi</h4>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Belum ada riwayat penukaran atau perolehan poin sejauh ini.
            </p>
        </div>

      </div>
    </Layout>
  );
};
