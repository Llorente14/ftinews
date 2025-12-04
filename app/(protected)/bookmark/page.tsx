"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./bookmark.module.css";
import {
  useBookmarks,
  useDeleteBookmark,
  Bookmark,
} from "@/hooks/useBookmarks";
import Footer from "@/components/layout/Footer";
import HomeHeader from "@/components/home/HomeHeader";

type ConfirmationModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <i
          className="bx bx-trash"
          style={{ fontSize: "2rem", color: "#ef4444" }}
        ></i>
        <h3 className={styles.modalTitle}>Hapus Artikel?</h3>
        <p className={styles.modalText}>
          Apakah Anda yakin ingin menghapus artikel ini dari koleksi Anda?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className={styles.modalActions}>
          <button
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isDeleting}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={styles.confirmBtn}
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookmarkPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const currentPath = usePathname();

  const { bookmarks, isLoading, error, fetchBookmarks } = useBookmarks();
  const { deleteBookmark, isLoading: isDeleting } = useDeleteBookmark();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (
      error === "Silakan login terlebih dahulu." ||
      (!session && !isLoading && !error)
    ) {
      router.push("/login");
    }
  }, [error, router, session, isLoading]);

  const handleOpenModal = (bookmarkId: string) => {
    setSelectedBookmarkId(bookmarkId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBookmarkId(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBookmarkId) return;

    try {
      await deleteBookmark(selectedBookmarkId);
      fetchBookmarks();
      handleCloseModal();
    } catch (e) {
      alert("Gagal menghapus bookmark.");
      handleCloseModal();
    }
  };

  const filteredAndSortedBookmarks = useMemo(() => {
    if (!bookmarks) return [];

    const filtered = bookmarks.filter((bookmark) => {
      const title = bookmark.article?.title?.toLowerCase() || "";
      const desc = bookmark.article?.description?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return title.includes(search) || desc.includes(search);
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOption === "oldest" ? dateA - dateB : dateB - dateA;
    });
  }, [bookmarks, searchTerm, sortOption]);

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return today.toLocaleDateString("id-ID", options).replace(/,/g, "");
  };

  const currentDate = getCurrentDate();

  if (isLoading) {
    return (
      <div className={styles.centerState}>
        <i
          className="bx bx-loader-alt bx-spin"
          style={{ fontSize: "2.5rem" }}
        ></i>
        <p>Memuat koleksi artikel...</p>
      </div>
    );
  }

  if (error && error !== "Silakan login terlebih dahulu.") {
    return (
      <div className={styles.centerState}>
        <i
          className="bx bx-error-alt"
          style={{ fontSize: "2.5rem", color: "#ef4444" }}
        ></i>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (error === "Silakan login terlebih dahulu.") {
    return null;
  }

  return (
    <>
      <HomeHeader
        session={session}
        currentPath={currentPath}
        currentDate={currentDate}
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Koleksi Saya</h1>
            <p className={styles.subtitle}>
              Daftar artikel yang Anda simpan untuk dibaca nanti.
            </p>
          </div>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <i className={`bx bx-search ${styles.searchIcon}`}></i>
            <input
              className={styles.searchInput}
              placeholder="Cari artikel tersimpan..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.sortWrapper}>
            <select
              className={styles.selectInput}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
            <i className={`bx bx-chevron-down ${styles.selectIcon}`}></i>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredAndSortedBookmarks.length > 0 ? (
            filteredAndSortedBookmarks.map((bookmark: Bookmark) => (
              <div key={bookmark.id} className={styles.card}>
                <div
                  className={styles.cardImage}
                  style={{
                    backgroundImage: `url(${
                      bookmark.article?.imageUrl || "/placeholder.jpg"
                    })`,
                  }}
                />

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {bookmark.article?.title || "Judul tidak tersedia"}
                  </h3>
                  <p className={styles.cardDesc}>
                    {bookmark.article?.description ||
                      "Deskripsi tidak tersedia"}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.date}>
                      {new Date(bookmark.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <button
                      onClick={() => handleOpenModal(bookmark.id)}
                      className={styles.deleteBtn}
                      title="Hapus Bookmark"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <i
                className="bx bx-bookmark"
                style={{ fontSize: "3rem", opacity: 0.5 }}
              ></i>
              <p>
                {searchTerm || sortOption !== "newest"
                  ? "Tidak ada artikel yang cocok dengan kriteria pencarian/filter."
                  : "Belum ada artikel yang disimpan."}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <Footer />
    </>
  );
};

export default BookmarkPage;
