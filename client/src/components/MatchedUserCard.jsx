import React from 'react';
import { MessageSquare, MapPin, Sparkles, Users, ShieldCheck } from 'lucide-react';

export const MatchedUserCard = ({ partner, onOpenChat }) => {
  // Extract first name + initial for privacy
  const getMaskedName = (fullName) => {
    if (!fullName) return 'Garba Enthusiast';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  };

  return (
    <div
      className="glass-panel glass-panel-interactive"
      style={{
        padding: '24px 20px',
        border: '1.5px solid rgba(230, 161, 0, 0.4)',
        background: 'linear-gradient(135deg, rgba(26, 14, 46, 0.85), rgba(35, 18, 62, 0.9))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '18px',
      }}
    >
      <div>
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd54f, #ff9933, #d9381e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 0 12px rgba(255, 153, 51, 0.4)',
              }}
            >
              💃
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {getMaskedName(partner.fullName)}
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} /> Verified Navratri Dancer
              </div>
            </div>
          </div>

          <span
            className="pill-badge"
            style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#6ee7b7' }}
          >
            Matched 🎯
          </span>
        </div>

        {/* Preference Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <MapPin size={16} color="#ff9933" />
            <span>
              <strong>City:</strong> {partner.city} {partner.area ? `(${partner.area})` : ''}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <Sparkles size={16} color="#ffd54f" />
            <span>
              <strong>Style:</strong> {partner.garbaStyle || 'Dodhiya / Popat'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <Users size={16} color="#d9381e" />
            <span>
              <strong>Format:</strong> {partner.groupSize || 'Solo'} Dancer
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onOpenChat(partner)}
        className="btn-festive-gold"
        style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
      >
        <MessageSquare size={18} />
        <span>Chat Now (Masked)</span>
      </button>
    </div>
  );
};
