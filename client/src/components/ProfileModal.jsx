import React from 'react';
import { X, User, Phone, MapPin, Sparkles, Shield, Calendar, Instagram, CheckCircle2 } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '32px 26px',
          position: 'relative',
          border: '1.5px solid var(--border-gold-strong)',
          maxHeight: '90vh',
          overflowY: 'auto',
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

        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd54f, #ff9933, #d9381e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: '28px',
              boxShadow: '0 0 20px rgba(255, 153, 51, 0.4)',
            }}
          >
            💃
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            {user.fullName}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
            <span className="pill-badge" style={{ fontSize: '0.78rem' }}>
              Status: {user.matchStatus || 'Pending (October Batch)'}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(13, 7, 20, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
            <Phone size={18} color="#ffd54f" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Phone</div>
              <div style={{ fontWeight: 600 }}>+91 {user.phone}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(13, 7, 20, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
            <MapPin size={18} color="#ff9933" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
              <div style={{ fontWeight: 600 }}>
                {user.city} {user.area ? `• ${user.area}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(13, 7, 20, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
            <Sparkles size={18} color="#ffd54f" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Garba Style & Format</div>
              <div style={{ fontWeight: 600 }}>
                {user.garbaStyle} • {user.groupSize} ({user.gender})
              </div>
            </div>
          </div>

          {user.socialProfile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(13, 7, 20, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
              <Instagram size={18} color="#e1306c" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Social Verification</div>
                <div style={{ fontWeight: 600 }}>{user.socialProfile}</div>
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(13, 7, 20, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Selected Navratri Nights
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user.nightAvailability?.map((night) => (
                <span
                  key={night}
                  style={{
                    background: 'rgba(230, 161, 0, 0.15)',
                    border: '1px solid rgba(230, 161, 0, 0.3)',
                    color: '#ffd54f',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                  }}
                >
                  {night}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-festive-gold"
          style={{ width: '100%', marginTop: '24px' }}
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};
