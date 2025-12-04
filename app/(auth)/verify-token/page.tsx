'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// PERBAIKAN DI SINI: Path-nya sekarang ../../
import { useVerifyToken, useResendCode } from '../../../hooks/useAuth'; 

// Komponen CSS
const PageStyle = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    * { box-sizing: border-box; }
    .login-wrapper {
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
    .login-container {
      animation: fadeIn 0.6s ease-out;
      width: 100%;
      max-width: 450px;
    }
    .login-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }
    .login-title {
      animation: slideIn 0.5s ease-out;
      font-size: 2.5rem;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 1rem;
      text-align: center;
    }
    .login-subtitle {
      animation: slideIn 0.5s ease-out 0.1s backwards;
      font-size: 1rem;
      color: #666;
      margin-bottom: 2rem;
      text-align: center;
      word-break: break-word;
    }
    .form-group-animated {
      animation: slideIn 0.5s ease-out;
      margin-bottom: 1.5rem;
    }
    .form-label {
      font-weight: 600;
      color: #333333;
      margin-bottom: 0.5rem;
      display: block;
      font-size: 0.95rem;
    }
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #d0d0d0;
      background: #ffffff;
      color: #1a1a1a;
      transition: all 0.3s ease;
      font-size: 1rem;
      outline: none;
    }
    .form-control::placeholder { color: #999999; }
    .form-control:focus {
      border-color: #333333;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
    .form-control.is-invalid {
      border-color: #dc3545;
      animation: shake 0.5s ease-in-out;
    }
    .form-control:disabled {
      background-color: #f5f5f5;
      color: #666;
    }
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .btn-login {
      width: 100%;
      background-color: #333333;
      color: #ffffff;
      font-weight: 600;
      padding: 12px;
      border-radius: 8px;
      border: none;
      transition: all 0.3s ease;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-login:hover:not(:disabled) {
      background-color: #1a1a1a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .btn-login:active:not(:disabled) { transform: translateY(0); }
    .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      animation: slideIn 0.5s ease-out;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      border: 1px solid;
    }
    .alert-success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }
    .alert-danger {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
    .footer-links {
      margin-top: 1.5rem;
      text-align: center;
    }
    .footer-links a, .footer-links button {
      color: #666666;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
      cursor: pointer;
      background: none;
      border: none;
      font-size: 0.875rem;
      font-family: inherit;
      padding: 0.25rem;
    }
    .footer-links a:hover, .footer-links button:hover {
      color: #1a1a1a;
      text-decoration: underline;
    }
    .spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #ffffff;
      animation: spin 0.6s linear infinite;
      margin-right: 0.5rem;
    }
    @media (max-width: 576px) {
      .login-card { padding: 30px 20px; }
      .login-title { font-size: 2rem; }
    }
  `}</style>
);

// Komponen Form
function VerifyTokenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  const { verifyToken, isLoading, error: verifyError } = useVerifyToken();
  const { 
    resendCode, 
    isLoading: isResending, 
    error: resendError, 
    successMessage 
  } = useResendCode();

  // Redirect jika tidak ada email
  useEffect(() => {
    if (!email) {
      router.replace('/lupa-password');
    }
  }, [email, router]);

  const handleSubmit = async () => {
    setTokenError('');
    if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
      setTokenError('Kode harus 6 digit angka');
      return;
    }
    if (email) {
      await verifyToken({ email, token });
    }
  };

  const handleResend = () => {
    if (email) {
      resendCode(email);
    }
  };
  
  if (!email) {
    return null; // Sementara redirect
  }

  return (
    <>
      <PageStyle />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Verifikasi Akun</h1>
            <p className="login-subtitle">
              Kami telah mengirimkan kode 6-digit ke <strong>{email}</strong>.
            </p>
            
            {/* Tampilkan error dari hook verifikasi */}
            {verifyError && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>{verifyError}</span>
              </div>
            )}
            {/* Tampilkan error dari hook kirim ulang */}
            {resendError && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>{resendError}</span>
              </div>
            )}
            {/* Tampilkan sukses kirim ulang */}
            {successMessage && (
              <div className="alert alert-success">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>{successMessage}</span>
              </div>
            )}
            
            <div>
              <div className="form-group-animated">
                <label htmlFor="token" className="form-label">Kode 6-Digit</label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  className={`form-control ${tokenError ? 'is-invalid' : ''}`}
                  placeholder="Masukkan kode"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    if (tokenError) setTokenError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  maxLength={6}
                  disabled={isLoading || isResending}
                />
                {tokenError && (
                  <div className="invalid-feedback">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span>{tokenError}</span>
                  </div>
                )}
              </div>

              <button 
                type="button"
                className="btn-login"
                disabled={isLoading || isResending}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Memverifikasi...
                  </>
                ) : (
                  'Verifikasi Kode'
                )}
              </button>
            </div>

            <div className="footer-links">
              <button onClick={handleResend} disabled={isLoading || isResending}>
                {isResending ? 'Mengirim...' : 'Kirim Ulang Kode'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Bungkus dengan Suspense karena kita pakai useSearchParams
export default function VerifyTokenPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        Loading...
      </div>
    }>
      <VerifyTokenForm />
    </Suspense>
  );
}