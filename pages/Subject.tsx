
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { BookOpen, Mic, PenTool, Headphones, Search, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: UserProfile;
}

export const Subject: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = [
    { 
      id: 1, 
      title: 'Pronunciation', 
      icon: Mic, 
      color: 'bg-rose-500', 
      desc: 'Improve your pronunciation and fluency.',
      path: '/materials/Pronunciation'  // Updated to dynamic path
    },
    { 
      id: 2, 
      title: 'Grammar', 
      icon: PenTool, 
      color: 'bg-indigo-500', 
      desc: 'Master the rules of English structure.',
      path: '/materials/Grammar'
    },
    { 
      id: 3, 
      title: 'Listening', 
      icon: Headphones, 
      color: 'bg-emerald-500', 
      desc: 'Understand native speakers better.',
      path: '/materials/Listening'
    },
    { 
      id: 4, 
      title: 'Vocabulary', 
      icon: BookOpen, 
      color: 'bg-amber-500', 
      desc: 'Expand your word bank daily.',
      path: '/materials/Vocabulary'
    },
  ];

  const handleNavigate = (path: string | null) => {
    if (path) {
      navigate(path);
    }
  };

  // Filter Logic
  const filteredSubjects = subjects.filter(sub => 
    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout user={user} title="Subjects">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Select Subject</h2>
        <p className="text-slate-500 text-sm">Choose a topic to start learning today.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8 max-w-lg">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search for subjects..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 shadow-sm transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* GRID LIST */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredSubjects.map((sub) => (
            <button 
              key={sub.id}
              onClick={() => handleNavigate(sub.path)}
              className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left flex items-start gap-4 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${sub.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}></div>
              
              <div className={`${sub.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <sub.icon size={24} />
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{sub.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{sub.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <AlertCircle size={32} />
           </div>
           <h3 className="text-slate-800 font-bold mb-1">No subjects found</h3>
           <p className="text-slate-500 text-sm">We couldn't find any subjects matching "{searchQuery}"</p>
           <button 
             onClick={() => setSearchQuery('')}
             className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
           >
             Clear Search
           </button>
        </div>
      )}
    </Layout>
  );
};
