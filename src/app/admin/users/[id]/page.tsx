import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    { icon: '🎉', label: 'Registered', date: user.createdAt },
    ...(profile
      ? [
          { icon: '✅', label: 'Profile created', date: profile.id ? user.createdAt : null },
          ...profile.projects.map((p) => ({
            icon: '🗂️',
            label: `Created project: ${p.name}`,
            date: p.createdAt,
          })),
        ]
      : []),
  ]
    .filter((t) => t.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link
          href="/admin/users"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#3B82F6',
            textDecoration: 'none',
          }}
        >
          ← Back to Users
        </Link>
      </div>

      {/* Profile Header Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <img
          src={profile?.avatar || '/profile_avatar.png'}
          alt={user.name}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #E2E8F0',
          }}
        />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#0F172A',
              marginBottom: '0.15rem',
            }}
          >
            {user.name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
            {user.email}
            {profile?.username ? ` · @${profile.username}` : ''}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: profile?.isPremium ? '#FEF3C7' : '#F1F5F9',
                color: profile?.isPremium ? '#D97706' : '#64748B',
                textTransform: 'uppercase',
              }}
            >
              {profile?.isPremium ? 'Premium' : 'Free'}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: profile?.isOnline ? '#DCFCE7' : '#FEE2E2',
                color: profile?.isOnline ? '#16A34A' : '#DC2626',
                textTransform: 'uppercase',
              }}
            >
              {profile?.isOnline ? 'Online' : 'Offline'}
            </span>
            {user.accounts.map((acc) => (
              <span
                key={acc.id}
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  textTransform: 'uppercase',
                }}
              >
                {acc.provider}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
            Joined
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Tap Count', value: profile?.tapCount || 0, icon: '👆' },
          { label: 'Social Links', value: profile?.socials.length || 0, icon: '🔗' },
          { label: 'Projects', value: profile?.projects.length || 0, icon: '🗂️' },
          { label: 'Tags', value: profile?.tags.length || 0, icon: '🏷️' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {stat.icon} {stat.label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginTop: '0.25rem' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Split: Timeline + Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Timeline */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #F1F5F9',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#0F172A',
            }}
          >
            📅 Activity Timeline
          </div>
          <div style={{ padding: '0.5rem 0', maxHeight: '350px', overflowY: 'auto' }}>
            {timeline.map((event, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 1.25rem',
                  borderBottom: i < timeline.length - 1 ? '1px solid #F8FAFC' : 'none',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{event.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                    {event.label}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8' }}>
                  {new Date(event.date!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Details */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #F1F5F9',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#0F172A',
            }}
          >
            📝 Profile Details
          </div>
          <div style={{ padding: '0' }}>
            {[
              { label: 'Bio', value: profile?.bio || '—' },
              { label: 'Tagline', value: profile?.tagline || '—' },
              { label: 'Phone', value: profile?.phone || '—' },
              { label: 'WhatsApp', value: profile?.whatsapp || '—' },
              { label: 'Location', value: profile?.location || '—' },
              { label: 'Diamonds', value: profile?.diamonds || '0' },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1.25rem',
                  borderBottom: '1px solid #F8FAFC',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                  {row.label}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
