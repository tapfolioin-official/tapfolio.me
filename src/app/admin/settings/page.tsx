'use client';

import styles from '../modules.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSub}>Admin dashboard configuration</p>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formGrid}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Platform Name</label>
            <input className={styles.formInput} defaultValue="Tapfolio" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Default Theme</label>
            <select className={styles.formSelect} defaultValue="light">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Maintenance Mode</label>
            <select className={styles.formSelect} defaultValue="off">
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Registration</label>
            <select className={styles.formSelect} defaultValue="open">
              <option value="open">Open</option>
              <option value="invite">Invite Only</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Auto-refresh Interval</label>
            <select className={styles.formSelect} defaultValue="30">
              <option value="5">5 seconds</option>
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button className={styles.submitBtn}>💾 Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
