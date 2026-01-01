
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { UserProfile } from '../../types';
import { Skeleton } from '../../components/Skeleton';
import { 
  Gift, ArrowRight, Wallet, Medal, CheckCircle,
  FileSpreadsheet, Clock, Search, Edit3, Tag, TrendingUp, AlertTriangle, Trophy, Zap,
  Download, RotateCcw, FileText, ChevronDown, Trash2, Percent, Users
} from 'lucide-react';
import { 
  collection, getDocs, getDoc, doc, serverTimestamp, 
  query, orderBy, where, writeBatch, increment, deleteDoc 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { utils, writeFile } from 'xlsx';

interface Props {
  user: UserProfile;
}

// --- INTERNAL COMPONENT: CONFIRMATION MODAL ---
const ConfirmationModal = ({ 
  isOpen, title, message, onConfirm, onCancel, isProcessing, confirmLabel = "Ya, Proses", isDestructive = false
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3 text-slate-800">
             <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
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

export const AdminReward: React.FC<Props> = ({ user }) => {
  // NAVIGATION TABS
  // Updated: Split PAYOUT into PAYOUT_CASHBACK and PAYOUT_REFERRAL
  const [activeTab, setActiveTab] = useState<'INCOMING' | 'PAYOUT_CASHBACK' | 'PAYOUT_REFERRAL' | 'HISTORY' | 'MANUAL'>('INCOMING');
  
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Bulk Processing State
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');
  
  // Export & Reset Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // --- PRICE CONFIGURATION STATE ---
  const [appPrice, setAppPrice] = useState<number>(100000); 
  const [tempPrice, setTempPrice] = useState<string>('100000');
  const [isPriceLocked, setIsPriceLocked] = useState(true);

  // DATA STATES
  const [incomingData, setIncomingData] = useState<any[]>([]); // Tab: INCOMING
  const [payoutData, setPayoutData] = useState<any[]>([]); // Raw Payout Data
  const [historyData, setHistoryData] = useState<any[]>([]); // Tab: HISTORY
  
  // Derived State for Payouts
  const cashbackQueue = payoutData.filter(item => item.type === 'CASHBACK');
  const referralQueue = payoutData.filter(item => item.type === 'REFERRAL_BONUS');

  // Achievement Form State (Manual)
  const [achForm, setAchForm] = useState({ email: '', title: '', amount: '', description: '' });

  // History Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // MODAL & TOAST
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: 'ENTER_POIN' | 'PAYOUT' | 'BULK_CALC' | 'BULK_PAYOUT' | 'RESET_HISTORY' | null;
    data: any;
  }>({ isOpen: false, type: null, data: null });

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000); 
  };

  // --- FETCH DATA ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. INCOMING (New Registrations)
      const qInc = query(collection(db, 'registrations'), where('status', '==', 'VERIFIED'));
      const snapInc = await getDocs(qInc);
      const incoming = snapInc.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(item => (!item.rewardStatus || item.rewardStatus === 'PENDING'))
        .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)); // FIFO

      // 2. PROCESSED (Payouts & History)
      const qProc = query(collection(db, 'reward_calculations'), orderBy('createdAt', 'desc'));
      const snapProc = await getDocs(qProc);
      const allCalculations = snapProc.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      const readyPayouts = allCalculations.filter(d => d.status === 'READY_TO_SEND');
      const finishedHistory = allCalculations.filter(d => d.status === 'SENT');

      setIncomingData(incoming);
      setPayoutData(readyPayouts);
      setHistoryData(finishedHistory);

    } catch (error) {
      console.error("Fetch data error:", error);
      showToast("Gagal mengambil data.", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeTab]); // Refresh when tab changes

  // --- ACTIONS ---

  // 1. CONFIG PRICE
  const handleSetPrice = () => {
    const val = parseInt(tempPrice.replace(/\D/g, ''));
    if (!val || val <= 0) return showToast("Nominal tidak valid.", 'error');
    setAppPrice(val);
    setIsPriceLocked(true);
    showToast(`Harga dikunci: Rp ${val.toLocaleString()}`, 'success');
  };

  // --- CORE LOGIC EXTRACTED (Reusable for Single & Bulk) ---

  const processRewardCalculation = async (item: any) => {
      const batch = writeBatch(db);
      
      // REFERRAL BONUS
      if (item.usedReferralCode && item.usedReferralCode !== '-') {
        const usersRef = collection(db, 'users');
        const qUser = query(usersRef, where('referralCode', '==', item.usedReferralCode));
        const userSnap = await getDocs(qUser);

        if (!userSnap.empty) {
            const referrerDoc = userSnap.docs[0];
            const referrerData = referrerDoc.data();
            
            const qRefList = query(usersRef, where('referredBy', '==', item.usedReferralCode));
            const refListSnap = await getDocs(qRefList);
            const activeCount = refListSnap.size;

            let tier = 'Rookie', percentage = 0.05;
            if (activeCount > 30) { tier = 'Legend'; percentage = 0.10; } 
            else if (activeCount > 10) { tier = 'Pro'; percentage = 0.07; }
            
            // Auto Update Level User
            if (referrerData.level !== tier) {
                 batch.update(referrerDoc.ref, { level: tier });
                 
                 const notifLevelRef = doc(collection(db, 'user_notifications'));
                 batch.set(notifLevelRef, {
                    userEmail: referrerDoc.id,
                    title: 'Level Up!',
                    message: `Selamat! Level Anda naik menjadi ${tier}. Nikmati bonus referral lebih besar (${percentage * 100}%).`,
                    isRead: false,
                    createdAt: serverTimestamp(),
                    type: 'SYSTEM',
                    link: '/dashboard'
                 });
            }

            const bonusAmount = appPrice * percentage;
            const refBonusDoc = doc(collection(db, 'reward_calculations'));
            batch.set(refBonusDoc, {
                sourceId: item.id, type: 'REFERRAL_BONUS',
                targetEmail: referrerDoc.id, targetName: referrerData.fullName || 'Unknown',
                tier, referralCount: activeCount, percentage, transactionBase: appPrice, bonusAmount,
                status: 'READY_TO_SEND', createdAt: serverTimestamp(),
                description: `Referral Bonus (Tier ${tier}) dari: ${item.fullName}`
            });
        }
      }

      // CASHBACK LOGIC
      const targetUserRef = doc(db, 'users', item.email);
      const targetUserSnap = await getDoc(targetUserRef);
      
      let cashbackRate = 0;
      let cashbackDesc = '';

      if (!targetUserSnap.exists()) {
          // NEW MEMBER -> 5%
          cashbackRate = 0.05;
          cashbackDesc = 'Welcome Cashback (5%) - New Member';
      } else {
          // RENEWAL
          const userData = targetUserSnap.data();
          const userLevel = userData.level || 'Rookie';
          
          if (userLevel === 'Pro' || userLevel === 'Legend') {
              cashbackRate = 0.05;
              cashbackDesc = `Loyalty Cashback (5%) - ${userLevel} Renewal`;
          }
      }

      if (cashbackRate > 0) {
          const cashbackAmount = appPrice * cashbackRate;
          const cashbackDoc = doc(collection(db, 'reward_calculations'));
          batch.set(cashbackDoc, {
              sourceId: item.id, type: 'CASHBACK',
              targetEmail: item.email, targetName: item.fullName,
              transactionBase: appPrice, percentage: cashbackRate, bonusAmount: cashbackAmount,
              status: 'READY_TO_SEND', createdAt: serverTimestamp(),
              description: cashbackDesc
          });
      }

      const regDoc = doc(db, 'registrations', item.id);
      batch.update(regDoc, { rewardStatus: 'CALCULATED' });

      await batch.commit();
      return item.id;
  };

  const processPayoutTransaction = async (calcItem: any) => {
        const batch = writeBatch(db);
        const userRef = doc(db, 'users', calcItem.targetEmail);
        batch.update(userRef, { balance: increment(calcItem.bonusAmount) });

        const calcRef = doc(db, 'reward_calculations', calcItem.id);
        batch.update(calcRef, { status: 'SENT', sentAt: serverTimestamp() });

        const notifRef = doc(collection(db, 'user_notifications'));
        batch.set(notifRef, {
            userEmail: calcItem.targetEmail,
            title: calcItem.type === 'CASHBACK' ? 'Cashback Diterima!' : 'Referral Reward Masuk!',
            message: `Saldo +${calcItem.bonusAmount.toLocaleString()}. (${calcItem.description})`,
            isRead: false, createdAt: serverTimestamp(), type: 'REWARD', link: '/dashboard'
        });

        await batch.commit();
        return calcItem.id;
  };

  // --- 2. SINGLE ACTION HANDLERS ---
  
  const triggerEnterPoin = (item: any) => setConfirmation({ isOpen: true, type: 'ENTER_POIN', data: item });
  const triggerPayout = (item: any) => setConfirmation({ isOpen: true, type: 'PAYOUT', data: item });

  const executeEnterPoin = async () => {
    const item = confirmation.data;
    if (!item) return;
    setProcessingId(item.id);
    try {
      await processRewardCalculation(item);
      setIncomingData(prev => prev.filter(p => p.id !== item.id));
      fetchAllData(); 
      setConfirmation({ isOpen: false, type: null, data: null });
      showToast(`Sukses menghitung reward!`, 'success');
    } catch (error: any) {
      showToast("Gagal: " + error.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const executePayout = async () => {
    const calcItem = confirmation.data;
    if (!calcItem) return;
    setProcessingId(calcItem.id);
    try {
        await processPayoutTransaction(calcItem);
        setPayoutData(prev => prev.filter(p => p.id !== calcItem.id));
        setHistoryData(prev => [{...calcItem, status: 'SENT'}, ...prev]);
        setConfirmation({ isOpen: false, type: null, data: null });
        showToast(`Payout terkirim!`, 'success');
    } catch (error: any) {
        showToast("Gagal payout: " + error.message, 'error');
    } finally {
        setProcessingId(null);
    }
  };

  // --- 3. BULK ACTION HANDLERS ---

  const triggerBulkCalc = () => setConfirmation({ isOpen: true, type: 'BULK_CALC', data: incomingData });
  
  // Update logic: Bulk payout depends on ACTIVE TAB
  const triggerBulkPayout = () => {
      let dataToProcess: any[] = [];
      if (activeTab === 'PAYOUT_CASHBACK') {
          dataToProcess = cashbackQueue;
      } else if (activeTab === 'PAYOUT_REFERRAL') {
          dataToProcess = referralQueue;
      }

      setConfirmation({ isOpen: true, type: 'BULK_PAYOUT', data: dataToProcess });
  };

  const executeBulkAction = async () => {
      const type = confirmation.type;
      const items = confirmation.data as any[];
      if(!items || items.length === 0) return;

      setIsBulkProcessing(true);
      setConfirmation({ ...confirmation, isOpen: false }); // Close modal, show progress instead
      
      let processedCount = 0;
      const total = items.length;

      try {
          if (type === 'BULK_CALC') {
              for (const item of items) {
                  setBulkProgress(`Calculating ${processedCount + 1}/${total}: ${item.fullName}`);
                  try {
                      await processRewardCalculation(item);
                      processedCount++;
                      setIncomingData(prev => prev.filter(p => p.id !== item.id));
                  } catch (err) {
                      console.error(`Failed to process ${item.id}`, err);
                  }
              }
              showToast(`Selesai! Berhasil menghitung ${processedCount} reward.`, 'success');
              fetchAllData();
          } 
          else if (type === 'BULK_PAYOUT') {
              for (const item of items) {
                  setBulkProgress(`Sending ${processedCount + 1}/${total}: Rp ${item.bonusAmount.toLocaleString()}`);
                  try {
                      await processPayoutTransaction(item);
                      processedCount++;
                      setPayoutData(prev => prev.filter(p => p.id !== item.id));
                      setHistoryData(prev => [{...item, status: 'SENT'}, ...prev]);
                  } catch (err) {
                       console.error(`Failed to pay ${item.id}`, err);
                  }
              }
              showToast(`Selesai! Berhasil mengirim ${processedCount} pembayaran.`, 'success');
          }

      } catch (error: any) {
          showToast("Bulk Process Error: " + error.message, 'error');
      } finally {
          setIsBulkProcessing(false);
          setBulkProgress('');
          setConfirmation({ isOpen: false, type: null, data: null });
      }
  };

  // --- 4. EXPORT & RESET HANDLERS (HISTORY TAB) ---
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const handleDownloadCSV = () => {
    const headers = "Date,User Name,User Email,Type,Bonus Amount,Description,Status\n";
    const rows = historyData.map(h => 
      `"${formatDate(h.sentAt || h.createdAt)}","${h.targetName}","${h.targetEmail}","${h.type}","${h.bonusAmount}","${h.description}","${h.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REWARD_HISTORY_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setShowExportMenu(false);
  };

  const handleDownloadExcel = () => {
    const data = historyData.map(h => ({
      Date: formatDate(h.sentAt || h.createdAt),
      User: h.targetName,
      Email: h.targetEmail,
      Type: h.type,
      Amount: h.bonusAmount,
      Description: h.description,
      Status: h.status
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transactions");
    writeFile(wb, `REWARD_HISTORY_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportMenu(false);
  };

  const triggerResetHistory = () => setConfirmation({ isOpen: true, type: 'RESET_HISTORY', data: historyData });

  const executeResetHistory = async () => {
      // Logic: Delete all 'SENT' items from 'reward_calculations'
      const itemsToDelete = confirmation.data as any[];
      if (!itemsToDelete || itemsToDelete.length === 0) return;

      setIsBulkProcessing(true);
      setConfirmation({ ...confirmation, isOpen: false });
      
      let deletedCount = 0;
      const total = itemsToDelete.length;

      try {
         for (const item of itemsToDelete) {
             setBulkProgress(`Deleting ${deletedCount + 1}/${total}...`);
             try {
                 await deleteDoc(doc(db, 'reward_calculations', item.id));
                 deletedCount++;
             } catch (err) {
                 console.error(`Failed to delete history ${item.id}`, err);
             }
         }
         
         setHistoryData([]); // Clear local state
         showToast(`Reset Berhasil! ${deletedCount} riwayat transaksi dihapus.`, 'success');

      } catch (error: any) {
          showToast("Gagal reset data: " + error.message, 'error');
      } finally {
          setIsBulkProcessing(false);
          setBulkProgress('');
          setConfirmation({ isOpen: false, type: null, data: null });
      }
  };


  // 5. MANUAL EVENT
  const handleSendAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!achForm.email || !achForm.amount) return;
    setLoading(true);
    try {
       const userEmail = achForm.email.toLowerCase();
       const batch = writeBatch(db);
       const userRef = doc(db, 'users', userEmail);
       batch.update(userRef, { balance: increment(Number(achForm.amount)) });

       const historyRef = doc(collection(db, 'reward_calculations'));
       batch.set(historyRef, {
         type: 'ACHIEVEMENT', targetEmail: userEmail, targetName: 'Manual Event',
         bonusAmount: Number(achForm.amount), title: achForm.title, description: achForm.description,
         status: 'SENT', sentAt: serverTimestamp(), createdAt: serverTimestamp()
       });

        const notifRef = doc(collection(db, 'user_notifications'));
        batch.set(notifRef, {
            userEmail: userEmail, title: `Event Reward: ${achForm.title}`, message: `+${achForm.amount} Poin! ${achForm.description}`,
            isRead: false, createdAt: serverTimestamp(), type: 'ACHIEVEMENT'
        });

       await batch.commit();
       showToast(`Event Reward sent!`, 'success');
       setAchForm({ email: '', title: '', amount: '', description: '' });
       setLoading(false);
    } catch (error: any) {
       showToast("Gagal: " + error.message, 'error');
       setLoading(false);
    }
  };

  // HISTORY FILTERING
  const filteredHistory = historyData.filter(d => {
      if(!searchQuery) return true;
      const lowerQ = searchQuery.toLowerCase();
      return (d.targetName || '').toLowerCase().includes(lowerQ) || (d.targetEmail || '').toLowerCase().includes(lowerQ);
  });
  const currentHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- UI HELPERS ---
  const NavButton = ({ id, label, icon: Icon, count, colorClass }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 min-w-[140px] py-4 px-2 text-xs md:text-sm font-bold border-b-2 flex flex-col md:flex-row items-center justify-center gap-2 transition-all
        ${activeTab === id ? `border-indigo-600 text-indigo-600 bg-indigo-50/50` : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
      `}
    >
        <div className={`relative ${activeTab === id ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Icon size={18} />
            {count > 0 && (
                <span className={`absolute -top-2 -right-2 ${colorClass} text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm`}>
                    {count}
                </span>
            )}
        </div>
        <span>{label}</span>
    </button>
  );

  return (
    <AdminLayout user={user} title="Reward Center">
      
      {/* 1. TOP STATS (GLOBAL) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Base Price</div>
            <div className="flex items-center gap-2 mt-1">
                <input 
                    type="text" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} disabled={isPriceLocked}
                    className={`w-full text-sm font-bold font-mono outline-none ${isPriceLocked ? 'bg-transparent' : 'border-b border-indigo-300'}`} 
                />
                <button onClick={() => isPriceLocked ? setIsPriceLocked(false) : handleSetPrice()} className="text-indigo-500 hover:text-indigo-700">
                    {isPriceLocked ? <Edit3 size={14}/> : <CheckCircle size={14}/>}
                </button>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">To Process</div>
            <div className="text-lg font-bold text-slate-800">{incomingData.length}</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Pending Payout</div>
            <div className="text-lg font-bold text-amber-600">{payoutData.length}</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Paid Out</div>
            <div className="text-lg font-bold text-emerald-600">Rp {historyData.reduce((a, b) => a + (b.bonusAmount || 0), 0).toLocaleString()}</div>
         </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="bg-white rounded-t-xl border-b border-slate-200 flex flex-wrap shadow-sm sticky top-[70px] z-20">
         <NavButton id="INCOMING" label="New Registrations" icon={Clock} count={incomingData.length} colorClass="bg-blue-500" />
         <NavButton id="PAYOUT_CASHBACK" label="Cashback Payouts" icon={Percent} count={cashbackQueue.length} colorClass="bg-emerald-500" />
         <NavButton id="PAYOUT_REFERRAL" label="Referral Bonuses" icon={Users} count={referralQueue.length} colorClass="bg-purple-500" />
         <NavButton id="HISTORY" label="History" icon={FileSpreadsheet} count={0} colorClass="" />
         <NavButton id="MANUAL" label="Manual" icon={Medal} count={0} colorClass="" />
      </div>

      <div className="bg-white p-6 rounded-b-xl border border-slate-200 border-t-0 min-h-[500px]">
         
         {/* TAB 1: NEW REGISTRATIONS */}
         {activeTab === 'INCOMING' && (
            <div className="animate-in fade-in space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                   <div className="flex items-center gap-2 text-sm">
                       <Tag size={16} />
                       <p>User <strong>Verified</strong>. Klik "Hitung" untuk memproses reward.</p>
                   </div>
                   {incomingData.length > 0 && (
                       <button 
                           onClick={triggerBulkCalc}
                           disabled={isBulkProcessing}
                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-200 transition-all w-full md:w-auto justify-center"
                       >
                           {isBulkProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Zap size={14} />}
                           Hitung Semua ({incomingData.length})
                       </button>
                   )}
                </div>

                {isBulkProcessing && activeTab === 'INCOMING' && (
                   <div className="bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
                       <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                           <span className="font-bold text-sm">Processing Bulk Action...</span>
                       </div>
                       <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded">{bulkProgress}</span>
                   </div>
                )}

                {loading && incomingData.length === 0 ? <Skeleton className="h-20 w-full" /> :
                 incomingData.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">Tidak ada registrasi baru.</div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {incomingData.map(item => (
                          <div key={item.id} className="border border-slate-200 p-4 rounded-xl hover:border-blue-400 transition-all shadow-sm group bg-white">
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                   <div className="font-bold text-slate-800">{item.fullName}</div>
                                   <div className="text-xs text-slate-500">{item.email}</div>
                                </div>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">Ref: {item.usedReferralCode}</span>
                             </div>
                             <button onClick={() => triggerEnterPoin(item)} disabled={!!processingId || isBulkProcessing}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-blue-700 disabled:opacity-50"
                             >
                                {processingId === item.id ? 'Calculating...' : <><ArrowRight size={14}/> Hitung Reward</>}
                             </button>
                          </div>
                       ))}
                    </div>
                 )
                }
            </div>
         )}

         {/* TAB 2: CASHBACK QUEUE */}
         {activeTab === 'PAYOUT_CASHBACK' && (
            <div className="animate-in fade-in space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                   <div className="flex items-center gap-2 text-sm">
                       <Percent size={16} />
                       <p>Antrian <strong>Cashback</strong> (Member Baru/Renew). Klik "Kirim Saldo" untuk transfer.</p>
                   </div>
                   {cashbackQueue.length > 0 && (
                       <button 
                           onClick={triggerBulkPayout}
                           disabled={isBulkProcessing}
                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-200 transition-all w-full md:w-auto justify-center"
                       >
                           {isBulkProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Zap size={14} />}
                           Kirim Semua ({cashbackQueue.length})
                       </button>
                   )}
                </div>

                {isBulkProcessing && activeTab === 'PAYOUT_CASHBACK' && (
                   <div className="bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
                       <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                           <span className="font-bold text-sm">Processing Cashback Payouts...</span>
                       </div>
                       <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded">{bulkProgress}</span>
                   </div>
                )}

                {cashbackQueue.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">Antrian Cashback kosong.</div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {cashbackQueue.map(item => (
                          <div key={item.id} className="border border-emerald-200 bg-emerald-50/30 p-4 rounded-xl shadow-sm">
                             <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs bg-emerald-500">
                                    CB
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{item.targetName}</div>
                                    <div className="text-xs font-mono font-bold text-emerald-600">+ {item.bonusAmount?.toLocaleString()}</div>
                                </div>
                             </div>
                             <p className="text-[10px] text-slate-500 mb-3 line-clamp-2">{item.description}</p>
                             <button onClick={() => triggerPayout(item)} disabled={!!processingId || isBulkProcessing}
                                className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 disabled:opacity-50 shadow-md shadow-emerald-200/50"
                             >
                                {processingId === item.id ? 'Sending...' : <><CheckCircle size={14}/> Kirim Saldo</>}
                             </button>
                          </div>
                       ))}
                    </div>
                 )
                }
            </div>
         )}

         {/* TAB 3: REFERRAL QUEUE */}
         {activeTab === 'PAYOUT_REFERRAL' && (
            <div className="animate-in fade-in space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-3 bg-purple-50 text-purple-800 rounded-lg border border-purple-100">
                   <div className="flex items-center gap-2 text-sm">
                       <Users size={16} />
                       <p>Antrian <strong>Referral Bonus</strong> (Affiliate). Klik "Kirim Saldo" untuk transfer.</p>
                   </div>
                   {referralQueue.length > 0 && (
                       <button 
                           onClick={triggerBulkPayout}
                           disabled={isBulkProcessing}
                           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition-all w-full md:w-auto justify-center"
                       >
                           {isBulkProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Zap size={14} />}
                           Kirim Semua ({referralQueue.length})
                       </button>
                   )}
                </div>

                {isBulkProcessing && activeTab === 'PAYOUT_REFERRAL' && (
                   <div className="bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
                       <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                           <span className="font-bold text-sm">Processing Referral Bonuses...</span>
                       </div>
                       <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded">{bulkProgress}</span>
                   </div>
                )}

                {referralQueue.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">Antrian Referral kosong.</div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {referralQueue.map(item => (
                          <div key={item.id} className="border border-purple-200 bg-purple-50/30 p-4 rounded-xl shadow-sm">
                             <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs bg-purple-500">
                                    REF
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{item.targetName}</div>
                                    <div className="text-xs font-mono font-bold text-purple-600">+ {item.bonusAmount?.toLocaleString()}</div>
                                </div>
                             </div>
                             <p className="text-[10px] text-slate-500 mb-3 line-clamp-2">{item.description}</p>
                             <button onClick={() => triggerPayout(item)} disabled={!!processingId || isBulkProcessing}
                                className="w-full py-2 bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-800 disabled:opacity-50 shadow-md shadow-purple-200/50"
                             >
                                {processingId === item.id ? 'Sending...' : <><CheckCircle size={14}/> Kirim Saldo</>}
                             </button>
                          </div>
                       ))}
                    </div>
                 )
                }
            </div>
         )}

         {/* TAB 4: HISTORY */}
         {activeTab === 'HISTORY' && (
            <div className="animate-in fade-in">
                
                {/* TOOLBAR: SEARCH & ACTIONS */}
                <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-4">
                    <h3 className="font-bold text-slate-700 text-sm">Transaction History</h3>
                    
                    <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                         {/* SEARCH */}
                         <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="text" placeholder="Cari nama/email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                        </div>
                        
                        <div className="flex gap-2">
                             {/* EXPORT DROPDOWN */}
                            <div className="relative flex-1 md:flex-none">
                                <button 
                                onClick={() => setShowExportMenu(!showExportMenu)} 
                                className="w-full justify-center bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200"
                                >
                                <Download size={14} /> 
                                <span>Export</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`}/>
                                </button>
                                
                                {showExportMenu && (
                                    <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 p-1 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                        <button 
                                            onClick={handleDownloadCSV}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors"
                                        >
                                            <FileText size={16} className="text-indigo-500" />
                                            <span>Download CSV</span>
                                        </button>
                                        <button 
                                            onClick={handleDownloadExcel}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors"
                                        >
                                            <FileSpreadsheet size={16} className="text-emerald-500" />
                                            <span>Download Sheet</span>
                                        </button>
                                    </div>
                                    </>
                                )}
                            </div>

                             {/* RESET BUTTON */}
                             <button 
                                onClick={triggerResetHistory}
                                disabled={isBulkProcessing || historyData.length === 0}
                                className="flex-1 md:flex-none justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 border border-red-100 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                             >
                                <Trash2 size={14} /> Reset History
                            </button>
                        </div>
                    </div>
                </div>

                {/* BULK PROGRESS BAR (FOR RESET) */}
                {isBulkProcessing && activeTab === 'HISTORY' && (
                   <div className="bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 mb-4">
                       <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                           <span className="font-bold text-sm">Deleting Data...</span>
                       </div>
                       <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded">{bulkProgress}</span>
                   </div>
                )}

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                   <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase">
                          <tr><th className="p-3">User</th><th className="p-3">Type</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {currentHistory.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-slate-400">Tidak ada data.</td></tr> :
                            currentHistory.map(h => (
                                <tr key={h.id} className="hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-bold text-slate-700">{h.targetName}</div>
                                        <div className="text-slate-400">{h.targetEmail}</div>
                                    </td>
                                    <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded">{h.type}</span></td>
                                    <td className="p-3 font-mono font-bold text-emerald-600">{h.bonusAmount?.toLocaleString()}</td>
                                    <td className="p-3 text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={12}/> Sent</td>
                                </tr>
                            ))
                          }
                      </tbody>
                   </table>
                </div>
            </div>
         )}

         {/* TAB 5: MANUAL */}
         {activeTab === 'MANUAL' && (
            <div className="max-w-xl mx-auto py-6 animate-in fade-in">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><Trophy size={20} className="text-amber-500"/> Input Event Reward</h3>
                    <form onSubmit={handleSendAchievement} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email User</label>
                            <input type="email" required value={achForm.email} onChange={e => setAchForm({...achForm, email: e.target.value})}
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none text-sm" placeholder="user@email.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Event Title</label>
                                <input type="text" required value={achForm.title} onChange={e => setAchForm({...achForm, title: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Amount (Rp)</label>
                                <input type="number" required value={achForm.amount} onChange={e => setAchForm({...achForm, amount: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none text-sm font-bold" />
                            </div>
                        </div>
                        <textarea value={achForm.description} onChange={e => setAchForm({...achForm, description: e.target.value})}
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none text-sm h-24" placeholder="Deskripsi..." />
                        <button disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                            {loading ? 'Sending...' : <><Gift size={18}/> Kirim Reward</>}
                        </button>
                    </form>
                </div>
            </div>
         )}

      </div>

      <ConfirmationModal 
        isOpen={confirmation.isOpen}
        title={
            confirmation.type === 'ENTER_POIN' ? "Konfirmasi Hitung Reward" : 
            confirmation.type === 'PAYOUT' ? "Konfirmasi Payout" :
            confirmation.type === 'BULK_CALC' ? "Konfirmasi Hitung Semua" :
            confirmation.type === 'BULK_PAYOUT' ? 
                (activeTab === 'PAYOUT_CASHBACK' ? "Kirim Semua Cashback" : "Kirim Semua Referral") :
            "Konfirmasi Reset History"
        }
        message={
            confirmation.type === 'ENTER_POIN' ? `Hitung reward untuk ${confirmation.data?.fullName}?` :
            confirmation.type === 'PAYOUT' ? `Kirim saldo Rp ${confirmation.data?.bonusAmount?.toLocaleString()} ke ${confirmation.data?.targetEmail}?` :
            confirmation.type === 'BULK_CALC' ? `Anda akan menghitung reward untuk ${confirmation.data?.length} user secara otomatis. Lanjutkan?` :
            confirmation.type === 'BULK_PAYOUT' ? `Anda akan mengirim saldo kepada ${confirmation.data?.length} user sekaligus. Pastikan data sudah benar. Lanjutkan?` :
            `PERHATIAN: Anda akan MENGHAPUS SEMUA data riwayat transaksi (${confirmation.data?.length} data) dari database secara PERMANEN. \n\nData yang dihapus tidak bisa dikembalikan. Lanjutkan?`
        }
        onConfirm={
            confirmation.type === 'ENTER_POIN' ? executeEnterPoin : 
            confirmation.type === 'PAYOUT' ? executePayout :
            confirmation.type === 'RESET_HISTORY' ? executeResetHistory :
            executeBulkAction
        }
        onCancel={() => setConfirmation({ isOpen: false, type: null, data: null })}
        confirmLabel={
            confirmation.type === 'ENTER_POIN' ? "Hitung Sekarang" : 
            confirmation.type === 'PAYOUT' ? "Kirim Saldo" :
            confirmation.type === 'RESET_HISTORY' ? "Ya, Hapus Semua" :
            "Proses Semua"
        }
        isProcessing={!!processingId || isBulkProcessing}
        isDestructive={confirmation.type === 'RESET_HISTORY'}
      />
      
      {toast.show && (
          <div className={`fixed top-6 right-6 z-[110] p-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right ${toast.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
             <div className="font-bold text-sm">{toast.message}</div>
          </div>
      )}
    </AdminLayout>
  );
};
