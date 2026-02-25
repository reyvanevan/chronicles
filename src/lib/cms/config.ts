import { db } from '../firebase-config.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

declare const lucide: any;
const win = window as any;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PartnerConfig {
    nickname: string;       // short name, e.g. "Anya"
    displayName: string;    // full name, e.g. "Partner Full Name"
    roleLabel: string;      // role label, e.g. "Princess"
    defaultTitle: string;   // default profile title
    defaultBio: string;     // default bio/quote
    pageSlug: string;       // URL slug, e.g. "her"
    colorTheme: string;     // tailwind color name, e.g. "pink"
}

export interface SiteConfig {
    siteName: string;
    siteTagline: string;
    partnerA: PartnerConfig;  // the one the site is dedicated to
    partnerB: PartnerConfig;  // the one managing the site
    zeroMarker: { name: string; description: string };
    letter: { defaultGreeting: string; defaultClosing: string };
    startDate: string;        // ISO date string, e.g. "2024-07-24"
    isSetupComplete: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: SiteConfig = {
    siteName: 'Chronicles',
    siteTagline: 'Control Center',
    partnerA: {
        nickname: 'Her',
        displayName: 'Partner Name',
        roleLabel: 'Princess',
        defaultTitle: 'The Main Character',
        defaultBio: 'She is the poem I never knew how to write, and this life is the paper.',
        pageSlug: 'her',
        colorTheme: 'pink',
    },
    partnerB: {
        nickname: 'Rey',
        displayName: 'Your Name',
        roleLabel: 'Guardian',
        defaultTitle: 'The Observer',
        defaultBio: 'I see the universe in your eyes...',
        pageSlug: 'him',
        colorTheme: 'blue',
    },
    zeroMarker: {
        name: 'Sasuke Uchiha',
        description: '0% - Stranger/Friendzone marker',
    },
    letter: {
        defaultGreeting: 'Hai Anya...',
        defaultClosing: 'I love you, today and forever.',
    },
    startDate: '',
    isSetupComplete: false,
};

// ─── Load ─────────────────────────────────────────────────────────────────────

export async function loadSiteConfig(): Promise<SiteConfig> {
    try {
        const snap = await getDoc(doc(db, 'config', 'site'));
        const config: SiteConfig = snap.exists()
            ? deepMerge(DEFAULT_CONFIG, snap.data()) as SiteConfig
            : { ...DEFAULT_CONFIG };
        win.siteConfig = config;
        applyConfigToDOM(config);
        return config;
    } catch (err) {
        console.error('Error loading site config:', err);
        win.siteConfig = DEFAULT_CONFIG;
        return DEFAULT_CONFIG;
    }
}

// ─── Save ─────────────────────────────────────────────────────────────────────

export async function saveSiteConfig(partial: Partial<SiteConfig>): Promise<void> {
    const current: SiteConfig = win.siteConfig ?? DEFAULT_CONFIG;
    const next = deepMerge(current, { ...partial, isSetupComplete: true }) as SiteConfig;
    await setDoc(doc(db, 'config', 'site'), next);
    win.siteConfig = next;
    applyConfigToDOM(next);
}

// ─── Window handler (called from SectionSiteConfig save button) ───────────────

win.saveSiteConfigForm = async function () {
    const btn = document.getElementById('btn-save-site-config') as HTMLButtonElement;
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Saving...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        const g = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value?.trim() ?? '';

        const partial: Partial<SiteConfig> = {
            siteName: g('config-siteName') || DEFAULT_CONFIG.siteName,
            siteTagline: g('config-siteTagline') || DEFAULT_CONFIG.siteTagline,
            startDate: g('config-startDate'),
            partnerA: {
                nickname:     g('config-pA-nickname')     || DEFAULT_CONFIG.partnerA.nickname,
                displayName:  g('config-pA-displayName')  || DEFAULT_CONFIG.partnerA.displayName,
                roleLabel:    g('config-pA-roleLabel')    || DEFAULT_CONFIG.partnerA.roleLabel,
                defaultTitle: g('config-pA-defaultTitle') || DEFAULT_CONFIG.partnerA.defaultTitle,
                defaultBio:   g('config-pA-defaultBio')   || DEFAULT_CONFIG.partnerA.defaultBio,
                pageSlug:     g('config-pA-pageSlug')     || DEFAULT_CONFIG.partnerA.pageSlug,
                colorTheme:   win.siteConfig?.partnerA?.colorTheme ?? 'pink',
            },
            partnerB: {
                nickname:     g('config-pB-nickname')     || DEFAULT_CONFIG.partnerB.nickname,
                displayName:  g('config-pB-displayName')  || DEFAULT_CONFIG.partnerB.displayName,
                roleLabel:    g('config-pB-roleLabel')    || DEFAULT_CONFIG.partnerB.roleLabel,
                defaultTitle: g('config-pB-defaultTitle') || DEFAULT_CONFIG.partnerB.defaultTitle,
                defaultBio:   g('config-pB-defaultBio')   || DEFAULT_CONFIG.partnerB.defaultBio,
                pageSlug:     g('config-pB-pageSlug')     || DEFAULT_CONFIG.partnerB.pageSlug,
                colorTheme:   win.siteConfig?.partnerB?.colorTheme ?? 'blue',
            },
            zeroMarker: {
                name:        g('config-zeroMarker-name') || DEFAULT_CONFIG.zeroMarker.name,
                description: g('config-zeroMarker-desc') || DEFAULT_CONFIG.zeroMarker.description,
            },
            letter: {
                defaultGreeting: g('config-letter-greeting') || DEFAULT_CONFIG.letter.defaultGreeting,
                defaultClosing:  g('config-letter-closing')  || DEFAULT_CONFIG.letter.defaultClosing,
            },
        };

        await saveSiteConfig(partial);

        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Saved!';
        btn.classList.replace('bg-violet-500', 'bg-green-500');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.classList.replace('bg-green-500', 'bg-violet-500');
            btn.disabled = false;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
    } catch (err: any) {
        console.error('Save config error:', err);
        btn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i> Error!';
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => { alert('Failed to save: ' + err.message); btn.innerHTML = orig; }, 800);
    }
};

// ─── Apply to DOM ─────────────────────────────────────────────────────────────

export function applyConfigToDOM(cfg: SiteConfig): void {
    const s = (id: string, text: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    const p = (id: string, text: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el) el.placeholder = text;
    };
    const v = (id: string, text: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el) el.value = text;
    };

    // ── Site identity
    s('site-name-label', cfg.siteName);
    s('site-tagline-label', cfg.siteTagline);
    s('cms-welcome-header', `Welcome back, ${cfg.partnerB.nickname}! 👋`);

    // ── Sidebar nav
    s('nav-partnerA-profile', `${cfg.partnerA.roleLabel} Profile`);
    s('nav-partnerA-slug',    `${cfg.partnerA.pageSlug}.html`);
    s('nav-partnerB-profile', `${cfg.partnerB.roleLabel} Profile`);
    s('nav-partnerB-slug',    `${cfg.partnerB.pageSlug}.html`);

    // ── Partner A section
    s('section-partnerA-heading',          `${cfg.partnerA.roleLabel} Profile`);
    s('section-partnerA-subtitle',         `Data for ${cfg.partnerA.pageSlug}.html page`);
    s('section-partnerA-badge-role',       `The ${cfg.partnerA.roleLabel}`);
    s('section-partnerA-gallery-subtitle', `Photos shown on ${cfg.partnerA.pageSlug}.html`);

    // ── Zero marker
    s('section-zero-marker-label', `Upload ${cfg.zeroMarker.name} Image`);
    s('section-zero-marker-info',  `Upload gambar ${cfg.zeroMarker.name} atau karakter lain yang mewakili "friendzone".`);
    p('sasukeName',        cfg.zeroMarker.name);
    p('sasukeDescription', cfg.zeroMarker.description);

    // ── Partner B section
    s('section-partnerB-heading',          `${cfg.partnerB.roleLabel} Profile`);
    s('section-partnerB-subtitle',         `${cfg.partnerB.nickname}'s Profile Section`);
    s('section-partnerB-stickers-label',   `Stickers from ${cfg.partnerA.nickname}`);
    s('section-partnerB-sticker-prompt',   `Add a sticker for ${cfg.partnerB.nickname}:`);
    s('section-partnerB-badge-role',       `The ${cfg.partnerB.roleLabel}`);
    s('section-partnerB-gallery-subtitle', `Photos shown on ${cfg.partnerB.pageSlug}.html`);

    // ── Profile form placeholders
    p('input-name',          cfg.partnerA.displayName);
    p('input-princess-name', cfg.partnerA.displayName);
    p('input-princess-title',cfg.partnerA.defaultTitle);
    p('input-princess-bio',  cfg.partnerA.defaultBio);
    p('input-rey-name',      cfg.partnerB.displayName);
    p('input-rey-title',     cfg.partnerB.defaultTitle);
    p('input-rey-bio',       cfg.partnerB.defaultBio);

    // ── Letter defaults
    p('letter-title', cfg.letter.defaultGreeting);
    p('letter-quote', cfg.letter.defaultClosing);
    const previewTitle = document.getElementById('letter-preview-title');
    if (previewTitle) previewTitle.textContent = cfg.letter.defaultGreeting;
    const previewQuote = document.getElementById('letter-preview-quote');
    if (previewQuote) previewQuote.textContent = `"${cfg.letter.defaultClosing}"`;

    // ── Config form values (SectionSiteConfig)
    v('config-siteName',          cfg.siteName);
    v('config-siteTagline',       cfg.siteTagline);
    v('config-startDate',         cfg.startDate);
    v('config-pA-nickname',       cfg.partnerA.nickname);
    v('config-pA-displayName',    cfg.partnerA.displayName);
    v('config-pA-roleLabel',      cfg.partnerA.roleLabel);
    v('config-pA-defaultTitle',   cfg.partnerA.defaultTitle);
    v('config-pA-defaultBio',     cfg.partnerA.defaultBio);
    v('config-pA-pageSlug',       cfg.partnerA.pageSlug);
    v('config-pB-nickname',       cfg.partnerB.nickname);
    v('config-pB-displayName',    cfg.partnerB.displayName);
    v('config-pB-roleLabel',      cfg.partnerB.roleLabel);
    v('config-pB-defaultTitle',   cfg.partnerB.defaultTitle);
    v('config-pB-defaultBio',     cfg.partnerB.defaultBio);
    v('config-pB-pageSlug',       cfg.partnerB.pageSlug);
    v('config-zeroMarker-name',   cfg.zeroMarker.name);
    v('config-zeroMarker-desc',   cfg.zeroMarker.description);
    v('config-letter-greeting',   cfg.letter.defaultGreeting);
    v('config-letter-closing',    cfg.letter.defaultClosing);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source ?? {})) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] ?? {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}
