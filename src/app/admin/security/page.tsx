'use client';

import styles from '../dashboard/dashboard.module.css';

export default function SecurityPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Security</h1>
          <p className={styles.pageSub}>Authentication monitoring and threat detection</p>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🔴 Failed Logins (24h)</span>
          <span className={styles.kpiValue}>23</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🚫 Blocked IPs</span>
          <span className={styles.kpiValue}>4</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>⚠️ Suspicious Accounts</span>
          <span className={styles.kpiValue}>12</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🔑 Password Resets (7d)</span>
          <span className={styles.kpiValue}>18</span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>🔒 Recent Security Events</span>
        </div>
        <div className={styles.panelBody}>
          {[
            { event: 'Failed login attempt', detail: 'user@test.com · 3 attempts', time: '5m ago', dot: 'Red' },
            { event: 'Password reset requested', detail: 'john@company.com', time: '15m ago', dot: 'Yellow' },
            { event: 'New device login', detail: 'sarah@example.com · iPhone 15 · India', time: '22m ago', dot: 'Blue' },
            { event: 'Suspicious activity flagged', detail: 'bot_account_42 · automated signup pattern', time: '1h ago', dot: 'Red' },
            { event: 'Admin login', detail: 'nibrasulhaqqamini@gmail.com · MacBook · Chrome', time: '2h ago', dot: 'Green' },
            { event: 'IP blocked', detail: '192.168.1.100 · brute force detected', time: '3h ago', dot: 'Red' },
          ].map((e, i) => (
            <div key={i} className={styles.feedItem}>
              <div className={styles[`feedDot${e.dot}` as keyof typeof styles] || styles.feedDot} />
              <div style={{ flex: 1 }}>
                <span className={styles.feedText}>
                  <span className={styles.feedTextHighlight}>{e.event}</span>
                </span>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500, marginTop: '0.1rem' }}>
                  {e.detail}
                </div>
              </div>
              <span className={styles.feedTime}>{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
