import React, { useState } from 'react';
import { Share2, Copy, Check, Sparkles, Users, MessageCircle } from 'lucide-react';
import { api } from '../services/api';

export const ReferralShare = ({ user, title = 'Invite Your Garba Group on WhatsApp' }) => {
  const [copied, setCopied] = useState(false);

  const city = user?.city || 'Gujarat';
  const referralUrl = 'https://findmygarbapartner.com';

  const defaultShareMessage = `Hey! 💃🕺 I just registered on FindMyGarbaPartner.com to find a Garba partner & group in ${city} for Navratri 2026! It is 100% free, verifies dancers, and keeps phone numbers strictly private until you match. Register your group here: ${referralUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultShareMessage)}`;

  const handleShareClick = () => {
    // Track non-PII telemetry event
    api.trackEvent({
      eventType: 'WhatsApp_Share_Clicked',
      city: user?.city || 'Gujarat',
      metadata: { source: 'ReferralShare_Card' },
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(defaultShareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    api.trackEvent({
      eventType: 'WhatsApp_Share_Clicked',
      city: user?.city || 'Gujarat',
      metadata: { action: 'Copied_Link' },
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 20px',
        border: '1.5px solid rgba(37, 211, 102, 0.4)',
        background: 'linear-gradient(135deg, rgba(18, 140, 126, 0.15), rgba(26, 14, 46, 0.85))',
        borderRadius: '18px',
        margin: '20px 0',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#25D366', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
        <Sparkles size={14} />
        <span>VIRAL GARBA CIRCLE INVITE</span>
      </div>

      <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
        {title} 🌸
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
        Garba is best enjoyed in big circles! Invite your friends in <strong>{city}</strong> to match into your Garba group.
      </p>

      {/* Share Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', smDirection: 'row', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareClick}
          className="btn-whatsapp"
          style={{ width: '100%', fontSize: '0.95rem', padding: '12px' }}
        >
          <MessageCircle size={18} />
          <span>Share to WhatsApp Friends & Groups</span>
        </a>

        <button
          onClick={handleCopyLink}
          style={{
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            border: copied ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
            color: copied ? '#6ee7b7' : '#ffffff',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied Share Text!' : 'Copy Invite Message'}</span>
        </button>
      </div>
    </div>
  );
};
