"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './about.module.css';
import Footer from "@/components/layout/Footer";
import HomeHeader from "@/components/home/HomeHeader";

const dummyCategories = [
    { name: 'Teknologi', count: 5 },
    { name: 'Gaya Hidup', count: 3 },
];

const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    };
    return today.toLocaleDateString('id-ID', options).replace(/,/g, '');
};
const currentDate = getCurrentDate();


const AboutUsPage: React.FC = () => {
  const { data: session } = useSession();
  const currentPath = usePathname();

  return (
    <>
      <HomeHeader 
        session={session}
        categories={dummyCategories} 
        currentPath={currentPath}
        currentDate={currentDate}
      />
      
      <main className={styles.mainContainer}>
        <div className={styles.headerSection}>
          <p className={styles.tagline}>Mengenal Lebih Jauh</p>
          <h1 className={styles.mainTitle}>
            Jurnalisme Berkualitas, <br className='hidden sm:inline'/>
            Untuk Masa Depan Informasi.
          </h1>
          <hr className={styles.divider} />
        </div>

        <div className={styles.missionVisionGrid}>
            <div className={styles.visionCard}>
                <h2 className={styles.cardTitle}>Visi Kami</h2>
                <p className={styles.cardText}>
                    Menjadi sumber terpercaya untuk analisis mendalam dan pelaporan berita yang tidak bias tentang kisah-kisah yang membentuk dunia kita. Kami percaya pada kekuatan informasi untuk mendorong pemahaman dan perubahan positif.
                </p>
            </div>
            <div className={styles.missionCard}>
                <h2 className={styles.cardTitle}>Misi Kami</h2>
                <p className={styles.cardText}>
                    Menyampaikan jurnalisme berkualitas tinggi, berdasarkan fakta, yang memberdayakan pembaca kami untuk membuat keputusan yang terinformasi. Kami berkomitmen pada integritas, akurasi, dan keadilan dalam semua pelaporan kami.
                </p>
            </div>
        </div>
        
        <h2 className={styles.teamSectionTitle}>Temui Tim Kami</h2>
        
        <div className={styles.teamGrid}>
          
          <div className={styles.teamMember}>
            <div
              className={styles.profileImage}
              style={{
                backgroundImage: 'url(/team/christy.png)',
              }}
            ></div>
            <div>
              <p className={styles.memberName}>Christy Jones</p>
              <p className={styles.memberRole}>535240070</p>
            </div>
          </div>
          
          <div className={styles.teamMember}>
            <div
              className={styles.profileImage}
              style={{
                backgroundImage: 'url("/team/Delvyn.jpeg")',
              }}
            ></div>
            <div>
              <p className={styles.memberName}>Delvyn Putra</p>
              <p className={styles.memberRole}>535240090</p>
            </div>
          </div>
          
          <div className={styles.teamMember}>
            <div
              className={styles.profileImage}
              style={{
                backgroundImage: 'url("/team/Axel.jpeg")',
              }}
            ></div>
            <div>
              <p className={styles.memberName}>Axel Chrisdy</p>
              <p className={styles.memberRole}>535240143</p>
            </div>
          </div>
          
          <div className={styles.teamMember}>
            <div
              className={styles.profileImage}
              style={{
                backgroundImage: 'url("/team/iyan.JPG")',
              }}
            ></div>
            <div>
              <p className={styles.memberName}>Tandwiyan T.</p>
              <p className={styles.memberRole}>535240176</p>
            </div>
          </div>
          
          <div className={styles.teamMember}>
            <div
              className={styles.profileImage}
              style={{
                backgroundImage: 'url("/team/MOSHE.jpeg")',
              }}
            ></div>
            <div>
              <p className={styles.memberName}>Affan Moshe</p>
              <p className={styles.memberRole}>535240183</p>
            </div>
          </div>
          
          <div className={styles.teamMember}>
            <div
              className={styles.profileImage}
              style={{
                backgroundImage: 'url("/team/yuen.jpeg")',
              }}
            ></div>
            <div>
              <p className={styles.memberName}>Naisya Yuen</p>
              <p className={styles.memberRole}>535240187</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutUsPage;