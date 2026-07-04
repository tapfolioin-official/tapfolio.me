'use client';

import { useEffect, useState } from 'react';
import styles from '../modules.module.css';

export default function BroadcastPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', body: '', target: 'EVERYONE', channel: 'IN_APP' });
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/broadcast');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (e) {
      console.error('Failed to load broadcasts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSending(true);
    try {
      await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ title: '', body: '', target: 'EVERYONE', channel: 'IN_APP' });
      fetchMessages();
    } catch (e) {
      console.error('Failed to send broadcast', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Broadcast Center</h1>
          <p className={styles.pageSub}>Send announcements and notifications</p>
        </div>
      </div>

      {/* Composer */}
      <form className={styles.formPanel} onSubmit={sendBroadcast}>
        <div className={styles.formGrid}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              placeholder="Broadcast title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Message</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Write your broadcast message..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Target Audience</label>
            <select
              className={styles.formSelect}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
            >
              <option value="EVERYONE">Everyone</option>
              <option value="PREMIUM">Premium Users</option>
              <option value="FREE">Free Users</option>
              <option value="VERIFIED">Verified Users</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Channel</label>
            <select
              className={styles.formSelect}
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
            >
              <option value="IN_APP">In-App</option>
              <option value="EMAIL">Email</option>
              <option value="PUSH">Push Notification</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={sending}>
              {sending ? 'Sending...' : '📢 Send Broadcast'}
            </button>
          </div>
        </div>
      </form>

      {/* History */}
      <div className={styles.tablePanel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Channel</th>
              <th>Sent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📢</div>
                    <div className={styles.emptyText}>No broadcasts sent yet</div>
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 700 }}>{m.title}</td>
                  <td><span className={styles.badge}>{m.target}</span></td>
                  <td><span className={styles.badge}>{m.channel}</span></td>
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
