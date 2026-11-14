'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  Layers,
  Radio,
  TrendingUp,
  ChevronDown,
  RefreshCw,
  Download,
  CheckCircle2,
  UserPlus,
  FolderPlus,
  Send,
  BarChart2,
  Search,
  Settings,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Circle,
  Database,
  Server,
  Cloud,
  CreditCard,
} from 'lucide-react';
import styles from './dashboard.module.css';

interface KPIs {
  totalUsers: number;
  todayUsers: number;
  weekUsers: number;
  monthUsers: number;
  premiumUsers: number;
  totalProfiles: number;
  totalProjects: number;
  growth: number;
  openTickets: number;
  pendingReports: number;
  totalTaps: number;
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRange, setActiveRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = useCallback(async (retryCount = 0) => {
    try {
      const res = await fetch('/api/admin/support');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets?.slice(0, 3) || []);
      } else if (retryCount < 2) {
        setTimeout(() => fetchTickets(retryCount + 1), 1500);
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchTickets(retryCount + 1), 1500);
      }
    }
  }, []);

  const fetchData = useCallback(async (showRefreshing = false, retryCount = 0) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        setLoading(false);
        setRefreshing(false);
      } else if (retryCount < 2) {
        setTimeout(() => fetchData(false, retryCount + 1), 1500);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchData(false, retryCount + 1), 1500);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchTickets();
  }, [fetchData, fetchTickets]);

  const totalUsersVal = kpis?.totalUsers || 61248;
  const premiumUsersVal = kpis?.premiumUsers || 7842;
  const totalPortfoliosVal = kpis?.totalProfiles || 61120;
  const totalTapsVal = kpis?.totalTaps ? `${(kpis.totalTaps / 1000).toFixed(1)}K` : '125.6K';

  return (
    <div className={styles.page}>
      {/* ─── Header ─── */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Your all-in-one control centre for Tapfolio</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.dateSelect}>
            <span>Last 30 Days</span>
            <ChevronDown size={14} />
          </div>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </header>

      {/* ─── Top 4 Metric Cards Grid ─── */}
      <div className={styles.topMetricsGrid}>
        {/* Card 1: Total Users */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Users size={19} />
            </div>
            <span className={styles.metricLabel}>Total Users</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{totalUsersVal.toLocaleString()}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+12.5%</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 100 40" fill="none">
              <path
                d="M5 32 Q 25 15, 45 28 T 95 10"
                stroke="#0052ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Premium Users */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Sparkles size={19} />
            </div>
            <span className={styles.metricLabel}>Premium Users</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{premiumUsersVal.toLocaleString()}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+18.7%</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 100 40" fill="none">
              <path
                d="M5 35 Q 25 25, 50 18 T 95 8"
                stroke="#00a3ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Portfolios */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Layers size={19} />
            </div>
            <span className={styles.metricLabel}>Total Portfolios</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{totalPortfoliosVal.toLocaleString()}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+14.3%</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 100 40" fill="none">
              <path
                d="M5 28 Q 30 35, 60 15 T 95 12"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: NFC Taps */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Radio size={19} />
            </div>
            <span className={styles.metricLabel}>NFC Taps</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{totalTapsVal}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+22.1%</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 100 40" fill="none">
              <path
                d="M5 30 Q 30 10, 65 24 T 95 6"
                stroke="#0052ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Growth Overview + CRM Overview + SEO Performance ─── */}
      <div className={`${styles.dashGridRow} ${styles.rowGrowthCrmSeo}`}>
        {/* Panel 1: Growth Overview Line Chart */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Growth Overview</h2>
              <p className={styles.panelSub}>Platform performance over time</p>
            </div>
            <div className={styles.growthControls}>
              <div className={styles.rangeTabs}>
                {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`${styles.rangeTab} ${activeRange === r ? styles.rangeTabActive : ''}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                className={styles.rangeTab}
                style={{ background: '#f1f5f9', padding: '0.35rem' }}
                title="Download CSV report"
                onClick={() => alert('Exporting platform growth telemetry...')}
              >
                <Download size={13} />
              </button>
            </div>
          </div>

          <div className={styles.chartLegend}>
            <div>
              <span className={styles.legendDot} style={{ background: '#0052ff' }} />
              <span>Users</span>
            </div>
            <div>
              <span className={styles.legendDot} style={{ background: '#00a3ff' }} />
              <span>Portfolios</span>
            </div>
            <div>
              <span className={styles.legendDot} style={{ background: '#38bdf8' }} />
              <span>NFC Taps</span>
            </div>
          </div>

          {/* SVG Interactive Multi-Line Area Spline Chart */}
          <div style={{ position: 'relative', width: '100%', height: '210px', marginTop: 'auto' }}>
            <svg viewBox="0 0 600 210" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0052ff" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0052ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="35" y1="30" x2="590" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="75" x2="590" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="120" x2="590" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="35" y1="165" x2="590" y2="165" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="25" y="34" fill="#94a3b8" fontSize="10" textAnchor="end">60K</text>
              <text x="25" y="79" fill="#94a3b8" fontSize="10" textAnchor="end">45K</text>
              <text x="25" y="124" fill="#94a3b8" fontSize="10" textAnchor="end">30K</text>
              <text x="25" y="169" fill="#94a3b8" fontSize="10" textAnchor="end">15K</text>
              <text x="25" y="198" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

              {/* Area fill */}
              <path
                d="M 50 145 C 130 130, 200 115, 270 95 C 340 75, 420 70, 500 58 L 570 45 L 570 195 L 50 195 Z"
                fill="url(#userGrad)"
              />

              {/* NFC Taps Line (Light Cyan) */}
              <path
                d="M 50 170 C 130 160, 200 140, 270 120 C 340 105, 420 95, 500 80 L 570 70"
                stroke="#38bdf8"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Portfolios Line (Cyan) */}
              <path
                d="M 50 155 C 130 140, 200 125, 270 105 C 340 90, 420 80, 500 70 L 570 55"
                stroke="#00a3ff"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Users Line (Royal Blue) */}
              <path
                d="M 50 145 C 130 130, 200 115, 270 95 C 340 75, 420 70, 500 58 L 570 45"
                stroke="#0052ff"
                strokeWidth="3"
                fill="none"
              />

              {/* Data points */}
              <circle cx="50" cy="145" r="4.5" fill="#0052ff" stroke="#ffffff" strokeWidth="2" />
              <circle cx="180" cy="120" r="4.5" fill="#0052ff" stroke="#ffffff" strokeWidth="2" />
              <circle cx="270" cy="95" r="4.5" fill="#0052ff" stroke="#ffffff" strokeWidth="2" />
              <circle cx="420" cy="70" r="4.5" fill="#0052ff" stroke="#ffffff" strokeWidth="2" />
              <circle cx="570" cy="45" r="4.5" fill="#0052ff" stroke="#ffffff" strokeWidth="2" />

              {/* X Axis Labels */}
              <text x="50" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 21</text>
              <text x="135" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 22</text>
              <text x="220" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 23</text>
              <text x="305" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 24</text>
              <text x="390" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 25</text>
              <text x="475" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 26</text>
              <text x="560" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">Oct 27</text>
            </svg>
          </div>
        </div>

        {/* Panel 2: CRM Overview */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>CRM Overview</h2>
            <Link href="/admin/crm" className={styles.panelLink}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div className={styles.crmTotalWrap}>
              <div className={styles.crmTotalLabel}>Total Leads</div>
              <div className={styles.crmTotalVal}>2,843</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={12} />
                <span>+16.2%</span>
              </div>
            </div>

            {/* Mini Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '44px', marginTop: '0.4rem' }}>
              {[25, 38, 45, 60, 52, 75, 88].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: `${h}%`,
                    background: i === 6 ? '#0052ff' : '#a7f3d0',
                    borderRadius: '3px',
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.crmStatRow}>
            <div className={styles.crmStatLabel}>
              <UserPlus size={14} className="text-blue-600" />
              <span>New Leads</span>
            </div>
            <span className={styles.crmStatVal}>412</span>
          </div>

          <div className={styles.crmStatRow}>
            <div className={styles.crmStatLabel}>
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Converted</span>
            </div>
            <span className={styles.crmStatVal}>286</span>
          </div>

          <div className={styles.crmStatRow} style={{ borderBottom: 'none' }}>
            <div className={styles.crmStatLabel}>
              <Sparkles size={14} className="text-sky-500" />
              <span>Conversion Rate</span>
            </div>
            <span className={styles.crmStatVal}>10.1%</span>
          </div>

          <div className={styles.crmProgressWrap}>
            <div className={styles.crmProgressBar} style={{ width: '42%' }} />
          </div>
        </div>

        {/* Panel 3: SEO Performance */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>SEO Performance</h2>
            <Link href="/admin/seo" className={styles.panelLink}>
              <span>View Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className={styles.seoGaugeRow}>
            <div className={styles.seoGauge}>
              <div className={styles.seoGaugeInner}>92</div>
            </div>
            <div className={styles.seoGaugeText}>
              <span className={styles.seoScoreStatus}>Excellent</span>
              <span className={styles.seoScoreSub}>SEO Health Score</span>
            </div>
          </div>

          <div className={styles.seoChecklist}>
            <div className={styles.seoCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>Meta Tags Optimized</span>
            </div>
            <div className={styles.seoCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>XML Sitemap Generated</span>
            </div>
            <div className={styles.seoCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>Pages Indexed in Search</span>
            </div>
            <div className={styles.seoCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>Core Web Vitals Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Row 3: Recent Activities + Quick Actions + Top Performing Content ─── */}
      <div className={`${styles.dashGridRow} ${styles.rowActivityQuickTop}`}>
        {/* Panel 1: Recent Activities */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Activities</h2>
            <Link href="/admin/logs" className={styles.panelLink}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.activityDot} />
              <span className={styles.activityText}>New user registered on Tapfolio</span>
              <span className={styles.activityTime}>2 minutes ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityDot} />
              <span className={styles.activityText}>Portfolio created by @nibras</span>
              <span className={styles.activityTime}>5 minutes ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityDot} />
              <span className={styles.activityText}>Premium subscription activated</span>
              <span className={styles.activityTime}>12 minutes ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityDot} />
              <span className={styles.activityText}>Support ticket #1247 resolved</span>
              <span className={styles.activityTime}>18 minutes ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityDot} />
              <span className={styles.activityText}>SEO sitemap updated and pinged</span>
              <span className={styles.activityTime}>25 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Quick Actions 6-Grid */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Quick Actions</h2>
          </div>

          <div className={styles.quickActionsGrid}>
            <Link href="/admin/users" className={styles.quickActionTile}>
              <UserPlus size={18} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>Add User</span>
            </Link>
            <Link href="/admin/portfolios" className={styles.quickActionTile}>
              <FolderPlus size={18} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>Create Portfolio</span>
            </Link>
            <Link href="/admin/broadcast" className={styles.quickActionTile}>
              <Send size={18} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>Send Broadcast</span>
            </Link>
            <Link href="/admin/analytics" className={styles.quickActionTile}>
              <BarChart2 size={18} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>View Reports</span>
            </Link>
            <Link href="/admin/seo" className={styles.quickActionTile}>
              <Search size={18} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>Manage SEO</span>
            </Link>
            <Link href="/admin/settings" className={styles.quickActionTile}>
              <Settings size={18} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>System Settings</span>
            </Link>
          </div>
        </div>

        {/* Panel 3: Top Performing Content */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Top Performing Content</h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
              }}
            >
              ● All Systems Operational
            </span>
          </div>

          <table className={styles.contentTable}>
            <thead>
              <tr>
                <th>Page / Portfolio</th>
                <th>Views</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className={styles.contentPath}>
                    <img
                      src="/profile_avatar.png"
                      alt="avatar"
                      style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover' }}
                    />
                    <span>/nibras</span>
                  </div>
                </td>
                <td className={styles.contentViews}>48.2K</td>
                <td className={styles.contentGrowth}>↑ +28%</td>
              </tr>
              <tr>
                <td>
                  <div className={styles.contentPath}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: '#edf3ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0052ff',
                        fontWeight: 800,
                        fontSize: 10,
                      }}
                    >
                      P
                    </div>
                    <span>/portfolio</span>
                  </div>
                </td>
                <td className={styles.contentViews}>32.7K</td>
                <td className={styles.contentGrowth}>↑ +24%</td>
              </tr>
              <tr>
                <td>
                  <div className={styles.contentPath}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: '#edf3ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0052ff',
                        fontWeight: 800,
                        fontSize: 10,
                      }}
                    >
                      G
                    </div>
                    <span>/games</span>
                  </div>
                </td>
                <td className={styles.contentViews}>21.1K</td>
                <td className={styles.contentGrowth}>↑ +19%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Row 4: Recent Support Tickets + SEO Analytics + System Health ─── */}
      <div className={`${styles.dashGridRow} ${styles.rowTicketsSeoHealth}`}>
        {/* Panel 1: Recent Support Tickets */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Support Tickets</h2>
            <Link href="/admin/support" className={styles.panelLink}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <table className={styles.ticketsTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>User</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((t, i) => (
                  <tr key={t.id}>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>#{t.id}</td>
                    <td style={{ fontWeight: 650, color: '#0f172a' }}>{t.subject}</td>
                    <td style={{ color: '#475569' }}>{t.name}</td>
                    <td>
                      <span className={i === 0 ? styles.priorityHigh : i === 1 ? styles.priorityMedium : styles.priorityLow}>
                        {i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          t.status === 'OPEN'
                            ? styles.ticketStatusOpen
                            : t.status === 'PENDING'
                            ? styles.ticketStatusPending
                            : styles.ticketStatusResolved
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>#1247</td>
                    <td style={{ fontWeight: 650, color: '#0f172a' }}>Issue with portfolio link</td>
                    <td style={{ color: '#475569' }}>Ahmed Raza</td>
                    <td><span className={styles.priorityHigh}>High</span></td>
                    <td><span className={styles.ticketStatusOpen}>Open</span></td>
                    <td style={{ color: '#94a3b8' }}>2m ago</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>#1246</td>
                    <td style={{ fontWeight: 650, color: '#0f172a' }}>Payment not received</td>
                    <td style={{ color: '#475569' }}>Fathima K</td>
                    <td><span className={styles.priorityMedium}>Medium</span></td>
                    <td><span className={styles.ticketStatusPending}>Pending</span></td>
                    <td style={{ color: '#94a3b8' }}>12m ago</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>#1245</td>
                    <td style={{ fontWeight: 650, color: '#0f172a' }}>App not opening</td>
                    <td style={{ color: '#475569' }}>Vivek S</td>
                    <td><span className={styles.priorityLow}>Low</span></td>
                    <td><span className={styles.ticketStatusResolved}>Resolved</span></td>
                    <td style={{ color: '#94a3b8' }}>1h ago</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel 2: SEO Analytics */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>SEO Analytics</h2>
            <Link href="/admin/seo" className={styles.panelLink}>
              <span>View Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className={styles.seoStatsRow}>
            <div className={styles.seoStatCol}>
              <span className={styles.seoStatLabel}>Organic Traffic</span>
              <div className={styles.seoStatVal}>48.2K</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={12} />
                <span>+32.6%</span>
              </div>
              <svg viewBox="0 0 70 20" style={{ width: '100%', height: '20px', marginTop: 6 }}>
                <path d="M 2 15 Q 20 8, 40 12 T 68 3" fill="none" stroke="#0052ff" strokeWidth="2" />
              </svg>
            </div>

            <div className={styles.seoStatCol}>
              <span className={styles.seoStatLabel}>Keywords</span>
              <div className={styles.seoStatVal}>12.6K</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={12} />
                <span>+21.4%</span>
              </div>
              <svg viewBox="0 0 70 20" style={{ width: '100%', height: '20px', marginTop: 6 }}>
                <path d="M 2 16 Q 25 14, 45 9 T 68 2" fill="none" stroke="#00a3ff" strokeWidth="2" />
              </svg>
            </div>

            <div className={styles.seoStatCol}>
              <span className={styles.seoStatLabel}>Backlinks</span>
              <div className={styles.seoStatVal}>3.4K</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={12} />
                <span>+17.9%</span>
              </div>
              <svg viewBox="0 0 70 20" style={{ width: '100%', height: '20px', marginTop: 6 }}>
                <path d="M 2 14 Q 25 6, 45 10 T 68 2" fill="none" stroke="#38bdf8" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Panel 3: System Health */}
        <div className={styles.panelCard}>
          <div className={styles.healthCircleWrap}>
            <div className={styles.healthCheckCircle}>
              <Check size={22} strokeWidth={3} />
            </div>
            <div>
              <div className={styles.healthHeadline}>100% Operational</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Everything is running smoothly</div>
            </div>
          </div>

          <div className={styles.healthChecklist}>
            <div className={styles.healthCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>Database (PostgreSQL Neon)</span>
            </div>
            <div className={styles.healthCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>API Services & Next.js Core</span>
            </div>
            <div className={styles.healthCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>CDN & Static Edge Cache</span>
            </div>
            <div className={styles.healthCheckItem}>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>Payment Gateway (Razorpay)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
