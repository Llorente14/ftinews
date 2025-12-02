/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
// app/(protected)/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import styles from './profile.module.css'; 
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'; 
import { useLogout } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { profile, fetchProfile, isLoading: profileLoading } = useProfile();
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [feedback, setFeedback] = useState({
    message: "",
    type: "" // 'success' | 'error'
  });

  useEffect(() => {
    if (profile) {
      setInputName(profile.namaLengkap || "");
    }
  }, [profile]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    
    try {
      await updateProfile({ namaLengkap: inputName });
      await fetchProfile(); 
      
      setFeedback({ message: "Nama berhasil diperbarui.", type: "success" });
      
      setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Gagal memperbarui nama.", type: "error" });
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputPassword || inputPassword.length < 8) {
      setFeedback({ message: "Password minimal 8 karakter.", type: "error" });
      return;
    }

    try {
      await updateProfile({ password: inputPassword });
      
      setFeedback({ message: "Password berhasil diubah. Silakan ingat password baru Anda.", type: "success" });
      setInputPassword(""); 
      
      setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Gagal memperbarui password.", type: "error" });
    }
  };

  if (profileLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.card}>
          
          {/* --- Bagian Header Profil --- */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className={styles.profilePicWrapper}>
              {/* Gambar Profil Placeholder */}
              <img
                src="https://via.placeholder.com/100" 
                alt="Profile"
                className={styles.profileImg}
              />
              <label htmlFor="profile-upload" className={styles.profilePicOverlay}>
                <i className="bi bi-pencil-fill fs-4"></i>
                {/* Fitur upload file gambar belum diaktifkan */}
                <input type="file" id="profile-upload" className="d-none" disabled />
              </label>
            </div>

            {/* Nama & Email diambil Dinamis dari Database */}
            <h2 className={styles.title} style={{ marginBottom: '0.5rem' }}>
              {profile?.namaLengkap || "User"}
            </h2>
            <p className={styles.textMuted}>{profile?.email}</p>
            <p className={`${styles.textMuted} ${styles.textSmall}`} style={{ marginTop: '0.5rem' }}>
              {profile?.nomorHandphone}
            </p>

            <div className={styles.actionButtons}>
               <button 
                 className={styles.btnDangerOutline} 
                 onClick={logout} 
                 disabled={isLoggingOut}
               >
                 {isLoggingOut ? "Keluar..." : "Logout"}
               </button>
               
               <Link 
                 href="/bookmark" 
                 className={styles.btnPrimary} 
                 style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
               >
                 <i className="bi bi-bookmark me-2"></i> Bookmark Page
               </Link>
            </div>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

          {/* --- Feedback Alert (Muncul saat sukses/gagal update) --- */}
          {feedback.message && (
            <div className={`${styles.alert} ${feedback.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
              <span>{feedback.message}</span>
            </div>
          )}

          {/* --- Form Update --- */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Manage Account</h3>
            
            {/* Form Ganti Nama */}
            <form onSubmit={handleSaveName} className={styles.formGroup}>
              <label htmlFor="namaLengkap" className={styles.label}>Change Name</label>
              <input
                type="text"
                id="namaLengkap"
                name="namaLengkap"
                className={styles.input}
                placeholder="Masukkan nama lengkap"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                disabled={isUpdating}
              />
              <div style={{ marginTop: '1rem' }}>
                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }} disabled={isUpdating}>
                  {isUpdating ? "Menyimpan..." : "Save Name"}
                </button>
              </div>
            </form>

            {/* Form Ganti Password */}
            <form onSubmit={handleSavePassword} className={styles.formGroup} style={{ marginTop: '2rem' }}>
              <label htmlFor="newPassword" className={styles.label}>Change Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className={styles.input}
                placeholder="Masukkan password baru"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                disabled={isUpdating}
              />
              <div style={{ marginTop: '1rem' }}>
                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }} disabled={isUpdating}>
                  {isUpdating ? "Menyimpan..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

          {/* --- Comment History --- */}
          <div>
            <h3 className={styles.sectionTitle}>Comment History</h3>
            
            <div className={styles.commentCard}>
              <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
                "This is an insightful article. I really appreciate the depth of the analysis..."
              </p>
              <Link href="#" style={{ color: '#333', fontSize: '0.9rem', textDecoration: 'none' }}>
                on "The Future of Artificial Intelligence"
              </Link>
              <div className={styles.commentHeader}>
                <span>2 days ago</span>
                <div>
                   <button style={{ background:'none', border:'none', cursor:'pointer', marginRight:'10px' }}>
                     <i className="bi bi-pencil-fill"></i>
                   </button>
                   <button style={{ background:'none', border:'none', cursor:'pointer', color:'#dc3545' }}>
                     <i className="bi bi-trash-fill"></i>
                   </button>
                </div>
              </div>
            </div>
            
            <p className="text-muted small fst-italic mt-3">
              *Fitur riwayat komentar sedang dalam pengembangan.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}