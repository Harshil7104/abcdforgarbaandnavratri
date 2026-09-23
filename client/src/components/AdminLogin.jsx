import React, { useState } from 'react';
import { ShieldCheck, Lock, Phone, AlertCircle, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const AdminLogin = ({ onLoginSuccess, onBackToSite }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number.');
      }
      if (!password) {
        throw new Error('Please enter your admin master password.');
      }

      const res = await api.login({ phone: cleanPhone, password });
      if (res.success && res.data) {
        if (res.data.user?.role !== 'admin') {
          throw new Error('Access Denied. Your account does not have Admin privileges.');
        }
        if (onLoginSuccess) {
          onLoginSuccess(res.data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setPhone('9999999999');
    setPassword('AdminGarba@2026');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 16px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 28px',
          border: '1.5px solid var(--accent-gold)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(230, 161, 0, 0.2)',
          borderRadius: '20px',
          position: 'relative',
        }}
      >
        {/* Back link */}
        <button
          onClick={onBackToSite}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Main Site</span>
        </button>

        {/* Shield Icon Badge */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(230, 161, 0, 0.3), rgba(217, 56, 30, 0.4))',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: '0 0 20px rgba(230, 161, 0, 0.3)',
            }}
          >
            <ShieldCheck size={32} color="#ffd54f" />
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            Admin Control Center
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Restricted access for Navratri 2026 match monitoring and moderation.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="alert-error" style={{ marginBottom: '18px', padding: '10px 14px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#ffd54f" />
              <span>Admin Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 9999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#ffd54f" />
              <span>Master Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-festive-gold glow-pulse"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            <span>Authenticate Admin Session</span>
          </button>
        </form>

        {/* Quick Demo Fill for Testing */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            style={{
              background: 'rgba(230, 161, 0, 0.1)',
              border: '1px dashed var(--accent-gold)',
              color: '#ffd54f',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} />
            <span>Fill Seeded Admin Credentials (Dev)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
