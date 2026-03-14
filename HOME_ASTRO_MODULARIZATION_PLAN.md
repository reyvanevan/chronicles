# Universe Home Modularization Plan

Target file: `src/pages/universe/home.astro` (`1662` lines)
Goal: reduce maintenance risk, isolate features, and keep behavior unchanged while splitting UI + client logic into focused modules.

## Why now

- The page already combines many surfaces: widgets, quick notes, stories, posts feed, 3 modals, and auth/bootstrap logic.
- New Phase 2 modules will add more complexity if we keep everything in one file.
- Safer iteration needs smaller files with clear ownership.

## Refactor principles

- Behavior parity first: no UX or data contract changes during modularization.
- Keep stable element IDs and public handler names while migrating (avoid breaking existing script hooks).
- Slice by feature and ship incrementally (small commits, no big-bang rewrite).
- After each slice: manual smoke test on `/universe/home` and `get_errors` validation.

## Target architecture

### A) UI components (Astro)

Create folder: `src/components/universe/`

1. `UniverseHeader.astro`
2. `LifeWidgetsSection.astro`
3. `QuickNotesSection.astro`
4. `StoriesStrip.astro`
5. `PostsFeed.astro`
6. `UniverseBottomNav.astro`
7. `PhotoModal.astro`
8. `StoryModal.astro`
9. `EditPostModal.astro`

`src/pages/universe/home.astro` should become a composition shell that imports components and mounts a single client bootstrap module.

### B) Client modules (JS)

Create folder: `src/lib/universe/home/`

1. `bootstrap.js`
2. `state.js`
3. `dom.js`
4. `auth-session.js`
5. `life-widgets.js`
6. `quick-notes.js`
7. `stories.js`
8. `posts.js`
9. `modals.js`
10. `theme.js`

Suggested ownership:
- `bootstrap.js`: init order, auth observer, top-level error guard.
- `auth-session.js`: logout + user/role mapping.
- `life-widgets.js`: dynamic age/progress/weather rendering.
- `quick-notes.js`: full notes CRUD + counters/feedback.
- `stories.js`, `posts.js`: feed and stories rendering/actions.
- `modals.js`: photo/story/edit modal state and handlers.
- `dom.js`: shared DOM setters, sanitize helpers, utility formatters.

## Migration phases

## Phase 0 - Baseline snapshot

- Capture current behavior matrix:
  - auth redirect
  - life widgets visibility and timer
  - quick notes CRUD
  - stories open/close and navigation
  - posts like/edit/delete flows
  - all three modals
- Keep this checklist as regression gate for every phase.

## Phase 1 - Extract static layout components

- Move header, bottom nav, and modal markup into components first.
- Keep script logic in `home.astro` unchanged.
- Wire imports and preserve existing IDs/classes.

Exit criteria:
- No JS behavior changes.
- Visual parity on desktop/mobile.

## Phase 2 - Extract quick notes module

- Move notes-specific functions into `quick-notes.js`:
  - `loadQuickNotesModule`
  - `refreshQuickNotes`
  - `renderQuickNotes`
  - `renderQuickNoteCard`
  - `submitQuickNote`
  - `toggleQuickNoteStatus`
  - `toggleQuickNotePin`
  - `removeQuickNoteItem`
- Export an init function and bind handlers inside module.

Exit criteria:
- Notes feature parity with current behavior.
- Visibility toggle still respected.

## Phase 3 - Extract life widgets module

- Move widget timer/update/weather logic to `life-widgets.js`.
- Keep config loading contract unchanged (`loadTimeProgressConfig`, `loadFeatureVisibilityConfig`).

Exit criteria:
- Realtime updates still smooth.
- No duplicate intervals.

## Phase 4 - Extract stories/posts/modals modules

- Split feed + modal logic into `stories.js`, `posts.js`, and `modals.js`.
- Replace direct `window.*` scatter with explicit module binds from bootstrap.

Exit criteria:
- Story viewer and photo modal parity.
- Edit/delete flows still stable.

## Phase 5 - Bootstrap cleanup

- Replace large inline script with:
  - minimal imports
  - one `initUniverseHome()` call
- Keep only route-specific glue in `home.astro`.

Exit criteria:
- `home.astro` target size < 350 lines.
- Feature modules independently readable and testable.

## Risk controls

- Main risk: broken handlers after moving modal/inline event hooks.
- Mitigation:
  - Keep handler names stable during transition.
  - Migrate one feature group per commit.
  - Re-run `get_errors` and quick manual smoke after each commit.

## Definition of done

- `src/pages/universe/home.astro` reduced to composition + bootstrap.
- All existing behaviors from baseline checklist still work.
- No lint/syntax errors in extracted modules.
- Docs updated with new module map.

## Suggested commit sequence

1. `refactor(universe-home): extract layout and modal components`
2. `refactor(universe-home): move quick notes logic to module`
3. `refactor(universe-home): move life widgets logic to module`
4. `refactor(universe-home): split stories posts and modals controllers`
5. `refactor(universe-home): finalize bootstrap orchestration`
