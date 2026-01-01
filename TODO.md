### 4. Perbaikan UX: Session ID & Refresh Halaman
Saat ini, SESSION_ID dibuat baru setiap kali halaman di-*refresh*:
tsx

const SESSION_ID = useRef(`sess_${Date.now()}_...`).current;
*   Masalah: Jika pengguna tidak sengaja menekan F5, mereka akan langsung melihat layar "Koneksi Terputus" karena lastSessionId di database berbeda dengan SESSION_ID baru di browser, padahal itu orang yang sama di perangkat yang sama.
*   Saran: Simpan SESSION_ID di sessionStorage.
    
tsx

    const SESSION_ID = useRef(
      sessionStorage.getItem('device_session_id') || 
      (() => {
        const newId = `sess_${Date.now()}`;
        sessionStorage.setItem('device_session_id', newId);
        return newId;
      })()
    ).current;