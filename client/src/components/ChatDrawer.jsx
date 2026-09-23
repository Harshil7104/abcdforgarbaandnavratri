import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldAlert, Flag, AlertTriangle, Check, Lock, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { getSocket } from '../services/socket';

export const ChatDrawer = ({ isOpen, onClose, currentUser, matchPartner }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate behavior in chat');
  const [blockUserCheck, setBlockUserCheck] = useState(true);
  const [reportSuccess, setReportSuccess] = useState(false);
  const messagesEndRef = useRef(null);

  const socket = getSocket();

  const getMaskedName = (fullName) => {
    if (!fullName) return 'Garba Partner';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  };

  const partnerId = matchPartner?._id || matchPartner?.id;
  const currentUserId = currentUser?._id || currentUser?.id;

  // Load message history & listen to socket events
  useEffect(() => {
    if (!isOpen || !partnerId) return;

    setLoading(true);
    // Fetch message history from API
    api.getMessages(partnerId)
      .then((res) => {
        if (res.success) {
          setMessages(res.data || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load chat history:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Join socket rooms
    socket.emit('join_user', currentUserId);
    socket.emit('join_chat', partnerId);

    const handleNewMessage = (msg) => {
      // Check if message belongs to this conversation
      if (
        (msg.senderId === partnerId && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === partnerId)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('chat_message', handleNewMessage);

    // Fallback polling every 4 seconds for message sync
    const pollInterval = setInterval(() => {
      api.getMessages(partnerId)
        .then((res) => {
          if (res.success) {
            setMessages(res.data || []);
          }
        })
        .catch(() => {});
    }, 4000);

    return () => {
      socket.emit('leave_chat', partnerId);
      socket.off('new_message', handleNewMessage);
      socket.off('chat_message', handleNewMessage);
      clearInterval(pollInterval);
    };
  }, [isOpen, partnerId, currentUserId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Optimistic message
      const tempMsg = {
        _id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: partnerId,
        matchId: partnerId,
        text: messageText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);

      // Emit via socket
      socket.emit('send_message', {
        senderId: currentUserId,
        receiverId: partnerId,
        matchId: partnerId,
        text: messageText,
      });

      // Also persist via REST endpoint
      const res = await api.sendMessage({
        receiverId: partnerId,
        matchId: partnerId,
        text: messageText,
      });

      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempMsg._id ? res.data : m))
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.reportUser({
        targetUserId: partnerId,
        reason: reportReason,
        blockUser: blockUserCheck,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setIsReporting(false);
        setReportSuccess(false);
        if (blockUserCheck) {
          onClose();
        }
      }, 2000);
    } catch (err) {
      alert(err.message || 'Could not submit report');
    }
  };

  if (!isOpen || !matchPartner) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1.5px solid var(--border-gold-strong)',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '14px 20px',
            background: 'rgba(13, 7, 20, 0.95)',
            borderBottom: '1px solid rgba(230, 161, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd54f, #ff9933)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              💃
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem' }}>
                {getMaskedName(matchPartner.fullName)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
                {matchPartner.city} • {matchPartner.garbaStyle}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsReporting(true)}
              style={{
                background: 'rgba(217, 56, 30, 0.15)',
                border: '1px solid #d9381e',
                color: '#ff8a80',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Report or block this user"
            >
              <Flag size={13} />
              <span>Report</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Safety Warning Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(217, 56, 30, 0.25), rgba(255, 153, 51, 0.2))',
            borderBottom: '1px solid rgba(255, 153, 51, 0.3)',
            padding: '8px 16px',
            fontSize: '0.76rem',
            color: '#ffd54f',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Lock size={14} style={{ flexShrink: 0 }} />
          <span>
            <strong>Safety Reminder:</strong> Never share sensitive financial details. Keep communication respectful and inside the app.
          </span>
        </div>

        {/* Message Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'rgba(13, 7, 20, 0.4)',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
              <div>Loading encrypted conversation...</div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', margin: 'auto' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🪔</div>
              <div style={{ fontWeight: 600, color: '#ffd54f' }}>Start the Conversation!</div>
              <p style={{ fontSize: '0.84rem', marginTop: '6px' }}>
                Say "Kem Cho!" and coordinate your favorite Garba steps and pass booking for Navratri 2026.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === currentUserId;
              const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={msg._id || index}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      background: isMe
                        ? 'linear-gradient(135deg, #d9381e, #ff9933)'
                        : 'rgba(26, 14, 46, 0.95)',
                      border: isMe ? 'none' : '1px solid rgba(230, 161, 0, 0.3)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '0.92rem',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px', padding: '0 4px' }}>
                    {time} {isMe && (msg.read ? '• Read' : '• Sent')}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '12px 16px',
            background: 'rgba(13, 7, 20, 0.95)',
            borderTop: '1px solid rgba(230, 161, 0, 0.25)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Type a message (e.g. Which pass do you have?)..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ borderRadius: '9999px', padding: '12px 18px', fontSize: '0.92rem' }}
          />
          <button
            type="submit"
            className="btn-festive-gold"
            style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
            disabled={!newMessage.trim() || sending}
          >
            <Send size={18} />
          </button>
        </form>

        {/* Report / Block Modal Overlay */}
        {isReporting && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(7, 3, 12, 0.92)',
              zIndex: 10,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {reportSuccess ? (
              <div style={{ textAlign: 'center', color: '#6ee7b7' }}>
                <Check size={48} style={{ margin: '0 auto 12px auto' }} />
                <h3>Report Submitted</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Thank you for keeping Find My Garba Partner safe.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8a80', marginBottom: '12px' }}>
                  <ShieldAlert size={24} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Report / Block User</h3>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for reporting</label>
                  <select
                    className="form-select"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  >
                    <option value="Inappropriate behavior in chat">Inappropriate behavior in chat</option>
                    <option value="Commercial pass seller / spam">Commercial pass seller / spam</option>
                    <option value="Fake profile details">Fake profile details</option>
                    <option value="Harassment or abusive language">Harassment or abusive language</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#ffffff', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={blockUserCheck}
                      onChange={(e) => setBlockUserCheck(e.target.checked)}
                      style={{ accentColor: '#d9381e' }}
                    />
                    <span>Block this user from sending me future messages</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsReporting(false)}
                    className="btn-outline-gold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#d9381e',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
