import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, Users } from 'lucide-react';
import { ReferralShare } from './ReferralShare';

export const SuccessScreen = ({ user, onOpenProfile, onReset }) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff9933', '#ffd54f', '#d9381e', '#ffffff'],
      });
    } catch {
      // ignore in SSR/test
    }
  }, []);

  return (
    <section style={{ padding: '30px 0 60px 0' }}>
      <div className="container-custom" style={{ maxWidth: '640px' }}>
        <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', borderColor: 'rgba(16, 185, 129, 0.5)' }}>
          {/* Animated Success Badge */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            }}
          >
            <CheckCircle2 size={46} color="#ffffff" />
          </div>

          <span className="font-festive" style={{ color: '#ffd54f', fontSize: '1.4rem' }}>
            અભિનંદન! Congratulations!
          </span>
          <h2 className="font-heading" style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>
            Registration Successful!
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px', lineHeight: 1.6 }}>
            Welcome to the community, <strong style={{ color: '#ffd54f' }}>{user?.fullName || 'Garba Enthusiast'}</strong>! Your profile is active for Navratri 2026 matching.
          </p>

          {/* Batch Matching Timeline Box */}
          <div
            style={{
              background: 'rgba(230, 161, 0, 0.1)',
              border: '1.5px dashed var(--accent-gold)',
              borderRadius: '16px',
              padding: '20px',
              margin: '28px 0',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffd54f', fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>
              <Calendar size={20} />
              <span>What Happens Next? (October Batch Release)</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              • <strong>Early October Batch Matching</strong>: Our smart matching algorithm will group dancers based on city (<strong>{user?.city || 'Gujarat'}</strong>), preferred steps (<strong>{user?.garbaStyle || 'Garba'}</strong>), and night availability.
              <br />
              • You will receive an SMS/WhatsApp notification once your curated match circle is ready!
            </p>
          </div>

          {/* User Registration Details Card */}
          <div
            style={{
              background: 'rgba(13, 7, 20, 0.7)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '28px',
              textAlign: 'left',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Your Registered Preferences
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.9rem' }}>
              <div>📍 <strong>City:</strong> {user?.city} {user?.area ? `(${user.area})` : ''}</div>
              <div>💃 <strong>Style:</strong> {user?.garbaStyle}</div>
              <div>👥 <strong>Format:</strong> {user?.groupSize}</div>
              <div>🌙 <strong>Nights:</strong> {user?.nightAvailability?.length || 9} Selected</div>
            </div>
          </div>

          {/* Viral WhatsApp Referral Card */}
          <ReferralShare user={user} title="Invite Your Garba Friends & Groups on WhatsApp" />

          {/* Additional Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '20px' }}>
            <button onClick={onOpenProfile} className="btn-outline-gold">
              <Users size={16} />
              <span>Go to My Dashboard</span>
            </button>
            <button onClick={onReset} className="btn-outline-gold">
              <span>Register Another Person</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
