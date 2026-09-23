import React from 'react';
import { ToranBanner } from './ToranBanner';
import { User, LogIn, LogOut, Sparkles, LayoutDashboard } from 'lucide-react';

export const Header = ({
  user,
  currentView,
  onNavigate,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  onStartRegistration,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        background: 'rgba(13, 7, 20, 0.85)',
        borderBottom: '1px solid rgba(230, 161, 0, 0.2)',
      }}
    >
      <ToranBanner />

      <div
        className="container-custom"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
        }}
      >
        {/* Logo & Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => onNavigate('landing')}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d9381e, #ff9933, #e6a100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 153, 51, 0.5)',
              fontSize: '22px',
            }}
          >
            🪔
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="font-heading"
                style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd54f', letterSpacing: '0.5px' }}
              >
                FIND MY GARBA PARTNER
              </span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Sparkles size={11} color="#ff9933" /> Gujarat's Navratri Partner Finder • 2026
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  style={{
                    background: currentView === 'admin' ? 'var(--accent-gold)' : 'rgba(230, 161, 0, 0.2)',
                    color: currentView === 'admin' ? '#0d0714' : '#ffd54f',
                    border: '1px solid var(--accent-gold)',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🛡️</span>
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => onNavigate(currentView === 'dashboard' ? 'landing' : 'dashboard')}
                className="btn-outline-gold"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <LayoutDashboard size={16} />
                <span>{currentView === 'dashboard' ? 'Home' : 'Dashboard'}</span>
              </button>

              <button
                onClick={onOpenProfile}
                className="btn-outline-gold"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <User size={16} />
                <span>{user.fullName ? user.fullName.split(' ')[0] : 'Profile'}</span>
              </button>

              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onNavigate('admin')}
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  color: 'var(--text-muted)',
                  borderRadius: '9999px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
                title="Admin Control Center"
              >
                🛡️ Admin
              </button>

              <button
                onClick={onOpenLogin}
                className="btn-outline-gold"
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>

              <button
                onClick={onStartRegistration}
                className="btn-festive-gold"
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                id="header-register-btn"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
