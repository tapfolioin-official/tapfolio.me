'use client';

import React, { useRef, useState, useEffect } from 'react';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
}

export function OTPInput({ length, value, onChange, onComplete, disabled }: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    const newDigits = Array(length).fill('');
    for (let i = 0; i < value.length; i++) {
      newDigits[i] = value[i] || '';
    }
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;
    
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned) {
      // If cleared, update state
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      onChange(newDigits.join(''));
      return;
    }

    const newDigits = [...digits];
    const singleDigit = cleaned[cleaned.length - 1];
    newDigits[index] = singleDigit;
    setDigits(newDigits);

    const updatedValue = newDigits.join('');
    onChange(updatedValue);

    if (updatedValue.length === length) {
      onComplete(updatedValue);
    } else if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
      } else if (index > 0) {
        newDigits[index - 1] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();

    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    const newDigits = Array(length).fill('');
    for (let i = 0; i < length; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    const updatedValue = newDigits.join('');
    onChange(updatedValue);

    if (updatedValue.length === length) {
      onComplete(updatedValue);
      inputsRef.current[length - 1]?.focus();
    } else {
      inputsRef.current[updatedValue.length]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '20px 0' }}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx] || ''}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          disabled={disabled}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '6px',
            border: '1px solid #334155',
            backgroundColor: '#1E293B',
            color: '#F8FAFC',
            textAlign: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3B82F6';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#334155';
          }}
        />
      ))}
    </div>
  );
}
