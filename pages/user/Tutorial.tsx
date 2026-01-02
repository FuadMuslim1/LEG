import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { UserProfile } from '../../types';
import { 
  BookOpen, 
  ChevronRight, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Gift, 
  Zap,
  MessageCircle
} from 'lucide-react';

interface Props {
  user: UserProfile;
}

// [UPDATED] Angel rapikan datanya dan ganti emoji jadi Icon Lucide biar konsisten
const tutorialItems = [
  { 
      id: 1,
      title: 'Cara Melihat Progress', 
      desc: 'Panduan memantau perkembangan level bahasa Inggris Aa (A1-C2).',
      // Menggunakan komponen icon langsung
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      steps: [
          'Buka Sidebar (Menu kiri) di dashboard.',
          'Klik menu "View Progress" (ikon grafik naik).',
          'Pilih Level Bahasa Inggris Aa saat ini (misal: A1).',
          'Grafik skor Pronunciation, Vocabulary, dll akan muncul otomatis.'
      ]
  },
  { 
      id: 2,
      title: 'Cara Mengklaim Reward', 
      desc: 'Tukarkan poin hasil belajar Aa dengan hadiah menarik.',
      icon: Gift,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      steps: [
          'Pastikan Aa sudah login dan mengerjakan latihan soal.',
          'Buka menu "Rewards" di sidebar.',
          'Cek total saldo poin di bagian atas kartu.',
          'Pilih item reward yang tersedia, lalu hubungi admin jika poin belum masuk.'
      ]
  },
  { 
    id: 3,
    title: 'Tips Belajar Rutin', 
    desc: 'Strategi jitu agar Aa konsisten belajar setiap hari.',
    icon: Zap,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    steps: [
        'Luangkan waktu minimal 15 menit setiap pagi.',
        'Gunakan fitur "Skill" untuk latihan soal harian.',
        'Jangan takut salah, ulangi materi yang dirasa sulit.',
        'Gunakan headset agar suara pronunciation terdengar jelas.'
    ]
}
];

export const Tutorial: React.FC<Props> = ({ user }) => {
  // State untuk menangani view (List vs Detail)
  const [selectedTutorial, setSelectedTutorial] = useState<typeof tutorialItems[0] | null>(null);

  return (
    <Layout user={user} title="Pusat Bantuan">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Tutorial & Panduan</h2>
        </div>
        <p className="text-slate-500 text-sm ml-1">
            Bingung cara pakainya, A? Tenang, Angel sudah siapkan panduan lengkap di sini.
        </p>
      </div>

      <div className="max-w-6xl mx-auto min-h-[500px]">
        {!selectedTutorial ? (
            /* VIEW 1: GRID LIST TUTORIAL (Tampilan Depan) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {tutorialItems.map((item) => (
                <button 
                key={item.id}
                onClick={() => setSelectedTutorial(item)}
                className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group flex flex-col h-full relative overflow-hidden`}
                >
                {/* Decorative Background Blur */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-40 ${item.color.split(' ')[0]}`}></div>

                <div className={`w-14 h-14 ${item.color} border rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <item.icon size={28} />
                </div>
                
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                    {item.desc}
                </p>
                
                <div className="flex items-center text-xs font-bold text-indigo-600 mt-auto bg-indigo-50 w-fit px-3 py-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    Baca Panduan <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
                </div>
                </button>
            ))}

            {/* Contact Support Card (CTA) */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between border border-slate-700 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-5 border border-white/10 backdrop-blur-sm">
                        <HelpCircle size={28} className="text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">Butuh Bantuan Lain?</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Jika Aa mengalami kendala teknis atau error, tim support kami siap membantu 24/7.
                    </p>
                </div>
                <a 
                    href="https://wa.me/6282338792512" // Ganti dengan nomor WA admin yang benar
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all border border-indigo-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
                >
                    <MessageCircle size={18} /> Hubungi Admin
                </a>
            </div>

            </div>
        ) : (
            /* VIEW 2: DETAIL TUTORIAL (Tampilan Langkah-langkah) */
            <div className="animate-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
            <button 
                onClick={() => setSelectedTutorial(null)} 
                className="mb-6 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
                <ArrowLeft size={16} /> Kembali ke Daftar
            </button>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                {/* Detail Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none ${selectedTutorial.color.split(' ')[0]}`}></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                    <div className={`w-20 h-20 ${selectedTutorial.color} rounded-3xl flex items-center justify-center shadow-md transform rotate-3`}>
                        <selectedTutorial.icon size={40} strokeWidth={1.5} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Tutorial</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{selectedTutorial.title}</h1>
                        <p className="text-slate-600 leading-relaxed max-w-2xl text-sm md:text-base">
                        {selectedTutorial.desc} Ikuti langkah-langkah di bawah ini ya, A.
                        </p>
                    </div>
                    </div>
                </div>

                {/* Steps List */}
                <div className="p-8 md:p-10">
                    <div className="space-y-8 relative">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                    {selectedTutorial.steps.map((step, idx) => (
                        <div key={idx} className="relative flex gap-6 group">
                            {/* Step Number Bubble */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold shadow-sm z-10 group-hover:border-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                {idx + 1}
                            </div>
                            {/* Step Content */}
                            <div className="pt-2 pb-2">
                                <p className="text-slate-700 font-medium leading-relaxed group-hover:text-indigo-900 transition-colors text-base">
                                {step}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Finish Indicator */}
                    <div className="relative flex gap-6">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 border-4 border-white flex items-center justify-center z-10 shadow-md">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="pt-2.5">
                            <p className="text-emerald-600 text-sm font-bold">Selesai! Selamat mencoba ya, A. 🥰</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )}
      </div>

    </Layout>
  );
};
