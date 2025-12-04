"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/Footer"; // Pastikan path ini sesuai
import styles from "./contact.module.css";

export default function ContactPage() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Initialize date directly (Shared logic from Home)
  const currentDate = (() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  })();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi API Call
    setTimeout(() => {
      console.log("Form Data:", formData);
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      {/* Header (Reused from Home to maintain consistency) */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopContent}>
            <div className={styles.headerTopLeft}>
              <Link href="/" className={styles.logoLink}>
                <h1 className={styles.logo}>FTI News</h1>
              </Link>
              <span className={styles.date}>{currentDate}</span>
            </div>
            <div className={styles.headerTopRight}>
              <Link
                href={session ? "/profile" : "/login"}
                className={styles.headerLink}
              >
                {session?.user?.name || "Login"}
              </Link>
              <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <i className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}></i>
              </button>
            </div>
          </div>
        </div>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}>
          <div className={styles.navContent}>
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLink}>Home</Link>
              <Link href="/artikel" className={styles.navLink}>News</Link>
              {session && (
                <Link href="/profile" className={styles.navLink}>Profile</Link>
              )}
              <Link href="/kontak" className={styles.navLinkActive}>Kontak</Link>
              <Link href="/tentang-kami" className={styles.navLink}>Tentang Kami</Link>
            </div>
          </div>
        </nav>
        <div className={styles.navDivider}></div>
      </header>

      <main className={styles.main}>
        {/* Contact Header */}
        <section className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Hubungi Kami</h1>
          <p className={styles.pageSubtitle}>
            Punya berita menarik, pertanyaan, atau ingin beriklan? Tim FTI News siap mendengar dari Anda.
          </p>
          <div className={styles.titleUnderline}></div>
        </section>

        <div className={styles.contentGrid}>
          {/* Left: Contact Form */}
          <section className={styles.formSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Kirim Pesan</h2>
              
              {submitStatus === "success" && (
                <div className={styles.alertSuccess}>
                  Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Masukkan nama anda"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="email@contoh.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>Subjek</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Pilih Subjek...</option>
                    <option value="redaksi">Redaksi / Kirim Berita</option>
                    <option value="iklan">Periklanan & Kerjasama</option>
                    <option value="teknis">Kendala Teknis</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Tulis pesan anda disini..."
                    rows={6}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  {!isSubmitting && <i className="bx bx-send"></i>}
                </button>
              </form>
            </div>
          </section>

          {/* Right: Contact Info & Map */}
          <aside className={styles.sidebarSection}>
            {/* Contact Info Card */}
            <div className={styles.card}>
              <h3 className={styles.sidebarTitle}>Informasi Kontak</h3>
              <div className={styles.contactInfoList}>
                <div className={styles.contactItem}>
                  <div className={styles.iconWrapper}>
                    <i className="bx bx-map"></i>
                  </div>
                  <div>
                    <h4 className={styles.infoLabel}>Alamat Redaksi</h4>
                    <p className={styles.infoText}>
                      Gedung FTI News, Lantai 3<br />
                      Jl. Teknologi No. 12<br />
                      Jakarta Selatan, 12345
                    </p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconWrapper}>
                    <i className="bx bx-envelope"></i>
                  </div>
                  <div>
                    <h4 className={styles.infoLabel}>Email</h4>
                    <a href="mailto:redaksi@ftinews.com" className={styles.infoLink}>redaksi@ftinews.com</a>
                    <a href="mailto:iklan@ftinews.com" className={styles.infoLink}>iklan@ftinews.com</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconWrapper}>
                    <i className="bx bx-phone"></i>
                  </div>
                  <div>
                    <h4 className={styles.infoLabel}>Telepon</h4>
                    <a href="tel:+62215551234" className={styles.infoLink}>(021) 555-1234</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Card */}
            <div className={`${styles.card} ${styles.marginTop}`}>
              <h3 className={styles.sidebarTitle}>Divisi Khusus</h3>
              <ul className={styles.departmentList}>
                <li className={styles.departmentItem}>
                  <span>Editor in Chief</span>
                  <a href="mailto:chief@ftinews.com">chief@ftinews.com</a>
                </li>
                <li className={styles.departmentItem}>
                  <span>IT Support</span>
                  <a href="mailto:support@ftinews.com">support@ftinews.com</a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}