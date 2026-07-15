'use client';

import React, { useState, useEffect } from 'react';

interface OTPTimerProps {
  initialSeconds: number;
  onResend: () => Promise<void>;
  disabled?: boolean;
}

export function OTPTimer({ initialSeconds, onResend, disabled }: OTPTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = async () => {
    if (seconds > 0 || disabled || loading) return;
    setLoading(true);
    try {
      await onResend();
      setSeconds(initialSeconds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', marginTop: '15px' }}>
      {seconds > 0 ? (
        <span>
          Resend available in <strong style={{ color: '#E2E8F0' }}>{formatTime(seconds)}</strong>
        </span>
      ) : (
        <button
          onClick={handleResend}
          disabled={disabled || loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#3B82F6',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            textDecoration: 'underline',
            fontSize: '0.85rem',
            padding: 0,
            fontWeight: '600'
          }}
        >
          {loading ? 'Resending...' : 'Resend Code'}
        </button>
      )}
    </div>
  );
}
