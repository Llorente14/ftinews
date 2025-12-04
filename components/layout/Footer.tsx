"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>What is FTI News?</h3>
            <p className={styles.footerDescription}>
              FTI News is a platform for in-depth analysis and breaking news,
              offering a global perspective on the events that shape our world.
              We are committed to journalistic integrity and quality reporting.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/bookmark" className={styles.footerLink}>
                  Bookmark
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className={styles.footerLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/kontak" className={styles.footerLink}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className={styles.footerLink}>
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Search by Category</h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/kategori/politics" className={styles.footerLink}>
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/kategori/technology" className={styles.footerLink}>
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/kategori/business" className={styles.footerLink}>
                  Business
                </Link>
              </li>
              <li>
                <Link href="/kategori/culture" className={styles.footerLink}>
                  Culture
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>
              <a
                href="#"
                className={styles.socialLink}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className={styles.socialIcon}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.48 2.96,10.28 2.38,9.95C2.38,9.97 2.38,9.98 2.38,10C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.45,16.03 6.13,17.26 8.13,17.29C6.67,18.45 4.82,19.11 2.84,19.11C2.49,19.11 2.14,19.09 1.8,19.04C3.81,20.36 6.26,21.11 8.84,21.11C16,21.11 20.38,15.11 20.38,9.88C20.38,9.68 20.37,9.49 20.36,9.29C21.1,8.77 21.84,8.1 22.46,7.29L22.46,6Z"></path>
                </svg>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className={styles.socialIcon}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12,2C6.477,2,2,6.477,2,12c0,4.237,2.635,7.825,6.25,9.395.45.082.615-.195.615-.434,0-.214-.008-.778-.012-1.527-2.559.555-3.1-1.234-3.1-1.234-.409-1.04-.999-1.317-.999-1.317-.817-.558.062-.547.062-.547.904.064,1.38,1.036,1.38,1.036.8,1.373,2.103,1.004,2.615.768.082-.597.313-1.004.572-1.234-1.995-.226-4.092-1-4.092-4.44,0-1.012.363-1.838,1-2.485-.1-.227-.435-1.176.095-2.454,0,0,.753-.242,2.468.92.715-.198,1.48-.298,2.242-.302.763.004,1.528.104,2.243.302,1.714-1.162,2.466-.92,2.466-.92.53,1.278.195,2.227.1,2.454.637.647,1,1.473,1,2.485,0,3.45-2.099,4.21-4.1,4.43.32.277.61.823.61,1.66v2.462c0,.24.164.52.62.434C19.365,19.825,22,16.237,22,12,22,6.477,17.523,2,12,2Z"></path>
                </svg>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className={styles.socialIcon}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} FTI News – All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
