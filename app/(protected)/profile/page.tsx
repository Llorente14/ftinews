/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
// app/(protected)/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import styles from './profile.module.css'; 
import { useProfile, useUpdateProfile, useUserComments } from '@/hooks/useProfile'; 
import { useLogout } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { profile, fetchProfile, isLoading: profileLoading } = useProfile();
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { comments, isLoading: commentsLoading } = useUserComments();

  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setInputName(profile.namaLengkap || "");
    }
  }, [profile]);

  // --- Upload Gambar ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setFeedback({ message: "Ukuran gambar terlalu besar (Max 1MB).", type: "error" });
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await updateProfile({ image: base64String });
        await fetchProfile(); 
        setFeedback({ message: "Foto profil berhasil diperbarui!", type: "success" });
        setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
      } catch (err) {
        console.error(err);
        setFeedback({ message: "Gagal mengupload gambar.", type: "error" });
      } finally {
        setIsUploadingImage(false);
      }
    };
  };

  // --- Ganti Nama ---
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

  // --- Ganti Password ---
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword || inputPassword.length < 8) {
      setFeedback({ message: "Password minimal 8 karakter.", type: "error" });
      return;
    }
    try {
      await updateProfile({ password: inputPassword });
      setFeedback({ message: "Password berhasil diubah.", type: "success" });
      setInputPassword(""); 
      setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Gagal memperbarui password.", type: "error" });
    }
  };

  // --- Hapus Akun ---
  const handleDeleteAccount = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus akun secara permanen? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      const res = await fetch("/api/users/me", { method: "DELETE" });
      if (res.ok) {
        alert("Akun berhasil dihapus. Sampai jumpa!");
        await logout(); 
        window.location.href = "/"; 
      } else {
        alert("Gagal menghapus akun.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  if (profileLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.card}>
          
          {/* Header Profil */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className={styles.profilePicWrapper}>
              <img
                src={
                  (profile?.image && profile.image.startsWith("data:image")) 
                    ? profile.image 
                    : "https://via.placeholder.com/100"
                }
                alt="Profile"
                className={styles.profileImg}
                style={{ 
                  opacity: isUploadingImage ? 0.5 : 1,
                  objectFit: "cover" 
                }}
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/100"; }}
              />
              <label 
                htmlFor="profile-upload" 
                className={styles.profilePicOverlay}
                style={{ cursor: isUploadingImage ? 'wait' : 'pointer' }}
              >
                {isUploadingImage ? (
                  <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                ) : (
                  <i className="bi bi-pencil-fill fs-4 text-white"></i>
                )}
                <input 
                  type="file" 
                  id="profile-upload" 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
            </div>

            <h2 className={styles.title} style={{ marginBottom: '0.5rem' }}>
              {profile?.namaLengkap || "User"}
            </h2>
            <p className={styles.textMuted}>{profile?.email}</p>
            <p className={`${styles.textMuted} ${styles.textSmall}`} style={{ marginTop: '0.5rem' }}>
              {profile?.nomorHandphone}
            </p>

            <div className={styles.actionButtons}>
               <button className={styles.btnDangerOutline} onClick={logout} disabled={isLoggingOut}>
                 {isLoggingOut ? "Keluar..." : "Logout"}
               </button>
               <Link href="/bookmark" className={styles.btnPrimary} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                 <i className="bi bi-bookmark me-2"></i> Bookmark Page
               </Link>
            </div>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

          {feedback.message && (
            <div className={`${styles.alert} ${feedback.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form Manage Account */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Manage Account</h3>
            
            <form onSubmit={handleSaveName} className={styles.formGroup}>
              <label htmlFor="namaLengkap" className={styles.label}>Change Name</label>
              <input type="text" id="namaLengkap" className={styles.input} value={inputName} onChange={(e) => setInputName(e.target.value)} disabled={isUpdating} />
              <div style={{ marginTop: '1rem' }}>
                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }} disabled={isUpdating}>Save Name</button>
              </div>
            </form>

            <form onSubmit={handleSavePassword} className={styles.formGroup} style={{ marginTop: '2rem' }}>
              <label htmlFor="newPassword" className={styles.label}>Change Password</label>
              <input type="password" id="newPassword" className={styles.input} value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} disabled={isUpdating} />
              <div style={{ marginTop: '1rem' }}>
                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }} disabled={isUpdating}>Save Password</button>
              </div>
            </form>

            {/* --- TOMBOL DELETE ACCOUNT --- */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <button 
               className={styles.btnDelete}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

          {/* Comment History */}
          <div>
            <h3 className={styles.sectionTitle}>Comment History</h3>
            {commentsLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary"></div>
                <span className="ms-2 text-muted">Memuat komentar...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="alert alert-secondary text-center small">Belum ada riwayat komentar.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {comments.map((comment) => (
                  <div key={comment.id} className={styles.commentCard}>
                    <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>"{comment.content}"</p>
                    <Link href={`/artikel/${comment.article.slug}`} style={{ color: '#333', fontSize: '0.9rem', textDecoration: 'none', fontWeight:'bold' }}>
                      on "{comment.article.title}"
                    </Link>
                    <div className={styles.commentHeader}>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}