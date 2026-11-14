import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Zap,
  Link2,
  FolderGit2,
  Tag,
  Calendar,
  Sparkles,
  CheckCircle2,
  Phone,
  MapPin,
  Mail,
  User,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          tags: true,
          socials: true,
          projects: true,
        },
      },
      accounts: true,
    },
  });

  if (!user) return notFound();

  const profile = user.profile;
  const timeline = [
    { label: 'Registered on platform', date: user.createdAt, type: 'REGISTER' },
    ...(profile
      ? [
          { label: 'Profile bio & tags initialized', date: profile.id ? user.createdAt : null, type: 'PROFILE' },
          ...profile.projects.map((p) => ({
            label: `Published project: ${p.name}`,
            date: p.createdAt,
            type: 'PROJECT',
          })),
        ]
      : []),
  ]
    .filter((t) => t.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 2rem 3rem' }}>
      {/* Header / Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link
          href="/admin/users"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#0052ff',
            textDecoration: 'none',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '0.45rem 0.95rem',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Users Directory</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e8eefa',
          borderRadius: '16px',
          padding: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 2px 12px rgba(0, 82, 255, 0.03)',
          flexWrap: 'wrap',
        }}
      >
        <img
          src={profile?.avatar || '/profile_avatar.png'}
          alt={user.name}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #edf3ff',
            boxShadow: '0 4px 14px rgba(0, 82, 255, 0.12)',
          }}
        />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1
              style={{
                fontSize: '1.65rem',
                fontWeight: 850,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.025em',
              }}
            >
              {user.name}
            </h1>
            {profile?.username && (
              <Link
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0052ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: '#edf3ff',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                }}
              >
                <span>@{profile.username}</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
            {user.email}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 750,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: profile?.isPremium ? '#fffbeb' : '#f1f5f9',
                color: profile?.isPremium ? '#d97706' : '#64748b',
                border: profile?.isPremium ? '1px solid #fde68a' : '1px solid #e2e8f0',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {profile?.isPremium ? '★ Premium' : 'Free Plan'}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 750,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: profile?.isOnline ? '#ecfdf5' : '#fef2f2',
                color: profile?.isOnline ? '#059669' : '#dc2626',
                border: profile?.isOnline ? '1px solid #a7f3d0' : '1px solid #fecaca',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {profile?.isOnline ? '● Online' : '○ Offline'}
            </span>
            {user.accounts.map((acc) => (
              <span
                key={acc.id}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 750,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  background: '#eff6ff',
                  color: '#0052ff',
                  border: '1px solid #bfdbfe',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                OAuth: {acc.provider}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Registration Date
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 750, color: '#0f172a', marginTop: '0.25rem' }}>
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'NFC Taps', value: profile?.tapCount || 0, icon: <Zap size={18} />, color: '#0052ff', bg: '#edf3ff' },
          { label: 'Social Links', value: profile?.socials.length || 0, icon: <Link2 size={18} />, color: '#00a3ff', bg: '#edf3ff' },
          { label: 'Portfolio Projects', value: profile?.projects.length || 0, icon: <FolderGit2 size={18} />, color: '#059669', bg: '#ecfdf5' },
          { label: 'Custom Tags', value: profile?.tags.length || 0, icon: <Tag size={18} />, color: '#d97706', bg: '#fffbeb' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#ffffff',
              border: '1px solid #e8eefa',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 12px rgba(0, 82, 255, 0.03)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: stat.bg,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 850, color: '#0f172a', marginTop: '0.15rem' }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Split: Timeline + Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {/* Timeline */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8eefa',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0, 82, 255, 0.03)',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Calendar size={16} className="text-blue-600" />
            <span>Activity & Event History</span>
          </div>
          <div style={{ padding: '0.5rem 0', maxHeight: '350px', overflowY: 'auto' }}>
            {timeline.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No recorded activity events.
              </div>
            ) : (
              timeline.map((event, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    borderBottom: i < timeline.length - 1 ? '1px solid #f8fafc' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#0052ff',
                      boxShadow: '0 0 6px rgba(0, 82, 255, 0.4)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 650, color: '#1e293b' }}>
                      {event.label}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8' }}>
                    {new Date(event.date!).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8eefa',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0, 82, 255, 0.03)',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <User size={16} className="text-blue-600" />
            <span>Profile Metadata & Parameters</span>
          </div>
          <div>
            {[
              { label: 'Bio Description', value: profile?.bio || '—' },
              { label: 'Tagline', value: profile?.tagline || '—' },
              { label: 'Phone Number', value: profile?.phone || '—' },
              { label: 'WhatsApp', value: profile?.whatsapp || '—' },
              { label: 'Geographic Location', value: profile?.location || '—' },
              { label: 'Account Diamonds', value: profile?.diamonds?.toString() || '0' },
            ].map((row, idx) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.5rem',
                  borderBottom: idx < 5 ? '1px solid #f8fafc' : 'none',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    textAlign: 'right',
                    maxWidth: '60%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
