'use client';

import React, { useState, useEffect } from 'react';
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
  previewTheme?: any; // For live preview panel in dashboard
  previewProfileData?: any; // Live preview state for profile details
}

// Particles background component for Space/Particles themes
function ParticlesBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particlesCanvas} />;
}

// Cursor Glow component
function CursorGlow() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={styles.cursorGlowNode}
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`
      }}
    />
  );
}

// Platform SVG icons
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
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M20 4l-6.768 6.768" />
      </svg>
    );
  }
  if (p.includes('facebook')) {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
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
  previewTheme,
  previewProfileData
}: ConnectClientPageProps) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const activeProfileData = previewProfileData || profileData;
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    // Only redirect to mobile app if not inside preview dashboard
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isMobile && !previewTheme) {
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
  }, [username, previewTheme]);

  // Load selected fonts dynamically
  const activeTheme = previewTheme || activeProfileData?.theme;
  const activeFont = activeTheme?.typography?.fontFamily;

  useEffect(() => {
    if (!activeFont) return;
    const fontId = `google-font-${activeFont.toLowerCase().replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return;

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${activeFont.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [activeFont]);

  // ─── Share ───
  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} — Tapfolio`,
      text: `Connect with ${profile.name} on Tapfolio`,
      url: window.location.href,
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Profile link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  // ─── Save Contact (vCard) ───
  const handleSaveContact = () => {
    window.location.href = `/api/profile/${username}/vcard`;
  };

  // ─── Data helpers ───
  const getRolesText = () => {
    const list = activeProfileData?.tags
      ?.filter((t: any) => t.type === 'role' || t.type === 'skill')
      .map((t: any) => t.text) || [];
    if (list.length === 0) return activeProfileData ? '' : 'Creator • Developer';
    return list.join(' • ');
  };

  const getLocationString = () => {
    return activeProfileData?.location || '';
  };

  const bioText = activeProfileData?.bio || (activeProfileData ? '' : 'Photographer, visual storyteller and creative professional.');

  const getSocialsList = () => {
    const list = activeProfileData?.socials || [];
    return list.filter((s: any) => s.url && s.url !== '#' && s.url.trim() !== '');
  };

  const getContactInfoItems = () => {
    const items: { label: string; val: string; href: string }[] = [];

    const emailLink = activeProfileData?.socials?.find((s: any) => s.platform.toLowerCase().includes('email'));
    if (emailLink) {
      items.push({ label: 'Email', val: emailLink.handle || emailLink.url.replace('mailto:', ''), href: emailLink.url });
    }

    const phoneLink = activeProfileData?.socials?.find((s: any) => s.platform.toLowerCase().includes('phone') || s.platform.toLowerCase().includes('whatsapp'));
    if (phoneLink) {
      const displayVal = phoneLink.handle || phoneLink.url.replace('tel:', '').replace('https://wa.me/', '').split('?')[0];
      items.push({ label: 'Phone', val: displayVal, href: phoneLink.url });
    }

    const webLink = activeProfileData?.socials?.find((s: any) => s.platform.toLowerCase().includes('portfolio') || s.platform.toLowerCase().includes('website'));
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
  const socials = getSocialsList();

  // Convert theme settings object to CSS variables
  const getThemeStyles = () => {
    if (!activeTheme) return {};

    const colors = activeTheme.colors || {};
    const background = activeTheme.background || {};
    const typography = activeTheme.typography || {};
    const cards = activeTheme.cards || {};
    const buttons = activeTheme.buttons || {};
    const layout = activeTheme.layout || {};
    const avatar = activeTheme.avatar || {};
    const cover = activeTheme.cover || {};
    const socialIcons = activeTheme.socialIcons || {};

    let avatarRadius = '50%';
    if (avatar.shape === 'rounded') avatarRadius = '1rem';
    if (avatar.shape === 'square') avatarRadius = '0px';

    // Buttons
    let buttonBg = colors.primary || '#014BAA';
    let buttonColor = '#ffffff';
    let buttonBorder = 'none';

    if (buttons.style === 'outlined') {
      buttonBg = 'transparent';
      buttonColor = colors.primary || '#014BAA';
      buttonBorder = `2px solid ${colors.primary || '#014BAA'}`;
    } else if (buttons.style === 'ghost') {
      buttonBg = 'transparent';
      buttonColor = colors.primary || '#014BAA';
      buttonBorder = 'none';
    } else if (buttons.style === 'gradient') {
      buttonBg = `linear-gradient(135deg, ${colors.primary || '#014BAA'} 0%, ${colors.accent || '#1D9BF0'} 100%)`;
      buttonColor = '#ffffff';
      buttonBorder = 'none';
    }

    let buttonRadius = buttons.radius || '100px';
    if (buttons.style === 'pill') buttonRadius = '100px';
    if (buttons.style === 'rounded') buttonRadius = '0.5rem';
    if (buttons.style === 'square') buttonRadius = '0px';

    // Cover
    let coverBg = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
    if (cover.type === 'solid') coverBg = cover.value || colors.primary || '#014BAA';
    if (cover.type === 'gradient') coverBg = cover.value || `linear-gradient(135deg, ${colors.primary || '#014BAA'} 0%, ${colors.accent || '#1D9BF0'} 100%)`;
    if (cover.type === 'image') coverBg = `url(${cover.value}) center/cover no-repeat`;

    let cardHoverTransform = 'translateY(-3px)';
    let cardHoverShadow = '0 12px 24px -8px rgba(0, 0, 0, 0.12)';
    if (cards.style === 'minimal' || cards.style === 'flat') {
      cardHoverTransform = 'none';
      cardHoverShadow = 'none';
    }

    return {
      '--theme-primary': colors.primary,
      '--theme-secondary': colors.secondary,
      '--theme-accent': colors.accent,
      '--theme-success': colors.success,
      '--theme-warning': colors.warning,
      '--theme-danger': colors.danger,
      '--theme-bg': background.type === 'solid' ? background.value : 'transparent',
      '--theme-surface': colors.surface,
      '--theme-text': colors.text,
      '--theme-muted-text': colors.mutedText,
      '--theme-border': colors.border,
      '--theme-shadow': colors.shadow,

      '--theme-font-family': activeFont ? `'${activeFont}', sans-serif` : undefined,
      '--theme-heading-size': typography.headingSize,
      '--theme-body-size': typography.bodySize,
      '--theme-heading-weight': typography.weight,
      '--theme-letter-spacing': typography.letterSpacing,
      '--theme-line-height': typography.lineHeight,

      '--theme-card-border-radius': cards.borderRadius,
      '--theme-card-shadow': cards.style === 'minimal' || cards.style === 'flat' ? 'none' : cards.shadow,
      '--theme-card-border': cards.style === 'minimal' ? 'none' : cards.border,
      '--theme-card-opacity': cards.opacity,
      '--theme-card-blur': cards.style === 'glass' ? cards.blur || '10px' : '0px',
      '--theme-card-padding': cards.padding,
      '--theme-card-spacing': cards.spacing,
      '--theme-card-hover-transform': cardHoverTransform,
      '--theme-card-hover-shadow': cardHoverShadow,

      '--theme-button-bg': buttonBg,
      '--theme-button-text': buttonColor,
      '--theme-button-border': buttonBorder,
      '--theme-button-radius': buttonRadius,
      '--theme-button-height': buttons.height,
      '--theme-button-hover-transform': buttons.animation === 'hover_lift' ? 'translateY(-2px)' : 'none',

      '--theme-profile-width': layout.profileWidth,
      '--theme-content-width': layout.contentWidth,
      '--theme-layout-spacing': layout.spacing,

      '--theme-avatar-radius': avatarRadius,
      '--theme-avatar-border': avatar.border,
      '--theme-avatar-shadow': avatar.glow === 'glow' ? `0 0 20px ${colors.primary || '#014BAA'}` : avatar.shadow,

      '--theme-cover-bg': cover.type === 'none' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : coverBg,

      '--theme-social-icon-size': socialIcons.size,
      '--theme-social-icon-spacing': socialIcons.spacing
    } as React.CSSProperties;
  };

  if (loadingProfile && !previewTheme) {
    return (
      <div className={styles.wrapper}>
        <p className="text-gray-400 mt-20 animate-pulse">Loading Tapfolio Profile...</p>
      </div>
    );
  }

  // Define layout structure based on section order & visibility
  const sectionOrder = activeTheme?.sections?.order || ["about", "contact", "socials", "portfolio", "projects"];
  const sectionVisibility = activeTheme?.sections?.visibility || {
    about: true,
    contact: true,
    socials: true,
    portfolio: true,
    projects: true
  };

  const renderSection = (secName: string) => {
    if (!sectionVisibility[secName]) return null;

    switch (secName) {
      case 'about':
        if (!bioText) return null;
        return (
          <div className={styles.accordionRow} key="about">
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
        );

      case 'contact':
        if (contactItems.length === 0) return null;
        return (
          <div className={styles.accordionRow} key="contact">
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
        );

      case 'socials':
        if (socials.length === 0) return null;
        return (
          <div className={styles.socialSection} key="socials">
            <div className={styles.socialGrid} style={{ gridTemplateColumns: activeTheme?.layout?.style === 'compact' ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)' }}>
              {socials.map((link: any, idx: number) => (
                <a
                  key={link.id || `${link.platform}-${idx}`}
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
        );

      case 'portfolio':
        return (
          <div className={styles.accordionRow} key="portfolio">
            <a
              href={`/portfolio/${username}`}
              className="flex items-center justify-between w-full p-4 font-semibold text-sm hover:bg-gray-50/5 transition-colors no-underline text-[var(--theme-text,#111827)]"
            >
              <span>View Interactive Portfolio Showcase</span>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>
        );

      case 'projects':
        const projects = activeProfileData?.projects || [];
        return (
          <div className={styles.socialSection} key="projects">
            <h4 className="text-xs uppercase tracking-wider font-bold mb-3 px-1 text-[var(--theme-muted-text)]">Featured Projects</h4>
            <div className="flex flex-col gap-3">
              {projects.length > 0 ? (
                projects.map((proj: any) => (
                  <a
                    key={proj.id}
                    href={`/${username}/projects/${proj.slug}`}
                    className={styles.socialTile}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '1rem', width: '100%' }}
                  >
                    <div className="text-left">
                      <span className="block font-bold text-sm text-[var(--theme-text)]">{proj.name}</span>
                      <span className="block text-xs text-[var(--theme-muted-text)] mt-1">{proj.shortDesc}</span>
                    </div>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                ))
              ) : (
                <div className={styles.socialTile} style={{ padding: '1rem', width: '100%', justifyContent: 'center' }}>
                  <span className="text-xs text-[var(--theme-muted-text)]">No projects published yet</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const bgType = activeTheme?.background?.type;
  const bgValue = activeTheme?.background?.value;
  const isPremiumTheme = activeTheme?.premium || false;

  // Animation settings
  const animationStyle = activeTheme?.animations?.style || 'fade';
  const entranceClass = animationStyle === 'fade' ? styles.fadeEntrance :
                        animationStyle === 'slide' ? styles.slideEntrance :
                        animationStyle === 'scale' ? styles.scaleEntrance : '';

  return (
    <div
      className={`${styles.wrapper} ${entranceClass}`}
      style={{
        ...getThemeStyles(),
        alignItems: activeTheme?.layout?.alignment === 'left' ? 'flex-start' :
                    activeTheme?.layout?.alignment === 'right' ? 'flex-end' : 'center',
        minHeight: previewTheme ? '100%' : '100vh',
      }}
    >
      {/* ─── Premium Background Rendering ─── */}
      {bgType === 'aurora' && <div className={styles.auroraBg} />}
      {bgType === 'animated_gradient' && <div className={styles.animatedGradientBg} />}
      {bgType === 'particles' && <ParticlesBackground />}
      {bgType === 'video' && bgValue && (
        <video src={bgValue} autoPlay loop muted playsInline className={styles.videoBg} />
      )}
      {bgType === 'image' && bgValue && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            background: `url(${bgValue}) center/cover no-repeat`,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* ─── Cursor Glow Effect ─── */}
      {activeTheme?.animations?.cursorGlow && <CursorGlow />}

      <div style={{ width: '100%', maxWidth: activeTheme?.layout?.profileWidth || '640px', zIndex: 1 }}>
        {/* ─── Hero Banner ─── */}
        <div className={styles.heroBanner}>
          <div className={styles.heroContent}>
            {/* Profile Row: avatar left/top, info right/center */}
            <div
              className={styles.profileRow}
              style={{
                flexDirection: activeTheme?.layout?.alignment === 'center' ? 'column' : 'row',
                alignItems: 'center',
                textAlign: activeTheme?.layout?.alignment === 'center' ? 'center' : 'left'
              }}
            >
              <img
                src={profile.avatar || '/profile_avatar.png'}
                alt={profile.name}
                className={`${styles.heroAvatar} ${activeTheme?.avatar?.glow === 'glow' ? styles.heroAvatarGlow : ''}`}
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
                  <div
                    className={styles.heroLocation}
                    style={{
                      justifyContent: activeTheme?.layout?.alignment === 'center' ? 'center' : 'flex-start'
                    }}
                  >
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
            <div
              className={styles.heroActions}
              style={{
                justifyContent: activeTheme?.layout?.alignment === 'center' ? 'center' : 'flex-start'
              }}
            >
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

        {/* ─── Render dynamic ordered sections ─── */}
        {sectionOrder.map((sectionName: string) => renderSection(sectionName))}

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
    </div>
  );
}