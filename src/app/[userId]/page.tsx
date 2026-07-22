import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ConnectButton from '@/components/ConnectButton';
import styles from './page.module.css';

export default async function PublicProfile({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  let profile = null;

  // 1. Try finding by numeric userId first
  const parsedUserId = parseInt(userId, 10);
  if (!isNaN(parsedUserId)) {
    profile = await prisma.profile.findUnique({
      where: { userId: parsedUserId },
      include: { 
        tags: true, 
        socials: true, 
        user: true,
        projects: {
          where: { isPublic: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });
  }

  // 2. Try finding by username field directly
  if (!profile) {
    profile = await prisma.profile.findUnique({
      where: { username: userId.toLowerCase().trim() },
      include: { 
        tags: true, 
        socials: true, 
        user: true,
        projects: {
          where: { isPublic: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });
  }

  // 3. Fallback to finding by slugified name
  if (!profile) {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const normalizedParam = userId.toLowerCase().trim();

    // Fast path: query database replacing hyphens with spaces
    const spaceSeparated = normalizedParam.replace(/-/g, ' ');
    profile = await prisma.profile.findFirst({
      where: {
        name: {
          equals: spaceSeparated,
          mode: 'insensitive'
        }
      },
      include: { 
        tags: true, 
        socials: true, 
        user: true,
        projects: {
          where: { isPublic: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    // Full in-memory search fallback (handles cases where name slugification is complex)
    if (!profile) {
      const allProfiles = await prisma.profile.findMany({
        include: { 
          tags: true, 
          socials: true, 
          user: true,
          projects: {
            where: { isPublic: true },
            orderBy: { displayOrder: 'asc' }
          }
        }
      });
      profile = allProfiles.find(p => slugify(p.name) === normalizedParam) || null;
    }
  }

  if (!profile) {
    return notFound();
  }

  const websiteSocial = profile.socials?.find((s: any) =>
    s.platform.toLowerCase() === 'website' || s.platform.toLowerCase() === 'portfolio'
  );

  const rawSocials = profile.socials?.filter((s: any) =>
    s.platform.toLowerCase() !== 'website' && s.platform.toLowerCase() !== 'portfolio'
  ) || [];

  const filteredSocials = [...rawSocials];
  if (profile.whatsapp && profile.whatsapp.trim()) {
    const hasWa = filteredSocials.some((s: any) => s.platform.toLowerCase().includes('whatsapp'));
    if (!hasWa) {
      const trimmedWa = profile.whatsapp.trim();
      let waDigits = trimmedWa.replace(/\D/g, '');
      if (waDigits.length === 10) waDigits = `91${waDigits}`;
      const waUrl = (trimmedWa.startsWith('http://') || trimmedWa.startsWith('https://'))
        ? trimmedWa
        : `https://wa.me/${waDigits}`;
      if (waUrl) {
        filteredSocials.push({
          id: 0,
          profileId: profile.id,
          platform: 'WhatsApp',
          handle: profile.whatsapp,
          url: waUrl,
          icon: 'whatsapp',
          color: '#25d366'
        });
      }
    }
  }

  const roleTags = profile.tags?.filter((t: any) => t.type === 'role' || t.type === 'skill') || [];
  const locationText = profile.location || '';

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.profileCard} glass-panel`}>
        {/* 1. HOME TAB VIEW (Profile Header) */}
        <div className={styles.homeTabView}>
          <img
            src={profile.avatar || '/profile_avatar.png'}
            alt={profile.name}
            className={styles.avatar}
          />
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.profileTagline}>{profile.tagline}</p>
        </div>

        {/* 2. CONNECT WITH ME BUTTON */}
        <div className={styles.actionContainer}>
          <ConnectButton 
            profileId={profile.id} 
            initialTapCount={profile.tapCount} 
            username={profile.username} 
            name={profile.name}
            phone={profile.phone}
            email={profile.user.email}
            tags={profile.tags}
            location={locationText}
          />
        </div>

        {/* 3. DYNAMIC QUOTE BAR */}
        <div className={styles.quoteBar}>
          <p>Design is not just what it looks like, it's how it connects.</p>
        </div>

        {/* 4. BIO AND DETAILS */}
        <div className={styles.detailsSection}>
          {profile.bio && (
            <div className={styles.bioBlock}>
              <h2>About</h2>
              <p>{profile.bio}</p>
            </div>
          )}

          {/* ⭐ Featured Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className={styles.projectsSection}>
              <h2>⭐ Featured Projects</h2>
              <div className={styles.projectsList}>
                {profile.projects.map((proj: any) => (
                  <div key={proj.id} className={styles.projectCard}>
                    {proj.showCover && proj.coverImage && (
                      <div className={styles.projectCoverWrap}>
                        <img src={proj.coverImage} alt={proj.name} className={styles.projectCover} />
                      </div>
                    )}
                    <div className={styles.projectBody}>
                      <span className={styles.projectCategory}>{proj.category}</span>
                      <h3 className={styles.projectName}>{proj.name}</h3>
                      <p className={styles.projectDesc}>{proj.shortDesc}</p>
                      
                      {proj.showTechnologies && proj.techStack && proj.techStack.length > 0 && (
                        <div className={styles.projectTech}>
                          {proj.techStack.slice(0, 3).map((tech: string, i: number) => (
                            <span key={i} className={styles.techChip}>{tech}</span>
                          ))}
                        </div>
                      )}
                      
                      <div className={styles.projectLinks}>
                        <a href={`/${profile.username}/projects/${proj.slug}`} className={styles.detailsLink}>
                          View Details →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(roleTags.length > 0 || locationText) && (
            <div className={styles.tagsBlock}>
              {roleTags.map((t: any, idx: number) => (
                <span
                  key={idx}
                  className={`${styles.tag} ${styles.tagRole}`}
                >
                  ⚙️ {t.text}
                </span>
              ))}
              {locationText && (
                <span className={`${styles.tag} ${styles.tagLoc}`}>
                  📍 {locationText}
                </span>
              )}
            </div>
          )}

          {(profile.user.email || profile.phone || profile.whatsapp || profile.location || websiteSocial) && (
            <div className={styles.contactBlock}>
              <h2>Contact</h2>
              <div className={styles.contactGrid}>
                {profile.phone && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>📞 Phone</span>
                    <a href={`tel:${profile.phone}`} className={styles.contactValue}>{profile.phone}</a>
                  </div>
                )}
                {profile.whatsapp && profile.whatsapp.trim() && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>💬 WhatsApp</span>
                    <a
                      href={profile.whatsapp.trim().startsWith('http') ? profile.whatsapp.trim() : `https://wa.me/${profile.whatsapp.trim().replace(/\D/g, '').length === 10 ? '91' + profile.whatsapp.trim().replace(/\D/g, '') : profile.whatsapp.trim().replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      {profile.whatsapp}
                    </a>
                  </div>
                )}
                {profile.user.email && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>✉️ Email</span>
                    <a href={`mailto:${profile.user.email}`} className={styles.contactValue}>{profile.user.email}</a>
                  </div>
                )}
                {websiteSocial && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>🌐 Website</span>
                    <a href={websiteSocial.url} target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                      {websiteSocial.handle || websiteSocial.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
                {locationText && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>📍 Location</span>
                    <span className={styles.contactValue}>{locationText}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {profile.resumeUrl && profile.resumeUrl.trim() && (
            <div className={styles.contactBlock}>
              <h2>Resume / CV</h2>
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>📄 Resume Document</span>
                  <a href={profile.resumeUrl.trim()} target="_blank" rel="noopener noreferrer" className={styles.contactValue} style={{ color: '#2563eb', fontWeight: 600 }}>
                    View Resume / CV ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {filteredSocials.length > 0 && (
            <div className={styles.socialsBlock}>
              <h2>Links</h2>
              <div className={styles.socialGrid}>
                {filteredSocials.map((s: any, idx: number) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLinkCard}
                    style={{ '--hover-color': s.color } as React.CSSProperties}
                  >
                    <span className={styles.platformName}>{s.platform}</span>
                    <span className={styles.platformHandle}>{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
