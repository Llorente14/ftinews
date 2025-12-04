"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import PublicHeader from "@/components/layout/PublicHeader";

import "./privacy.css";

function PrivacyPage() {
  return (
    <>
    <PublicHeader />
    <div className="privacy-page">
      <header className="privacy-hero">
        <div className="privacy-hero-inner">
          <p className="privacy-eyebrow">Legal</p>
          <h1 className="privacy-title">Kebijakan Privasi</h1>
          <p className="privacy-subtitle">
            Bagaimana FTI News mengumpulkan, menggunakan, dan melindungi data
            pribadi Anda saat menggunakan platform ini.
          </p>

          <div className="privacy-meta">
            <span>Terakhir diperbarui: 3 Desember 2025</span>
            <span className="privacy-dot">•</span>
            <span>FTI News – Fakultas Teknologi Informasi</span>
          </div>

          <nav
            className="privacy-quicklinks"
            aria-label="Navigasi bagian kebijakan privasi"
          >
            <a href="#introduction" className="privacy-chip">
              Ringkasan
            </a>
            <a href="#data-we-collect" className="privacy-chip">
              Data yang Kami Kumpulkan
            </a>
            <a href="#how-we-use" className="privacy-chip">
              Cara Kami Menggunakan Data
            </a>
            <a href="#cookies" className="privacy-chip">
              Cookie & Teknologi Serupa
            </a>
            <a href="#rights" className="privacy-chip">
              Hak Anda
            </a>
            <a href="#contact" className="privacy-chip">
              Kontak
            </a>
          </nav>
        </div>
      </header>

      <main className="privacy-main">
        <section id="introduction" className="privacy-section">
          <h2 className="privacy-section-title">1. Ringkasan Umum</h2>
          <p>
            Kebijakan Privasi ini menjelaskan bagaimana FTI News mengelola
            informasi pribadi yang kami terima ketika Anda mengakses atau
            menggunakan layanan kami. Kami berkomitmen untuk menjaga kerahasiaan
            dan keamanan data Anda.
          </p>
          <p>
            Dengan menggunakan situs ini, Anda menyetujui pengumpulan dan
            penggunaan informasi sesuai dengan kebijakan ini. Jika Anda tidak
            setuju, silakan hentikan penggunaan layanan FTI News.
          </p>
        </section>

        <section id="data-we-collect" className="privacy-section">
          <h2 className="privacy-section-title">2. Data yang Kami Kumpulkan</h2>
          <p>Kami dapat mengumpulkan beberapa jenis informasi berikut:</p>
          <ul className="privacy-list">
            <li>
              <strong>Data akun</strong> – nama lengkap, alamat email,
              kredensial login, dan informasi profil lain yang Anda berikan
              secara langsung.
            </li>
            <li>
              <strong>Data penggunaan</strong> – informasi tentang bagaimana
              Anda berinteraksi dengan situs (halaman yang diakses, artikel
              yang dibaca, klik, dan waktu kunjungan).
            </li>
            <li>
              <strong>Data teknis</strong> – alamat IP, jenis browser, jenis
              perangkat, sistem operasi, dan pengaturan bahasa.
            </li>
          </ul>
        </section>

        <section id="how-we-use" className="privacy-section">
          <h2 className="privacy-section-title">3. Cara Kami Menggunakan Data</h2>
          <p>Data yang kami kumpulkan digunakan untuk tujuan berikut:</p>
          <ul className="privacy-list">
            <li>Menyediakan dan memelihara layanan FTI News.</li>
            <li>
              Menyesuaikan konten, seperti rekomendasi artikel dan berita yang
              lebih relevan.
            </li>
            <li>
              Menganalisis performa dan meningkatkan kualitas situs,
              pengalaman pengguna, serta keamanan sistem.
            </li>
            <li>
              Mengirimkan pemberitahuan penting, seperti pembaruan kebijakan
              atau informasi terkait keamanan.
            </li>
          </ul>
        </section>

        <section id="cookies" className="privacy-section">
          <h2 className="privacy-section-title">
            4. Cookie &amp; Teknologi Serupa
          </h2>
          <p>
            FTI News dapat menggunakan cookie dan teknologi pelacakan lainnya
            untuk:
          </p>
          <ul className="privacy-list">
            <li>Mengingat preferensi tampilan dan pengaturan Anda.</li>
            <li>
              Menyimpan sesi login sehingga Anda tidak perlu masuk berulang
              kali.
            </li>
            <li>
              Mengumpulkan data analitik teragregasi untuk memahami tren
              penggunaan.
            </li>
          </ul>
          <p>
            Anda dapat mengatur browser untuk menolak cookie tertentu, namun
            hal ini dapat memengaruhi beberapa fungsi situs.
          </p>
        </section>

        <section id="rights" className="privacy-section">
          <h2 className="privacy-section-title">5. Hak Anda atas Data Pribadi</h2>
          <p>Anda memiliki hak-hak berikut terkait data pribadi Anda:</p>
          <ul className="privacy-list">
            <li>Hak untuk mengakses dan meminta salinan data pribadi Anda.</li>
            <li>
              Hak untuk memperbarui atau memperbaiki informasi yang tidak akurat
              atau tidak lengkap.
            </li>
            <li>
              Hak untuk meminta penghapusan data tertentu, sesuai dengan batasan
              hukum yang berlaku.
            </li>
            <li>
              Hak untuk menolak atau membatasi pemrosesan data dalam kondisi
              tertentu.
            </li>
          </ul>
          <p>
            Untuk mengajukan permintaan terkait hak-hak tersebut, Anda dapat
            menghubungi kami melalui informasi kontak di bawah.
          </p>
        </section>

        <section id="contact" className="privacy-section privacy-section-highlight">
          <h2 className="privacy-section-title">6. Kontak &amp; Informasi Tambahan</h2>
          <p>
            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau
            cara kami memproses data pribadi, silakan hubungi kami melalui
            halaman{" "}
            <Link href="/kontak" className="privacy-link">
              Kontak
            </Link>{" "}
            atau email resmi fakultas.
          </p>
          <p>
            Kebijakan ini dapat diperbarui dari waktu ke waktu untuk menyesuaikan
            dengan perkembangan regulasi atau kebutuhan operasional. Setiap
            perubahan penting akan kami informasikan melalui situs FTI News.
          </p>
        </section>

        <footer className="privacy-footer">
          <Link href="/legal/terms" className="privacy-back-link">
            ← Kembali ke Syarat &amp; Ketentuan
          </Link>
        </footer>
      </main>
    </div>
    <Footer />
    </>
  );
}

export default PrivacyPage;


