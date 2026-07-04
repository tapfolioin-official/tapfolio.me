'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ConnectClientPageProps {
  username: string;
  profile: {
    id: number;
    userId: number;
    name: string;
    avatar: string;
    isPremium: boolean;
    tagline: string;
  };
  isLoggedIn: boolean;
}

// Platform SVG icons (only essential ones – you can expand)
const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('github')) {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (p.includes('instagram')) {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  // Default fallback (globe)
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
};

export default function ConnectClientPage({
  username,
  profile,
  isLoggedIn,
}: ConnectClientPageProps) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tapfolio://connect/${username}`;
    }

    async function loadPublicData() {
      try {
        const res = await fetch(`/api/profile/${username}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setProfileData(data.profile);
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadPublicData();
  }, [username]);

  // ─── Share ───
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} — Tapfolio`,
          text: `Connect with ${profile.name} on Tapfolio`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  // ─── Save Contact (vCard) ───
  const handleSaveContact = () => {
    window.location.href = `/api/profile/${username}/vcard`;
  };

  // ─── Data helpers ───
  const getRolesText = () => {
    const list = profileData?.tags
      ?.filter((t: any) => t.type === 'role')
      .map((t: any) => t.text) || [];
    if (list.length === 0) return profileData ? '' : 'Creator • Developer';
    return list.join(' • ');
  };

  const getLocationString = () => {
    return profileData?.location || '';
  };

  const bioText = profileData?.bio || (profileData ? '' : 'Photographer, visual storyteller and creative professional.');

  const getSocialsList = () => {
    const list = profileData?.socials || [];
    if (list.length === 0) {
      return [
        { id: 1, platform: 'GitHub', url: '#' },
        { id: 2, platform: 'LinkedIn', url: '#' },
        { id: 3, platform: 'Instagram', url: '#' },
      ];
    }
    return list;
  };

  const getContactInfoItems = () => {
    const items: { label: string; val: string; href: string }[] = [];

    const emailLink = profileData?.socials?.find((s: any) => s.platform.toLowerCase().includes('email'));
    if (emailLink) {
      items.push({ label: 'Email', val: emailLink.handle || emailLink.url.replace('mailto:', ''), href: emailLink.url });
    }

    const phoneLink = profileData?.socials?.find((s: any) => s.platform.toLowerCase().includes('phone') || s.platform.toLowerCase().includes('whatsapp'));
    if (phoneLink) {
      const displayVal = phoneLink.handle || phoneLink.url.replace('tel:', '').replace('https://wa.me/', '').split('?')[0];
      items.push({ label: 'Phone', val: displayVal, href: phoneLink.url });
    }

    const webLink = profileData?.socials?.find((s: any) => s.platform.toLowerCase().includes('portfolio') || s.platform.toLowerCase().includes('website'));
    if (webLink) {
      items.push({ label: 'Website', val: webLink.handle || webLink.url, href: webLink.url });
    }

    const loc = getLocationString();
    if (loc) {
      items.push({ label: 'Location', val: loc, href: `https://maps.google.com/?q=${encodeURIComponent(loc)}` });
    }

    return items;
  };

  const rolesText = getRolesText();
  const locationString = getLocationString();
  const contactItems = getContactInfoItems();

  // ─── Render ───
  return (
    <div className={styles.wrapper}>
      {/* ─── Hero Banner ─── */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          {/* Profile Row: avatar left, info right */}
          <div className={styles.profileRow}>
            <img
              src={profile.avatar || '/profile_avatar.png'}
              alt={profile.name}
              className={styles.heroAvatar}
            />
            <div className={styles.profileInfo}>
              <h1 className={styles.heroName}>
                {profile.name}
                {profile.isPremium && (
                  <span className={styles.verifiedBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
                      <path d="M7.5 12.5l3 3 6-6" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </h1>
              {rolesText && <div className={styles.heroRoles}>{rolesText}</div>}
              {locationString && (
                <div className={styles.heroLocation}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                  </svg>
                  {locationString}
                </div>
              )}
            </div>
          </div>

          {/* Actions: Save Contact + Share */}
          <div className={styles.heroActions}>
            <button className={styles.saveContactBtn} onClick={handleSaveContact}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
              </svg>
              <span>Save Contact</span>
            </button>
            <button className={styles.shareBtn} onClick={handleShare} aria-label="Share profile">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V10.5a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3-3m0 0l3 3m-3-3v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Social Tiles ─── */}
      <div className={styles.socialSection}>
        <div className={styles.socialGrid}>
          {getSocialsList().map((link: any) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialTile}
            >
              <span className={styles.tileIcon}>
                {getPlatformIcon(link.platform)}
              </span>
              <span className={styles.tileName}>{link.platform}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── About (accordion) ─── */}
      {bioText && (
        <div className={styles.accordionRow}>
          <button className={styles.accordionHeader} onClick={() => setAboutOpen(!aboutOpen)}>
            <span>About Me</span>
            <span className={`${styles.accordionChevron} ${aboutOpen ? styles.accordionChevronOpen : ''}`}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </span>
          </button>
          {aboutOpen && (
            <div className={styles.accordionContent}>
              <p className={styles.accordionText}>{bioText}</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Contact (accordion) ─── */}
      {contactItems.length > 0 && (
        <div className={styles.accordionRow}>
          <button className={styles.accordionHeader} onClick={() => setContactOpen(!contactOpen)}>
            <span>Contact</span>
            <span className={`${styles.accordionChevron} ${contactOpen ? styles.accordionChevronOpen : ''}`}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </span>
          </button>
          {contactOpen && (
            <div className={styles.accordionContent}>
              <ul className={styles.contactList}>
                {contactItems.map((item, idx) => (
                  <li key={idx} className={styles.contactItem}>
                    <span className={styles.contactItemLabel}>{item.label}</span>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.contactItemValue}>
                      {item.val}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {/* ─── Footer ─── */}
      <div className={styles.footer}>
        <span className={styles.footerText}>
          Powered by <span>Tapfolio</span>
        </span>
        <a href="/login" className={styles.footerCta}>
          Create your Tapfolio
          <span className={styles.footerCtaArrow}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}