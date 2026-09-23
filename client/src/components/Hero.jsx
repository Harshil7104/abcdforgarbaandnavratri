import React from 'react';
import { ShieldCheck, Sparkles, MapPin, ArrowDown, Users } from 'lucide-react';

export const Hero = ({ onRegisterClick }) => {
  const gujaratCities = [
    { name: 'Vadodara', icon: '🏰', venue: 'United Way & Navlakhi' },
    { name: 'Ahmedabad', icon: '🏛️', venue: 'GMDC & Club 07' },
    { name: 'Surat', icon: '💎', venue: 'Indoor Stadium & VIP' },
    { name: 'Rajkot', icon: '🎡', venue: 'Race Course & Khodaldham' },
    { name: 'Anand', icon: '🌸', venue: 'BVM & Charotar Ground' },
  ];

  return (
    <section style={{ paddingTop: '36px', paddingBottom: '32px', textAlign: 'center', position: 'relative' }}>
      <div className="container-custom">
        {/* Top Tag */}
        <div style={{ display: 'inline-block', marginBottom: '18px' }}>
          <div className="pill-badge glow-pulse">
            <Sparkles size={14} color="#ffd54f" />
            <span>NAVRATRI 2026 GUJARAT COMMUNITY MATCHING</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          className="font-heading"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 30%, #ffd54f 70%, #ff9933 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          Find Your Perfect Garba Partner in Gujarat
        </h1>

        {/* Dynamic Social Proof Counter */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 153, 51, 0.15)', border: '1px solid rgba(255, 153, 51, 0.4)', padding: '6px 16px', borderRadius: '9999px', margin: '0 auto 20px auto', color: '#ffd54f', fontSize: '0.88rem', fontWeight: 600 }}>
          <span style={{ fontSize: '1.1rem' }}>🔥</span>
          <span>Join <strong>500+ Garba lovers</strong> registered across Vadodara & Gujarat!</span>
        </div>

        {/* Subtitle & Trust assurance */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 24px auto',
            lineHeight: 1.6,
          }}
        >
          Whether you dance <span style={{ color: '#ffd54f', fontWeight: 600 }}>Dodhiya</span>, <span style={{ color: '#ffd54f', fontWeight: 600 }}>Popat</span>, or <span style={{ color: '#ffd54f', fontWeight: 600 }}>Tran Tali</span> — connect safely with local Garba lovers & groups across Gujarat without sharing your private phone number until you match.
        </p>

        {/* Safety Highlights Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontSize: '0.92rem', fontWeight: 500 }}>
            <ShieldCheck size={18} /> 100% Masked Contact & Privacy Protected
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd54f', fontSize: '0.92rem', fontWeight: 500 }}>
            <Users size={18} /> Solo, Duo & Group Matching
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '36px' }}>
          <button
            onClick={onRegisterClick}
            className="btn-festive-gold"
            style={{ fontSize: '1.15rem', padding: '16px 36px' }}
          >
            <span>✨ Register for Free Matching</span>
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Gujarat Active Cities Strip */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
            Active Matching In Top Garba Venues
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {gujaratCities.map((city) => (
              <div
                key={city.name}
                style={{
                  background: 'rgba(26, 14, 46, 0.6)',
                  border: '1px solid rgba(230, 161, 0, 0.25)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-muted)',
                }}
              >
                <span>{city.icon}</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{city.name}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({city.venue})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
