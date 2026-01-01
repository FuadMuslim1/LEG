
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { UserProfile } from '../../types';
import { 
  Bell, Send, CheckCircle, MessageSquare, Info, 
  Trash2, Clock, ExternalLink, AlertTriangle, RotateCcw
} from 'lucide-react';
import { 
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch 
} from 'firebase/firestore';
import { db } from '../../firebase';

interface Props {
  user: UserProfile;
}

// --- INTERNAL COMPONENT: CONFIRMATION MODAL ---
const ConfirmationModal = ({ 
  isOpen, title, message, onConfirm, onCancel, isProcessing, confirmLabel = "Ya, Hapus", isDestructive = true
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3 text-slate-800">
             <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
               <AlertTriangle size={20} />
             </div>
             <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mb-6 pl-1">{message}</p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md 
                ${isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              {isProcessing && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminNotification: React.FC<Props> = ({ user }) => {
  // Broadcast States
  const [sending, setSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  
  // History States
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Form States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL');
  const [link, setLink] = useState('');

  // Confirmation States
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // ID to delete
  const [showClearAll, setShowClearAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. REALTIME HISTORY LISTENER ---
  useEffect(() => {
    const q = query(collection(db, 'admin_notification'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(data);
        setLoadingHistory(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. SEND BROADCAST ---
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setSending(true);
    
    try {
      await addDoc(collection(db, 'admin_notification'), {
        title,
        message,
        target,
        link: link || null,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      setTitle(''); setMessage(''); setLink(''); setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 3000);
    } catch (err) {
      alert("Failed to send broadcast.");
    } finally {
      setSending(false);
    }
  };

  // --- 3. DELETE ACTIONS ---
  const handleDeleteSingle = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    try {
        await deleteDoc(doc(db, 'admin_notification', deleteTarget));
        setDeleteTarget(null);
    } catch (error) {
        console.error("Delete failed", error);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleClearAll = async () => {
    setIsProcessing(true);
    try {
        const batch = writeBatch(db);
        history.forEach(item => {
            const ref = doc(db, 'admin_notification', item.id);
            batch.delete(ref);
        });
        await batch.commit();
        setShowClearAll(false);
    } catch (error) {
        console.error("Clear all failed", error);
    } finally {
        setIsProcessing(false);
    }
  };

  // Helper Date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminLayout user={user} title="Broadcast Center">
      
      {/* HEADER INFO */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
         <div className="flex items-center gap-3 text-indigo-600">
            <Bell size={20} />
            <span className="font-bold text-sm">System Announcement Manager</span>
         </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMN 1: COMPOSE FORM */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 text-lg">
                    <MessageSquare size={20} className="text-indigo-600" />
                    Compose Message
                </h3>
                
                {broadcastSuccess && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-2 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle size={16} /> 
                        <span className="font-bold">Message sent successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Title / Subject</label>
                        <input 
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                            placeholder="e.g. System Maintenance"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Target Audience</label>
                        <select 
                            value={target} onChange={e => setTarget(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50 focus:bg-white"
                        >
                            <option value="ALL">All Users</option>
                            <option value="PREMIUM">Premium Members</option>
                            <option value="FREE">Free Members</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Message Body</label>
                        <textarea 
                            required value={message} onChange={e => setMessage(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-40 resize-none bg-slate-50 focus:bg-white leading-relaxed"
                            placeholder="Type your announcement here..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Action Link (Optional)</label>
                        <input 
                            type="text" value={link} onChange={e => setLink(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50 focus:bg-white"
                            placeholder="https://..."
                        />
                    </div>
                    <button 
                        disabled={sending}
                        className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                        {sending ? 'Sending...' : <><Send size={18} /> Send Broadcast</>}
                    </button>
                </form>
                </div>
            </div>

            {/* COLUMN 2: HISTORY LIST */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 h-full flex flex-col shadow-sm overflow-hidden">
                    {/* Header History */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                             <Clock size={18} className="text-slate-500" />
                             <h4 className="font-bold text-slate-700">Broadcast History</h4>
                             <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{history.length}</span>
                        </div>
                        {history.length > 0 && (
                            <button 
                                onClick={() => setShowClearAll(true)}
                                className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                            >
                                <RotateCcw size={14} /> Clear All
                            </button>
                        )}
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px] bg-slate-50">
                        {loadingHistory ? (
                             <div className="text-center py-10 text-slate-400">Loading history...</div>
                        ) : history.length === 0 ? (
                             <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
                                 <Info size={40} className="mb-2 opacity-50" />
                                 <p className="text-sm">Belum ada riwayat broadcast.</p>
                             </div>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.target === 'ALL' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                TARGET: {item.target}
                                            </span>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => setDeleteTarget(item.id)}
                                            className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
                                            title="Hapus notifikasi ini"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <h5 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h5>
                                    <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                                    
                                    {item.link && (
                                        <div className="mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
                                            <ExternalLink size={12} className="text-blue-500" />
                                            <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-md block">
                                                {item.link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* CONFIRMATION MODALS */}
      
      {/* 1. Single Delete */}
      <ConfirmationModal 
          isOpen={!!deleteTarget}
          title="Hapus Notifikasi?"
          message="Notifikasi ini akan dihapus dari riwayat admin. (User yang sudah menerima notifikasi mungkin masih melihatnya sampai mereka refresh)."
          onConfirm={handleDeleteSingle}
          onCancel={() => setDeleteTarget(null)}
          isProcessing={isProcessing}
          confirmLabel="Ya, Hapus"
      />

      {/* 2. Clear All */}
      <ConfirmationModal 
          isOpen={showClearAll}
          title="Hapus SEMUA Riwayat?"
          message={`Anda akan menghapus ${history.length} pesan dari riwayat broadcast. Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleClearAll}
          onCancel={() => setShowClearAll(false)}
          isProcessing={isProcessing}
          confirmLabel="Hapus Semua"
      />

    </AdminLayout>
  );
};
