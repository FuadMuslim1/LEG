
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { updatePassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Lock, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  user: UserProfile;
}

export const ProfileSettings: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    setMessage(null);

    try {
      // 1. Update Display Name (Auth & Firestore)
      if (displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName });
        
        // Use user.email as ID because that's our structure
        if (user.email) {
            await updateDoc(doc(db, 'users', user.email), { 
                displayName, 
                fullName: displayName 
            });
        }
      }

      // 2. Update Password
      if (newPassword) {
        if (newPassword.length < 6) throw new Error("Password minimal 6 karakter.");
        if (newPassword !== confirmPassword) throw new Error("Konfirmasi password tidak cocok.");
        
        await updatePassword(auth.currentUser, newPassword);
      }

      setMessage({ text: "Profil berhasil diperbarui!", type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ text: "Demi keamanan, silakan Logout dan Login kembali sebelum mengganti password.", type: 'error' });
      } else {
        setMessage({ text: "Gagal update: " + error.message, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} title="Profile Settings">
      <div className="max-w-2xl mx-auto py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <User size={24} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Edit Profil</h2>
               <p className="text-xs text-slate-500">Perbarui informasi akun Anda.</p>
             </div>
          </div>

          <div className="p-6 md:p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                 {message.type === 'success' ? <CheckCircle size={18} className="mt-0.5 shrink-0"/> : <AlertCircle size={18} className="mt-0.5 shrink-0"/>}
                 <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Identity Section */}
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Identitas</h3>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email (Tidak dapat diubah)</label>
                        <input type="text" disabled value={user.email || ''} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                        <input 
                          type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all focus:border-indigo-500" 
                        />
                    </div>
                 </div>
              </div>

              {/* Password Section */}
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 pt-2">Keamanan</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-xs flex gap-2 items-start">
                        <Lock size={16} className="mt-0.5 shrink-0" />
                        <p>Kosongkan bagian ini jika Anda tidak ingin mengganti password.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password Baru</label>
                        <input 
                          type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all focus:border-indigo-500"
                          placeholder="Minimal 6 karakter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password Baru</label>
                        <input 
                          type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all focus:border-indigo-500"
                          placeholder="Ulangi password baru"
                        />
                    </div>
                 </div>
              </div>

              <div className="pt-4 flex justify-end">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
                 >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Simpan Perubahan
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
