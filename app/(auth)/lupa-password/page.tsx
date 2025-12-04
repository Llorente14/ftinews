'use client';

import React, { useState } from 'react';
import { useForgotPassword } from '@/hooks/useAuth';

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  
  const { sendResetLink, isLoading, error, successMessage } = useForgotPassword();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    setErrors({ email: '' });
    
    let hasError = false;
    if (!email) {
      setErrors({ email: 'Email tidak boleh kosong' });
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrors({ email: 'Format email tidak valid' });
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await sendResetLink(email);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
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
        }
        .form-group-animated {
          animation: slideIn 0.5s ease-out;
          margin-bottom: 1.5rem;
        }
        .form-group-animated:nth-child(1) {
          animation-delay: 0.1s;
          animation-fill-mode: backwards;
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
          animation: slideIn 0.5s ease-out 0.3s backwards;
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
          animation: slideIn 0.5s ease-out 0.4s backwards;
          margin-top: 1.5rem;
          text-align: center;
        }
        .footer-links a {
          color: #666666;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          cursor: pointer;
        }
        .footer-links a:hover {
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

      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Lupa Password?</h1>
            <p className="login-subtitle">
              Masukkan email Anda. Kami akan mengirimkan link untuk mereset password Anda.
            </p>
            
            {successMessage && (
              <div className="alert alert-success">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <div className="form-group-animated">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ email: '' });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>

              <button 
                type="button"
                className="btn-login"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Memproses...
                  </>
                ) : (
                  'Kirim Link Reset'
                )}
              </button>
            </div>

            <div className="footer-links">
              <a 
                href="/login" 
                onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }}
              >
                <small>Kembali ke Login</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}