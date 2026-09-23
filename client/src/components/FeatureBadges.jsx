import React from 'react';
import { Lock, Sparkles, HeartHandshake } from 'lucide-react';

export const FeatureBadges = () => {
  const features = [
    {
      icon: <Lock size={26} color="#ffd54f" />,
      title: '100% Privacy Protection',
      desc: 'Your mobile number is never made public. Only mutual matches gain contact access.',
      gradient: 'linear-gradient(135deg, rgba(217, 56, 30, 0.2), rgba(26, 14, 46, 0.4))',
      border: 'rgba(217, 56, 30, 0.4)',
    },
    {
      icon: <Sparkles size={26} color="#ff9933" />,
      title: 'Smart Style & City Matching',
      desc: 'Match precisely by preferred steps (Dodhiya, Popat, Tran Tali), city, and specific nights.',
      gradient: 'linear-gradient(135deg, rgba(255, 153, 51, 0.2), rgba(26, 14, 46, 0.4))',
      border: 'rgba(255, 153, 51, 0.4)',
    },
    {
      icon: <HeartHandshake size={26} color="#10b981" />,
      title: 'Free Community Initiative',
      desc: 'Created for the cultural joy of Navratri. Completely free for solo dancers and groups alike.',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(26, 14, 46, 0.4))',
      border: 'rgba(16, 185, 129, 0.4)',
    },
  ];

  return (
    <section style={{ padding: '24px 0 40px 0' }}>
      <div className="container-custom">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '24px 20px',
                background: item.gradient,
                borderColor: item.border,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(13, 7, 20, 0.7)',
                  border: `1px solid ${item.border}`,
                  padding: '12px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
