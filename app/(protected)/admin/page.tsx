"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useDashboardArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  useDashboardArticle,
} from "@/hooks/useDashboard";
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/useAdmin";
import styles from "./admin.module.css";

// --- 1. KOMPONEN MODAL KONFIRMASI (Reusable) ---
interface ConfirmationModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      {" "}
      {/* Menggunakan class overlay yg sudah ada */}
      <div
        className={styles.modal}
        style={{ maxWidth: "400px", textAlign: "center" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <i
            className="bx bx-trash"
            style={{ fontSize: "3rem", color: "#ef4444" }}
          ></i>
        </div>
        <h3 className={styles.modalTitle} style={{ justifyContent: "center" }}>
          {title}
        </h3>
        <p style={{ color: "#666", marginBottom: "2rem" }}>{message}</p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={onClose}
            className={styles.formCancel}
            disabled={isDeleting}
            style={{ flex: 1 }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={styles.buttonDelete} // Menggunakan style button delete yg ada
            disabled={isDeleting}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. HALAMAN UTAMA ADMIN ---
export default function AdminPanelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"articles" | "users">("articles");

  // State Modal Form
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);

  // State Modal Konfirmasi Delete
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Articles Hooks
  const {
    articles,
    fetchArticles,
    isLoading: articlesLoading,
  } = useDashboardArticles();
  const { article, fetchArticle } = useDashboardArticle();
  const { createArticle, isLoading: creating } = useCreateArticle();
  const { updateArticle, isLoading: updating } = useUpdateArticle();
  const { deleteArticle, isLoading: deleting } = useDeleteArticle();

  // Users Hooks (Admin only)
  const { users, fetchUsers, isLoading: usersLoading } = useAdminUsers();
  const { createUser, isLoading: creatingUser } = useCreateUser();
  const { updateUser, isLoading: updatingUser } = useUpdateUser();
  const { deleteUser, isLoading: deletingUser } = useDeleteUser();

  // Article Form State
  const [articleForm, setArticleForm] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    sourceLink: "",
    category: "",
    publishedAt: "",
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    namaLengkap: "",
    email: "",
    nomorHandphone: "",
    password: "",
    role: "USER" as "USER" | "WRITER" | "ADMIN",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN" && session?.user?.role !== "WRITER") {
        router.push("/");
        return;
      }
      fetchArticles();
      if (session?.user?.role === "ADMIN") {
        fetchUsers();
      }
    }
  }, [status, session, router, fetchArticles, fetchUsers]);

  // --- HANDLERS ARTIKEL ---

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createArticle({
        ...articleForm,
        imageUrl: articleForm.imageUrl || null,
        sourceLink: articleForm.sourceLink || null,
        category: articleForm.category || null,
        publishedAt: articleForm.publishedAt || undefined,
      });
      setShowArticleModal(false);
      setEditingArticle(null);
      setArticleForm({
        title: "",
        description: "",
        content: "",
        imageUrl: "",
        sourceLink: "",
        category: "",
        publishedAt: "",
      });
      fetchArticles();
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleEditArticle = async (id: string) => {
    try {
      const art = await fetchArticle(id);
      if (art) {
        setArticleForm({
          title: art.title,
          description: art.description,
          content: art.content,
          imageUrl: art.imageUrl || "",
          sourceLink: art.sourceLink || "",
          category: art.category || "",
          publishedAt: art.publishedAt
            ? new Date(art.publishedAt).toISOString().slice(0, 16)
            : "",
        });
        setEditingArticle(id);
        setShowArticleModal(true);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      await updateArticle(editingArticle, {
        ...articleForm,
        imageUrl: articleForm.imageUrl || null,
        sourceLink: articleForm.sourceLink || null,
        category: articleForm.category || null,
        publishedAt: articleForm.publishedAt || undefined,
      });
      setEditingArticle(null);
      setShowArticleModal(false);
      setArticleForm({
        title: "",
        description: "",
        content: "",
        imageUrl: "",
        sourceLink: "",
        category: "",
        publishedAt: "",
      });
      fetchArticles();
    } catch (err) {
      // Error handled in hook
    }
  };

  // 1. Trigger Modal Hapus Artikel
  const handleDeleteArticleClick = (id: string) => {
    setArticleToDelete(id); // Set ID yang mau dihapus, ini akan membuka modal
  };

  // 2. Eksekusi Hapus Artikel (Dipanggil Modal)
  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      await deleteArticle(articleToDelete);
      fetchArticles();
      setArticleToDelete(null); // Tutup modal
    } catch (err) {
      // Error handled in hook
    }
  };

  // --- HANDLERS USER ---

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(userForm);
      setShowUserModal(false);
      setUserForm({
        namaLengkap: "",
        email: "",
        nomorHandphone: "",
        password: "",
        role: "USER",
      });
      fetchUsers();
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleUpdateUserRole = async (
    userId: string,
    newRole: "USER" | "WRITER" | "ADMIN"
  ) => {
    try {
      await updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (err) {
      // Error handled in hook
    }
  };

  // 1. Trigger Modal Hapus User
  const handleDeleteUserClick = (userId: string) => {
    setUserToDelete(userId); // Set ID user, buka modal
  };

  // 2. Eksekusi Hapus User (Dipanggil Modal)
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      fetchUsers();
      setUserToDelete(null); // Tutup modal
    } catch (err) {
      // Error handled in hook
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <p style={{ color: "#000000" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "WRITER") {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>FTI News - Admin Panel</h1>
            <p className={styles.headerSubtitle}>
              Selamat datang, {session?.user?.name} ({session?.user?.role})
            </p>
          </div>
          <Link href="/" className={styles.backButton}>
            Kembali ke Website
          </Link>
        </div>
      </header>

      {/* --- CONFIRMATION MODALS --- */}

      {/* Modal Hapus Artikel */}
      <ConfirmationModal
        isOpen={!!articleToDelete}
        isDeleting={deleting}
        onClose={() => setArticleToDelete(null)}
        onConfirm={confirmDeleteArticle}
        title="Hapus Artikel?"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Modal Hapus User */}
      <ConfirmationModal
        isOpen={!!userToDelete}
        isDeleting={deletingUser}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        title="Hapus User?"
        message="Apakah Anda yakin ingin menghapus user ini? Semua data terkait user akan hilang."
      />

      <div className={styles.main}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <ul className={styles.tabList}>
            <li>
              <button
                onClick={() => setActiveTab("articles")}
                className={`${styles.tabButton} ${
                  activeTab === "articles" ? styles.tabButtonActive : ""
                }`}
              >
                Artikel
              </button>
            </li>
            {session?.user?.role === "ADMIN" && (
              <li>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`${styles.tabButton} ${
                    activeTab === "users" ? styles.tabButtonActive : ""
                  }`}
                >
                  User Management
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Daftar Artikel</h2>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setArticleForm({
                    title: "",
                    description: "",
                    content: "",
                    imageUrl: "",
                    sourceLink: "",
                    category: "",
                    publishedAt: "",
                  });
                  setShowArticleModal(true);
                }}
                className={styles.actionButton}
              >
                + Buat Artikel Baru
              </button>
            </div>

            {articlesLoading ? (
              <p className={styles.loading}>Loading...</p>
            ) : (
              <div className={styles.articleList}>
                {articles.length === 0 ? (
                  <p className={styles.empty}>Belum ada artikel.</p>
                ) : (
                  articles.map((art) => (
                    <div key={art.id} className={styles.articleCard}>
                      <div className={styles.articleHeader}>
                        <div className={styles.articleContent}>
                          {art.imageUrl && (
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className={styles.articleThumbnail}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}

                          <h3 className={styles.articleTitle}>{art.title}</h3>
                          <p className={styles.articleDescription}>
                            {art.description}
                          </p>
                          <div className={styles.articleMeta}>
                            <span>{art.category || "Uncategorized"}</span>
                            <span>
                              Oleh: {art.author?.namaLengkap || "Unknown"}
                            </span>
                            <span>💬 {art._count.comments}</span>
                            <span>🔖 {art._count.bookmarks}</span>
                            <span>
                              📅{" "}
                              {art.publishedAt
                                ? new Date(art.publishedAt).toLocaleDateString(
                                    "id-ID"
                                  )
                                : "Draft"}
                            </span>
                          </div>
                        </div>

                        <div className={styles.articleActions}>
                          <button
                            onClick={() => handleEditArticle(art.id)}
                            className={`${styles.button} ${styles.buttonEdit}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticleClick(art.id)} // Menggunakan Handler baru
                            disabled={deleting}
                            className={`${styles.button} ${styles.buttonDelete}`}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Users Tab (Admin Only) */}
        {activeTab === "users" && session?.user?.role === "ADMIN" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>User Management</h2>
              <button
                onClick={() => {
                  setUserForm({
                    namaLengkap: "",
                    email: "",
                    nomorHandphone: "",
                    password: "",
                    role: "USER",
                  });
                  setShowUserModal(true);
                }}
                className={styles.actionButton}
              >
                + Tambah User
              </button>
            </div>

            {usersLoading ? (
              <p className={styles.loading}>Loading...</p>
            ) : (
              <div className={styles.userList}>
                {users.length === 0 ? (
                  <p className={styles.empty}>Belum ada user.</p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className={styles.userCard}>
                      <div className={styles.userHeader}>
                        <div className={styles.userContent}>
                          <h3 className={styles.userName}>
                            {user.namaLengkap}
                          </h3>
                          <p className={styles.userEmail}>{user.email}</p>
                          <div className={styles.userMeta}>
                            <span>Role: {user.role}</span>
                            <span>Artikel: {user._count.articles}</span>
                            <span>Komentar: {user._count.comments}</span>
                          </div>
                        </div>
                        <div className={styles.userActions}>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateUserRole(
                                user.id,
                                e.target.value as "USER" | "WRITER" | "ADMIN"
                              )
                            }
                            className={styles.select}
                          >
                            <option value="USER">USER</option>
                            <option value="WRITER">WRITER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUserClick(user.id)} // Menggunakan Handler baru
                            disabled={
                              deletingUser || user.id === session?.user?.id
                            }
                            className={`${styles.button} ${styles.buttonDelete}`}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Article Modal (TETAP SAMA) */}
        {showArticleModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingArticle ? "Edit Artikel" : "Buat Artikel Baru"}
                </h2>
                <button
                  onClick={() => {
                    setShowArticleModal(false);
                    setEditingArticle(null);
                    setArticleForm({
                      title: "",
                      description: "",
                      content: "",
                      imageUrl: "",
                      sourceLink: "",
                      category: "",
                      publishedAt: "",
                    });
                  }}
                  className={styles.modalClose}
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={
                  editingArticle ? handleUpdateArticle : handleCreateArticle
                }
                className={styles.form}
              >
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Judul *</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, title: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Deskripsi *</label>
                  <textarea
                    required
                    value={articleForm.description}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className={styles.formTextarea}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Konten *</label>
                  <textarea
                    required
                    value={articleForm.content}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        content: e.target.value,
                      })
                    }
                    rows={10}
                    className={styles.formTextarea}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>URL Gambar</label>
                    <input
                      type="url"
                      value={articleForm.imageUrl}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          imageUrl: e.target.value,
                        })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Kategori</label>
                    <input
                      type="text"
                      value={articleForm.category}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          category: e.target.value,
                        })
                      }
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Link Sumber</label>
                    <input
                      type="url"
                      value={articleForm.sourceLink}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          sourceLink: e.target.value,
                        })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Tanggal Publikasi
                    </label>
                    <input
                      type="datetime-local"
                      value={articleForm.publishedAt}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          publishedAt: e.target.value,
                        })
                      }
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    disabled={creating || updating}
                    className={styles.formSubmit}
                  >
                    {creating || updating ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowArticleModal(false);
                      setEditingArticle(null);
                      setArticleForm({
                        title: "",
                        description: "",
                        content: "",
                        imageUrl: "",
                        sourceLink: "",
                        category: "",
                        publishedAt: "",
                      });
                    }}
                    className={styles.formCancel}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create User Modal (TETAP SAMA) */}
        {showUserModal && session?.user?.role === "ADMIN" && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modal} ${styles.modalSmall}`}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Tambah User Baru</h2>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setUserForm({
                      namaLengkap: "",
                      email: "",
                      nomorHandphone: "",
                      password: "",
                      role: "USER",
                    });
                  }}
                  className={styles.modalClose}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={userForm.namaLengkap}
                    onChange={(e) =>
                      setUserForm({ ...userForm, namaLengkap: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email *</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nomor Handphone *</label>
                  <input
                    type="tel"
                    required
                    value={userForm.nomorHandphone}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        nomorHandphone: e.target.value,
                      })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Password *</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role: e.target.value as "USER" | "WRITER" | "ADMIN",
                      })
                    }
                    className={styles.formInput}
                  >
                    <option value="USER">USER</option>
                    <option value="WRITER">WRITER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    disabled={creatingUser}
                    className={styles.formSubmit}
                  >
                    {creatingUser ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      setUserForm({
                        namaLengkap: "",
                        email: "",
                        nomorHandphone: "",
                        password: "",
                        role: "USER",
                      });
                    }}
                    className={styles.formCancel}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
