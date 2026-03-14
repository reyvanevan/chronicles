export const POST_TYPES = {
    PHOTO: 'photo',
    NOTE: 'note',
    STORY: 'story'
};

export const TAGS = ['Dates', 'Trips', 'Food', 'Silly', 'Random', 'Music', 'Tech', 'Work'];

export const FEATURE_COLLECTIONS = {
    moodEntries: 'moodEntries',
    quickNotes: 'quickNotes',
    projectTracks: 'projectTracks',
    letterbox: 'letterbox',
    financeEntries: 'financeEntries',
    sharedLinks: 'sharedLinks'
};

export const DEFAULT_FEATURE_VISIBILITY = {
    public: {
        progressPreview: true,
        onThisDayPreview: false,
        ourStoryProgressPreview: false
    },
    universe: {
        progressWidgets: true,
        dailyDashboard: true,
        moodJournal: true,
        letterbox: true,
        financeTracker: true,
        sharedLinks: true,
        aiAssistant: false,
        moodPlaylist: false
    },
    core: {
        timeProgressConfig: true,
        featureVisibilityConfig: true,
        integrationsConfig: true
    }
};

export const HIGHLIGHT_ICONS = [
    'heart', 'star', 'camera', 'music', 'plane', 'coffee', 'smile', 'sun',
    'moon', 'sparkles', 'flame', 'zap', 'gift', 'cake', 'crown', 'diamond',
    'gamepad-2', 'headphones', 'briefcase', 'book', 'palette', 'film',
    'utensils', 'shopping-bag', 'home', 'car', 'bike', 'dumbbell'
];

export const HIGHLIGHT_GRADIENTS = [
    { id: 'pink', from: 'pink-400', to: 'rose-500' },
    { id: 'purple', from: 'purple-400', to: 'pink-500' },
    { id: 'blue', from: 'blue-400', to: 'cyan-500' },
    { id: 'green', from: 'emerald-400', to: 'teal-500' },
    { id: 'orange', from: 'orange-400', to: 'amber-500' },
    { id: 'red', from: 'red-400', to: 'rose-600' },
    { id: 'slate', from: 'slate-400', to: 'slate-600' },
    { id: 'gold', from: 'yellow-400', to: 'amber-500' }
];
