import React from 'react';
import { Eye, Unlink, UserX, Loader2, MessageSquare, Phone } from 'lucide-react';
import { generateAdminMatchWhatsAppLink, openWhatsApp } from '../utils/whatsapp';

export const AdminMatchTable = ({
  matches = [],
  loading = false,
  actionLoading = false,
  onInspectPair,
  onManualUnmatch,
}) => {
  const handleNotifyUser = (e, recipient, partner, city) => {
    e.stopPropagation();
    if (!recipient?.phone) {
      alert('Phone number not available for this user.');
      return;
    }
    const url = generateAdminMatchWhatsAppLink({
      recipientPhone: recipient.phone,
      recipientName: recipient.fullName,
      partnerName: partner?.fullName || 'your matched partner',
      city: city || recipient.city || 'Gujarat',
    });
    openWhatsApp(url);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
        <div>Loading match monitor records...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
        <UserX size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>No match records found matching current filters.</div>
        <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting city or status filters above.</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffd54f' }}>
            <th style={{ padding: '10px 12px' }}>User A</th>
            <th style={{ padding: '10px 12px' }}>User B / Partner</th>
            <th style={{ padding: '10px 12px' }}>City / Area</th>
            <th style={{ padding: '10px 12px' }}>Garba Style</th>
            <th style={{ padding: '10px 12px' }}>Common Nights</th>
            <th style={{ padding: '10px 12px' }}>Status / Score</th>
            <th style={{ padding: '10px 12px', textAlign: 'center' }}>One-Click WhatsApp Dispatch</th>
            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m, idx) => (
            <tr
              key={m.matchId || idx}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
              }}
            >
              {/* User A */}
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{m.userA?.fullName}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  +91 {m.userA?.phone} ({m.userA?.gender})
                </div>
                {m.userA?.socialProfile && (
                  <div style={{ fontSize: '0.7rem', color: '#ff9933' }}>{m.userA.socialProfile}</div>
                )}
              </td>

              {/* User B / Partner */}
              <td style={{ padding: '12px' }}>
                {m.userB ? (
                  <div>
                    <div style={{ fontWeight: 700, color: '#6ee7b7' }}>{m.userB.fullName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      +91 {m.userB.phone} ({m.userB.gender})
                    </div>
                    {m.userB?.socialProfile && (
                      <div style={{ fontSize: '0.7rem', color: '#ff9933' }}>{m.userB.socialProfile}</div>
                    )}
                  </div>
                ) : (
                  <span style={{ color: '#ffd54f', fontStyle: 'italic', fontSize: '0.78rem' }}>
                    ⏳ Awaiting Partner
                  </span>
                )}
              </td>

              {/* City / Area */}
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: 600 }}>{m.city}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.area}</div>
              </td>

              {/* Garba Style */}
              <td style={{ padding: '12px' }}>
                <span
                  style={{
                    background: 'rgba(230, 161, 0, 0.15)',
                    color: '#ffd54f',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  {m.overlappingStyle}
                </span>
              </td>

              {/* Common Nights */}
              <td style={{ padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '140px' }}>
                  {Array.isArray(m.commonNights) ? m.commonNights.slice(0, 2).join(', ') : m.commonNights}
                  {Array.isArray(m.commonNights) && m.commonNights.length > 2 && ` (+${m.commonNights.length - 2})`}
                </div>
              </td>

              {/* Compatibility Score / Status */}
              <td style={{ padding: '12px' }}>
                {m.status === 'Matched' ? (
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#6ee7b7',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {m.matchScore}
                  </span>
                ) : (
                  <span
                    style={{
                      background: 'rgba(255, 153, 51, 0.15)',
                      color: '#ffd54f',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                    }}
                  >
                    Pending Solo
                  </span>
                )}
              </td>

              {/* One-Click WhatsApp Direct Dispatch */}
              <td style={{ padding: '12px', textAlign: 'center' }}>
                {m.status === 'Matched' && m.userA && m.userB ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <button
                      onClick={(e) => handleNotifyUser(e, m.userA, m.userB, m.city)}
                      title={`Notify ${m.userA?.fullName} on WhatsApp`}
                      style={{
                        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.25))',
                        border: '1px solid #25D366',
                        color: '#25D366',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        width: '120px',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#25D366';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.25))';
                        e.currentTarget.style.color = '#25D366';
                      }}
                    >
                      <span>💬 Notify Partner A</span>
                    </button>

                    <button
                      onClick={(e) => handleNotifyUser(e, m.userB, m.userA, m.city)}
                      title={`Notify ${m.userB?.fullName} on WhatsApp`}
                      style={{
                        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.25))',
                        border: '1px solid #25D366',
                        color: '#25D366',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        width: '120px',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#25D366';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.25))';
                        e.currentTarget.style.color = '#25D366';
                      }}
                    >
                      <span>💬 Notify Partner B</span>
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                )}
              </td>

              {/* Actions: Inspect & Unmatch */}
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => onInspectPair(m)}
                    title="Inspect Pair Details"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Eye size={13} />
                    <span>Inspect</span>
                  </button>

                  {m.status === 'Matched' && onManualUnmatch && (
                    <button
                      onClick={() =>
                        onManualUnmatch(m.userA?._id, m.userB?._id, `${m.userA?.fullName} & ${m.userB?.fullName}`)
                      }
                      title="Break Match (Reset to Pending)"
                      style={{
                        background: 'rgba(217, 56, 30, 0.15)',
                        border: '1px solid #d9381e',
                        color: '#ff8a80',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      disabled={actionLoading}
                    >
                      <Unlink size={13} />
                      <span>Unmatch</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMatchTable;
