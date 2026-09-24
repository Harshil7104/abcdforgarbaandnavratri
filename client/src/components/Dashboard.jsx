import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { DonationCard } from './DonationCard';
import { MatchedUserCard } from './MatchedUserCard';
import { ReferralShare } from './ReferralShare';
import { Sparkles, MessageSquareHeart, ShieldCheck } from 'lucide-react';

export const Dashboard = ({ user, onOpenChat, onOpenProfile, onOpenAdmin, onOpenFeedback }) => {
  const isMatched = user?.matchStatus === 'Matched' && user?.matchedWith && user.matchedWith.length > 0;

  return (
    <div style={{ padding: '24px 0 60px 0' }}>
      <div className="container-custom">
        {/* Top User Greeting Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(26, 14, 46, 0.8), rgba(13, 7, 20, 0.9))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd54f, #ff9933, #d9381e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                boxShadow: '0 0 15px rgba(255, 153, 51, 0.4)',
              }}
            >
              💃
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  Kem Cho, {user?.fullName?.split(' ')[0] || 'Dancer'}!
                </span>
                <span
                  className="pill-badge"
                  style={{
                    background: isMatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(230, 161, 0, 0.15)',
                    borderColor: isMatched ? '#10b981' : 'var(--accent-gold)',
                    color: isMatched ? '#6ee7b7' : '#ffd54f',
                    fontSize: '0.78rem',
                  }}
                >
                  {isMatched ? '🎉 Matched' : '⏳ Matching in Progress'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                📍 {user?.city} {user?.area ? `• ${user.area}` : ''} | 💃 {user?.garbaStyle} ({user?.groupSize})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button onClick={onOpenProfile} className="btn-outline-gold" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              My Profile
            </button>
            <button onClick={onOpenFeedback} className="btn-outline-gold" style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: '#ffd54f' }}>
              <MessageSquareHeart size={15} color="#ffd54f" />
              <span>Feedback</span>
            </button>
            {user?.role === 'admin' && (
              <button onClick={onOpenAdmin} className="btn-outline-gold" style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: '#ff9933', color: '#ff9933' }}>
                ⚙️ Admin Runner
              </button>
            )}
          </div>
        </div>

        {/* STATE 1: PENDING */}
        {!isMatched && (
          <div>
            {/* Standby Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(230, 161, 0, 0.15), rgba(217, 56, 30, 0.2))',
                border: '1.5px solid var(--accent-gold)',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 0 25px rgba(255, 153, 51, 0.2)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🪔</div>
              <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd54f', marginBottom: '8px' }}>
                Matching in Progress!
              </h2>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
                Announcements will be released via SMS/WhatsApp in early October before Navratri. Our smart algorithm is evaluating style compatibility, {user?.city} venue proximity, and night availability.
              </p>
            </div>

            {/* Live Countdown Timer */}
            <CountdownTimer />

            {/* Viral WhatsApp Referral Card */}
            <ReferralShare user={user} title="Invite Your Garba Group on WhatsApp" />

            {/* Donation Card */}
            <DonationCard />
          </div>
        )}

        {/* STATE 2: MATCHED */}
        {isMatched && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="pill-badge" style={{ marginBottom: '8px' }}>
                <Sparkles size={14} color="#ffd54f" />
                <span>NAVRATRI 2026 MATCH CIRCLE</span>
              </div>
              <h2 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                Your Garba Partner Matches
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
                We found compatible Garba dancers in <strong>{user?.city}</strong> who match your style (<strong>{user?.garbaStyle}</strong>).
              </p>
            </div>

            {/* Matched Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              {user.matchedWith.map((partner) => (
                <MatchedUserCard
                  key={partner._id || partner.id || partner}
                  partner={partner}
                  currentUser={user}
                  onOpenChat={onOpenChat}
                />
              ))}
            </div>

            {/* Safety Reminder */}
            <div
              className="glass-panel"
              style={{
                padding: '16px 20px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <ShieldCheck size={24} color="#6ee7b7" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.88rem', color: '#6ee7b7', lineHeight: 1.5 }}>
                <strong>Masked Contact Security:</strong> All conversations are encrypted and masked. Only share passes and meet at official Navratri venues in {user?.city}.
              </div>
            </div>

            {/* Viral WhatsApp Referral Card */}
            <ReferralShare user={user} title="Add More Friends to Your Garba Circle" />

            {/* Voluntary Donation Support */}
            <DonationCard />
          </div>
        )}
      </div>
    </div>
  );
};
