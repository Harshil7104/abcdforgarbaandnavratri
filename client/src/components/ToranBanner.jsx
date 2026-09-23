import React from 'react';

/**
 * Decorative Marigold & Mango Leaves Toran Motif for Gujarati Navratri
 */
export const ToranBanner = () => {
  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 50 }}>
      {/* Top Gradient Border */}
      <div className="toran-container"></div>
      
      {/* Repeating Marigold & Leaf Pattern Garland */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          padding: '0 8px',
          height: '22px',
          overflow: 'hidden',
          background: 'transparent',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateY(${i % 2 === 0 ? '0px' : '-2px'})`,
            }}
          >
            {/* Hanging Marigold Garland Pearl / Diya */}
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i % 2 === 0 ? '#ff9933' : '#d9381e',
                border: '1.5px solid #ffd54f',
                boxShadow: '0 0 6px rgba(255, 153, 51, 0.8)',
              }}
            />
            {/* Little golden tassel */}
            <div
              style={{
                width: '2px',
                height: '7px',
                background: '#e6a100',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
