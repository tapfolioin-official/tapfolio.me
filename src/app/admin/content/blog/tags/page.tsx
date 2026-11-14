'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Trash2,
  Search,
} from 'lucide-react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

export default function BlogTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadTags = () => {
    setLoading(true);
    fetch('/api/admin/blog/tags')
      .then((res) => res.json())
      .then((data) => {
        if (data.tags) setTags(data.tags);
      })
      .catch(() => setTags([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              background: '#edf3ff',
              color: '#0052ff',
              borderRadius: 20,
              fontSize: '0.78rem',
              fontWeight: 750,
              marginBottom: '0.55rem',
            }}
          >
            <Tag size={13} /> Taxonomy Keywords
          </div>
          <h1 className={styles.pageTitle}>Article Tags ({tags.length})</h1>
          <p className={styles.pageSub}>
            Metadata tags associated with blog guides to link related topics together.
          </p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem' }}>
          {[
            'NFC Technology',
            'Smart Cards',
            'Networking',
            'Business Growth',
            'Apple Wallet',
            'Google Review Cards',
            'Metal NFC Cards',
            'RFID Security',
            'Digital Identity',
            'Corporate Gifting',
            'Lead Generation',
            'CRM Integration',
            'Trade Shows',
            'Freelancer Branding',
          ].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 20,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.8rem',
                fontWeight: 650,
                color: '#334155',
              }}
            >
              <Tag size={12} color="#0052ff" />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
