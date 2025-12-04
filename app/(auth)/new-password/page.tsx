'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Sesuaikan path ke hooks/useAuth Anda
import { useResetPassword } from '../../../hooks/useAuth'; 

// Komponen CSS (Salin dari halaman login/register Anda)
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
    .password-wrapper { position: relative; }
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #666666;
      transition: color 0.3s ease;
      padding: 4px;
      display: flex;
      align-items: center;
    }
    .password-toggle:hover { color: #1a1a1a; }
    .password-wrapper input::-ms-reveal,
    .password-wrapper input::-webkit-password-reveal-button {
      display: none;
      -webkit-appearance: none;
      appearance: none;
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
    .alert-danger {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
    .footer-links {
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
  `}</style>
);

// Komponen Form
function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, isLoading, error } = useResetPassword();

  // Redirect jika tidak ada email atau token
  useEffect(() => {
    if (!email || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors(prev => ({...prev, general: "Link tidak valid. Silakan ulangi proses lupa password."}));
      setTimeout(() => {
        router.replace('/lupa-password');
      }, 3000);
    }
  }, [email, token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    setErrors({ password: '', confirmPassword: '', general: '' });
    if (!email || !token) {
       setErrors(prev => ({...prev, general: "Link tidak valid."}));
       return;
    }
    
    const { password, confirmPassword } = formData;
    let hasError = false;
    const newErrors = { password: '', confirmPassword: '', general: '' };

    if (!password) {
      newErrors.password = 'Password tidak boleh kosong';
      hasError = true;
    } else if (password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password dan konfirmasi tidak cocok';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    await resetPassword({ email, token, password });
    // Redirect di-handle oleh hook
  };

  return (
    <>
      <PageStyle />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Password Baru</h1>
            <p className="login-subtitle">
              Masukkan password baru Anda.
            </p>
            
            {/* Tampilkan error dari hook */}
            {error && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>{error}</span>
              </div>
            )}
            {/* Tampilkan error validasi umum */}
            {errors.general && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>{errors.general}</span>
              </div>
            )}
            
            <div>
              <div className="form-group-animated">
                <label htmlFor="password" className="form-label">Password Baru</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading || !!errors.general}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={isLoading || !!errors.general}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      {showPassword ? ( <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /> ) : ( <> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /> <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /> </> )}
                    </svg>
                  </button>
                </div>
                {errors.password && <div className="invalid-feedback"><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg><span>{errors.password}</span></div>}
              </div>

              <div className="form-group-animated">
                <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Ulangi password baru"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    disabled={isLoading || !!errors.general}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading || !!errors.general}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      {showConfirmPassword ? ( <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /> ) : ( <> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /> <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /> </> )}
                    </svg>
                  </button>
                </div>
                {errors.confirmPassword && <div className="invalid-feedback"><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg><span>{errors.confirmPassword}</span></div>}
              </div>

              <button 
                type="button"
                className="btn-login"
                disabled={isLoading || !!errors.general}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Password Baru'
                )}
              </button>
            </div>

            <div className="footer-links">
              <a href="/login" onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }}>
                <small>Kembali ke Login</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Bungkus dengan Suspense karena kita pakai useSearchParams
export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        Loading...
      </div>
    }>
      <NewPasswordForm />
    </Suspense>
  );
}