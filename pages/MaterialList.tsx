
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { 
  ArrowLeft, FileText, Video, Mic, BookOpen, Clock, 
  ChevronRight, Play, X, Headphones 
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Skeleton } from '../components/Skeleton';
import DOMPurify from 'dompurify';

interface Props {
  user: UserProfile;
}

export const MaterialList: React.FC<Props> = ({ user }) => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'lessons'),
          where('subject', '==', subject),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      fetchLessons();
    }
  }, [subject]);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'VIDEO': return <Video size={20} strokeWidth={2.5} />;
          case 'AUDIO': return <Headphones size={20} strokeWidth={2.5} />;
          default: return <FileText size={20} strokeWidth={2.5} />;
      }
  };

  const getStyles = (type: string) => {
      switch(type) {
          case 'VIDEO': return { 
              bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', 
              ring: 'group-hover:ring-rose-200', iconBg: 'bg-rose-100', accent: 'bg-rose-500' 
          };
          case 'AUDIO': return { 
              bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', 
              ring: 'group-hover:ring-amber-200', iconBg: 'bg-amber-100', accent: 'bg-amber-500' 
          };
          default: return { 
              bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', 
              ring: 'group-hover:ring-indigo-200', iconBg: 'bg-indigo-100', accent: 'bg-indigo-500' 
          };
      }
  };

  return (
    <Layout user={user} title={subject || 'Materials'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <button 
                onClick={() => navigate('/subject')} 
                className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 font-bold transition-colors text-sm"
            >
                <div className="p-1 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                Back to Subjects
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{subject} <span className="text-slate-300 font-light">Materials</span></h2>
                    <p className="text-slate-500 mt-1">Master this topic with curated lessons.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
                    {lessons.length} Lessons Available
                </div>
            </div>
        </div>

        {loading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
            </div>
        ) : lessons.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <BookOpen size={32} />
               </div>
               <p className="text-slate-600 font-bold">No materials yet.</p>
               <p className="text-sm text-slate-400 mt-1">Check back later for new content.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {lessons.map((lesson, idx) => {
                    const style = getStyles(lesson.type);
                    return (
                        <div 
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1 hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-50 ${style.ring}`}
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full ${style.accent}`}></div>
                            
                            <div className="flex justify-between items-center">
                                <div className="flex items-start gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${style.iconBg} ${style.text}`}>
                                        {getIcon(lesson.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${style.bg} ${style.text}`}>
                                                {lesson.type}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {formatDate(lesson.createdAt)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors leading-tight">
                                            {lesson.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-1 mt-1 max-w-md">
                                            {lesson.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    {lesson.type === 'VIDEO' || lesson.type === 'AUDIO' ? <Play size={16} className="ml-0.5" /> : <ChevronRight size={18} />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* LESSON VIEWER MODAL */}
        {activeLesson && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                    
                    {/* Dark Header */}
                    <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-white/10 text-white`}>
                            {getIcon(activeLesson.type)}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base line-clamp-1">{activeLesson.title}</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">{activeLesson.type} Lesson</p>
                            </div>
                        </div>
                        <button onClick={() => setActiveLesson(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="p-0 overflow-y-auto bg-slate-50 flex-1">
                        {activeLesson.type === 'VIDEO' && activeLesson.content && (
                            <div className="aspect-video w-full bg-black shadow-inner">
                                {getYouTubeId(activeLesson.content) ? (
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.content)}`} 
                                        className="w-full h-full"
                                        title={activeLesson.title}
                                        allowFullScreen
                                        frameBorder="0"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white/50 text-sm">Video URL not valid</div>
                                )}
                            </div>
                        )}

                        {activeLesson.type === 'AUDIO' && activeLesson.content && (
                            <div className="py-12 px-6 flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
                                <div className="relative z-10 w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.5)] animate-pulse">
                                    <Headphones size={40} />
                                </div>
                                <h4 className="relative z-10 font-bold mb-6 text-lg tracking-wide">Audio Lesson</h4>
                                <audio controls src={activeLesson.content} className="relative z-10 w-full max-w-md h-12 rounded-lg" />
                            </div>
                        )}

                        {/* SECURITY: Sanitized HTML Content */}
                        <div className="p-8 max-w-2xl mx-auto">
                            {activeLesson.type === 'TEXT' ? (
                                <div 
                                    className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{ 
                                        __html: DOMPurify.sanitize(activeLesson.content) 
                                    }} 
                                />
                            ) : (
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">About this lesson</h4>
                                    <p className="text-slate-600">{activeLesson.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                        <button 
                            onClick={() => setActiveLesson(null)} 
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Mark as Complete
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};
