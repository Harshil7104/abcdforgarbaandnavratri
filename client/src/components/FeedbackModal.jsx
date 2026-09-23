import React, { useState } from 'react';
import { X, MessageSquareHeart, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const FeedbackModal = ({ isOpen, onClose, user }) => {
  const [category, setCategory] = useState('Venue Suggestion');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const categories = [
    { value: 'Venue Suggestion', label: 'Venue Suggestion 🏰' },
    { value: 'Feature Request', label: 'Feature Request ✨' },
    { value: 'Bug Report', label: 'Bug Report 🐛' },
    { value: 'General', label: 'General / Praise 🌸' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please type your suggestion or feedback.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.submitFeedback({ category, message: message.trim() });
      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setMessage('');
          onClose();
        }, 2200);
      }
    } catch (err) {
      setError(err.message || 'Could not submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '30px 24px',
          position: 'relative',
          border: '1.5px solid var(--border-gold-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#6ee7b7' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 12px auto' }} />
            <h3 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
              Jay Mataji! 🌸
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Thank you for helping make Find My Garba Partner better for all of Gujarat!
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ffd54f, #ff9933)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                💬
              </div>
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  Suggestion & Feedback Box
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Help us expand across Navratri venues
                </div>
              </div>
            </div>

            {error && (
              <div className="alert-error" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Category selector */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {categories.map((c) => (
                    <div
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`night-chip ${category === c.value ? 'selected' : ''}`}
                      style={{ padding: '8px 6px', fontSize: '0.78rem', textAlign: 'center' }}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-msg">
                  Your Suggestion / Venue Request
                </label>
                <textarea
                  id="feedback-msg"
                  rows={4}
                  className="form-input"
                  placeholder="e.g. Please add United Way pass group coordination, or add Anand Charotar Ground venue!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ borderRadius: '12px', resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-festive-gold"
                style={{ width: '100%', padding: '12px' }}
                disabled={loading}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
