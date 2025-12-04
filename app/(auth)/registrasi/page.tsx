'use client';

import React, { useState } from 'react';
import { useRegister } from '../../../hooks/useAuth';

export default function RegistrasiPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorHandphone: '',
    password: '',
    konfirmasiPassword: ''
  });

  const [errors, setErrors] = useState({
    namaLengkap: '',
    email: '',
    nomorHandphone: '',
    password: '',
    konfirmasiPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
  
  const { register, isLoading, error: registerError } = useRegister();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validateNamaLengkap = (nama: string): string => {
    if (!nama) return 'Nama lengkap tidak boleh kosong';
    if (nama.length < 3) return 'Nama lengkap minimal 3 karakter';
    if (nama.length > 32) return 'Nama lengkap maksimal 32 karakter';
    if (/\d/.test(nama)) return 'Nama lengkap tidak boleh mengandung angka';
    return '';
  };
  
  const validateNomorHandphone = (nomor: string): string => {
    if (!nomor) return 'Nomor handphone tidak boleh kosong';
    if (!/^08\d{8,14}$/.test(nomor)) {
      return 'Format nomor HP salah (contoh: 08123456789). Min 10, maks 16 digit.';
    }
    return '';
  };
  
  const validatePassword = (password: string): string => {
    if (!password) return 'Kata sandi tidak boleh kosong';
    if (password.length < 8) return 'Kata sandi minimal 8 karakter';
    return '';
  };
  
  const validateKonfirmasiPassword = (password: string, konfirmasi: string): string => {
    if (!konfirmasi) return 'Konfirmasi kata sandi tidak boleh kosong';
    if (password !== konfirmasi) return 'Kata sandi dan konfirmasi tidak cocok';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    const { namaLengkap, email, nomorHandphone, password, konfirmasiPassword } = formData;
    const namaError = validateNamaLengkap(namaLengkap);
    const emailError = validateEmail(email) ? '' : (email ? 'Format email tidak valid' : 'Email tidak boleh kosong');
    const hpError = validateNomorHandphone(nomorHandphone);
    const passwordError = validatePassword(password);
    const konfirmasiError = validateKonfirmasiPassword(password, konfirmasiPassword);

    const newErrors = {
      namaLengkap: namaError,
      email: emailError,
      nomorHandphone: hpError,
      password: passwordError,
      konfirmasiPassword: konfirmasiError
    };

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return; 
    }

    try {
      await register(formData);
    } catch (err) {
      console.error(err);
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
            <h1 className="login-title">Buat Akun</h1>
            
            {registerError && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{registerError}</span>
              </div>
            )}
            
            <div>
              <div className="form-group-animated" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="namaLengkap" className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  id="namaLengkap"
                  name="namaLengkap"
                  className={`form-control ${errors.namaLengkap ? 'is-invalid' : ''}`}
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.namaLengkap && (
                  <div className="invalid-feedback">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.namaLengkap}
                  </div>
                )}
              </div>

              <div className="form-group-animated" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Masukkan email Anda"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-group-animated" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="nomorHandphone" className="form-label">Nomor Handphone</label>
                <input
                  type="tel"
                  id="nomorHandphone"
                  name="nomorHandphone"
                  className={`form-control ${errors.nomorHandphone ? 'is-invalid' : ''}`}
                  placeholder="Contoh: 08123456789"
                  value={formData.nomorHandphone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.nomorHandphone && <div className="invalid-feedback">{errors.nomorHandphone}</div>}
              </div>

              <div className="form-group-animated" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ paddingRight: '45px' }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      {showPassword ? (
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      ) : (
                        <>
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="form-group-animated" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="konfirmasiPassword" className="form-label">Konfirmasi Password</label>
                <div className="password-wrapper">
                  <input
                    type={showKonfirmasiPassword ? 'text' : 'password'}
                    id="konfirmasiPassword"
                    name="konfirmasiPassword"
                    className={`form-control ${errors.konfirmasiPassword ? 'is-invalid' : ''}`}
                    placeholder="Ulangi kata sandi Anda"
                    value={formData.konfirmasiPassword}
                    onChange={handleChange}
                    style={{ paddingRight: '45px' }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowKonfirmasiPassword(!showKonfirmasiPassword)}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      {showKonfirmasiPassword ? (
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      ) : (
                        <>
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.konfirmasiPassword && <div className="invalid-feedback">{errors.konfirmasiPassword}</div>}
              </div>

              <button 
                type="button"
                className="btn-login"
                disabled={isLoading}
                onClick={handleSubmit}
                style={{ animationDelay: '0.6s' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Mendaftar...
                  </>
                ) : (
                  'Registrasi'
                )}
              </button>
            </div>

            <div className="footer-links" style={{ animationDelay: '0.7s' }}>
              <p style={{ margin: 0 }}>
                <small style={{ color: '#666666' }}>
                  Sudah punya akun?{' '}
                  <a 
                    href="/login" 
                    onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }}
                    style={{ color: '#1a1a1a', fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    Login di sini
                  </a>
                </small>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}