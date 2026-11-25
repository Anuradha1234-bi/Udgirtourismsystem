import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLoginPage = () => {
  const { lang, t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard immediately
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await api.adminLogin(username, password);
      login(data.access_token, data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '80px 0 120px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(198, 161, 91, 0.2)',
              color: 'var(--forest-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Lock size={26} />
            </div>
            <h1 style={{ color: 'var(--forest-green)', fontSize: '1.4rem', fontWeight: 800 }}>
              {t.admin.loginTitle}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              {lang === 'mr' ? 'अधिकृत प्रशासकांसाठी सुरक्षित प्रवेश' : 'Authorized Personnel Access Only'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#FFEBEE',
              color: '#C62828',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                {t.admin.username}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                {t.admin.password}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              <ShieldCheck size={16} />
              <span>{submitting ? (lang === 'mr' ? 'प्रमाणित करत आहे...' : 'Verifying...') : t.admin.loginBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
