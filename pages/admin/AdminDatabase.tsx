import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { UserProfile, UserRole } from '../../types';
import { Skeleton } from '../../components/Skeleton';
import { 
  Database, Search, RefreshCw, CheckCircle, Clock, ArrowRight,
  Calendar, ShieldAlert, Key, Eye, AlertTriangle, Users, FileText,
  CreditCard, UserCheck, XCircle, FileClock, ChevronLeft, ChevronRight,
  Trash2, CheckSquare, Square, Filter, Check
} from 'lucide-react';
import { 
  collection, query, getDocs, doc, setDoc, serverTimestamp, updateDoc, orderBy, limit, getDoc, addDoc, where, writeBatch, deleteDoc 
} from 'firebase/firestore';
import { db, registerUserByAdmin } from '../../firebase';

interface Props {
  user: UserProfile;
}

// Internal Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, title, message, onConfirm, onCancel, isProcessing, confirmLabel = "Ya, Proses", isDestructive = false 
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

export const AdminDatabase: React.FC<Props> = ({ user }) => {
  // Tab State
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'DATABASE'>('QUEUE');

  // Data States
  const [pendingQueue, setPendingQueue] = useState<any[]>([]); // Collection: registrations
  const [usersList, setUsersList] = useState<any[]>([]); // Collection: users
  
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Search & Filter States
  const [userSearch, setUserSearch] = useState(''); 
  const [queueSearch, setQueueSearch] = useState('');
  
  // New Filters for Database Tab (Dark Panel)
  const [sortOption, setSortOption] = useState<'DEFAULT' | 'A_Z' | 'Z_A' | 'BALANCE'>('DEFAULT');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection State (For Bulk Actions)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Modal State
  const [confirmation, setConfirmation] = useState<{
      isOpen: boolean;
      type: 'PROCESS_REG' | 'DELETE_USER' | 'BULK_DELETE_USERS' | null;
      data: any;
  }>({ isOpen: false, type: null, data: null });


  // --- FETCH DATA ---
  
  const fetchQueue = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
        const qRegs = query(collection(db, "registrations"), where("status", "==", "SENT_TO_DB"));
        const snapRegs = await getDocs(qRegs);
        const regsData = snapRegs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        regsData.sort((a: any, b: any) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)); // FIFO
        setPendingQueue(regsData);
    } catch (error: any) {
      console.error("Error fetching queue:", error);
      setErrorMsg("Failed to load queue.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
      setLoading(true);
      setErrorMsg(null);
      setSelectedUserIds(new Set()); // Reset selection
      try {
          const qUsers = query(collection(db, "users"), orderBy('createdAt', 'desc'), limit(100));
          const snapUsers = await getDocs(qUsers);
          const uList = snapUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsersList(uList);
      } catch (error: any) {
          console.error("Error fetching users:", error);
          setErrorMsg("Failed to load users list.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    setCurrentPage(1);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (activeTab === 'QUEUE') {
        fetchQueue();
    } else {
        fetchUsers();
    }
  }, [user, activeTab]);

  // --- ACTIONS: PROCESS REGISTRATION (QUEUE) ---
  const triggerProcessReg = (regData: any) => {
      if (!regData.generatedReferralCode) {
        setErrorMsg("Gagal: Kode Password (Generated Code) kosong.");
        return;
      }
      setConfirmation({ isOpen: true, type: 'PROCESS_REG', data: regData });
  };

  const executeProcessReg = async () => {
    const regData = confirmation.data;
    if (!regData) return;
    setProcessingId(regData.id);

    try {
      const targetEmail = regData.email.toLowerCase();
      // 1. Create Auth
      try {
        await registerUserByAdmin(targetEmail, regData.generatedReferralCode);
      } catch (authErr: any) {
        if (!authErr.message?.includes('email-already-in-use')) console.error(authErr);
      }

      // 2. Create Firestore User
      const now = new Date();
      const validUntil = new Date();
      validUntil.setDate(now.getDate() + 30);
      
      await setDoc(doc(db, "users", targetEmail), {
        email: targetEmail,
        fullName: regData.fullName,
        displayName: regData.fullName,
        whatsapp: regData.whatsapp || '-',
        referralCode: regData.generatedReferralCode,
        referredBy: regData.usedReferralCode !== '-' ? regData.usedReferralCode : null,
        role: UserRole.USER,
        balance: 0, level: 'Rookie', createdAt: serverTimestamp(),
        validUntil: validUntil.toISOString().split('T')[0], photoURL: null
      }, { merge: true });

      // 3. Update Registration Status
      await updateDoc(doc(db, "registrations", regData.id), { status: 'VERIFIED' });

      setPendingQueue(prev => prev.filter(p => p.id !== regData.id)); // Remove locally
      setSuccessMsg(`Berhasil! Data ${regData.fullName} diproses.`);
      setConfirmation({ isOpen: false, type: null, data: null });

    } catch (error: any) {
      setErrorMsg(`Gagal memproses: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // --- ACTIONS: DELETE USERS (DATABASE) ---

  const handleSelectUser = (id: string) => {
      const newSet = new Set(selectedUserIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedUserIds(newSet);
  };

  const handleSelectAll = (filteredData: any[]) => {
      if (selectedUserIds.size === filteredData.length && filteredData.length > 0) {
          setSelectedUserIds(new Set()); // Uncheck all
      } else {
          const newSet = new Set<string>();
          filteredData.forEach(u => newSet.add(u.id));
          setSelectedUserIds(newSet);
      }
  };

  const triggerDeleteUser = (u: any) => {
      setConfirmation({ isOpen: true, type: 'DELETE_USER', data: u });
  }

  const triggerBulkDelete = () => {
      setConfirmation({ isOpen: true, type: 'BULK_DELETE_USERS', data: Array.from(selectedUserIds) });
  }

  const executeDeleteUser = async () => {
      const u = confirmation.data;
      setProcessingId(u.id);
      try {
          await deleteDoc(doc(db, "users", u.id));
          setUsersList(prev => prev.filter(user => user.id !== u.id));
          setSuccessMsg(`User ${u.email} berhasil dihapus.`);
          setConfirmation({ isOpen: false, type: null, data: null });
      } catch (error: any) {
          setErrorMsg("Gagal menghapus user: " + error.message);
      } finally {
          setProcessingId(null);
      }
  };

  const executeBulkDelete = async () => {
      const ids = confirmation.data as string[];
      if (!ids || ids.length === 0) return;
      
      setProcessingId('BULK');
      try {
          const batch = writeBatch(db);
          ids.forEach(id => {
              batch.delete(doc(db, "users", id));
          });
          await batch.commit();
          
          setUsersList(prev => prev.filter(u => !selectedUserIds.has(u.id)));
          setSelectedUserIds(new Set());
          setSuccessMsg(`Berhasil menghapus ${ids.length} user.`);
          setConfirmation({ isOpen: false, type: null, data: null });
      } catch (error: any) {
          setErrorMsg("Bulk delete failed: " + error.message);
      } finally {
          setProcessingId(null);
      }
  };


  // --- UI HELPERS ---
  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'VERIFIED': return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><CheckCircle size={10} /> Registered</span>;
          case 'SENT_TO_DB': return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100"><Clock size={10} /> Queued</span>;
          case 'PAID': return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Paid</span>;
          default: return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Draft</span>;
      }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  // PAGINATION & FILTERING
  const sourceData = activeTab === 'QUEUE' ? pendingQueue : usersList;
  const searchTerm = activeTab === 'QUEUE' ? queueSearch : userSearch;
  
  const filteredData = sourceData.filter(item => {
     // Text Search
     const lowerQ = searchTerm.toLowerCase();
     const matchesSearch = !searchTerm || (
        (item.fullName || '').toLowerCase().includes(lowerQ) ||
        (item.email || '').toLowerCase().includes(lowerQ) ||
        (item.referralCode || '').toLowerCase().includes(lowerQ)
     );
     if (!matchesSearch) return false;

     // Role Filter (Database Mode Only)
     if (activeTab === 'DATABASE' && filterRole !== 'ALL') {
        const role = (item.role || 'user').toLowerCase();
        if (filterRole === 'ADMIN' && !role.includes('admin')) return false;
        if (filterRole === 'USER' && role !== 'user') return false;
     }

     return true;
  }).sort((a, b) => {
      if (activeTab === 'DATABASE') {
          // Sorting Logic
          switch (sortOption) {
              case 'A_Z': return (a.fullName || '').localeCompare(b.fullName || '');
              case 'Z_A': return (b.fullName || '').localeCompare(a.fullName || '');
              case 'BALANCE': return (b.balance || 0) - (a.balance || 0);
              case 'DEFAULT': 
              default:
                  // Newest First
                  const tA = a.createdAt?.seconds || 0;
                  const tB = b.createdAt?.seconds || 0;
                  return tB - tA;
          }
      }
      return 0; // Queue uses default sort from fetch
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <span className="text-sm font-bold text-slate-500">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>
    );
 };

  return (
    <AdminLayout user={user} title="Master Database">
      
      {/* --- NAVBAR BUTTONS (Switcher) --- */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap gap-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => setActiveTab('QUEUE')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200
            ${activeTab === 'QUEUE' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}
          `}
        >
          <FileText size={18} /> 
          Antrian (Pending)
          {pendingQueue.length > 0 && (
            <span className="ml-2 bg-amber-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              {pendingQueue.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('DATABASE')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200
            ${activeTab === 'DATABASE' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}
          `}
        >
          <Users size={18} /> 
          User Management
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-6">

        {/* --- ALERT / INFO --- */}
        {activeTab === 'QUEUE' && (
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 p-4 rounded-xl flex items-start gap-3">
                <Eye size={20} className="mt-0.5 shrink-0" />
                <div>
                <h4 className="font-bold text-sm">Mode: Data Entry (FIFO)</h4>
                <p className="text-xs mt-1">Menampilkan antrian dari TERLAMA ke TERBARU. Harap proses data paling atas terlebih dahulu.</p>
                </div>
            </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
             <AlertTriangle size={20} className="mt-0.5 shrink-0" />
             <div><h4 className="font-bold text-sm">Error</h4><p className="text-xs mt-1">{errorMsg}</p></div>
          </div>
        )}

        {successMsg && (
           <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
              <CheckCircle size={20} className="mt-0.5 shrink-0" />
              <div><h4 className="font-bold text-sm">Berhasil</h4><p className="text-xs mt-1">{successMsg}</p></div>
           </div>
        )}

        {/* VIEW 1: REGISTRATION QUEUE (LIST MODE) */}
        {activeTab === 'QUEUE' && (
          <>
             <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Clock size={18} className="text-amber-500" /> Antrian Pending
                    </h3>
                    <button onClick={fetchQueue} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Filter Name/Email..." value={queueSearch} onChange={(e) => { setQueueSearch(e.target.value); setCurrentPage(1); }}
                       className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Waktu Daftar</th>
                        <th className="px-6 py-4">Identity</th>
                        <th className="px-6 py-4">Codes</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                         <tr><td colSpan={5} className="p-8"><Skeleton className="h-10 w-full" /></td></tr>
                      ) : currentItems.length === 0 ? (
                         <tr><td colSpan={5} className="p-16 text-center text-slate-400">Antrian Kosong.</td></tr>
                      ) : (
                        currentItems.map((u, index) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="text-xs font-mono text-slate-500">{formatDate(u.createdAt)}</div>
                                {index === 0 && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded animate-pulse">PRIORITY</span>}
                             </td>
                             <td className="px-6 py-4">
                               <div className="font-bold text-slate-800">{u.fullName}</div>
                               <div className="text-xs text-slate-500">{u.email}</div>
                               <div className="text-[10px] text-slate-400 font-mono">{u.whatsapp}</div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <div className="text-xs text-slate-400">Ref: <span className="font-bold text-slate-600">{u.usedReferralCode}</span></div>
                                  <div className="text-xs text-slate-400">Key: <span className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">{u.generatedReferralCode}</span></div>
                                </div>
                             </td>
                             <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                             <td className="px-6 py-4 text-right">
                                <button onClick={() => triggerProcessReg(u)} disabled={!!processingId}
                                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors w-full md:w-auto shadow-md shadow-indigo-100"
                                   >
                                      {processingId === u.id ? '...' : <><ArrowRight size={14} /> Proses</>}
                                </button>
                             </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="pb-6"><PaginationControls /></div>
             </div>
          </>
        )}

        {/* VIEW 2: USER MANAGEMENT LIST (DATABASE MODE) */}
        {activeTab === 'DATABASE' && (
          <>
             {/* NEW SEARCH & FILTER PANEL (DARK THEME) */}
             <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 mb-6 font-sans">
                {/* Header */}
                <div className="bg-[#0099dd] p-4 text-white font-bold text-lg flex items-center gap-2">
                    <Users size={24} />
                    User Directory
                </div>
                
                {/* Filter Body */}
                <div className="bg-[#1e1e1e] p-4 text-slate-300 space-y-4">
                    {/* Row 1: Dropdowns & Search */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <select 
                            value={filterRole} 
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-[#2a2a2a] text-sm text-white px-4 py-2 rounded hover:bg-[#333] border-none outline-none cursor-pointer"
                        >
                            <option value="ALL">Role: All</option>
                            <option value="USER">User / Member</option>
                            <option value="ADMIN">Admin / Staff</option>
                        </select>
                        
                        <div className="flex-1 flex gap-0">
                            <input 
                                type="text" 
                                placeholder="Cari nama, email, atau kode referral..." 
                                value={userSearch}
                                onChange={(e) => { setUserSearch(e.target.value); setCurrentPage(1); }}
                                className="flex-1 bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-l outline-none focus:bg-[#333] placeholder:text-slate-500"
                            />
                            <button className="bg-[#0099dd] text-white px-6 py-2 rounded-r font-bold text-sm hover:bg-[#0088c5] flex items-center gap-2 transition-colors">
                                <Search size={16} /> Cari
                            </button>
                        </div>
                    </div>
                    
                    {/* Row 2: Sort Options & Bulk Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <div className="flex flex-wrap gap-4 text-sm font-medium">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${sortOption === 'DEFAULT' ? 'bg-[#00bfa5] border-[#00bfa5]' : 'border-slate-500'}`}>
                                    {sortOption === 'DEFAULT' && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                                <span className={sortOption === 'DEFAULT' ? 'text-white' : ''}>Default (Newest)</span>
                                <input type="radio" name="sort" className="hidden" onClick={() => setSortOption('DEFAULT')} />
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${sortOption === 'A_Z' ? 'bg-[#00bfa5] border-[#00bfa5]' : 'border-slate-500'}`}>
                                    {sortOption === 'A_Z' && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                                <span className={sortOption === 'A_Z' ? 'text-white' : ''}>A-Z</span>
                                <input type="radio" name="sort" className="hidden" onClick={() => setSortOption('A_Z')} />
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${sortOption === 'Z_A' ? 'bg-[#00bfa5] border-[#00bfa5]' : 'border-slate-500'}`}>
                                    {sortOption === 'Z_A' && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                                <span className={sortOption === 'Z_A' ? 'text-white' : ''}>Z-A</span>
                                <input type="radio" name="sort" className="hidden" onClick={() => setSortOption('Z_A')} />
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${sortOption === 'BALANCE' ? 'bg-[#00bfa5] border-[#00bfa5]' : 'border-slate-500'}`}>
                                    {sortOption === 'BALANCE' && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                                <span className={sortOption === 'BALANCE' ? 'text-white' : ''}>Balance (Highest)</span>
                                <input type="radio" name="sort" className="hidden" onClick={() => setSortOption('BALANCE')} />
                            </label>
                         </div>

                         {/* Bulk Delete Button - Shows when items selected */}
                         {selectedUserIds.size > 0 && (
                            <button 
                                onClick={triggerBulkDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-900/50 transition-all animate-in fade-in slide-in-from-right-4"
                            >
                                <Trash2 size={14} /> Delete Selected ({selectedUserIds.size})
                            </button>
                         )}
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 w-10">
                            <button onClick={() => handleSelectAll(filteredData)} className="text-slate-400 hover:text-indigo-600">
                                {selectedUserIds.size === filteredData.length && filteredData.length > 0 ? <CheckSquare size={18} className="text-indigo-600"/> : <Square size={18}/>}
                            </button>
                        </th>
                        <th className="px-6 py-4">User Profile</th>
                        <th className="px-6 py-4">Stats</th>
                        <th className="px-6 py-4">Role & Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                         <tr><td colSpan={5} className="p-8"><Skeleton className="h-10 w-full" /></td></tr>
                      ) : currentItems.length === 0 ? (
                         <tr><td colSpan={5} className="p-16 text-center text-slate-400">Tidak ada user ditemukan.</td></tr>
                      ) : (
                        currentItems.map((u) => (
                          <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${selectedUserIds.has(u.id) ? 'bg-indigo-50/50' : ''}`}>
                             <td className="px-6 py-4">
                                <button onClick={() => handleSelectUser(u.id)} className="text-slate-300 hover:text-indigo-600">
                                    {selectedUserIds.has(u.id) ? <CheckSquare size={18} className="text-indigo-600"/> : <Square size={18}/>}
                                </button>
                             </td>
                             <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                                       {u.displayName?.charAt(0)}
                                   </div>
                                   <div>
                                       <div className="font-bold text-slate-800">{u.fullName}</div>
                                       <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                                   </div>
                               </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <div className="text-xs text-slate-500 flex items-center gap-1">
                                      <CreditCard size={12}/> Bal: <span className="font-bold text-amber-600">{u.balance?.toLocaleString()}</span>
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1">
                                      <ShieldAlert size={12}/> Lvl: <span className="font-bold text-slate-700">{u.level || 'Rookie'}</span>
                                  </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{u.role}</span>
                                    {u.referralCode && <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 px-1 rounded">{u.referralCode}</span>}
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button onClick={() => triggerDeleteUser(u)} 
                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                                    <Trash2 size={16} />
                                </button>
                             </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="pb-6"><PaginationControls /></div>
             </div>
          </>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal 
         isOpen={confirmation.isOpen}
         title={
             confirmation.type === 'PROCESS_REG' ? "Konfirmasi Proses Data" :
             confirmation.type === 'DELETE_USER' ? "Hapus User?" : "Hapus Massal?"
         }
         message={
             confirmation.type === 'PROCESS_REG' ? `Data ${confirmation.data?.fullName} akan disalin ke database User agar bisa login.` :
             confirmation.type === 'DELETE_USER' ? `Yakin menghapus user ${confirmation.data?.email}?\nData wallet dan progress akan hilang permanen.` :
             `Anda akan menghapus ${confirmation.data?.length} user terpilih. Tindakan ini tidak dapat dibatalkan.`
         }
         onConfirm={
             confirmation.type === 'PROCESS_REG' ? executeProcessReg :
             confirmation.type === 'DELETE_USER' ? executeDeleteUser : executeBulkDelete
         }
         onCancel={() => setConfirmation({ isOpen: false, type: null, data: null })}
         isProcessing={!!processingId}
         isDestructive={confirmation.type !== 'PROCESS_REG'}
         confirmLabel={confirmation.type === 'PROCESS_REG' ? "Ya, Proses" : "Hapus Permanen"}
      />
    </AdminLayout>
  );
};
