import React, { useState } from 'react';
import { X, Phone, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please provide both your 10-digit mobile number and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ phone: phone.trim(), password });
      if (res.success) {
        onLoginSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Invalid mobile number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '32px 26px',
          position: 'relative',
          border: '1.5px solid var(--border-gold-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d9381e, #ff9933)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: '24px',
            }}
          >
            🪔
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            Welcome Back
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Log in to manage your Garba partner matching profile
          </p>
        </div>

        {error && (
          <div className="alert-error" style={{ padding: '10px 14px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem' }}>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-phone">
              10-Digit Mobile Number
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#ffd54f', fontWeight: 600, fontSize: '0.95rem' }}>
                +91
              </span>
              <input
                id="login-phone"
                type="tel"
                maxLength={10}
                className="form-input"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '52px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#ff9933' }} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '14px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-festive-gold"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
