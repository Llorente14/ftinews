"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  useComments,
  useAddComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/useComments"; 

// IMPORT STYLE YANG BENAR
import styles from "@/app/(public)/artikel/[slug]/article.module.css"; 

interface ArticleCommentsProps {
  articleId: string;
}

const ITEMS_PER_PAGE = 7;

export default function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { data: session } = useSession();
  const { comments, fetchComments, isLoading, error } = useComments(articleId);
  const { addComment, isLoading: isAdding } = useAddComment();
  const { deleteComment, isLoading: isDeleting } = useDeleteComment();
  const { updateComment, isLoading: isUpdating } = useUpdateComment();

  const [currentPage, setCurrentPage] = useState(1);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    try {
      await addComment(articleId, newCommentContent);
      setNewCommentContent("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim komentar");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      alert("Gagal menghapus komentar");
    }
  };

  const startEdit = (id: string, currentContent: string) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const handleUpdate = async () => {
    if (!editingId || !editContent.trim()) return;
    try {
      await updateComment(editingId, editContent);
      setEditingId(null);
      setEditContent("");
      fetchComments();
    } catch (err) {
      alert("Gagal mengupdate komentar");
    }
  };

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentComments = comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section className={styles.commentsSection}>
      <h3 className={styles.commentsTitle}>
        Komentar ({comments.length})
      </h3>

      <div className={styles.commentFormWrapper}>
        {session ? (
          <form onSubmit={handleSubmit} className={styles.commentForm}>
            <div className={styles.commentUserAvatar}>
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className={styles.commentInputGroup}>
              <textarea
                className={styles.commentTextarea}
                placeholder="Tulis komentar Anda..."
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                disabled={isAdding}
              />
              <button 
                type="submit" 
                className={styles.commentSubmitBtn}
                disabled={isAdding || !newCommentContent.trim()}
              >
                {isAdding ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <p>Silakan <Link href="/login">Login</Link> untuk berkomentar.</p>
          </div>
        )}
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.commentsList}>
        {isLoading ? (
          <p>Memuat komentar...</p>
        ) : currentComments.length > 0 ? (
          currentComments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentAvatar}>
                {comment.user.namaLengkap.charAt(0).toUpperCase()}
              </div>
              <div className={styles.commentContentWrapper}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>
                    {comment.user.namaLengkap}
                  </span>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className={styles.editMode}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={styles.editTextarea}
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleUpdate} disabled={isUpdating}>Simpan</button>
                      <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>Batal</button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.commentText}>{comment.content}</p>
                )}

                {session?.user?.email === comment.user.email && !editingId && (
                  <div className={styles.commentActions}>
                    <button onClick={() => startEdit(comment.id, comment.content)}>Edit</button>
                    <button onClick={() => handleDelete(comment.id)} disabled={isDeleting}>Hapus</button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noComments}>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={goToPrevPage} disabled={currentPage === 1} className={styles.pageBtn}>&lt; Sebelumnya</button>
          <span className={styles.pageInfo}>Halaman {currentPage} dari {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages} className={styles.pageBtn}>Selanjutnya &gt;</button>
        </div>
      )}
    </section>
  );
}