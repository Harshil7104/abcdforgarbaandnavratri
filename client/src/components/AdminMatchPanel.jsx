import React, { useState, useEffect } from 'react';
import { X, Play, Users, RefreshCw, Database, Sparkles, CheckCircle2, AlertCircle, Bell, ShieldAlert, Ban, Unlock, Search, Filter, Loader2, BarChart3, MessageSquareText, TrendingUp, Compass } from 'lucide-react';
import { api } from '../services/api';

export const AdminMatchPanel = ({ isOpen, onClose, onMatchingExecuted }) => {
  const [stats, setStats] = useState(null);
  const [matchingMode, setMatchingMode] = useState('hybrid'); // 'hybrid' | 'pairs' | 'groups'
  const [notificationLogs, setNotificationLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('runner'); // 'runner' | 'analytics' | 'users' | 'feedback' | 'reports' | 'notifications'
  const [feedback, setFeedback] = useState(null);

  // User Filter State
  const [userFilters, setUserFilters] = useState({
    city: 'All',
    matchStatus: 'All',
    search: '',
  });

  const loadDataForTab = async (tab) => {
    setLoading(true);
    setFeedback(null);
    try {
      if (tab === 'runner') {
        const statsRes = await api.getAdminStats();
        if (statsRes.success) setStats(statsRes.data);
      } else if (tab === 'analytics') {
        const analyticsRes = await api.getAdminAnalytics();
        if (analyticsRes.success) setAnalyticsData(analyticsRes.data);
      } else if (tab === 'feedback') {
        const fbRes = await api.getAdminFeedback();
        if (fbRes.success) setFeedbacksList(fbRes.data || []);
      } else if (tab === 'users') {
        const usersRes = await api.getAdminUsers(userFilters);
        if (usersRes.success) setUsersList(usersRes.data || []);
      } else if (tab === 'reports') {
        const repRes = await api.getAdminReports();
        if (repRes.success) setReportsList(repRes.data || []);
      } else if (tab === 'notifications') {
        const notifRes = await api.getNotificationLogs();
        if (notifRes.success) setNotificationLogs(notifRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDataForTab(activeTab);
    }
  }, [isOpen, activeTab]);

  const handleFilterChange = (key, value) => {
    const updated = { ...userFilters, [key]: value };
    setUserFilters(updated);
    api.getAdminUsers(updated).then((res) => {
      if (res.success) setUsersList(res.data || []);
    });
  };

  const handleBlockUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to BLOCK ${userName}? This will remove them from all match pools.`)) return;
    setActionLoading(true);
    try {
      const res = await api.blockAdminUser({ userId, reason: 'Moderator action' });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadDataForTab(activeTab);
        if (onMatchingExecuted) onMatchingExecuted();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockUser = async (userId) => {
    setActionLoading(true);
    try {
      const res = await api.unblockAdminUser(userId);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadDataForTab(activeTab);
        if (onMatchingExecuted) onMatchingExecuted();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunMatching = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.runBatchMatch(matchingMode);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message || 'Batch matching successfully executed!',
        });
        loadDataForTab('runner');
        if (onMatchingExecuted) onMatchingExecuted();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to execute matching.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.seedDemoPartners();
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message || 'Demo profiles seeded!',
        });
        loadDataForTab('runner');
        if (onMatchingExecuted) onMatchingExecuted();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to seed demo data.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all users back to Pending match status?')) return;
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.resetMatching();
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'All users reset to Pending status.',
        });
        loadDataForTab('runner');
        if (onMatchingExecuted) onMatchingExecuted();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to reset matching.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '720px',
          padding: '28px 24px',
          border: '1.5px solid var(--accent-gold)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
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

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e6a100, #d9381e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🛡️
          </div>
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
              Admin Moderation & Matching Engine
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Security, Content Moderation & Pre-Navratri Matching 2026
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          {[
            { key: 'runner', label: 'Matching Runner', icon: <Play size={14} /> },
            { key: 'analytics', label: 'Growth Analytics', icon: <BarChart3 size={14} /> },
            { key: 'users', label: `Users (${usersList.length || 'All'})`, icon: <Users size={14} /> },
            { key: 'feedback', label: `Feedback (${feedbacksList.length})`, icon: <MessageSquareText size={14} /> },
            { key: 'reports', label: `Safety Reports (${stats?.reportedUsersCount || reportsList.length})`, icon: <ShieldAlert size={14} /> },
            { key: 'notifications', label: 'Broadcast Logs', icon: <Bell size={14} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? 'rgba(230, 161, 0, 0.25)' : 'transparent',
                border: activeTab === tab.key ? '1px solid var(--accent-gold)' : '1px solid transparent',
                color: activeTab === tab.key ? '#ffd54f' : 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={feedback.type === 'success' ? 'alert-success' : 'alert-error'} style={{ padding: '10px 14px', marginBottom: '16px' }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontSize: '0.88rem' }}>{feedback.message}</span>
          </div>
        )}

        {/* TAB 1: MATCHING RUNNER */}
        {activeTab === 'runner' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(13, 7, 20, 0.7)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TOTAL USERS</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{stats?.totalUsers ?? '...'}</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>MATCHED</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6ee7b7' }}>{stats?.matchedCount ?? '...'}</div>
              </div>

              <div style={{ background: 'rgba(255, 153, 51, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255, 153, 51, 0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: '#ffd54f' }}>PENDING</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffd54f' }}>{stats?.pendingCount ?? '...'}</div>
              </div>

              <div style={{ background: 'rgba(217, 56, 30, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(217, 56, 30, 0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: '#ff8a80' }}>BLOCKED</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ff8a80' }}>{stats?.blockedCount ?? '0'}</div>
              </div>
            </div>

            {/* Formation Mode */}
            <div style={{ background: 'rgba(13, 7, 20, 0.6)', padding: '14px', borderRadius: '12px', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Matching Formation Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { value: 'hybrid', label: 'Hybrid Auto', desc: 'Smart pairs & groups' },
                  { value: 'pairs', label: 'Pairs Only (2)', desc: '1-on-1 dancer pairs' },
                  { value: 'groups', label: 'Micro-Groups (3-4)', desc: 'Garba circles' },
                ].map((mode) => (
                  <div
                    key={mode.value}
                    onClick={() => setMatchingMode(mode.value)}
                    className={`night-chip ${matchingMode === mode.value ? 'selected' : ''}`}
                    style={{ padding: '8px 6px', fontSize: '0.82rem', textAlign: 'center' }}
                  >
                    <div style={{ fontWeight: 700 }}>{mode.label}</div>
                    <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>{mode.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleRunMatching}
                className="btn-festive-gold glow-pulse"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                <span>Execute Batch Matching & WhatsApp Dispatch</span>
              </button>

              <button
                onClick={handleSeedDemo}
                className="btn-outline-gold"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={actionLoading}
              >
                <Database size={16} />
                <span>Seed Authentic Demo Gujarat Profiles</span>
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-muted)',
                  borderRadius: '9999px',
                  padding: '10px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                disabled={actionLoading}
              >
                <RefreshCw size={14} />
                <span>Reset Matching Status (Dev Only)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GROWTH ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            {loading || !analyticsData ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
                <div>Loading funnel & growth metrics...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Summary Key Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ background: 'rgba(13, 7, 20, 0.7)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PAGE VIEWS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd54f' }}>{analyticsData.summary?.pageViews || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>REGISTERED</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6ee7b7' }}>{analyticsData.summary?.totalRegistrations || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(230, 161, 0, 0.15)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(230, 161, 0, 0.3)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#ffd54f' }}>CONVERSION</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd54f' }}>{analyticsData.funnel?.step1To3ConversionRate || '0%'}</div>
                  </div>
                  <div style={{ background: 'rgba(217, 56, 30, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(217, 56, 30, 0.3)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#ff8a80' }}>UPI CLICKS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff8a80' }}>{analyticsData.summary?.upiQrClicks || 0}</div>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div style={{ background: 'rgba(13, 7, 20, 0.75)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#ffffff', fontSize: '0.88rem', marginBottom: '10px' }}>
                    <TrendingUp size={16} color="#ffd54f" />
                    <span>3-Step Registration Funnel</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { label: 'Step 1 (Basic Details)', count: analyticsData.funnel?.step1Starts || 0, color: '#ffd54f' },
                      { label: 'Step 2 (Garba Preferences)', count: analyticsData.funnel?.step2Reaches || 0, color: '#ff9933' },
                      { label: 'Step 3 (Nights & Security)', count: analyticsData.funnel?.step3Completions || 0, color: '#10b981' },
                    ].map((step, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{step.label}</span>
                          <strong style={{ color: step.color }}>{step.count} users</strong>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.max(5, ((step.count) / Math.max(1, analyticsData.funnel?.step1Starts || 1)) * 100))}%`,
                              height: '100%',
                              background: step.color,
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* City Breakdown & Solo vs Group */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* City Breakdown */}
                  <div style={{ background: 'rgba(13, 7, 20, 0.75)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.88rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Compass size={16} color="#ffd54f" />
                      <span>City Distribution</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(analyticsData.cityDistribution || []).map((c) => (
                        <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{c._id || 'Other'}</span>
                          <strong style={{ color: '#ffd54f' }}>{c.count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solo vs Group Ratio */}
                  <div style={{ background: 'rgba(13, 7, 20, 0.75)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.88rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={16} color="#ffd54f" />
                      <span>Solo vs Group</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Solo Dancers</span>
                        <strong style={{ color: '#6ee7b7' }}>{analyticsData.groupBreakdown?.soloCount || 0}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Group Entries</span>
                        <strong style={{ color: '#ffd54f' }}>{analyticsData.groupBreakdown?.groupCount || 0}</strong>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                        Solo Ratio: {analyticsData.groupBreakdown?.soloRatio || '0%'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER MODERATION */}
        {activeTab === 'users' && (
          <div>
            {/* Filter Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search name, phone, area..."
                  className="form-input"
                  value={userFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '0.85rem', padding: '8px 12px 8px 34px' }}
                />
              </div>

              <select
                className="form-select"
                value={userFilters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                style={{ fontSize: '0.82rem', padding: '8px 10px' }}
              >
                <option value="All">All Cities</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Rajkot">Rajkot</option>
              </select>

              <select
                className="form-select"
                value={userFilters.matchStatus}
                onChange={(e) => handleFilterChange('matchStatus', e.target.value)}
                style={{ fontSize: '0.82rem', padding: '8px 10px' }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Matched">Matched</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            {/* Users Table / List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
                <div>Loading users...</div>
              </div>
            ) : usersList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No users found matching filters.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {usersList.map((u) => (
                  <div
                    key={u._id}
                    style={{
                      background: u.matchStatus === 'Blocked' ? 'rgba(217,56,30,0.1)' : 'rgba(13, 7, 20, 0.75)',
                      border: u.matchStatus === 'Blocked' ? '1px solid #d9381e' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.92rem' }}>{u.fullName}</span>
                        <span style={{ fontSize: '0.75rem', color: '#ffd54f' }}>+91 {u.phone}</span>
                        {u.flagCount > 0 && (
                          <span style={{ background: '#d9381e', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                            🚩 {u.flagCount} Reports
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {u.city} {u.area ? `(${u.area})` : ''} • {u.garbaStyle} • Status: <strong>{u.matchStatus}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {u.matchStatus === 'Blocked' ? (
                        <button
                          onClick={() => handleUnblockUser(u._id)}
                          style={{
                            background: 'rgba(16,185,129,0.2)',
                            border: '1px solid #10b981',
                            color: '#6ee7b7',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Unlock size={12} />
                          <span>Unblock</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(u._id, u.fullName)}
                          style={{
                            background: 'rgba(217,56,30,0.2)',
                            border: '1px solid #d9381e',
                            color: '#ff8a80',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Ban size={12} />
                          <span>Block</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USER FEEDBACK INBOX */}
        {activeTab === 'feedback' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Feedback & suggestions submitted by Garba participants:
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>Loading feedbacks...</div>
            ) : feedbacksList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No feedback received yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                {feedbacksList.map((fb) => (
                  <div
                    key={fb._id}
                    style={{
                      background: 'rgba(13, 7, 20, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span
                        style={{
                          background: 'rgba(230, 161, 0, 0.2)',
                          color: '#ffd54f',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {fb.category}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '6px' }}>
                      "{fb.message}"
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                      User Phone: {fb.userPhone || 'Anonymous'} {fb.city ? `• ${fb.city}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SAFETY REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Flagged users & chat moderation reports submitted by community members:
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>Loading reports...</div>
            ) : reportsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6ee7b7' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto' }} />
                <div>No safety flags or user reports submitted! Community is clean.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                {reportsList.map((repUser) => (
                  <div
                    key={repUser._id}
                    style={{
                      background: 'rgba(217, 56, 30, 0.12)',
                      border: '1px solid rgba(217, 56, 30, 0.4)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ color: '#ffffff' }}>{repUser.fullName}</strong> (+91 {repUser.phone})
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{repUser.city} • Status: {repUser.matchStatus}</div>
                      </div>

                      {repUser.matchStatus !== 'Blocked' && (
                        <button
                          onClick={() => handleBlockUser(repUser._id, repUser.fullName)}
                          style={{
                            background: '#d9381e',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Block User
                        </button>
                      )}
                    </div>

                    <div style={{ background: 'rgba(13, 7, 20, 0.6)', padding: '8px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ color: '#ff8a80', fontWeight: 700, marginBottom: '4px' }}>
                        Report History ({repUser.reports?.length || 0} incidents):
                      </div>
                      {repUser.reports?.map((r, idx) => (
                        <div key={idx} style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                          • <strong>Reason:</strong> "{r.reason}" — <em>Reported by: {r.reportedBy?.fullName || 'User'} on {new Date(r.createdAt).toLocaleDateString()}</em>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Showing latest automated match notification dispatches & delivery logs:
            </div>

            {notificationLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                No notification logs recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                {notificationLogs.map((log) => (
                  <div
                    key={log._id}
                    style={{
                      background: 'rgba(13, 7, 20, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div>
                        <strong>+91 {log.recipientPhone}</strong> ({log.recipientName})
                      </div>
                      <span
                        style={{
                          background: log.status === 'Delivered' ? 'rgba(16,185,129,0.2)' : 'rgba(255,153,51,0.2)',
                          color: log.status === 'Delivered' ? '#6ee7b7' : '#ffd54f',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: '6px' }}>
                      "{log.message.slice(0, 100)}..."
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
                      Channel: {log.channel} • {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
