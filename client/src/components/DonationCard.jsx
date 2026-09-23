import React, { useState } from 'react';
import { Heart, Copy, Check, Smartphone, Sparkles, ExternalLink } from 'lucide-react';

export const DonationCard = ({ upiVpa = 'findmygarbapartner@upi' }) => {
  const [selectedAmount, setSelectedAmount] = useState(51);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);

  // Traditional Shubh Garba numbers
  const shubhAmounts = [21, 51, 101, 251];

  const currentAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // UPI Deep Link Specification
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(
    upiVpa
  )}&pn=FindMyGarbaPartner&am=${currentAmount}&cu=INR&tn=GarbaHostingSupport`;

  // Generate dynamic QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(
    upiDeepLink
  )}`;

  const handleSelectAmount = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setSelectedAmount(null);
  };

  const handleOpenUpiApp = () => {
    window.location.href = upiDeepLink;
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '30px 24px',
        border: '1.5px solid rgba(230, 161, 0, 0.5)',
        background: 'linear-gradient(135deg, rgba(26, 14, 46, 0.95), rgba(13, 7, 20, 0.98))',
        textAlign: 'center',
        margin: '28px 0',
        boxShadow: '0 8px 30px rgba(0,0,0,0.45), 0 0 25px rgba(255,153,51,0.2)',
      }}
    >
      {/* Header Accent */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ffd54f', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
        <Sparkles size={16} />
        <span>VOLUNTARY COMMUNITY SUPPORT</span>
        <Sparkles size={16} />
      </div>

      <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
        Support Platform Hosting Costs 🪔
      </h3>

      {/* Note Text */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
        <strong>100% Free Platform.</strong> Support server hosting costs & help us keep matching Garba enthusiasts across Gujarat!
      </p>

      {/* Shubh Amount Preset Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        {shubhAmounts.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => handleSelectAmount(amt)}
            className={`night-chip ${selectedAmount === amt ? 'selected' : ''}`}
            style={{ padding: '10px 20px', fontSize: '1rem', fontWeight: 700, minWidth: '75px' }}
          >
            ₹{amt}
          </button>
        ))}

        {/* Custom Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '12px', color: '#ffd54f', fontWeight: 700, fontSize: '0.9rem' }}>
            ₹
          </span>
          <input
            type="text"
            placeholder="Custom"
            value={customAmount}
            onChange={handleCustomInput}
            className="form-input"
            style={{
              paddingLeft: '28px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              width: '105px',
              height: '42px',
              fontSize: '0.92rem',
              fontWeight: 600,
              borderRadius: '10px',
              borderColor: customAmount ? 'var(--accent-gold)' : undefined,
            }}
          />
        </div>
      </div>

      {/* QR Code Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '16px',
          display: 'inline-block',
          boxShadow: '0 4px 25px rgba(255, 153, 51, 0.35)',
          marginBottom: '20px',
        }}
      >
        <img
          src={qrCodeUrl}
          alt={`UPI QR Code for ₹${currentAmount}`}
          style={{ width: '180px', height: '180px', display: 'block' }}
          loading="lazy"
        />
        <div style={{ color: '#0d0714', fontSize: '0.82rem', fontWeight: 800, marginTop: '8px' }}>
          Scan to Pay ₹{currentAmount}
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '2px' }}>
          Google Pay • PhonePe • Paytm • BHIM
        </div>
      </div>

      {/* Mobile Direct Deep-Link Button */}
      <div style={{ maxWidth: '380px', margin: '0 auto 16px auto' }}>
        <button
          onClick={handleOpenUpiApp}
          className="btn-festive-gold"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
        >
          <Smartphone size={18} />
          <span>Pay ₹{currentAmount} via UPI App (Mobile)</span>
        </button>
      </div>

      {/* VPA ID Copy Block */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(230, 161, 0, 0.25)',
          borderRadius: '12px',
          padding: '10px 16px',
          maxWidth: '380px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UPI VPA ID</div>
          <div style={{ fontWeight: 700, color: '#ffd54f', fontSize: '0.92rem' }}>{upiVpa}</div>
        </div>

        <button
          onClick={handleCopy}
          style={{
            background: copied ? '#10b981' : 'rgba(230, 161, 0, 0.2)',
            border: '1px solid var(--accent-gold)',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy VPA'}</span>
        </button>
      </div>
    </div>
  );
};
