import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config.js';

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
    letter: { defaultGreeting: string; defaultContent: string; defaultClosing: string };
    about: {
        defaultIntro: string;
        traitOneTitle: string;
        traitOneDescription: string;
        traitTwoTitle: string;
        traitTwoDescription: string;
        traitThreeTitle: string;
        traitThreeDescription: string;
        quoteText: string;
        quoteAuthor: string;
    };
    startDate: string;        // ISO date string, e.g. "2024-07-24"
    isSetupComplete: boolean;
}

export interface TimeProgressConfig {
    birthDate: string;
    lifeExpectancyYears: number;
    breathingRatePerMinute: number;
    seasons: {
        spring: { min: number; max: number; label: string };
        summer: { min: number; max: number; label: string };
        autumn: { min: number; max: number; label: string };
        winter: { min: number; max: number; label: string };
    };
    publicPreviewEnabled: boolean;
}

export type FeaturePortal = 'public' | 'universe' | 'core';

export interface FeatureVisibilityConfig {
    public: Record<string, boolean>;
    universe: Record<string, boolean>;
    core: Record<string, boolean>;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: SiteConfig = {
    siteName: 'Chronicles',
    siteTagline: 'A private space for our story',
    partnerA: {
        nickname: 'Partner A',
        displayName: 'Partner A',
        roleLabel: 'Her',
        defaultTitle: 'The Main Character',
        defaultBio: 'Orang yang selalu ingin kamu rayakan di tempat ini.',
        pageSlug: 'her',
        colorTheme: 'pink',
    },
    partnerB: {
        nickname: 'Partner B',
        displayName: 'Partner B',
        roleLabel: 'Him',
        defaultTitle: 'The Storyteller',
        defaultBio: 'Seseorang yang ingin menyimpan semua cerita kalian di satu tempat.',
        pageSlug: 'him',
        colorTheme: 'blue',
    },
    letter: {
        defaultGreeting: 'Untukmu,',
        defaultContent: 'Terima kasih sudah bertahan, tumbuh, dan berjalan bersamaku sampai hari ini.',
        defaultClosing: 'Dengan sayang.',
    },
    about: {
        defaultIntro: 'Di antara banyak kemungkinan, aku bersyukur kita bertemu dan memilih jalan yang sama.',
        traitOneTitle: 'Setia',
        traitOneDescription: 'Tetap hadir bahkan di hari-hari paling berat.',
        traitTwoTitle: 'Bertumbuh',
        traitTwoDescription: 'Berani belajar demi hubungan yang lebih baik.',
        traitThreeTitle: 'Hangat',
        traitThreeDescription: 'Selalu jadi rumah saat dunia terasa ramai.',
        quoteText: 'Semua proses ini selalu terasa layak, selama akhirnya pulang ke kamu.',
        quoteAuthor: 'A Love Note',
    },
    startDate: '',
    isSetupComplete: false,
};

export const DEFAULT_TIME_PROGRESS_CONFIG: TimeProgressConfig = {
    birthDate: '2002-03-18',
    lifeExpectancyYears: 80,
    breathingRatePerMinute: 15,
    seasons: {
        spring: { min: 0, max: 20, label: 'Learning & Growing' },
        summer: { min: 21, max: 40, label: 'Building & Hustling' },
        autumn: { min: 41, max: 60, label: 'Reflecting & Refining' },
        winter: { min: 61, max: 120, label: 'Legacy & Wisdom' }
    },
    publicPreviewEnabled: true
};

export const DEFAULT_FEATURE_VISIBILITY_CONFIG: FeatureVisibilityConfig = {
    public: {
        progressPreview: true,
        onThisDayPreview: false,
        ourStoryProgressPreview: false
    },
    universe: {
        progressWidgets: true,
        dailyDashboard: true,
        moodJournal: true,
        notesAndReminders: true,
        projectTracker: true,
        letterbox: true,
        financeTracker: true,
        sharedLinkArchive: true,
        aiAssistant: false,
        moodPlaylist: false
    },
    core: {
        timeProgressConfig: true,
        featureVisibilityConfig: true,
        integrationConfig: true
    }
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

export async function loadTimeProgressConfig(): Promise<TimeProgressConfig> {
    try {
        const snap = await getDoc(doc(db, 'config', 'timeProgress'));
        const config: TimeProgressConfig = snap.exists()
            ? deepMerge(DEFAULT_TIME_PROGRESS_CONFIG, snap.data()) as TimeProgressConfig
            : await ensureTimeProgressConfig();
        win.timeProgressConfig = config;
        return config;
    } catch (err) {
        console.error('Error loading time progress config:', err);
        win.timeProgressConfig = DEFAULT_TIME_PROGRESS_CONFIG;
        return DEFAULT_TIME_PROGRESS_CONFIG;
    }
}

export async function saveTimeProgressConfig(partial: Partial<TimeProgressConfig>): Promise<void> {
    const current: TimeProgressConfig = win.timeProgressConfig ?? DEFAULT_TIME_PROGRESS_CONFIG;
    const next = deepMerge(current, partial) as TimeProgressConfig;
    await setDoc(doc(db, 'config', 'timeProgress'), next, { merge: true });
    win.timeProgressConfig = next;
}

export async function loadFeatureVisibilityConfig(): Promise<FeatureVisibilityConfig> {
    try {
        const snap = await getDoc(doc(db, 'config', 'featureVisibility'));
        const config: FeatureVisibilityConfig = snap.exists()
            ? deepMerge(DEFAULT_FEATURE_VISIBILITY_CONFIG, snap.data()) as FeatureVisibilityConfig
            : await ensureFeatureVisibilityConfig();
        win.featureVisibilityConfig = config;
        return config;
    } catch (err) {
        console.error('Error loading feature visibility config:', err);
        win.featureVisibilityConfig = DEFAULT_FEATURE_VISIBILITY_CONFIG;
        return DEFAULT_FEATURE_VISIBILITY_CONFIG;
    }
}

export async function saveFeatureVisibilityConfig(partial: Partial<FeatureVisibilityConfig>): Promise<void> {
    const current: FeatureVisibilityConfig = win.featureVisibilityConfig ?? DEFAULT_FEATURE_VISIBILITY_CONFIG;
    const next = deepMerge(current, partial) as FeatureVisibilityConfig;
    await setDoc(doc(db, 'config', 'featureVisibility'), next, { merge: true });
    win.featureVisibilityConfig = next;
}

export async function setSingleFeatureVisibility(
    portal: FeaturePortal,
    featureKey: string,
    isVisible: boolean
): Promise<FeatureVisibilityConfig> {
    const current = await loadFeatureVisibilityConfig();
    const next: FeatureVisibilityConfig = {
        ...current,
        [portal]: {
            ...(current[portal] || {}),
            [featureKey]: !!isVisible
        }
    };
    await saveFeatureVisibilityConfig(next);
    return next;
}

export async function isFeatureVisible(
    portal: FeaturePortal,
    featureKey: string,
    fallback = true
): Promise<boolean> {
    const config = await loadFeatureVisibilityConfig();
    const portalConfig = config?.[portal] || {};
    if (portalConfig[featureKey] === undefined) return fallback;
    return !!portalConfig[featureKey];
}

export async function ensureTimeProgressConfig(): Promise<TimeProgressConfig> {
    const seeded = deepMerge({}, DEFAULT_TIME_PROGRESS_CONFIG) as TimeProgressConfig;
    await setDoc(doc(db, 'config', 'timeProgress'), seeded, { merge: true });
    win.timeProgressConfig = seeded;
    return seeded;
}

export async function ensureFeatureVisibilityConfig(): Promise<FeatureVisibilityConfig> {
    const seeded = deepMerge({}, DEFAULT_FEATURE_VISIBILITY_CONFIG) as FeatureVisibilityConfig;
    await setDoc(doc(db, 'config', 'featureVisibility'), seeded, { merge: true });
    win.featureVisibilityConfig = seeded;
    return seeded;
}

export async function ensureFeatureConfigDefaults(): Promise<void> {
    await Promise.all([
        ensureTimeProgressConfig(),
        ensureFeatureVisibilityConfig()
    ]);
}

win.saveUniverseFeatureConfigForm = async function () {
    const btn = document.getElementById('btn-save-feature-config') as HTMLButtonElement | null;
    if (!btn) return;

    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Saving...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        const inputValue = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value?.trim() ?? '';
        const inputChecked = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.checked ?? false;

        const timeProgressPartial: Partial<TimeProgressConfig> = {
            birthDate: inputValue('config-time-birthDate') || DEFAULT_TIME_PROGRESS_CONFIG.birthDate,
            lifeExpectancyYears: Number(inputValue('config-time-lifeExpectancyYears') || DEFAULT_TIME_PROGRESS_CONFIG.lifeExpectancyYears),
            breathingRatePerMinute: Number(inputValue('config-time-breathingRatePerMinute') || DEFAULT_TIME_PROGRESS_CONFIG.breathingRatePerMinute),
            publicPreviewEnabled: inputChecked('config-time-publicPreviewEnabled'),
            seasons: {
                spring: {
                    ...DEFAULT_TIME_PROGRESS_CONFIG.seasons.spring,
                    ...(win.timeProgressConfig?.seasons?.spring || {}),
                    label: inputValue('config-time-spring-label') || DEFAULT_TIME_PROGRESS_CONFIG.seasons.spring.label
                },
                summer: {
                    ...DEFAULT_TIME_PROGRESS_CONFIG.seasons.summer,
                    ...(win.timeProgressConfig?.seasons?.summer || {}),
                    label: inputValue('config-time-summer-label') || DEFAULT_TIME_PROGRESS_CONFIG.seasons.summer.label
                },
                autumn: {
                    ...DEFAULT_TIME_PROGRESS_CONFIG.seasons.autumn,
                    ...(win.timeProgressConfig?.seasons?.autumn || {}),
                    label: inputValue('config-time-autumn-label') || DEFAULT_TIME_PROGRESS_CONFIG.seasons.autumn.label
                },
                winter: {
                    ...DEFAULT_TIME_PROGRESS_CONFIG.seasons.winter,
                    ...(win.timeProgressConfig?.seasons?.winter || {}),
                    label: inputValue('config-time-winter-label') || DEFAULT_TIME_PROGRESS_CONFIG.seasons.winter.label
                }
            }
        };

        const featureVisibilityPartial: Partial<FeatureVisibilityConfig> = {
            public: {
                progressPreview: inputChecked('config-visibility-public-progressPreview'),
                onThisDayPreview: inputChecked('config-visibility-public-onThisDayPreview'),
                ourStoryProgressPreview: inputChecked('config-visibility-public-ourStoryProgressPreview')
            },
            universe: {
                progressWidgets: inputChecked('config-visibility-universe-progressWidgets'),
                dailyDashboard: inputChecked('config-visibility-universe-dailyDashboard'),
                moodJournal: inputChecked('config-visibility-universe-moodJournal'),
                notesAndReminders: inputChecked('config-visibility-universe-notesAndReminders'),
                projectTracker: inputChecked('config-visibility-universe-projectTracker'),
                letterbox: inputChecked('config-visibility-universe-letterbox')
            },
            core: {
                timeProgressConfig: inputChecked('config-visibility-core-timeProgressConfig'),
                featureVisibilityConfig: inputChecked('config-visibility-core-featureVisibilityConfig'),
                integrationConfig: inputChecked('config-visibility-core-integrationConfig')
            }
        };

        await Promise.all([
            saveTimeProgressConfig(timeProgressPartial),
            saveFeatureVisibilityConfig(featureVisibilityPartial)
        ]);

        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Saved!';
        btn.classList.replace('bg-slate-700', 'bg-green-500');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.replace('bg-green-500', 'bg-slate-700');
            btn.disabled = false;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
    } catch (err: any) {
        console.error('Save feature config error:', err);
        btn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i> Error!';
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => {
            alert('Failed to save feature config: ' + err.message);
            btn.innerHTML = original;
        }, 800);
    }
};

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
            letter: {
                defaultGreeting: g('config-letter-greeting') || DEFAULT_CONFIG.letter.defaultGreeting,
                defaultContent:  g('config-letter-content')  || DEFAULT_CONFIG.letter.defaultContent,
                defaultClosing:  g('config-letter-closing')  || DEFAULT_CONFIG.letter.defaultClosing,
            },
            about: {
                defaultIntro:            g('config-about-intro')               || DEFAULT_CONFIG.about.defaultIntro,
                traitOneTitle:           g('config-about-trait-1-title')       || DEFAULT_CONFIG.about.traitOneTitle,
                traitOneDescription:     g('config-about-trait-1-description') || DEFAULT_CONFIG.about.traitOneDescription,
                traitTwoTitle:           g('config-about-trait-2-title')       || DEFAULT_CONFIG.about.traitTwoTitle,
                traitTwoDescription:     g('config-about-trait-2-description') || DEFAULT_CONFIG.about.traitTwoDescription,
                traitThreeTitle:         g('config-about-trait-3-title')       || DEFAULT_CONFIG.about.traitThreeTitle,
                traitThreeDescription:   g('config-about-trait-3-description') || DEFAULT_CONFIG.about.traitThreeDescription,
                quoteText:               g('config-about-quote-text')          || DEFAULT_CONFIG.about.quoteText,
                quoteAuthor:             g('config-about-quote-author')        || DEFAULT_CONFIG.about.quoteAuthor,
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
    p('letter-content', cfg.letter.defaultContent);
    p('letter-quote', cfg.letter.defaultClosing);
    const previewTitle = document.getElementById('letter-preview-title');
    if (previewTitle) previewTitle.textContent = cfg.letter.defaultGreeting;
    const previewQuote = document.getElementById('letter-preview-quote');
    if (previewQuote) previewQuote.textContent = `"${cfg.letter.defaultClosing}"`;
    const previewContent = document.getElementById('letter-preview-content');
    if (previewContent) previewContent.textContent = cfg.letter.defaultContent;

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
    v('config-letter-greeting',   cfg.letter.defaultGreeting);
    v('config-letter-content',    cfg.letter.defaultContent);
    v('config-letter-closing',    cfg.letter.defaultClosing);
    v('config-about-intro',               cfg.about.defaultIntro);
    v('config-about-trait-1-title',       cfg.about.traitOneTitle);
    v('config-about-trait-1-description', cfg.about.traitOneDescription);
    v('config-about-trait-2-title',       cfg.about.traitTwoTitle);
    v('config-about-trait-2-description', cfg.about.traitTwoDescription);
    v('config-about-trait-3-title',       cfg.about.traitThreeTitle);
    v('config-about-trait-3-description', cfg.about.traitThreeDescription);
    v('config-about-quote-text',          cfg.about.quoteText);
    v('config-about-quote-author',        cfg.about.quoteAuthor);
}

export function applyTimeProgressConfigToDOM(cfg: TimeProgressConfig): void {
    const value = (id: string, text: string | number) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.value = String(text ?? '');
    };
    const checked = (id: string, state: boolean) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.checked = !!state;
    };

    value('config-time-birthDate', cfg.birthDate);
    value('config-time-lifeExpectancyYears', cfg.lifeExpectancyYears);
    value('config-time-breathingRatePerMinute', cfg.breathingRatePerMinute);
    value('config-time-spring-label', cfg.seasons.spring.label);
    value('config-time-summer-label', cfg.seasons.summer.label);
    value('config-time-autumn-label', cfg.seasons.autumn.label);
    value('config-time-winter-label', cfg.seasons.winter.label);
    checked('config-time-publicPreviewEnabled', cfg.publicPreviewEnabled);
}

export function applyFeatureVisibilityConfigToDOM(cfg: FeatureVisibilityConfig): void {
    const checked = (id: string, state: boolean) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.checked = !!state;
    };

    checked('config-visibility-public-progressPreview', cfg.public.progressPreview);
    checked('config-visibility-public-onThisDayPreview', cfg.public.onThisDayPreview);
    checked('config-visibility-public-ourStoryProgressPreview', cfg.public.ourStoryProgressPreview);

    checked('config-visibility-universe-progressWidgets', cfg.universe.progressWidgets);
    checked('config-visibility-universe-dailyDashboard', cfg.universe.dailyDashboard);
    checked('config-visibility-universe-moodJournal', cfg.universe.moodJournal);
    checked('config-visibility-universe-notesAndReminders', cfg.universe.notesAndReminders);
    checked('config-visibility-universe-projectTracker', cfg.universe.projectTracker);
    checked('config-visibility-universe-letterbox', cfg.universe.letterbox);

    checked('config-visibility-core-timeProgressConfig', cfg.core.timeProgressConfig);
    checked('config-visibility-core-featureVisibilityConfig', cfg.core.featureVisibilityConfig);
    checked('config-visibility-core-integrationConfig', cfg.core.integrationConfig);
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
