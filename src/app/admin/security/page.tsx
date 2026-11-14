'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './security.module.css';

interface SecurityMetrics {
  total24h: number;
  hmacViolations24h: number;
  csrfBlocks24h: number;
  replayBlocks24h: number;
  rateLimitBlocks24h: number;
  blockedIpsCount: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recentBreakdownByType: Record<string, number>;
}

interface SecurityEvent {
  id: string;
  eventType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  clientType: 'web' | 'mobile' | 'system';
  ipAddress: string;
  path: string;
  method: string;
  detail: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface BlockedIp {
  ipAddress: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
  expiresAt?: string | null;
}

export default function SecurityMonitorPage() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Filters
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Inspection
  const [inspectedEvent, setInspectedEvent] = useState<SecurityEvent | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockFormIp, setBlockFormIp] = useState('');
  const [blockFormReason, setBlockFormReason] = useState('');
  const [blockFormDuration, setBlockFormDuration] = useState('24');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all security telemetry
  const fetchTelemetry = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [metricsRes, eventsRes, blockedRes] = await Promise.all([
        fetch('/api/admin/security/metrics'),
        fetch(`/api/admin/security/events?severity=${severityFilter}&eventType=${typeFilter}&search=${encodeURIComponent(searchQuery)}&limit=100`),
        fetch('/api/admin/security/block-ip'),
      ]);

      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        setMetrics(mData.metrics);
      }
      if (eventsRes.ok) {
        const eData = await eventsRes.json();
        setEvents(eData.events || []);
      }
      if (blockedRes.ok) {
        const bData = await blockedRes.json();
        setBlockedIps(bData.blockedIps || []);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load security telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [severityFilter, typeFilter, searchQuery]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Auto-refresh interval (10 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTelemetry]);

  // Handle blocking an IP
  const handleBlockIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockFormIp.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/security/block-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: blockFormIp.trim(),
          reason: blockFormReason.trim() || 'Manual block via Security Monitor',
          durationHours: parseInt(blockFormDuration, 10),
        }),
      });

      if (res.ok) {
        setShowBlockModal(false);
        setBlockFormIp('');
        setBlockFormReason('');
        fetchTelemetry();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to block IP.');
      }
    } catch (err) {
      alert('Network error while blocking IP.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle unblocking an IP
  const handleUnblockIp = async (ip: string) => {
    if (!confirm(`Are you sure you want to unblock IP ${ip}?`)) return;
    try {
      const res = await fetch('/api/admin/security/block-ip', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      if (res.ok) {
        fetchTelemetry();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to unblock IP.');
      }
    } catch (err) {
      alert('Network error while unblocking IP.');
    }
  };

  // Trigger test attack event simulation
  const handleSimulateAttack = async () => {
    try {
      const sampleTypes = ['HMAC_MISMATCH', 'REPLAY_ATTACK', 'CSRF_VIOLATION', 'UNTRUSTED_ORIGIN'];
      const chosen = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
      await fetch('/api/admin/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: chosen,
          severity: chosen.includes('HMAC') || chosen.includes('REPLAY') ? 'CRITICAL' : 'HIGH',
          clientType: chosen.includes('HMAC') ? 'mobile' : 'web',
          ipAddress: `198.51.100.${Math.floor(Math.random() * 200 + 1)}`,
          path: '/api/cards/active',
          method: 'POST',
          detail: `Simulated ${chosen} attack detection verification event.`,
          metadata: { testId: Math.random().toString(36).substring(7) },
        }),
      });
      fetchTelemetry();
    } catch (err) {
      console.error('Failed to simulate test event:', err);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span>🛡️ Security & Threat Intelligence</span>
            <span className={styles.titleBadge}>
              <span className={styles.pulseDot} />
              Live Defense Active
            </span>
          </h1>
          <p className={styles.subtitle}>
            Real-time cryptographic audit telemetry, HMAC & CSRF attack containment, and active IP blocking.
          </p>
        </div>

        <div className={styles.controls}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`${styles.btn} ${autoRefresh ? styles.btnPrimary : ''}`}
            title="Toggle live 10-second polling"
          >
            {autoRefresh ? '🟢 Auto-Refresh ON' : '⚪ Auto-Refresh OFF'}
          </button>

          <button
            onClick={() => fetchTelemetry(true)}
            disabled={refreshing}
            className={styles.btn}
          >
            {refreshing ? '⏳ Syncing...' : '🔄 Refresh Now'}
          </button>

          <button
            onClick={() => {
              setBlockFormIp('');
              setBlockFormReason('');
              setShowBlockModal(true);
            }}
            className={`${styles.btn} ${styles.btnDanger}`}
          >
            🚫 Block Malicious IP
          </button>

          <button
            onClick={handleSimulateAttack}
            className={styles.btn}
            title="Inject an attack verification event to test live stream updates"
          >
            ⚡ Test Attack Trigger
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>
            <span>Total Threats Blocked (24h)</span>
            <span>🛡️</span>
          </div>
          <div className={styles.kpiValue}>
            {loading ? '...' : metrics?.total24h ?? 0}
          </div>
          <div className={styles.kpiSubtext}>
            {metrics?.severityBreakdown.critical ?? 0} Critical · {metrics?.severityBreakdown.high ?? 0} High
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>
            <span>Mobile HMAC Violations</span>
            <span>📱</span>
          </div>
          <div className={styles.kpiValue} style={{ color: '#f87171' }}>
            {loading ? '...' : metrics?.hmacViolations24h ?? 0}
          </div>
          <div className={styles.kpiSubtext}>Signature tampering & bad keys</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>
            <span>Web CSRF & Origin Blocks</span>
            <span>🌐</span>
          </div>
          <div className={styles.kpiValue} style={{ color: '#fb923c' }}>
            {loading ? '...' : metrics?.csrfBlocks24h ?? 0}
          </div>
          <div className={styles.kpiSubtext}>Cross-site forged mutations</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>
            <span>Replay Attacks Thwarted</span>
            <span>⏱️</span>
          </div>
          <div className={styles.kpiValue} style={{ color: '#38bdf8' }}>
            {loading ? '...' : metrics?.replayBlocks24h ?? 0}
          </div>
          <div className={styles.kpiSubtext}>Reused nonces & duplicate keys</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>
            <span>Contained IP Addresses</span>
            <span>🚫</span>
          </div>
          <div className={styles.kpiValue} style={{ color: '#a78bfa' }}>
            {loading ? '...' : metrics?.blockedIpsCount ?? blockedIps.length}
          </div>
          <div className={styles.kpiSubtext}>Immediate 403 block on arrival</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>
            <span>Rate-Limit Spikes</span>
            <span>⚡</span>
          </div>
          <div className={styles.kpiValue} style={{ color: '#fbbf24' }}>
            {loading ? '...' : metrics?.rateLimitBlocks24h ?? 0}
          </div>
          <div className={styles.kpiSubtext}>15 req / 60s window exceedances</div>
        </div>
      </div>

      {/* Security Health & Defense Matrix */}
      <div className={styles.matrixGrid}>
        <div className={styles.matrixCard}>
          <div>
            <div className={styles.matrixName}>HMAC-SHA256 Mobile Gateway</div>
            <div className={styles.matrixDesc}>Session Key Derivation & Sliding Nonce (5m)</div>
          </div>
          <span className={styles.statusPill}>ENFORCING</span>
        </div>

        <div className={styles.matrixCard}>
          <div>
            <div className={styles.matrixName}>Web Cryptographic CSRF Shield</div>
            <div className={styles.matrixDesc}>24h Signed Token & SameSite Lax Cookie</div>
          </div>
          <span className={styles.statusPill}>ENFORCING</span>
        </div>

        <div className={styles.matrixCard}>
          <div>
            <div className={styles.matrixName}>Anti-Replay & Idempotency Lock</div>
            <div className={styles.matrixDesc}>Atomic Lock & Sliding TTL Storage</div>
          </div>
          <span className={styles.statusPill}>ENFORCING</span>
        </div>

        <div className={styles.matrixCard}>
          <div>
            <div className={styles.matrixName}>Origin & Host Isolation</div>
            <div className={styles.matrixDesc}>Sec-Fetch-Site & Strict Whitelist Filter</div>
          </div>
          <span className={styles.statusPill}>ENFORCING</span>
        </div>
      </div>

      {/* Main Split Layout: Live Events Stream + Blocked IPs Table */}
      <div className={styles.layoutSplit}>
        {/* Left Column: Live Security Events */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <span>🚨 Live Threat Telemetry Stream</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>
                ({events.length} events logged)
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Last sync: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="Filter by IP, endpoint, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchBox}
            />

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={styles.selectBox}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">🔴 Critical Only</option>
              <option value="HIGH">🟠 High Only</option>
              <option value="MEDIUM">🟡 Medium Only</option>
              <option value="LOW">🔵 Low Only</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.selectBox}
            >
              <option value="ALL">All Event Types</option>
              <option value="HMAC_MISMATCH">HMAC Signature Mismatch</option>
              <option value="REPLAY_ATTACK">Replay Attack Detection</option>
              <option value="CSRF_VIOLATION">CSRF Token Failure</option>
              <option value="UNTRUSTED_ORIGIN">Untrusted Origin</option>
              <option value="RATE_LIMIT_EXCEEDED">Rate Limit Exceeded</option>
              <option value="INVALID_CONTENT_TYPE">Disallowed Content-Type</option>
            </select>
          </div>

          {/* Event Stream List */}
          <div className={styles.eventsList}>
            {events.length === 0 ? (
              <div className={styles.emptyState}>
                🛡️ No security incidents match your filter. System is operating normally.
              </div>
            ) : (
              events.map((ev) => (
                <div key={ev.id} className={styles.eventItem}>
                  {/* Severity Badge */}
                  <span
                    className={`${styles.severityTag} ${
                      ev.severity === 'CRITICAL'
                        ? styles.sevCritical
                        : ev.severity === 'HIGH'
                        ? styles.sevHigh
                        : ev.severity === 'MEDIUM'
                        ? styles.sevMedium
                        : styles.sevLow
                    }`}
                  >
                    {ev.severity}
                  </span>

                  <div className={styles.eventContent}>
                    <div className={styles.eventHeaderRow}>
                      <span className={styles.eventPath}>
                        {ev.method} {ev.path}
                      </span>
                      <span className={styles.eventClient}>
                        {ev.clientType === 'mobile' ? '📱 Mobile' : '🌐 Web'}
                      </span>
                      <span className={styles.eventIp}>{ev.ipAddress}</span>
                      <span className={styles.eventTime}>
                        {formatRelativeTime(ev.createdAt)}
                      </span>
                    </div>

                    <div className={styles.eventDetail}>{ev.detail}</div>

                    <div className={styles.eventActions}>
                      <button
                        onClick={() => setInspectedEvent(ev)}
                        className={styles.actionBtn}
                      >
                        🔍 Inspect Technical Payload
                      </button>

                      <button
                        onClick={() => {
                          setBlockFormIp(ev.ipAddress);
                          setBlockFormReason(`Automated block: Threat incident ${ev.eventType} on ${ev.path}`);
                          setShowBlockModal(true);
                        }}
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      >
                        🚫 Block IP ({ev.ipAddress})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Contained / Blocked IPs */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <span>🚫 Contained IP Addresses</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>
                ({blockedIps.length})
              </span>
            </div>
            <button
              onClick={() => {
                setBlockFormIp('');
                setBlockFormReason('');
                setShowBlockModal(true);
              }}
              className={`${styles.btn} ${styles.btnDanger}`}
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
            >
              + Add IP
            </button>
          </div>

          <div style={{ maxHeight: 650, overflowY: 'auto' }}>
            {blockedIps.length === 0 ? (
              <div className={styles.emptyState}>
                No IPs are currently blocked.
              </div>
            ) : (
              <table className={styles.blockedTable}>
                <thead>
                  <tr>
                    <th>IP Address</th>
                    <th>Reason / Source</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedIps.map((entry) => (
                    <tr key={entry.ipAddress}>
                      <td>
                        <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#f87171' }}>
                          {entry.ipAddress}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.15rem' }}>
                          By: {entry.blockedBy} · {formatRelativeTime(entry.blockedAt)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                          {entry.reason}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUnblockIp(entry.ipAddress)}
                          className={styles.actionBtn}
                          style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.1)' }}
                        >
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Technical Event Inspector */}
      {inspectedEvent && (
        <div className={styles.modalBackdrop} onClick={() => setInspectedEvent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                🔍 Technical Audit Payload
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className={styles.btn}
                style={{ padding: '0.2rem 0.5rem' }}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Event ID:</span>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#ffffff' }}>
                  {inspectedEvent.id}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Target Route:</span>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem', color: '#38bdf8' }}>
                  {inspectedEvent.method} {inspectedEvent.path}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Offender IP Address:</span>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem', color: '#f87171' }}>
                  {inspectedEvent.ipAddress}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Failure Detail:</span>
                <div style={{ fontSize: '0.82rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  {inspectedEvent.detail}
                </div>
              </div>

              {inspectedEvent.metadata && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Captured Metadata & Headers:</span>
                  <pre
                    style={{
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 8,
                      padding: '0.75rem',
                      fontSize: '0.75rem',
                      fontFamily: 'ui-monospace, monospace',
                      color: '#a78bfa',
                      overflowX: 'auto',
                      marginTop: '0.4rem',
                    }}
                  >
                    {JSON.stringify(inspectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => {
                  setBlockFormIp(inspectedEvent.ipAddress);
                  setBlockFormReason(`Blocked from inspected threat event ${inspectedEvent.eventType}`);
                  setShowBlockModal(true);
                  setInspectedEvent(null);
                }}
                className={`${styles.btn} ${styles.btnDanger}`}
              >
                🚫 Block This IP
              </button>
              <button onClick={() => setInspectedEvent(null)} className={styles.btn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Block IP Address Form */}
      {showBlockModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowBlockModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>🚫 Block IP Address</div>
              <button
                onClick={() => setShowBlockModal(false)}
                className={styles.btn}
                style={{ padding: '0.2rem 0.5rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBlockIp}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>IP Address to Contain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 185.220.101.4"
                    value={blockFormIp}
                    onChange={(e) => setBlockFormIp(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reason / Attack Classification</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Repeated HMAC forgery attempts"
                    value={blockFormReason}
                    onChange={(e) => setBlockFormReason(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Block Duration</label>
                  <select
                    value={blockFormDuration}
                    onChange={(e) => setBlockFormDuration(e.target.value)}
                    className={styles.selectBox}
                    style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                  >
                    <option value="1">1 Hour (Temporary Containment)</option>
                    <option value="24">24 Hours (Standard Quarantine)</option>
                    <option value="72">72 Hours (Aggressive Attacker)</option>
                    <option value="720">30 Days (Extended Block)</option>
                    <option value="0">Permanent (Indefinite Blacklist)</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className={styles.btn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`${styles.btn} ${styles.btnDanger}`}
                >
                  {actionLoading ? 'Containing...' : 'Enforce IP Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
