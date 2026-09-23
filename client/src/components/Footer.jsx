import React from 'react';
import { Heart, Sparkles, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'rgba(13, 7, 20, 0.95)',
        borderTop: '1px solid rgba(230, 161, 0, 0.2)',
        padding: '40px 20px 30px 20px',
        textAlign: 'center',
        marginTop: '60px',
      }}
    >
      <div className="container-custom" style={{ maxWidth: '800px' }}>
        {/* Diya Icon */}
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>🪔</div>

        <div className="font-festive" style={{ fontSize: '1.4rem', color: '#ffd54f', marginBottom: '8px' }}>
          જય અંબે મા • શુભ નવરાત્રી
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
          Find My Garba Partner is a safe, community-driven platform celebrating the spirit, rhythm, and devotion of Gujarat's world-famous Navratri Mahotsav.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '24px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={14} color="#ffd54f" /> Safe & Verified Platform
          </span>
          <span>•</span>
          <span>Vadodara • Ahmedabad • Surat • Rajkot</span>
          <span>•</span>
          <span>Batch Matching in Early October</span>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
          © 2026 findmygarbapartner.com • Crafted with <Heart size={12} color="#d9381e" style={{ display: 'inline', verticalAlign: 'middle' }} /> for Gujarat Garba Lovers.
        </div>
      </div>
    </footer>
  );
};
