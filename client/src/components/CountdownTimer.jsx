import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

export const CountdownTimer = () => {
  // Target: Navratri 2026 Day 1 (October 11, 2026, 00:00:00 IST)
  const targetDate = new Date('2026-10-11T00:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(217, 56, 30, 0.2), rgba(26, 14, 46, 0.7))',
        border: '1.5px solid rgba(230, 161, 0, 0.4)',
        borderRadius: '20px',
        padding: '24px 20px',
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 153, 51, 0.15)',
        margin: '24px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ffd54f', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
        <Clock size={16} />
        <span>Countdown to Navratri 2026 (Oct 11)</span>
        <Sparkles size={16} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '460px',
          margin: '0 auto',
        }}
      >
        {units.map((unit) => (
          <div
            key={unit.label}
            style={{
              background: 'rgba(13, 7, 20, 0.85)',
              border: '1px solid rgba(230, 161, 0, 0.3)',
              borderRadius: '12px',
              padding: '12px 6px',
            }}
          >
            <div
              className="font-heading"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 900,
                color: '#ffd54f',
                lineHeight: 1,
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
