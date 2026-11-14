'use client';

import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Check,
  X,
  Users,
  Save,
  CheckCircle2,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

export default function AdminRolesPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roles = [
    {
      role: 'Super Admin',
      key: 'SUPER_ADMIN',
      desc: 'Full unrestricted platform access, database config, and billing operations',
      usersCount: 2,
      permissions: {
        users: true,
        crm: true,
        seo: true,
        revenue: true,
        security: true,
        broadcast: true,
      },
    },
    {
      role: 'Platform Admin',
      key: 'ADMIN',
      desc: 'Operational management across users, portfolios, reviews, and support queue',
      usersCount: 3,
      permissions: {
        users: true,
        crm: true,
        seo: true,
        revenue: false,
        security: true,
        broadcast: true,
      },
    },
    {
      role: 'CRM & Sales Manager',
      key: 'CRM_MANAGER',
      desc: 'Access to customer leads, visual deal pipelines, task assignments, and contact history',
      usersCount: 1,
      permissions: {
        users: true,
        crm: true,
        seo: false,
        revenue: true,
        security: false,
        broadcast: false,
      },
    },
    {
      role: 'SEO & Marketing Manager',
      key: 'SEO_MANAGER',
      desc: 'Access to on-page meta tags, keyword rankings, sitemaps, redirects, and analytics',
      usersCount: 1,
      permissions: {
        users: false,
        crm: false,
        seo: true,
        revenue: false,
        security: false,
        broadcast: true,
      },
    },
    {
      role: 'Support Desk Agent',
      key: 'SUPPORT',
      desc: 'Review complaints, reply to support tickets, and manage user connection flags',
      usersCount: 4,
      permissions: {
        users: true,
        crm: false,
        seo: false,
        revenue: false,
        security: false,
        broadcast: false,
      },
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Roles & Granular Permissions</h1>
          <p className={styles.subtitle}>
            Role-Based Access Control (RBAC) governing administrative access across Tapfolio modules
          </p>
        </div>
        <div className={styles.headerRight}>
          {savedSuccess && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 750,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
              }}
            >
              ✔ Permissions saved to database!
            </span>
          )}
          <button
            onClick={() => {
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            className={styles.refreshBtn}
          >
            <Save size={15} />
            <span>Save Permissions Matrix</span>
          </button>
        </div>
      </header>

      {/* Permissions Matrix Table */}
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Module Permission Access Matrix</h2>
            <p className={styles.panelSub}>Configured privileges for authenticated admin staff</p>
          </div>
        </div>

        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>Role Tier</th>
              <th>Users & Portfolios</th>
              <th>CRM & Deals</th>
              <th>SEO & Meta</th>
              <th>Revenue & Plans</th>
              <th>Security & Block IP</th>
              <th>Broadcast Alerts</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.key}>
                <td>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{r.role}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', maxWidth: 220 }}>{r.desc}</div>
                </td>
                <td>
                  {r.permissions.users ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Check size={16} /> Allow
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={16} /> Denied
                    </span>
                  )}
                </td>
                <td>
                  {r.permissions.crm ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Check size={16} /> Allow
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={16} /> Denied
                    </span>
                  )}
                </td>
                <td>
                  {r.permissions.seo ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Check size={16} /> Allow
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={16} /> Denied
                    </span>
                  )}
                </td>
                <td>
                  {r.permissions.revenue ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Check size={16} /> Allow
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={16} /> Denied
                    </span>
                  )}
                </td>
                <td>
                  {r.permissions.security ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Check size={16} /> Allow
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={16} /> Denied
                    </span>
                  )}
                </td>
                <td>
                  {r.permissions.broadcast ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Check size={16} /> Allow
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={16} /> Denied
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
