'use client';

import styles from '../dashboard/dashboard.module.css';

export default function RevenuePage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Revenue</h1>
          <p className={styles.pageSub}>Subscriptions, sales, and financial overview</p>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>💰 Monthly Revenue</span>
          <span className={styles.kpiValue}>₹48,250</span>
          <span className={styles.kpiDeltaUp}>+12.4% vs last month</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>⭐ Premium Subscribers</span>
          <span className={styles.kpiValue}>127</span>
          <span className={styles.kpiDeltaUp}>+8 this week</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📊 Conversion Rate</span>
          <span className={styles.kpiValue}>4.2%</span>
          <span className={styles.kpiDeltaUp}>+0.3%</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🔄 Refunds</span>
          <span className={styles.kpiValue}>2</span>
          <span className={styles.kpiDeltaUp}>Under control</span>
        </div>
      </div>

      <div className={styles.splitRow}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🏆 Top Plans</span>
          </div>
          <div className={styles.panelBody}>
            {[
              { plan: 'Pro Monthly', revenue: '₹24,500', subs: 89 },
              { plan: 'Pro Annual', revenue: '₹18,750', subs: 31 },
              { plan: 'Enterprise', revenue: '₹5,000', subs: 7 },
            ].map((p) => (
              <div key={p.plan} className={styles.statRow}>
                <span className={styles.statLabel}>{p.plan} ({p.subs} subs)</span>
                <span className={styles.statValue}>{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🌍 Revenue by Country</span>
          </div>
          <div className={styles.panelBody}>
            {[
              { country: '🇮🇳 India', revenue: '₹28,400' },
              { country: '🇺🇸 USA', revenue: '₹12,300' },
              { country: '🇦🇪 UAE', revenue: '₹4,800' },
              { country: '🇬🇧 UK', revenue: '₹2,750' },
            ].map((c) => (
              <div key={c.country} className={styles.statRow}>
                <span className={styles.statLabel}>{c.country}</span>
                <span className={styles.statValue}>{c.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
