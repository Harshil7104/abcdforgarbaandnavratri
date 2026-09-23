import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  MapPin,
  Search,
  Filter,
  Download,
  Play,
  Eye,
  Unlink,
  Link as LinkIcon,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Calendar,
  Instagram,
  Phone,
  Shield,
  Loader2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { GUJARAT_CITIES } from '../data/gujaratLocations';

export const AdminDashboard = ({ currentUser, onBackToSite, onLogout }) => {
  // State
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    city: 'All',
    gender: 'All',
    status: 'All',
    search: '',
  });

  // Modals
  const [inspectedPair, setInspectedPair] = useState(null);
  const [isManualPairOpen, setIsManualPairOpen] = useState(false);
  const [manualUserA, setManualUserA] = useState('');
  const [manualUserB, setManualUserB] = useState('');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [matchingMode, setMatchingMode] = useState('hybrid');
  const [matchingLog, setMatchingLog] = useState(null);

  // Fetch KPI Stats & Matches
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, matchesRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getMatchesOverview(filters),
        api.getAdminUsers({ matchStatus: 'Pending', limit: 100 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (matchesRes.success) setMatches(matchesRes.data || []);
      if (usersRes.success) setPendingUsers(usersRes.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to fetch dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.city, filters.gender, filters.status]);

  // Search debounce / submit
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, search: val }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Manual Unmatch
  const handleManualUnmatch = async (userAId, userBId, matchName) => {
    if (!window.confirm(`Break active match for ${matchName}? Both users will be returned to the Pending match pool.`)) return;

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.manualUnmatch({ userAId, userBId });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Match successfully broken.' });
        if (inspectedPair) setInspectedPair(null);
        fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to unmatch.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Manual Pair
  const handleManualPairSubmit = async (e) => {
    e.preventDefault();
    if (!manualUserA || !manualUserB) {
      alert('Please select two users to pair.');
      return;
    }
    if (manualUserA === manualUserB) {
      alert('Cannot pair a user with themselves.');
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.manualMatch({ userAId: manualUserA, userBId: manualUserB });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setIsManualPairOpen(false);
        setManualUserA('');
        setManualUserB('');
        fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to manually pair users.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger Matching Engine
  const handleRunAlgorithm = async () => {
    setActionLoading(true);
    setFeedback(null);
    setMatchingLog(null);
    try {
      const res = await api.runBatchMatch(matchingMode);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Matching engine executed successfully!' });
        setMatchingLog(res.summary || res.data || res.message);
        fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to run matching engine.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      await api.exportMatchesCsv();
      setFeedback({ type: 'success', message: 'CSV export downloaded successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to download CSV export.' });
    }
  };

  // Top Active City calculation
  const topCity = stats?.cityBreakdown?.[0] ? `${stats.cityBreakdown[0]._id} (${stats.cityBreakdown[0].count})` : 'Vadodara';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 60px 16px', color: '#ffffff' }}>
      {/* Top Header & Navigation Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e6a100, #d9381e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(230, 161, 0, 0.4)',
            }}
          >
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <h1 className="font-heading" style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0 }}>
              Admin Match Control Panel
            </h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Real-Time Match Monitoring, Manual Overrides & Algorithmic Dispatch
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchData}
            className="btn-outline-gold"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} />
            <span>Export Matches (CSV)</span>
          </button>

          <button
            onClick={onBackToSite}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to User View</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={feedback.type === 'success' ? 'alert-success' : 'alert-error'}
          style={{ marginBottom: '20px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* 1. KPI METRIC HEADER CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Total Users */}
        <div className="glass-panel" style={{ padding: '18px 20px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Registered
            </span>
            <Users size={18} color="#ffd54f" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {stats?.totalUsers ?? '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ffd54f', marginTop: '4px' }}>
            Across Gujarat Garba Enthusiasts
          </div>
        </div>

        {/* Card 2: Matched Pairs */}
        <div className="glass-panel" style={{ padding: '18px 20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
              Matched Dancers
            </span>
            <UserCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6ee7b7' }}>
            {stats?.matchedCount ?? '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
            {stats?.matchedCount ? `${Math.floor(stats.matchedCount / 2)} Active Pairs & Groups` : 'No matches yet'}
          </div>
        </div>

        {/* Card 3: Pending Users */}
        <div className="glass-panel" style={{ padding: '18px 20px', border: '1px solid rgba(255, 153, 51, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffd54f', textTransform: 'uppercase' }}>
              Pending Unmatched
            </span>
            <UserX size={18} color="#ff9933" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffd54f' }}>
            {stats?.pendingCount ?? '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
            Awaiting Next Batch Run
          </div>
        </div>

        {/* Card 4: Top Active City */}
        <div className="glass-panel" style={{ padding: '18px 20px', border: '1px solid rgba(217, 56, 30, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ff8a80', textTransform: 'uppercase' }}>
              Top Active City
            </span>
            <MapPin size={18} color="#d9381e" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {topCity}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
            Highest Density Garba Hub
          </div>
        </div>
      </div>

      {/* 2. MATCH ENGINE CONTROL & BATCH RUNNER STRIP */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          marginBottom: '24px',
          border: '1px solid var(--accent-gold)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(230, 161, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} color="#ffd54f" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Batch Matching Engine Trigger</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Automatically groups and pairs pending Garba enthusiasts based on City, Style & Nights
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            value={matchingMode}
            onChange={(e) => setMatchingMode(e.target.value)}
            style={{ fontSize: '0.82rem', padding: '8px 12px', minWidth: '150px' }}
          >
            <option value="hybrid">Mode: Hybrid Auto</option>
            <option value="pairs">Mode: 1-on-1 Pairs Only</option>
            <option value="groups">Mode: Micro-Groups (3-4)</option>
          </select>

          <button
            onClick={handleRunAlgorithm}
            className="btn-festive-gold glow-pulse"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            <span>Execute Batch Run</span>
          </button>

          <button
            onClick={() => setIsManualPairOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '9px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LinkIcon size={14} color="#ffd54f" />
            <span>Manual Pair Override</span>
          </button>
        </div>
      </div>

      {/* Execution Log summary if available */}
      {matchingLog && (
        <div
          style={{
            background: 'rgba(13, 7, 20, 0.85)',
            border: '1px solid var(--accent-gold)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            fontFamily: 'monospace',
            color: '#6ee7b7',
          }}
        >
          <strong>⚡ Execution Summary:</strong> {typeof matchingLog === 'string' ? matchingLog : JSON.stringify(matchingLog)}
        </div>
      )}

      {/* 3. CITY-WISE MATCH MONITOR TABLE & FILTER BAR */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Live Match Monitoring Matrix
            </h3>
            <span
              style={{
                background: 'rgba(230, 161, 0, 0.2)',
                color: '#ffd54f',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {matches.length} Records
            </span>
          </div>

          {/* Filter Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {/* Search */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search name, phone..."
                value={filters.search}
                onChange={handleSearchChange}
                className="form-input"
                style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem', width: '180px' }}
              />
            </form>

            {/* City Dropdown */}
            <select
              className="form-select"
              value={filters.city}
              onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
              style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '130px' }}
            >
              <option value="All">All Gujarat Cities</option>
              {GUJARAT_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Gender Dropdown */}
            <select
              className="form-select"
              value={filters.gender}
              onChange={(e) => setFilters((p) => ({ ...p, gender: e.target.value }))}
              style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '110px' }}
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Group">Group</option>
            </select>

            {/* Status Dropdown */}
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
              style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '110px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Matched">Matched</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <div>Loading match monitor records...</div>
          </div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
            <UserX size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>No match records found matching current filters.</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting city or status filters above.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffd54f' }}>
                  <th style={{ padding: '10px 12px' }}>User A</th>
                  <th style={{ padding: '10px 12px' }}>User B / Partner</th>
                  <th style={{ padding: '10px 12px' }}>City / Area</th>
                  <th style={{ padding: '10px 12px' }}>Garba Style</th>
                  <th style={{ padding: '10px 12px' }}>Common Nights</th>
                  <th style={{ padding: '10px 12px' }}>Compatibility</th>
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
                          {m.userB.socialProfile && (
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                        </div>
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

                    {/* Actions */}
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {/* Inspect Pair */}
                        <button
                          onClick={() => setInspectedPair(m)}
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

                        {/* Unmatch Action if Matched */}
                        {m.status === 'Matched' && (
                          <button
                            onClick={() =>
                              handleManualUnmatch(m.userA?._id, m.userB?._id, `${m.userA?.fullName} & ${m.userB?.fullName}`)
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
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL: INSPECT PAIR FULL PROFILE DETAILS               */}
      {/* ========================================================= */}
      {inspectedPair && (
        <div className="modal-overlay" onClick={() => setInspectedPair(null)}>
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '760px',
              padding: '28px',
              border: '1.5px solid var(--accent-gold)',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectedPair(null)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #e6a100, #d9381e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                🔍
              </div>
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  Match Inspector & Profile Verification
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Match ID: {inspectedPair.matchId} • City: {inspectedPair.city}
                </div>
              </div>
            </div>

            {/* Side-by-Side User Comparisons */}
            <div style={{ display: 'grid', gridTemplateColumns: inspectedPair.userB ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '24px' }}>
              {/* User A Card */}
              <div
                style={{
                  background: 'rgba(13, 7, 20, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💃</span>
                  <div>
                    <div style={{ fontWeight: 800, color: '#ffd54f', fontSize: '1.05rem' }}>
                      {inspectedPair.userA?.fullName}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      User A ({inspectedPair.userA?.gender})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#ffd54f" />
                    <strong>Phone:</strong> +91 {inspectedPair.userA?.phone} (Unmasked)
                  </div>

                  {inspectedPair.userA?.socialProfile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Instagram size={14} color="#ff8a80" />
                      <strong>Instagram:</strong> {inspectedPair.userA.socialProfile}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#ffd54f" />
                    <strong>Location:</strong> {inspectedPair.userA?.city} {inspectedPair.userA?.area ? `(${inspectedPair.userA.area})` : ''}
                  </div>

                  <div>
                    <strong>Garba Style:</strong> {inspectedPair.userA?.garbaStyle}
                  </div>

                  <div>
                    <strong>Group Preference:</strong> {inspectedPair.userA?.groupSize || 'Solo'}
                  </div>

                  <div>
                    <strong>Available Nights:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {(inspectedPair.userA?.nightAvailability || []).map((n) => (
                        <span key={n} style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* User B Card (if matched) */}
              {inspectedPair.userB && (
                <div
                  style={{
                    background: 'rgba(13, 7, 20, 0.7)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🕺</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#6ee7b7', fontSize: '1.05rem' }}>
                        {inspectedPair.userB.fullName}
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        User B ({inspectedPair.userB.gender})
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#6ee7b7" />
                      <strong>Phone:</strong> +91 {inspectedPair.userB.phone} (Unmasked)
                    </div>

                    {inspectedPair.userB.socialProfile && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Instagram size={14} color="#ff8a80" />
                        <strong>Instagram:</strong> {inspectedPair.userB.socialProfile}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#6ee7b7" />
                      <strong>Location:</strong> {inspectedPair.userB.city} {inspectedPair.userB.area ? `(${inspectedPair.userB.area})` : ''}
                    </div>

                    <div>
                      <strong>Garba Style:</strong> {inspectedPair.userB.garbaStyle}
                    </div>

                    <div>
                      <strong>Group Preference:</strong> {inspectedPair.userB.groupSize || 'Solo'}
                    </div>

                    <div>
                      <strong>Available Nights:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {(inspectedPair.userB.nightAvailability || []).map((n) => (
                          <span key={n} style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compatibility Summary Box */}
            <div
              style={{
                background: 'rgba(230, 161, 0, 0.08)',
                border: '1px solid rgba(230, 161, 0, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Match Compatibility Score</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd54f' }}>
                  {inspectedPair.matchScore} Overlap
                </div>
              </div>

              {inspectedPair.status === 'Matched' && (
                <button
                  onClick={() =>
                    handleManualUnmatch(
                      inspectedPair.userA?._id,
                      inspectedPair.userB?._id,
                      `${inspectedPair.userA?.fullName} & ${inspectedPair.userB?.fullName}`
                    )
                  }
                  className="btn-danger"
                  style={{
                    background: '#d9381e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  disabled={actionLoading}
                >
                  <Unlink size={14} />
                  <span>Break This Match</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: MANUAL PAIRING OF TWO PENDING USERS             */}
      {/* ========================================================= */}
      {isManualPairOpen && (
        <div className="modal-overlay" onClick={() => setIsManualPairOpen(false)}>
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '28px',
              border: '1.5px solid var(--accent-gold)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsManualPairOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <LinkIcon size={22} color="#ffd54f" />
              <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                Manual Match Override
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Select any two pending Garba enthusiasts to manually create a confirmed match pairing:
            </p>

            <form onSubmit={handleManualPairSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Select User 1 (Pending)</label>
                <select
                  className="form-select"
                  value={manualUserA}
                  onChange={(e) => setManualUserA(e.target.value)}
                  required
                >
                  <option value="">-- Choose User 1 --</option>
                  {pendingUsers.map((u) => (
                    <option key={u._id} value={u._id} disabled={u._id === manualUserB}>
                      {u.fullName} (+91 {u.phone}) — {u.city} • {u.garbaStyle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Select User 2 (Pending)</label>
                <select
                  className="form-select"
                  value={manualUserB}
                  onChange={(e) => setManualUserB(e.target.value)}
                  required
                >
                  <option value="">-- Choose User 2 --</option>
                  {pendingUsers.map((u) => (
                    <option key={u._id} value={u._id} disabled={u._id === manualUserA}>
                      {u.fullName} (+91 {u.phone}) — {u.city} • {u.garbaStyle}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-festive-gold glow-pulse"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '10px' }}
                disabled={actionLoading || !manualUserA || !manualUserB}
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <LinkIcon size={16} />}
                <span>Confirm Manual Pair</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
