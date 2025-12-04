"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

import "./terms.css";
import HomeHeader from "@/components/home/HomeHeader";

const currentDate = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function TermsPage() {
  return (
    <>
      <HomeHeader currentPath={"/legal/terms"} currentDate={currentDate} />
      <div className="terms-page">
        <header className="terms-hero">
          <div className="terms-hero-inner">
            <p className="terms-eyebrow">Legal</p>
            <h1 className="terms-title">Terms of Service</h1>
            <p className="terms-subtitle">
              Syarat dan ketentuan penggunaan platform FTI News. Bacalah dengan
              saksama sebelum menggunakan layanan kami.
            </p>

            <div className="terms-meta">
              <span>Terakhir diperbarui: 3 Desember 2025</span>
              <span className="terms-dot">•</span>
              <span>Universitas FTI – News Portal</span>
            </div>

            <nav
              className="terms-quicklinks"
              aria-label="Navigasi bagian dokumen"
            >
              <a href="#introduction" className="terms-chip">
                Pendahuluan
              </a>
              <a href="#use-of-service" className="terms-chip">
                Penggunaan Layanan
              </a>
              <a href="#content-policy" className="terms-chip">
                Konten & Hak Cipta
              </a>
              <a href="#privacy" className="terms-chip">
                Privasi
              </a>
              <a href="#limitation" className="terms-chip">
                Batasan Tanggung Jawab
              </a>
              <a href="#contact" className="terms-chip">
                Kontak
              </a>
            </nav>
          </div>
        </header>

        <main className="terms-main">
          <section id="introduction" className="terms-section">
            <h2 className="terms-section-title">1. Pendahuluan</h2>
            <p>
              Dengan mengakses atau menggunakan situs web dan layanan FTI News,
              Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui
              untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak
              menyetujui salah satu bagian dari ketentuan ini, Anda disarankan
              untuk tidak menggunakan layanan kami.
            </p>
            <p>
              Syarat dan Ketentuan ini mengatur hubungan hukum antara Anda
              (pengguna) dan tim pengelola FTI News sebagai penyedia layanan.
            </p>
          </section>

          <section id="use-of-service" className="terms-section">
            <h2 className="terms-section-title">2. Penggunaan Layanan</h2>
            <div className="terms-grid">
              <div className="terms-card">
                <h3>2.1 Akun Pengguna</h3>
                <p>
                  Untuk mengakses fitur tertentu (seperti komentar, bookmark,
                  atau pengelolaan artikel), Anda mungkin perlu membuat akun.
                  Anda bertanggung jawab penuh atas kerahasiaan kredensial akun
                  serta seluruh aktivitas yang terjadi melalui akun tersebut.
                </p>
              </div>
              <div className="terms-card">
                <h3>2.2 Perilaku yang Dilarang</h3>
                <ul className="terms-list">
                  <li>
                    Mengunggah atau menyebarkan konten yang melanggar hukum.
                  </li>
                  <li>
                    Melakukan spam, phishing, atau aktivitas yang mengganggu
                    layanan.
                  </li>
                  <li>
                    Mencoba mengakses sistem tanpa izin, termasuk upaya
                    peretasan atau eksploitasi.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="content-policy" className="terms-section">
            <h2 className="terms-section-title">
              3. Kebijakan Konten & Hak Cipta
            </h2>
            <p>
              Seluruh konten yang diterbitkan di FTI News (termasuk teks,
              gambar, ilustrasi, dan materi multimedia lainnya) dilindungi oleh
              hak cipta dan/atau hak kekayaan intelektual lainnya.
            </p>
            <ul className="terms-list">
              <li>
                Anda boleh membagikan tautan artikel selama tidak mengubah isi
                dan tetap mencantumkan atribusi yang sesuai.
              </li>
              <li>
                Dilarang menyalin, mereproduksi, atau mendistribusikan ulang
                konten untuk tujuan komersial tanpa izin tertulis.
              </li>
              <li>
                Untuk permintaan kerja sama atau lisensi, silakan hubungi tim
                redaksi kami.
              </li>
            </ul>
          </section>

          <section id="privacy" className="terms-section">
            <h2 className="terms-section-title">4. Privasi & Data Pribadi</h2>
            <p>
              Kami berkomitmen untuk melindungi privasi Anda. Informasi tentang
              bagaimana kami mengumpulkan, menggunakan, dan menyimpan data
              pribadi diatur lebih lanjut dalam{" "}
              <Link href="/legal/privacy" className="terms-link">
                Kebijakan Privasi
              </Link>
              .
            </p>
            <p>
              Dengan menggunakan layanan kami, Anda menyetujui bahwa data
              tertentu dapat diproses untuk keperluan analitik, peningkatan
              kualitas layanan, serta personalisasi konten.
            </p>
          </section>

          <section id="limitation" className="terms-section">
            <h2 className="terms-section-title">5. Batasan Tanggung Jawab</h2>
            <p>
              FTI News berupaya menghadirkan informasi yang akurat dan terkini,
              namun tidak dapat menjamin bahwa seluruh konten bebas dari
              kesalahan atau kelalaian. Penggunaan informasi dari situs ini
              sepenuhnya menjadi tanggung jawab pengguna.
            </p>
            <p>
              Dalam batas maksimal yang diizinkan oleh hukum, FTI News tidak
              bertanggung jawab atas kerugian langsung maupun tidak langsung
              yang timbul dari penggunaan atau ketidakmampuan menggunakan
              layanan kami.
            </p>
          </section>

          <section
            id="contact"
            className="terms-section terms-section-highlight"
          >
            <h2 className="terms-section-title">
              6. Kontak & Perubahan Ketentuan
            </h2>
            <p>
              Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke
              waktu. Perubahan penting akan kami umumkan melalui situs FTI News.
            </p>
            <p>
              Jika Anda memiliki pertanyaan mengenai dokumen ini, silakan
              hubungi kami melalui halaman{" "}
              <Link href="/kontak" className="terms-link">
                Kontak
              </Link>{" "}
              atau email resmi fakultas.
            </p>
          </section>

          <footer className="terms-footer">
            <Link href="/" className="terms-back-link">
              ← Kembali ke Beranda
            </Link>
          </footer>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default TermsPage;
