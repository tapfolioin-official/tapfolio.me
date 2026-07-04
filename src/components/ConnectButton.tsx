'use client';

import { useState } from 'react';
import styles from './ConnectButton.module.css';

interface ConnectButtonProps {
  profileId: number;
  initialTapCount: number;
  username: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  tags?: { text: string; type: string }[];
  location?: string | null;
}

export default function ConnectButton({
  profileId,
  initialTapCount,
  username,
  name,
  phone,
  email,
  tags,
  location,
}: ConnectButtonProps) {
  const handleConnect = () => {
    window.location.href = `/connect/${username}`;
  };

  const handleSaveContact = () => {
    window.location.href = `/api/profile/${username}/vcard`;
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleConnect}
        className={styles.connectBtn}
      >
        Connect with me
      </button>
      
      <button
        onClick={handleSaveContact}
        className={styles.saveContactBtn}
      >
        Save Contact
      </button>

      <div className={styles.tapStats}>
        <span>⚡ {initialTapCount} total connections</span>
      </div>
    </div>
  );
}
