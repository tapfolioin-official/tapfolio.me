'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ImageCropModal from '@/components/ImageCropModal';
import ConnectClientPage from '@/app/connect/[username]/ConnectClientPage';
import {
  DEFAULT_THEME_SETTINGS,
  QUICK_THEMES,
  PREMIUM_THEMES,
  calculateContrastRatio
} from '@/lib/theme';
import {
  Palette, Type, CreditCard, Layout, Sparkles, Check,
  Download, Upload, Copy, Share, ArrowUp, ArrowDown, ShieldAlert,
  Layers, Smartphone, Eye, EyeOff, Save, Trash2, Heart, Image, Star
} from 'lucide-react';
import React from 'react';

const THEME_DESCRIPTIONS: Record<string, string> = {
  // Quick Themes
  "Professional": "Clean white business style",
  "Minimal": "Simple clean layout",
  "Dark": "Midnight elegant dark",
  "Ocean": "Blue gradients & water",
  "Forest": "Green natural tones",
  "Royal": "Purple luxury style",
  "Carbon": "Modern charcoal dark",
  "Sunset": "Orange & pink gradients",
  "Elegant": "Premium bronze elegant",
  "Glass": "Glassmorphism effects",
  "Neon": "Bright glowing accents",
  "Business": "Corporate blue style",
  // Premium Themes
  "Luxury": "Gold premium elegance",
  "Cyber": "Futuristic neon pink & blue",
  "Aurora": "Northern lights gradient glow",
  "Liquid Glass": "Soft pastel glassmorphism",
  "Animated Gradient": "Fluid dynamic spectrum",
  "Neon Glow": "Cyan electric highlights",
  "Space": "Cosmic particles & purple",
  "Apple Style": "Clean Cupertino white",
  "Material You": "Dynamic pastel themes"
};

interface MiniProfilePreviewProps {
  theme: any;
}

const MiniProfilePreview: React.FC<MiniProfilePreviewProps> = React.memo(({ theme }) => {
  const settings = theme.settings;
  const colors = settings.colors;
  const background = settings.background;
  const avatar = settings.avatar;
  const cards = settings.cards;
  const buttons = settings.buttons;
  const layout = settings.layout;
  const socialIcons = settings.socialIcons;

  // Determine container background CSS
  let bgStyle: React.CSSProperties = {};
  if (background.type === 'gradient' || background.type === 'animated_gradient') {
    bgStyle.background = background.value;
  } else if (background.type === 'solid') {
    bgStyle.backgroundColor = background.value || colors.background;
  } else if (background.type === 'aurora') {
    bgStyle.background = 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #0f172a 100%)';
  } else if (background.type === 'particles') {
    bgStyle.background = 'linear-gradient(180deg, #03001e 0%, #7303c0 50%, #ec38bc 100%)';
  } else {
    bgStyle.backgroundColor = colors.background;
  }

  // Determine avatar shape & style
  const avatarRadius = avatar.shape === 'circle' ? '9999px' : avatar.shape === 'rounded' ? '6px' : '0px';

  // Determine card style
  let cardStyle: React.CSSProperties = {
    borderRadius: cards.borderRadius || '8px',
    backgroundColor: colors.surface,
    borderColor: colors.border || 'transparent',
    borderWidth: cards.border ? '1px' : '0px',
    borderStyle: 'solid',
    boxShadow: cards.shadow || 'none',
  };
  if (cards.style === 'glass') {
    cardStyle.backgroundColor = colors.surface.includes('rgba') ? colors.surface : 'rgba(255, 255, 255, 0.25)';
    cardStyle.backdropFilter = `blur(${cards.blur || '8px'})`;
  } else if (cards.style === 'minimal') {
    cardStyle.boxShadow = 'none';
    cardStyle.backgroundColor = 'transparent';
    cardStyle.borderColor = colors.border || '#e5e7eb';
  }

  // Determine button radius
  const btnRadius = buttons.style === 'pill' || buttons.radius === '100px' ? '9999px' : buttons.radius || '8px';

  // Align style
  const alignmentClass = layout.alignment === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div
      className="w-full aspect-[9/16] rounded-2xl relative overflow-hidden flex flex-col p-3 border border-gray-200/50 shadow-inner select-none transition-all duration-300 pointer-events-none"
      style={bgStyle}
    >
      {/* Cover / Header banner representation */}
      <div
        className="h-7 w-full rounded-t-xl absolute top-0 left-0 opacity-70"
        style={{ backgroundColor: colors.primary }}
      />

      {/* Profile Info Stack */}
      <div className={`mt-5 flex flex-col ${alignmentClass} gap-1 z-10 w-full`}>
        {/* Avatar Representation */}
        <div
          className="w-8 h-8 border-2 border-white shadow-sm flex items-center justify-center shrink-0"
          style={{
            borderRadius: avatarRadius,
            backgroundColor: colors.surface,
          }}
        >
          <div className="w-6 h-6 rounded-full bg-gray-200/60" />
        </div>

        {/* User Name & Bio Lines */}
        <div className="w-[70%] h-2 rounded bg-gray-200 mt-1" style={{ backgroundColor: colors.text, opacity: 0.9 }} />
        <div className="w-[50%] h-1.5 rounded bg-gray-200" style={{ backgroundColor: colors.mutedText, opacity: 0.7 }} />
      </div>

      {/* Social Icons row */}
      <div className="flex justify-center gap-1.5 mt-2.5 z-10">
        {[1, 2, 3].map((icon) => (
          <div
            key={icon}
            className="w-4 h-4 border border-white/40 flex items-center justify-center shrink-0 shadow-sm"
            style={{
              borderRadius: socialIcons.style === 'circle' ? '9999px' : '4px',
              backgroundColor: colors.primary,
            }}
          />
        ))}
      </div>

      {/* Content Cards section */}
      <div className="flex-1 flex flex-col gap-2 mt-3 z-10 w-full overflow-hidden">
        {/* Project Card 1 */}
        <div className="p-1.5 flex flex-col gap-1 w-full" style={cardStyle}>
          <div className="h-6 w-full rounded bg-gray-150 relative overflow-hidden shrink-0">
            {/* mock image accent */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colors.primary }} />
          </div>
          <div className="h-1.5 w-[80%] rounded" style={{ backgroundColor: colors.text }} />
          <div className="h-1 w-[60%] rounded" style={{ backgroundColor: colors.mutedText }} />
        </div>

        {/* Project Card 2 */}
        <div className="p-1.5 flex flex-col gap-1 w-full" style={cardStyle}>
          <div className="h-6 w-full rounded bg-gray-150 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colors.primary }} />
          </div>
          <div className="h-1.5 w-[75%] rounded" style={{ backgroundColor: colors.text }} />
          <div className="h-1 w-[50%] rounded" style={{ backgroundColor: colors.mutedText }} />
        </div>
      </div>

      {/* CTA Buttons bar at the bottom */}
      <div className="mt-auto pt-2 z-10 w-full flex flex-col gap-1.5">
        <div
          className="h-5 w-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm shrink-0"
          style={{
            backgroundColor: colors.primary,
            borderRadius: btnRadius,
          }}
        >
          Connect
        </div>
      </div>
    </div>
  );
});

MiniProfilePreview.displayName = 'MiniProfilePreview';

interface Tag {
  id?: number;
  text: string;
  type: string;
}

interface SocialLink {
  id?: number;
  platform: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
}

interface Profile {
  id: number;
  userId: number;
  name: string;
  username: string;
  tagline: string;
  avatar: string;
  isOnline: boolean;
  bio: string;
  diamonds: string;
  isPremium: boolean;
  tapCount: number;
  tags: Tag[];
  socials: SocialLink[];
  user?: {
    profileReady: boolean;
    connectionCount?: number;
    sharingSettings: {
      shareName: boolean;
      shareEmail: boolean;
      sharePhone: boolean;
      shareWhatsapp: boolean;
      shareLocation: boolean;
    } | null;
  };
}

interface ChecklistItem {
  id: string;
  label: string;
  points: number;
  completed: boolean;
  description: string;
}

interface SharingSettings {
  shareName: boolean;
  shareEmail: boolean;
  sharePhone: boolean;
  shareWhatsapp: boolean;
  shareLocation: boolean;
}

// Modern Platform Icon Renderer
const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('github')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (p.includes('twitter') || p.includes('x.com')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes('instagram')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  if (p.includes('youtube')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.113C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.505a3.003 3.003 0 00-2.11 2.113C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.113c1.87.505 9.388.505 9.388.505s7.518 0 9.388-.505a3.002 3.002 0 002.11-2.113C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (p.includes('google pay') || p.includes('gpay') || p.includes('upi')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.24 10.285V13.4h4.743c-.19 1.077-.736 1.99-1.636 2.603V18.1h2.617c1.53-1.42 2.413-3.52 2.413-5.996 0-.585-.052-1.15-.152-1.705H12.24z" fill="#4285F4" />
        <path d="M12.24 20c2.68 0 4.93-.897 6.57-2.433l-2.617-2.052c-.724.49-1.65.787-2.67.787-2.052 0-3.79-1.396-4.41-3.275H6.4V15.11C8.04 18.39 11.39 20 12.24 20z" fill="#34A853" />
        <path d="M7.83 13.027a5.81 5.81 0 0 1 0-3.69V7.202H6.4a9.924 9.924 0 0 0 0 9.595l1.43-2.138-.002-.632z" fill="#FBBC05" />
        <path d="M12.24 7.698c1.46 0 2.766.507 3.796 1.5l2.85-2.85C17.164 4.887 14.914 4 12.24 4 11.39 4 8.04 5.61 6.4 8.89l1.43 2.138c.62-1.879 2.358-3.33 4.41-3.33z" fill="#EA4335" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [historyEvents, setHistoryEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tabs Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'customizer' | 'projects' | 'sharing' | 'support'>('overview');

  // Support & Feedback states
  const [supportSubject, setSupportSubject] = useState('Feedback/Complaint');
  const [supportMessage, setSupportMessage] = useState('');
  const [submittingSupport, setSubmittingSupport] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState('');
  const [supportError, setSupportError] = useState('');

  // System Announcements states
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Projects states
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Project form fields
  const [pName, setPName] = useState('');
  const [pSlug, setPSlug] = useState('');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pFullDesc, setPFullDesc] = useState('');
  const [pCategory, setPCategory] = useState('Web');
  const [pStatus, setPStatus] = useState('COMPLETED');
  const [pCoverImage, setPCoverImage] = useState('');
  const [pLiveDemo, setPLiveDemo] = useState('');
  const [pGithub, setPGithub] = useState('');
  const [pAppStore, setPAppStore] = useState('');
  const [pPlayStore, setPPlayStore] = useState('');
  const [pDocumentation, setPDocumentation] = useState('');
  const [pCaseStudy, setPCaseStudy] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsPublic, setPIsPublic] = useState(true);
  const [pPinned, setPPinned] = useState(false);
  const [pShowTechnologies, setPShowTechnologies] = useState(true);
  const [pShowCover, setPShowCover] = useState(true);
  const [pShowDates, setPShowDates] = useState(true);
  const [pStartDate, setPStartDate] = useState('');
  const [pEndDate, setPEndDate] = useState('');
  const [pTechStack, setPTechStack] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [whatsapp, setWhatsapp] = useState('+91');
  const [location, setLocation] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  // 🔐 Password fields (new)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Theme Customizer States
  const [themeSettings, setThemeSettings] = useState<any>(DEFAULT_THEME_SETTINGS);
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeSubTab, setThemeSubTab] = useState<'profile' | 'presets' | 'colors' | 'background' | 'fonts' | 'cards' | 'buttons' | 'layout' | 'avatar' | 'sections' | 'socials' | 'animations' | 'marketplace' | 'advanced'>('profile');
  const [marketplaceThemes, setMarketplaceThemes] = useState<any[]>([]);
  const [loadingMarketplace, setLoadingMarketplace] = useState(false);
  const [marketplaceFilter, setMarketplaceFilter] = useState<'trending' | 'newest'>('trending');
  const [importJson, setImportJson] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishThemeName, setPublishThemeName] = useState('');

  // Tags states
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagText, setNewTagText] = useState('');
  const [newTagType, setNewTagType] = useState('role');

  // Socials states
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('GitHub');
  const [newHandle, setNewHandle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Sharing Settings
  const [sharingSettings, setSharingSettings] = useState<SharingSettings>({
    shareName: true,
    shareEmail: true,
    sharePhone: false,
    shareWhatsapp: true,
    shareLocation: false,
  });
  const [savingSharing, setSavingSharing] = useState(false);

  // Connect page visibility toggles (live preview only; some map to sharing settings)
  const [showName, setShowName] = useState(true);
  const [showTagline, setShowTagline] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [showSocials, setShowSocials] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(true);

  // Score & Checklist
  const [score, setScore] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Image Crop Modal State
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      // If not authenticated, redirect to login
      if (res.status === 401 || res.status === 400) {
        router.replace(`${ROUTES.LOGIN}?redirect=${ROUTES.DASHBOARD}`);
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setName(data.profile.name);
        setTagline(data.profile.tagline || '');
        setBio(data.profile.bio || '');
        setAvatar(data.profile.avatar);
        setIsPremium(data.profile.isPremium);
        setEmail(data.profile.user?.email || '');
        setPhone(data.profile.phone ? (data.profile.phone.startsWith('+') ? data.profile.phone : (data.profile.phone.replace(/\D/g, '').length === 10 ? `+91${data.profile.phone.replace(/\D/g, '')}` : data.profile.phone)) : '+91');
        setWhatsapp(data.profile.whatsapp ? (data.profile.whatsapp.startsWith('+') ? data.profile.whatsapp : (data.profile.whatsapp.replace(/\D/g, '').length === 10 ? `+91${data.profile.whatsapp.replace(/\D/g, '')}` : data.profile.whatsapp)) : '+91');
        setLocation(data.profile.location || '');
        setPortfolioUrl(data.profile.portfolioUrl || '');
        setResumeUrl(data.profile.resumeUrl || '');
        setTags(data.profile.tags || []);
        setSocials(data.profile.socials || []);
        setScore(data.score ?? 0);
        setChecklist(data.items ?? []);
        // Initialize preview visibility based on presence of data
        setShowTagline(Boolean(data.profile.tagline && data.profile.tagline.trim()));
        setShowBio(Boolean(data.profile.bio && data.profile.bio.trim()));
        setShowSocials(Boolean(data.profile.socials && data.profile.socials.length > 0));
        setShowTags(Boolean(data.profile.tags && data.profile.tags.length > 0));
      }
    } catch (err: any) {
      console.error('[Dashboard] fetchProfile error:', err);
      setError(err.message || 'Error loading profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setHistoryEvents(data.events || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch history logs:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/broadcast');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAnnouncements(data.announcements || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch system announcements:', err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchSharingSettings = async () => {
    try {
      const res = await fetch('/api/connections/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSharingSettings(data.settings);
          // Map sharing settings to preview toggles
          setShowName(Boolean(data.settings.shareName));
          const contactVisible = Boolean(data.settings.shareEmail || data.settings.sharePhone || data.settings.shareWhatsapp || data.settings.shareLocation);
          setShowContactInfo(contactVisible);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sharing settings:', err);
    }
  };

  const fetchTheme = async () => {
    try {
      const res = await fetch('/api/profile/theme');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.theme) {
          setThemeSettings(data.theme.settings || DEFAULT_THEME_SETTINGS);
          setImportJson(JSON.stringify(data.theme.settings || DEFAULT_THEME_SETTINGS, null, 2));
        }
      }
    } catch (error) {
      console.error('Error fetching theme settings:', error);
    }
  };

  const fetchMarketplace = async (filterType = marketplaceFilter) => {
    setLoadingMarketplace(true);
    try {
      const res = await fetch(`/api/profile/theme/marketplace?filter=${filterType}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMarketplaceThemes(data.themes || []);
        }
      }
    } catch (error) {
      console.error('Error fetching marketplace themes:', error);
    } finally {
      setLoadingMarketplace(false);
    }
  };

  const publishTheme = async () => {
    if (!publishThemeName.trim()) return;
    try {
      const res = await fetch('/api/profile/theme/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          themeName: publishThemeName,
          settings: themeSettings
        })
      });
      if (res.ok) {
        setSuccess('Theme published to the marketplace successfully!');
        setPublishThemeName('');
        setShowPublishModal(false);
        fetchMarketplace();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error publishing theme:', err);
    }
  };

  const likeMarketplaceTheme = async (themeId: number) => {
    try {
      const res = await fetch('/api/profile/theme/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          themeId
        })
      });
      if (res.ok) {
        fetchMarketplace();
      }
    } catch (err) {
      console.error('Error liking theme:', err);
    }
  };

  const installMarketplaceTheme = async (themeId: number) => {
    try {
      const res = await fetch('/api/profile/theme/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'install',
          themeId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.theme) {
          setThemeSettings(data.theme.settings);
          setImportJson(JSON.stringify(data.theme.settings, null, 2));
          setSuccess('Community theme installed successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error installing theme:', err);
    }
  };

  const deleteMarketplaceTheme = async (themeId: number, themeName: string) => {
    if (!confirm(`Delete "${themeName}" from the marketplace? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/profile/theme/marketplace?themeId=${themeId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccess('Theme deleted from marketplace.');
        fetchMarketplace();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete theme.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      console.error('Error deleting marketplace theme:', err);
      setError('Failed to delete theme.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const resetThemeToDefault = async () => {
    if (!confirm('Are you sure you want to reset all customizations to default styles?')) return;
    try {
      const res = await fetch('/api/profile/theme/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.theme) {
          setThemeSettings(data.theme.settings);
          setImportJson(JSON.stringify(data.theme.settings, null, 2));
          setSuccess('Theme reset to system defaults!');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error resetting theme:', err);
    }
  };

  const handleImportTheme = async () => {
    try {
      const parsed = JSON.parse(importJson);
      const res = await fetch('/api/profile/theme/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: parsed })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.theme) {
          setThemeSettings(data.theme.settings);
          setSuccess('Theme imported successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }
      } else {
        alert('Invalid theme format or server rejected import.');
      }
    } catch (err) {
      alert('Invalid JSON input. Please verify formatting.');
    }
  };

  const saveTheme = async () => {
    setSavingTheme(true);
    try {
      const res = await fetch('/api/profile/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: themeSettings })
      });
      if (res.ok) {
        setSuccess('Theme settings saved successfully!');
        setImportJson(JSON.stringify(themeSettings, null, 2));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to save theme');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      console.error('Error saving theme:', err);
      setError('Failed to save theme settings.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setSavingTheme(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
    fetchAnnouncements();
    fetchSharingSettings();
    fetchTheme();
    fetchMarketplace();
  }, []);

  // Step 1: User picks a file → show crop modal
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  // Step 2: Crop complete → upload cropped blob
  const handleCropDone = async (croppedBlob: Blob) => {
    setShowCropModal(false);
    setCropImageSrc(null);

    const formData = new FormData();
    formData.append('file', croppedBlob, 'avatar.png');

    setSaving(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatar(data.url);
        setSuccess('Avatar cropped & uploaded! Save your profile to finalize.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropImageSrc(null);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingResume(true);
    setError('');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResumeUrl(data.url);
        setSuccess('Resume uploaded successfully! Save your profile to finalize.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Resume upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Resume upload error');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setSaving(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setThemeSettings({
          ...themeSettings,
          background: {
            ...themeSettings.background,
            value: data.url
          }
        });
        setSuccess('Background image uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleThemeCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setSaving(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setThemeSettings({
          ...themeSettings,
          cover: {
            ...themeSettings.cover,
            value: data.url
          }
        });
        setSuccess('Cover image uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagText.trim()) return;
    const isDuplicate = tags.some(
      (t) => t.text.toLowerCase() === newTagText.trim().toLowerCase() && t.type === newTagType
    );
    if (isDuplicate) return;

    setTags([...tags, { text: newTagText.trim(), type: newTagType }]);
    setNewTagText('');
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    const urlVal = newUrl.trim();
    if (!urlVal) return;

    const handleVal = newPlatform === 'Google Pay' && !newHandle.trim()
      ? urlVal
      : newHandle.trim();

    if (!handleVal) return;

    const platformSpecs: Record<string, { color: string; icon: string }> = {
      GitHub: { color: '#24292e', icon: 'github' },
      LinkedIn: { color: '#0077b5', icon: 'linkedin' },
      Twitter: { color: '#1da1f2', icon: 'twitter' },
      Instagram: { color: '#e1306c', icon: 'instagram' },
      Facebook: { color: '#1877f2', icon: 'facebook' },
      YouTube: { color: '#ff0000', icon: 'youtube' },
      Website: { color: '#10b981', icon: 'globe' },
      'Google Pay': { color: '#4285F4', icon: 'credit-card' },
    };

    const specs = platformSpecs[newPlatform] || { color: '#6366f1', icon: 'link' };

    setSocials([
      ...socials,
      {
        platform: newPlatform,
        handle: handleVal,
        url: newPlatform === 'Google Pay'
          ? urlVal
          : (urlVal.startsWith('http') ? urlVal : `https://${urlVal}`),
        icon: specs.icon,
        color: specs.color,
      },
    ]);

    setNewHandle('');
    setNewUrl('');
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  // 🆕 Updated save profile with email & password support
  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // --- Password validation ---
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setSaving(false);
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      setSaving(false);
      return;
    }
    if (newPassword && !currentPassword) {
      setError('Current password is required to set a new password.');
      setSaving(false);
      return;
    }

    const formatPhoneWithDefaultCountryCode = (val: string) => {
      if (!val) return '';
      const trimmed = val.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('+')) return trimmed;
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (digitsOnly.length === 10) return `+91${digitsOnly}`;
      if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return `+${digitsOnly}`;
      return trimmed;
    };

    const finalPhone = formatPhoneWithDefaultCountryCode(phone);
    const finalWhatsapp = formatPhoneWithDefaultCountryCode(whatsapp);

    let finalSocials = [...socials];
    const urlVal = newUrl.trim();
    if (urlVal) {
      const handleVal = newPlatform === 'Google Pay' && !newHandle.trim()
        ? urlVal
        : newHandle.trim();

      if (handleVal) {
        const platformSpecs: Record<string, { color: string; icon: string }> = {
          GitHub: { color: '#24292e', icon: 'github' },
          LinkedIn: { color: '#0077b5', icon: 'linkedin' },
          Twitter: { color: '#1da1f2', icon: 'twitter' },
          Instagram: { color: '#e1306c', icon: 'instagram' },
          Facebook: { color: '#1877f2', icon: 'facebook' },
          YouTube: { color: '#ff0000', icon: 'youtube' },
          Website: { color: '#10b981', icon: 'globe' },
          'Google Pay': { color: '#4285F4', icon: 'credit-card' },
        };
        const specs = platformSpecs[newPlatform] || { color: '#6366f1', icon: 'link' };

        finalSocials.push({
          platform: newPlatform,
          handle: handleVal,
          url: newPlatform === 'Google Pay'
            ? urlVal
            : (urlVal.startsWith('http') ? urlVal : `https://${urlVal}`),
          icon: specs.icon,
          color: specs.color,
        });

        setSocials(finalSocials);
        setNewHandle('');
        setNewUrl('');
      }
    }

    try {
      const payload: any = {
        name,
        email,                   // ✅ now included
        tagline,
        bio,
        avatar,
        phone: finalPhone,
        whatsapp: finalWhatsapp,
        location,
        portfolioUrl,
        resumeUrl,
        tags,
        socials: finalSocials,
      };

      // Only send password fields if they are filled
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
        payload.confirmPassword = confirmPassword;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile.');

      // Clear password fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setSuccess('Profile saved successfully!');
      setProfile(data.profile);
      setScore(data.score);
      setChecklist(data.items);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSharingSettings = async () => {
    setSavingSharing(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/connections/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sharingSettings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update sharing settings.');

      setSuccess('Sharing preferences updated!');
      setSharingSettings(data.settings);

      // Refresh profile to update checklist points
      await fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setSavingSharing(false);
    }
  };

  const handleCreateSupportTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setSubmittingSupport(true);
    setSupportSuccess('');
    setSupportError('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: supportSubject,
          message: supportMessage
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSupportSuccess('Your feedback has been submitted successfully to the administrators.');
        setSupportMessage('');
        setSupportSubject('Feedback/Complaint');
      } else {
        setSupportError(data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Support ticket error:', err);
      setSupportError('Network error. Please try again.');
    } finally {
      setSubmittingSupport(false);
    }
  };

  const handleUpgradePayment = async () => {
    setPaymentProcessing(true);
    setError('');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPremium: true }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error('Upgrade update failed.');

        setIsPremium(true);
        if (profile) {
          setProfile({ ...profile, isPremium: true });
        }
        setShowPaymentModal(false);
        setSuccess('Upgrade successful! You are now a premium member and eligible for the leaderboard.');
        setTimeout(() => setSuccess(''), 5000);
      } catch (err: any) {
        setError(err.message || 'Upgrade failed.');
      } finally {
        setPaymentProcessing(false);
      }
    }, 2000);
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/profile/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    }
  }, [activeTab]);

  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pSlug.trim() || !pShortDesc.trim() || !pCategory) {
      setError('Please fill in Name, Slug, Short Description, and Category.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProjectId,
          name: pName,
          slug: pSlug,
          shortDesc: pShortDesc,
          fullDesc: pFullDesc,
          category: pCategory,
          status: pStatus,
          coverImage: pCoverImage,
          liveDemo: pLiveDemo,
          github: pGithub,
          appStore: pAppStore,
          playStore: pPlayStore,
          documentation: pDocumentation,
          caseStudy: pCaseStudy,
          isFeatured: pIsFeatured,
          isPublic: pIsPublic,
          pinned: pPinned,
          showTechnologies: pShowTechnologies,
          showCover: pShowCover,
          showDates: pShowDates,
          startDate: pStartDate || null,
          endDate: pEndDate || null,
          techStack: pTechStack.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(editingProjectId ? 'Project updated successfully!' : 'Project created successfully!');
        setTimeout(() => setSuccess(''), 3000);
        setShowProjectForm(false);
        resetProjectForm();
        fetchProjects();
      } else {
        setError(data.error || 'Failed to save project');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      console.error('Save project error:', err);
      setError('Something went wrong.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleEditProjectClick = (proj: any) => {
    setEditingProjectId(proj.id);
    setPName(proj.name);
    setPSlug(proj.slug);
    setPShortDesc(proj.shortDesc);
    setPFullDesc(proj.fullDesc || '');
    setPCategory(proj.category);
    setPStatus(proj.status);
    setPCoverImage(proj.coverImage || '');
    setPLiveDemo(proj.liveDemo || '');
    setPGithub(proj.github || '');
    setPAppStore(proj.appStore || '');
    setPPlayStore(proj.playStore || '');
    setPDocumentation(proj.documentation || '');
    setPCaseStudy(proj.caseStudy || '');
    setPIsFeatured(proj.isFeatured);
    setPIsPublic(proj.isPublic);
    setPPinned(proj.pinned);
    setPShowTechnologies(proj.showTechnologies);
    setPShowCover(proj.showCover);
    setPShowDates(proj.showDates);
    setPStartDate(proj.startDate ? proj.startDate.split('T')[0] : '');
    setPEndDate(proj.endDate ? proj.endDate.split('T')[0] : '');
    setPTechStack(proj.techStack ? proj.techStack.join(', ') : '');
    setShowProjectForm(true);
  };

  const handleDeleteProjectClick = async (projId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/profile/projects?id=${projId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setPName('');
    setPSlug('');
    setPShortDesc('');
    setPFullDesc('');
    setPCategory('Web');
    setPStatus('COMPLETED');
    setPCoverImage('');
    setPLiveDemo('');
    setPGithub('');
    setPAppStore('');
    setPPlayStore('');
    setPDocumentation('');
    setPCaseStudy('');
    setPIsFeatured(false);
    setPIsPublic(true);
    setPPinned(false);
    setPShowTechnologies(true);
    setPShowCover(true);
    setPShowDates(true);
    setPStartDate('');
    setPEndDate('');
    setPTechStack('');
  };

  const handleNameChange = (val: string) => {
    setPName(val);
    if (!editingProjectId) {
      setPSlug(val.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file, file.name);

    setUploadingCover(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPCoverImage(data.url);
      }
    } catch (err) {
      console.error('Upload cover error:', err);
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicLink = profile ? `${origin}/@${profile.username}` : '';

  const calculateProgress = () => {
    let pct = 40;
    const checklistItems = [
      { id: 'signup', label: 'Create Account', completed: true, value: 40, desc: 'Sign up with name & email' },
      { id: 'username', label: 'Customize Username', completed: false, value: 15, desc: 'Set a custom username link' },
      { id: 'photo_headline', label: 'Photo & Headline', completed: false, value: 15, desc: 'Upload an avatar and set tagline' },
      { id: 'sharing', label: 'Sharing Preferences', completed: false, value: 15, desc: 'Set your contact sharing settings' },
      { id: 'socials', label: 'Add Social Link', completed: false, value: 15, desc: 'Add at least one social profile' },
    ];

    if (profile?.user?.profileReady) {
      checklistItems[1].completed = true;
      pct += 15;
    }

    const hasCustomAvatar = profile?.avatar && profile.avatar !== '/profile_avatar.png' && !profile.avatar.includes('profile_avatar.png');
    const hasCustomTagline = profile?.tagline && profile.tagline.trim().length > 0 && profile.tagline !== "Let's connect!";
    if (hasCustomAvatar && hasCustomTagline) {
      checklistItems[2].completed = true;
      pct += 15;
    }

    if (profile?.user?.sharingSettings) {
      checklistItems[3].completed = true;
      pct += 15;
    }

    if (profile?.socials && profile.socials.length >= 1) {
      checklistItems[4].completed = true;
      pct += 15;
    }

    return { percentage: pct, items: checklistItems };
  };

  const progressData = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your digital presence and TapFolio settings.</p>
          </div>
          {publicLink && (
            <a
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Public Profile
              <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
        {success && <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN - MAIN CONTROLS */}
          <div className={`${activeTab === 'customizer' ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-6`}>

            {/* SEGMENTED TABS */}
            <div className="flex p-1 bg-gray-200/60 rounded-xl w-full sm:w-fit overflow-x-auto scrollbar-none whitespace-nowrap gap-1 select-none shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('customizer')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${activeTab === 'customizer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Customize Profile
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${activeTab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('sharing')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${activeTab === 'sharing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Privacy & Sharing
              </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                    <span className="text-gray-500 font-medium text-sm">Profile Views</span>
                    <span className="text-3xl font-extrabold text-gray-900">{profile?.tapCount || 0}</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                    <span className="text-gray-500 font-medium text-sm">TapFolio Score</span>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-extrabold text-gray-900">{score}</span>
                      <span className="text-gray-400 font-medium text-sm mb-1">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Setup Checklist */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Setup Progress</h3>
                    <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressData.percentage}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 font-medium">{progressData.percentage}% Completed</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {progressData.items.map((item, i) => (
                      <div key={i} className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border shrink-0 ${item.completed ? 'bg-green-100 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                            {item.completed ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 shrink-0">+{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Announcements */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl shadow-sm border border-blue-100/50 overflow-hidden">
                  <div className="px-6 py-5 border-b border-blue-100/30 flex items-center gap-2.5">
                    <span className="text-xl">📢</span>
                    <h3 className="text-lg font-bold text-gray-900">System Announcements</h3>
                  </div>
                  <div className="divide-y divide-blue-100/20 bg-white">
                    {loadingAnnouncements ? (
                      <div className="px-6 py-8 text-center text-gray-400 text-sm">Loading announcements...</div>
                    ) : announcements.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-400 text-sm">No announcements from the team yet.</div>
                    ) : (
                      announcements.map((msg, i) => (
                        <div key={i} className="px-6 py-5 flex flex-col gap-2 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-bold text-gray-900 text-sm">{msg.title}</h4>
                            <span className="text-[10px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold text-blue-600">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {historyEvents.slice(0, 3).map((event, i) => (
                      <div key={i} className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{event.action}</p>
                          <p className="text-xs text-gray-400">{new Date(event.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {historyEvents.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-500 text-sm">No activity recorded yet.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* CUSTOMIZER TAB */}
            {activeTab === 'customizer' && (
              <div className="flex flex-col gap-6">

                {/* Category Nav Tabs */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1 shrink-0">
                  {[
                    { id: 'profile', label: 'Profile Info' },
                    { id: 'presets', label: 'Theme Presets' },
                    { id: 'background', label: 'Background' },
                    { id: 'buttons', label: 'Buttons' },
                    { id: 'layout', label: 'Layout' },
                    { id: 'avatar', label: 'Avatar Shape' },
                    { id: 'sections', label: 'Custom Sections' },
                    { id: 'animations', label: 'Animations' },
                    { id: 'marketplace', label: 'Theme Market' }
                  ].map((sub) => {
                    const isTabPremium = ['background', 'buttons', 'layout', 'avatar', 'sections', 'animations', 'marketplace'].includes(sub.id);
                    const isLocked = isTabPremium && !isPremium;
                    
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            setShowPaymentModal(true);
                          } else {
                            setThemeSubTab(sub.id as any);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                          themeSubTab === sub.id
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {sub.label}
                        {isLocked && (
                          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Configurator Card Container */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6 lg:max-h-[calc(100vh-375px)] lg:overflow-y-auto scrollbar-none lg:pr-1">

                  {/* SUB-TAB 1: Profile Info */}
                  {themeSubTab === 'profile' && (
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Profile Details</h4>
                        <span className="text-xs text-blue-600 font-semibold px-2.5 py-1 bg-blue-50 rounded-full">Step 1</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 mb-2">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                            {avatar ? (
                              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              </div>
                            )}
                          </div>
                          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            Change Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                          </label>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Display Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="John Doe" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tagline</label>
                            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="Product Designer" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Location</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="City, Country" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="you@email.com" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Phone</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onFocus={(e) => { if (!e.target.value) setPhone('+91'); }} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="+91 9876543210" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">WhatsApp</label>
                            <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} onFocus={(e) => { if (!e.target.value) setWhatsapp('+91'); }} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="+91 9876543210" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Portfolio Link</label>
                            <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold" placeholder="https://yourportfolio.com" />
                          </div>

                          <div className="col-span-1 md:col-span-2 bg-gray-50/70 p-4 border border-gray-200 rounded-xl space-y-3">
                            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
                              <span>📄 Resume / CV (Upload or URL)</span>
                              {uploadingResume && <span className="text-blue-600 text-xs font-semibold animate-pulse">Uploading file...</span>}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                              <input
                                type="url"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold"
                                placeholder="https://drive.google.com/your-resume.pdf"
                              />
                              <label className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap">
                                <Upload className="w-3.5 h-3.5" />
                                {uploadingResume ? 'Uploading...' : 'Upload PDF/Doc'}
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,image/*"
                                  onChange={handleResumeUpload}
                                  className="hidden"
                                  disabled={uploadingResume}
                                />
                              </label>
                            </div>
                            {resumeUrl && (
                              <div className="flex items-center justify-between text-xs bg-white px-3 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium">
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1.5 truncate">
                                  <span>📄 View Uploaded Resume</span>
                                </a>
                                <button type="button" onClick={() => setResumeUrl('')} className="text-red-500 hover:text-red-700 text-xs font-semibold ml-2">
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Biography</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 text-sm font-semibold resize-none" placeholder="Tell people about yourself..." />
                      </div>

                      {/* Tags Section */}
                      <div className="border-t border-gray-100 pt-5">
                        <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                          🏷️ Profile Tags
                        </h5>
                        <p className="text-xs text-gray-500 mb-4">Add keywords/tags to display on your public profile. For example: roles (e.g. Developer, Designer) or locations.</p>

                        {/* Tags list */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${tag.type === 'location'
                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                                }`}
                            >
                              <span className="opacity-60 uppercase text-[9px] tracking-wider font-bold">
                                {tag.type}
                              </span>
                              <span className="font-bold text-gray-900">{tag.text}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(idx)}
                                className="text-gray-400 hover:text-red-600 font-bold focus:outline-none transition-colors cursor-pointer text-sm"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          {tags.length === 0 && (
                            <span className="text-xs text-gray-400 italic">No tags added yet. Use the tool below to add some!</span>
                          )}
                        </div>

                        {/* Add tag form */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            value={newTagType}
                            onChange={(e) => setNewTagType(e.target.value)}
                            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold outline-none focus:border-blue-500"
                          >
                            <option value="role">Role / Skill</option>
                            <option value="location">Location</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Tag text (e.g. Next.js, Austin TX)"
                            value={newTagText}
                            onChange={(e) => setNewTagText(e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold outline-none focus:border-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag(e);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Add Tag
                          </button>
                        </div>
                      </div>

                      {/* Security */}
                      <div className="border-t border-gray-100 pt-5">
                        <h5 className="text-sm font-bold text-gray-900 mb-3">Change Password</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-sm text-gray-900" />
                          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-sm text-gray-900" />
                          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-sm text-gray-900" />
                        </div>
                      </div>

                      {/* Social Connections */}
                      <div className="border-t border-gray-100 pt-5">
                        <h5 className="text-sm font-bold text-gray-900 mb-3">Social Connections</h5>
                        <div className="space-y-2 mb-4">
                          {socials.map((social, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold">
                              <span className="flex items-center gap-2">
                                {social.platform} ({social.handle})
                              </span>
                              <button type="button" onClick={() => handleRemoveSocial(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {socials.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No social profiles added. Link your socials below.</p>
                          )}
                        </div>
                        <form onSubmit={handleAddSocial} className="flex flex-col sm:flex-row gap-3">
                          <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold outline-none focus:border-blue-500">
                            <option>LinkedIn</option>
                            <option>Twitter</option>
                            <option>GitHub</option>
                            <option>Instagram</option>
                            <option>Facebook</option>
                            <option>YouTube</option>
                            <option>Website</option>
                            <option>Google Pay</option>
                          </select>
                          <input type="text" placeholder={newPlatform === 'Google Pay' ? "Handle (optional)" : "Handle/Label"} value={newHandle} onChange={(e) => setNewHandle(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold outline-none focus:border-blue-500" />
                          <input type="text" placeholder={newPlatform === 'Google Pay' ? "UPI ID (e.g., name@okaxis)" : "URL"} value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold outline-none focus:border-blue-500" />
                          <button type="submit" className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">Add</button>
                        </form>
                      </div>

                      <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                        <button type="button" onClick={handleSaveProfile} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-sm transition-all">
                          {saving ? 'Saving...' : 'Save Profile Details'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: Theme Presets */}
                  {themeSubTab === 'presets' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Preset Themes</h4>
                        <p className="text-xs text-gray-500 mt-1">Deploy a beautiful, professionally coordinated aesthetic in one click.</p>
                      </div>

                      {/* Quick Themes */}
                      <div>
                        <h5 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">Quick Themes</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {QUICK_THEMES.map((theme) => {
                            const isSelected = themeSettings && themeSettings.colors.primary === theme.settings.colors.primary && themeSettings.colors.background === theme.settings.colors.background;
                            const desc = THEME_DESCRIPTIONS[theme.name] || 'Creative template style';
                            return (
                              <div
                                key={theme.name}
                                onClick={() => {
                                  setThemeSettings(theme.settings);
                                  setSuccess(`Theme presets for "${theme.name}" loaded!`);
                                  setTimeout(() => setSuccess(''), 2500);
                                }}
                                className={`group relative p-2 border rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-md bg-white cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50/10 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'
                                  }`}
                              >
                                {/* Miniature live preview container */}
                                <div className="w-full relative rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:border-blue-200 transition-colors">
                                  <MiniProfilePreview theme={theme} />
                                </div>

                                {/* Theme metadata */}
                                <div className="w-full text-center flex flex-col gap-0.5 min-w-0">
                                  <span className="text-xs font-bold text-gray-800 truncate">{theme.name}</span>
                                  <span className="text-[10px] text-gray-400 font-medium truncate">{desc}</span>
                                  {isSelected ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveTheme();
                                      }}
                                      disabled={savingTheme}
                                      className="mt-1.5 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-0.5 uppercase tracking-wider"
                                    >
                                      <Check className="w-2.5 h-2.5" /> Save
                                    </button>
                                  ) : (
                                    <span className="mt-1.5 text-[9px] text-blue-500 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                      Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Premium Themes */}
                      <div className="border-t border-gray-100 pt-5">
                        <h5 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> Premium Themes
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {PREMIUM_THEMES.map((theme) => {
                            const isSelected = themeSettings && themeSettings.colors.primary === theme.settings.colors.primary && themeSettings.colors.background === theme.settings.colors.background;
                            const desc = THEME_DESCRIPTIONS[theme.name] || 'Premium coordinates';
                            return (
                              <div
                                key={theme.name}
                                onClick={() => {
                                  setThemeSettings(theme.settings);
                                  setSuccess(`Premium Theme "${theme.name}" applied!`);
                                  setTimeout(() => setSuccess(''), 2500);
                                }}
                                className={`group relative p-2 border rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-md bg-white cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50/10 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'
                                  }`}
                              >
                                {/* Premium Badge */}
                                <div className="absolute top-3.5 right-3.5 bg-yellow-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm z-20 flex items-center gap-0.5 select-none">
                                  <Star className="w-2 h-2 fill-white" /> Pro
                                </div>

                                {/* Miniature live preview container */}
                                <div className="w-full relative rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:border-blue-200 transition-colors">
                                  <MiniProfilePreview theme={theme} />
                                </div>

                                {/* Theme metadata */}
                                <div className="w-full text-center flex flex-col gap-0.5 min-w-0">
                                  <span className="text-xs font-bold text-gray-800 truncate">{theme.name}</span>
                                  <span className="text-[10px] text-gray-400 font-medium truncate">{desc}</span>
                                  {isSelected ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveTheme();
                                      }}
                                      disabled={savingTheme}
                                      className="mt-1.5 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-0.5 uppercase tracking-wider"
                                    >
                                      <Check className="w-2.5 h-2.5" /> Save
                                    </button>
                                  ) : (
                                    <span className="mt-1.5 text-[9px] text-blue-500 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                      Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}



                  {/* SUB-TAB 4: Backgrounds */}
                  {themeSubTab === 'background' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Background Engine</h4>
                        <p className="text-xs text-gray-500 mt-1">Choose layout background style. Particles and animators are unlocked for custom designs.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Background Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'solid', label: 'Solid Color' },
                            { id: 'gradient', label: 'Gradient' },
                            { id: 'aurora', label: 'Aurora Mesh' },
                            { id: 'particles', label: 'Particles Space' },
                            { id: 'video', label: 'Video Clip' },
                            { id: 'image', label: 'Custom Image' }
                          ].map((bgType) => (
                            <button
                              key={bgType.id}
                              type="button"
                              onClick={() => {
                                setThemeSettings({
                                  ...themeSettings,
                                  background: {
                                    ...themeSettings.background,
                                    type: bgType.id,
                                    value: bgType.id === 'solid' ? '#f0f2f8' :
                                      bgType.id === 'gradient' ? 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' :
                                        bgType.id === 'aurora' ? 'aurora-bg' :
                                          bgType.id === 'particles' ? 'space-particles' : ''
                                  }
                                });
                              }}
                              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${themeSettings.background?.type === bgType.id
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                              {bgType.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Context-dependent config fields */}
                      {themeSettings.background?.type === 'solid' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-700">Solid Color Hex</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={themeSettings.background?.value || '#f0f2f8'}
                              onChange={(e) => {
                                setThemeSettings({
                                  ...themeSettings,
                                  background: { ...themeSettings.background, value: e.target.value }
                                });
                              }}
                              className="w-10 h-9 p-0.5 border border-gray-200 rounded-lg cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeSettings.background?.value || '#f0f2f8'}
                              onChange={(e) => {
                                setThemeSettings({
                                  ...themeSettings,
                                  background: { ...themeSettings.background, value: e.target.value }
                                });
                              }}
                              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-mono text-gray-900"
                            />
                          </div>
                        </div>
                      )}

                      {themeSettings.background?.type === 'gradient' && (
                        <div className="flex flex-col gap-3">
                          <label className="text-xs font-semibold text-gray-700">Linear Gradient Value</label>
                          <input
                            type="text"
                            value={themeSettings.background?.value || ''}
                            onChange={(e) => {
                              setThemeSettings({
                                ...themeSettings,
                                background: { ...themeSettings.background, value: e.target.value }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono text-gray-900"
                            placeholder="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
                          />
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                              'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                              'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                              'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
                            ].map((gradientVal, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setThemeSettings({
                                    ...themeSettings,
                                    background: { ...themeSettings.background, value: gradientVal }
                                  });
                                }}
                                className="h-10 border border-gray-200 rounded-lg cursor-pointer shadow-sm"
                                style={{ background: gradientVal }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {themeSettings.background?.type === 'image' && (
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Background Image Link or Upload</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={themeSettings.background?.value || ''}
                                onChange={(e) => {
                                  setThemeSettings({
                                    ...themeSettings,
                                    background: { ...themeSettings.background, value: e.target.value }
                                  });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                                placeholder="https://images.unsplash.com/photo-1557683316-973673baf926"
                              />
                              <label className="cursor-pointer shrink-0 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                                Upload
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleBgImageUpload} 
                                />
                              </label>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Preset Images</label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500', // Modern Abstract Glass
                                'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500', // Violet Gradient Mesh
                                'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=500', // Deep Space Northern Lights
                                'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=500'  // Vibrant Paint Abstract
                              ].map((imgUrl, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setThemeSettings({
                                      ...themeSettings,
                                      background: { ...themeSettings.background, value: imgUrl }
                                    });
                                  }}
                                  className={`h-12 border rounded-lg cursor-pointer overflow-hidden shadow-sm hover:scale-[1.04] transition-all duration-200 ${themeSettings.background?.value === imgUrl ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'}`}
                                >
                                  <img src={imgUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Background Blur ({themeSettings.background?.blur || '0px'})
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                value={parseInt(themeSettings.background?.blur) || 0}
                                onChange={(e) => {
                                  setThemeSettings({
                                    ...themeSettings,
                                    background: { ...themeSettings.background, blur: `${e.target.value}px` }
                                  });
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-1"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Overlay Opacity ({Math.round((themeSettings.background?.overlayOpacity ?? 0.3) * 100)}%)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="0.9"
                                step="0.05"
                                value={themeSettings.background?.overlayOpacity !== undefined ? themeSettings.background?.overlayOpacity : 0.3}
                                onChange={(e) => {
                                  setThemeSettings({
                                    ...themeSettings,
                                    background: { ...themeSettings.background, overlayOpacity: parseFloat(e.target.value) }
                                  });
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-1"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Brightness ({Math.round((themeSettings.background?.brightness ?? 0.8) * 100)}%)
                              </label>
                              <input
                                type="range"
                                min="0.2"
                                max="1.2"
                                step="0.05"
                                value={themeSettings.background?.brightness !== undefined ? themeSettings.background?.brightness : 0.8}
                                onChange={(e) => {
                                  setThemeSettings({
                                    ...themeSettings,
                                    background: { ...themeSettings.background, brightness: parseFloat(e.target.value) }
                                  });
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {themeSettings.background?.type === 'video' && (
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-700">Background MP4 Video Link</label>
                          <input
                            type="text"
                            value={themeSettings.background?.value || ''}
                            onChange={(e) => {
                              setThemeSettings({
                                ...themeSettings,
                                background: { ...themeSettings.background, value: e.target.value }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                            placeholder="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4"
                          />
                        </div>
                      )}
                    </div>
                  )}


                  {/* SUB-TAB 7: Buttons */}
                  {themeSubTab === 'buttons' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Button Configuration</h4>
                        <p className="text-xs text-gray-500 mt-1">Configure action buttons (Save Contact, Send request, Custom buttons).</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Button Style</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['filled', 'outlined', 'ghost', 'gradient'].map((btnStyle) => (
                            <button
                              key={btnStyle}
                              type="button"
                              onClick={() => {
                                setThemeSettings({
                                  ...themeSettings,
                                  buttons: { ...themeSettings.buttons, style: btnStyle }
                                });
                              }}
                              className={`px-4 py-2 text-xs font-semibold rounded-lg border capitalize transition-all cursor-pointer ${themeSettings.buttons?.style === btnStyle
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                              {btnStyle}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SUB-TAB 8: Layout */}
                  {themeSubTab === 'layout' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Grid & Layout</h4>
                        <p className="text-xs text-gray-500 mt-1">Adjust width, content alignment, and structure presets for the public screen.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Layout Preset</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['centered', 'modern', 'minimal', 'compact', 'business', 'creative'].map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => {
                                setThemeSettings({
                                  ...themeSettings,
                                  layout: {
                                    ...themeSettings.layout,
                                    style: l,
                                    alignment: l === 'centered' ? 'center' : 'left'
                                  }
                                });
                              }}
                              className={`px-4 py-2 text-xs font-semibold rounded-lg border capitalize transition-all cursor-pointer ${themeSettings.layout?.style === l
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {themeSubTab === 'avatar' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Avatar Frame Styling</h4>
                        <p className="text-xs text-gray-500 mt-1">Configure user photo frame shapes and custom border designs.</p>
                      </div>

                      <div>
                        {/* Avatar Setup */}
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Avatar Shape</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {['circle', 'rounded', 'square'].map((sh) => (
                            <button
                              key={sh}
                              type="button"
                              onClick={() => {
                                setThemeSettings({
                                  ...themeSettings,
                                  avatar: { ...themeSettings.avatar, shape: sh }
                                });
                              }}
                              className={`px-3 py-2 text-xs font-semibold rounded-lg border capitalize transition-all cursor-pointer ${themeSettings.avatar?.shape === sh
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                              {sh}
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Border Value</label>
                            <input
                              type="text"
                              value={themeSettings.avatar?.border || '3px solid rgba(255,255,255,0.2)'}
                              onChange={(e) => {
                                setThemeSettings({
                                  ...themeSettings,
                                  avatar: { ...themeSettings.avatar, border: e.target.value }
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">Avatar Border Glow</span>
                            <input
                              type="checkbox"
                              checked={themeSettings.avatar?.glow === 'glow'}
                              onChange={(e) => {
                                setThemeSettings({
                                  ...themeSettings,
                                  avatar: { ...themeSettings.avatar, glow: e.target.checked ? 'glow' : 'none' }
                                });
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 10: Sections reordering */}
                  {themeSubTab === 'sections' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Visible Sections & Order</h4>
                        <p className="text-xs text-gray-500 mt-1">Reorder profile layers using up/down controls, and toggle visibility switchers.</p>
                      </div>

                      {/* List of sections with reordering controls */}
                      <div className="space-y-3">
                        {((themeSettings.sections?.order as string[]) || ["about", "contact", "socials", "portfolio", "projects"]).map((sec, idx, arr) => {
                          const isVisible = themeSettings.sections?.visibility?.[sec] !== false;
                          return (
                            <div key={sec} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const newOrder = [...arr];
                                      const temp = newOrder[idx];
                                      newOrder[idx] = newOrder[idx - 1];
                                      newOrder[idx - 1] = temp;
                                      setThemeSettings({
                                        ...themeSettings,
                                        sections: { ...themeSettings.sections, order: newOrder }
                                      });
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === arr.length - 1}
                                    onClick={() => {
                                      const newOrder = [...arr];
                                      const temp = newOrder[idx];
                                      newOrder[idx] = newOrder[idx + 1];
                                      newOrder[idx + 1] = temp;
                                      setThemeSettings({
                                        ...themeSettings,
                                        sections: { ...themeSettings.sections, order: newOrder }
                                      });
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div>
                                  <span className="block text-sm font-bold text-gray-800 capitalize">{sec} Section</span>
                                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Position {idx + 1}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={(e) => {
                                      setThemeSettings({
                                        ...themeSettings,
                                        sections: {
                                          ...themeSettings.sections,
                                          visibility: {
                                            ...themeSettings.sections?.visibility,
                                            [sec]: e.target.checked
                                          }
                                        }
                                      });
                                    }}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:width-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                   )}

                  {/* SUB-TAB 12: Animations */}
                  {themeSubTab === 'animations' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">Motion & Interaction Effects</h4>
                        <p className="text-xs text-gray-500 mt-1">Unlock micro-animations, transitions, and hover lifting events.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Page Entrance Animation</label>
                          <select
                            value={themeSettings.animations?.style || 'fade'}
                            onChange={(e) => {
                              setThemeSettings({
                                ...themeSettings,
                                animations: { ...themeSettings.animations, style: e.target.value }
                              });
                            }}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                          >
                            <option value="fade">Fade In</option>
                            <option value="slide">Slide Up Entrance</option>
                            <option value="scale">Scale Up Entrance</option>
                            <option value="none">None</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-3 mt-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">Enable Cursor Glow Light</span>
                            <input
                              type="checkbox"
                              checked={themeSettings.animations?.cursorGlow || false}
                              onChange={(e) => {
                                setThemeSettings({
                                  ...themeSettings,
                                  animations: { ...themeSettings.animations, cursorGlow: e.target.checked }
                                });
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">Parallax Scroll Effects</span>
                            <input
                              type="checkbox"
                              checked={themeSettings.animations?.parallax || false}
                              onChange={(e) => {
                                setThemeSettings({
                                  ...themeSettings,
                                  animations: { ...themeSettings.animations, parallax: e.target.checked }
                                });
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 13: Marketplace */}
                  {themeSubTab === 'marketplace' && (
                    <div className="flex flex-col gap-6">
                      <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Community Marketplace</h4>
                          <p className="text-xs text-gray-500 mt-1">Browse, install, and share creative page themes with others.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const pName = prompt('Enter a name for this custom theme:');
                            if (pName) {
                              setPublishThemeName(pName);
                              // Set immediately or call publish
                              fetch('/api/profile/theme/marketplace', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'publish', themeName: pName, settings: themeSettings })
                              })
                                .then(() => {
                                  setSuccess('Theme published!');
                                  fetchMarketplace();
                                  setTimeout(() => setSuccess(''), 2500);
                                });
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-all"
                        >
                          Publish Theme
                        </button>
                      </div>

                      {/* Marketplace themes grid */}
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {marketplaceThemes.map((theme) => {
                          const isOwner = profile && theme.userId === profile.userId;
                          return (
                            <div key={theme.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl gap-3">
                              <div className="min-w-0">
                                <span className="block text-sm font-bold text-gray-900 truncate">{theme.themeName}</span>
                                <span className="block text-[10px] text-gray-400 font-semibold uppercase mt-0.5">By {theme.user?.name || 'Tapfolio Creator'}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => likeMarketplaceTheme(theme.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 hover:border-red-400 rounded-lg text-xs font-bold text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <Heart className="w-3.5 h-3.5 fill-red-500 stroke-red-500" />
                                  <span>{theme.likesCount}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => installMarketplaceTheme(theme.id)}
                                  className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                  Install
                                </button>
                                {isOwner && (
                                  <button
                                    type="button"
                                    title="Delete your theme from marketplace"
                                    onClick={() => deleteMarketplaceTheme(theme.id, theme.themeName)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {marketplaceThemes.length === 0 && (
                          <p className="text-center text-xs text-gray-400 py-10 italic">No community themes published yet. Be the first!</p>
                        )}
                      </div>
                    </div>
                  )}


                  {/* Unified Customize Theme Save block (Always visible for theme config tabs) */}
                  {themeSubTab !== 'profile' && (
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center gap-3">
                      <button
                        type="button"
                        onClick={resetThemeToDefault}
                        className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      >
                        Reset Default
                      </button>
                      <button
                        type="button"
                        onClick={saveTheme}
                        disabled={savingTheme}
                        className="px-6 py-2.5 bg-gray-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        {savingTheme ? 'Saving Theme...' : 'Save Current Theme'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Portfolio Projects</h3>
                    <p className="text-gray-500 text-sm mt-1">Showcase your best works: websites, mobile apps, designs, and case studies.</p>
                  </div>
                </div>

                {showProjectForm ? (
                  <form onSubmit={handleCreateOrUpdateProject} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Name</label>
                        <input
                          type="text"
                          required
                          value={pName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Tapfolio Dashboard"
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project URL Slug</label>
                        <input
                          type="text"
                          required
                          value={pSlug}
                          onChange={(e) => setPSlug(e.target.value)}
                          placeholder="e.g. tapfolio-dashboard"
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="UI/UX">UI/UX</option>
                          <option value="Open Source">Open Source</option>
                          <option value="AI">AI</option>
                          <option value="Research">Research</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                        <select
                          value={pStatus}
                          onChange={(e) => setPStatus(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="PLANNED">Planned</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description (Max 150 chars)</label>
                      <input
                        type="text"
                        required
                        maxLength={150}
                        value={pShortDesc}
                        onChange={(e) => setPShortDesc(e.target.value)}
                        placeholder="Brief summary of what this project is about..."
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Description</label>
                      <textarea
                        rows={5}
                        value={pFullDesc}
                        onChange={(e) => setPFullDesc(e.target.value)}
                        placeholder="Detail the stack used, the problems solved, and final achievements..."
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          value={pCoverImage}
                          onChange={(e) => setPCoverImage(e.target.value)}
                          placeholder="Image URL or upload a file..."
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                        <label className="cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all whitespace-nowrap">
                          {uploadingCover ? 'Uploading...' : 'Choose File'}
                          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Demo Link</label>
                        <input
                          type="url"
                          value={pLiveDemo}
                          onChange={(e) => setPLiveDemo(e.target.value)}
                          placeholder="https://..."
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GitHub Link</label>
                        <input
                          type="url"
                          value={pGithub}
                          onChange={(e) => setPGithub(e.target.value)}
                          placeholder="https://github.com/..."
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">App Store Link</label>
                        <input
                          type="url"
                          value={pAppStore}
                          onChange={(e) => setPAppStore(e.target.value)}
                          placeholder="https://apps.apple.com/..."
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Play Store Link</label>
                        <input
                          type="url"
                          value={pPlayStore}
                          onChange={(e) => setPPlayStore(e.target.value)}
                          placeholder="https://play.google.com/..."
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Documentation Link</label>
                        <input
                          type="url"
                          value={pDocumentation}
                          onChange={(e) => setPDocumentation(e.target.value)}
                          placeholder="https://..."
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Case Study Link</label>
                        <input
                          type="url"
                          value={pCaseStudy}
                          onChange={(e) => setPCaseStudy(e.target.value)}
                          placeholder="https://..."
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Technologies (Comma-separated tags)</label>
                      <input
                        type="text"
                        value={pTechStack}
                        onChange={(e) => setPTechStack(e.target.value)}
                        placeholder="Next.js, React, Prisma, PostgreSQL"
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                        <input
                          type="date"
                          value={pStartDate}
                          onChange={(e) => setPStartDate(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Date (optional)</label>
                        <input
                          type="date"
                          value={pEndDate}
                          onChange={(e) => setPEndDate(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-100 rounded-xl bg-gray-50">
                        <input type="checkbox" checked={pIsPublic} onChange={(e) => setPIsPublic(e.target.checked)} className="rounded text-blue-600" />
                        <span className="text-xs font-semibold text-gray-700">Public Page</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-100 rounded-xl bg-gray-50">
                        <input type="checkbox" checked={pIsFeatured} onChange={(e) => setPIsFeatured(e.target.checked)} className="rounded text-blue-600" />
                        <span className="text-xs font-semibold text-gray-700">Featured</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-100 rounded-xl bg-gray-50">
                        <input type="checkbox" checked={pPinned} onChange={(e) => setPPinned(e.target.checked)} className="rounded text-blue-600" />
                        <span className="text-xs font-semibold text-gray-700">Pin to Top</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-100 rounded-xl bg-gray-50">
                        <input type="checkbox" checked={pShowCover} onChange={(e) => setPShowCover(e.target.checked)} className="rounded text-blue-600" />
                        <span className="text-xs font-semibold text-gray-700">Show Cover</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setShowProjectForm(false); resetProjectForm(); }}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-sm transition-all"
                      >
                        {saving ? 'Saving...' : 'Save Project'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {loadingProjects ? (
                      <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="relative overflow-hidden border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
                            {/* Thumbnail skeleton */}
                            <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" style={{ animation: `shimmer 1.8s ease-in-out ${i * 0.15}s infinite` }} />
                            {/* Text skeletons */}
                            <div className="flex-1 flex flex-col gap-2.5">
                              <div className="h-4 w-2/5 rounded-full bg-gray-100" style={{ animation: `shimmer 1.8s ease-in-out ${i * 0.15 + 0.05}s infinite` }} />
                              <div className="h-3 w-3/4 rounded-full bg-gray-50" style={{ animation: `shimmer 1.8s ease-in-out ${i * 0.15 + 0.1}s infinite` }} />
                            </div>
                            {/* Action skeleton */}
                            <div className="w-8 h-8 rounded-lg bg-gray-50 shrink-0" style={{ animation: `shimmer 1.8s ease-in-out ${i * 0.15 + 0.15}s infinite` }} />
                            <style>{`
                              @keyframes shimmer {
                                0%, 100% { opacity: 0.4; }
                                50% { opacity: 1; }
                              }
                            `}</style>
                          </div>
                        ))}
                        <p className="text-center text-xs text-gray-400 pt-1 tracking-wide">Loading projects…</p>
                      </div>
                    ) : projects.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl font-bold"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                        <div>
                          <p className="font-bold text-gray-900">No projects added yet</p>
                          <p className="text-sm text-gray-500 mt-1">Showcase your apps, designs, and achievements immediately on your public profile.</p>
                        </div>
                        <button
                          onClick={() => { resetProjectForm(); setShowProjectForm(true); }}
                          className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-sm transition-all"
                        >
                          Add Your First Project
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projects.map((proj) => (
                          <div key={proj.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                            <div>
                              {proj.coverImage && (
                                <img src={proj.coverImage} alt={proj.name} className="w-full h-36 object-cover" />
                              )}
                              <div className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{proj.category}</span>
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full font-semibold text-gray-600">{proj.status}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{proj.name}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{proj.shortDesc}</p>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                              <div className="flex gap-2">
                                {proj.isFeatured && <span className="text-xs px-2 py-0.5 bg-blue-50 border border-blue-100 rounded font-bold text-blue-600">Featured</span>}
                                {proj.isPublic ? <span className="text-xs px-2 py-0.5 bg-green-50 border border-green-100 rounded font-bold text-green-600">Public</span> : <span className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 rounded font-bold text-gray-500">Private</span>}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProjectClick(proj)}
                                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProjectClick(proj.id)}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'sharing' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Information Sharing</h3>
                <p className="text-gray-500 text-sm mb-8">Control exactly what information is requested and shared when someone taps your card.</p>

                <div className="space-y-4 mb-8">
                  {[
                    { id: 'shareName', label: 'Share Name & Photo', desc: 'Display your basic identity on the connection screen.' },
                    { id: 'shareEmail', label: 'Share Email Address', desc: 'Allow contacts to save your primary email.' },
                    { id: 'sharePhone', label: 'Share Phone Number', desc: 'Allow contacts to call or text you directly.' },
                    { id: 'shareWhatsapp', label: 'Share WhatsApp', desc: 'Include a direct WhatsApp messaging link.' },
                    { id: 'shareLocation', label: 'Share Office Location', desc: 'Display your company address or city.' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={sharingSettings[setting.id as keyof SharingSettings]} onChange={(e) => setSharingSettings({ ...sharingSettings, [setting.id]: e.target.checked })} />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSaveSharingSettings} disabled={savingSharing} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-sm transition-all disabled:opacity-50">
                    {savingSharing ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* SUPPORT & FEEDBACK TAB */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reviews & Complaints</h3>
                  <p className="text-gray-500 text-sm mt-1">Submit feedback, report system issues, or share complaints. Your name and account email will automatically be attached to the message.</p>
                </div>

                {supportSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                    {supportSuccess}
                  </div>
                )}

                {supportError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                    {supportError}
                  </div>
                )}

                <form onSubmit={handleCreateSupportTicket} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                    <select
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Feedback/Complaint">General Feedback / Complaint</option>
                      <option value="Bug Report">Technical Bug Report</option>
                      <option value="Feature Request">New Feature Request</option>
                      <option value="Account Issue">Account Billing & Access Support</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Description</label>
                    <textarea
                      rows={6}
                      required
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Please write the details of your review or complaint here..."
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={submittingSupport}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                    >
                      {submittingSupport ? 'Submitting...' : 'Send to Admin'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN - LIVE PREVIEW */}
          {activeTab === 'customizer' && (
            <div className="lg:col-span-5 self-stretch">
              <div className="lg:sticky lg:top-28 flex flex-col items-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-3.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-gray-400 animate-pulse" /> Your Live Tapfolio Showcase
                </div>

                {/* Smartphone Frame mockup */}
                <div className="w-[310px] h-[580px] sm:w-[335px] sm:h-[650px] rounded-[40px] border-[10px] border-gray-900 shadow-2xl overflow-hidden bg-gray-100 relative flex flex-col">
                  {/* Speaker Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-3.5 w-24 bg-gray-900 rounded-b-xl z-30" />

                  {/* iPhone Status Bar */}
                  <div className="h-9 bg-slate-900 text-white flex items-center justify-between px-5 text-[11px] font-semibold select-none z-20 shrink-0 font-sans">
                    <span>12:48</span>
                    <div className="flex items-center gap-1.5">
                      {/* Cellular Signal Bars */}
                      <div className="flex items-end gap-[1.5px] h-2">
                        <div className="w-[2.5px] h-[3px] bg-white rounded-sm" />
                        <div className="w-[2.5px] h-[5px] bg-white rounded-sm" />
                        <div className="w-[2.5px] h-[7px] bg-white rounded-sm" />
                        <div className="w-[2.5px] h-[8.5px] bg-white rounded-sm" />
                      </div>
                      {/* Wifi Icon */}
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 20h.01M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 14 0M1.5 9.5a15 15 0 0 1 21 0" strokeLinecap="round" />
                      </svg>
                      {/* Battery Icon */}
                      <div className="w-5 h-2.5 border border-white/60 rounded-[3px] p-[1.5px] flex items-center relative">
                        <div className="w-3.5 h-full bg-white rounded-[1.5px]" />
                        <div className="w-[1.5px] h-1.5 bg-white/60 absolute -right-[2.5px] top-[1.5px] rounded-r-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Smartphone Screen Area */}
                  <div className="flex-1 overflow-hidden overflow-y-auto scrollbar-none relative bg-gray-50 isolate" style={{ contain: 'layout paint' }}>
                    {themeSettings ? (
                      <ConnectClientPage
                        username={profile?.username || ''}
                        profile={{
                          id: profile?.id || 0,
                          userId: profile?.userId || 0,
                          name: name || 'Your Name',
                          avatar: avatar || '/profile_avatar.png',
                          isPremium: isPremium,
                          tagline: tagline || 'Tagline',
                          portfolioUrl: portfolioUrl,
                          resumeUrl: resumeUrl,
                          whatsapp: whatsapp
                        }}
                        isLoggedIn={false}
                        previewTheme={themeSettings}
                        previewProfileData={{
                          tags,
                          socials,
                          location,
                          bio,
                          projects,
                          portfolioUrl,
                          resumeUrl,
                          whatsapp
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400 animate-pulse">Loading visual showcase...</div>
                    )}
                  </div>

                  {/* Safari-style Address Bar at Bottom */}
                  <div className="bg-slate-100/95 backdrop-blur-md border-t border-slate-200/50 py-2 px-4 flex items-center justify-between gap-3 text-gray-700 select-none z-20 shrink-0 font-sans">
                    <div className="flex gap-4">
                      {/* Back Arrow */}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      {/* Forward Arrow */}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>

                    {/* URL Input mock */}
                    <div className="flex-1 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px] text-gray-800 shadow-sm gap-1.5">
                      {/* Lock icon */}
                      <svg className="w-2.5 h-2.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-slate-700 truncate tracking-wide">
                        {profile?.username ? `${typeof window !== 'undefined' ? window.location.host : 'tapfolio.me'}/@${profile.username}` : (typeof window !== 'undefined' ? window.location.host : 'tapfolio.me')}
                      </span>
                      {/* Refresh icon */}
                      <svg className="w-3 h-3 text-gray-450 hover:text-gray-900 cursor-pointer shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>

                    {/* Options/More icon */}
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {showCropModal && cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}