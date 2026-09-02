# YNWA

Bilingual (English / Arabic) corporate website for YNWA — a Doha-based business
services firm handling company formation, licensing, PRO and government
processes, and ongoing corporate compliance in Qatar.

Documents:

- [`docs/00-foundation.html`](docs/00-foundation.html) — audit, positioning, IA, content model, design system
- [`docs/01-identity.html`](docs/01-identity.html) — the mark, the wordmark, usage rules

Built on **Next.js 16** (App Router), React 19, TypeScript strict, Tailwind v4,
next-intl 4.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000 -> redirects to /en
```

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint, including the RTL rule below
npm run typecheck    # tsc --noEmit
```

## Where things are

```
src/
  app/
    globals.css          design tokens, locale-aware type scale, base styles
    fonts.ts             the five faces, vendored and loaded with next/font/local
    [locale]/
      layout.tsx         root layout: <html lang dir>, nav, footer, metadata
      page.tsx           home
  components/
    layout/              Navbar, Footer, LanguageSwitcher, ThemeToggle
    ui/                  Container, Button, Logo, SkipLink
  content/
    types.ts             the Status system and publishable()
    company.ts           address, hours, phones, emails — one source of truth
    navigation.ts        route structure, language-free
  fonts/                 vendored woff2 subsets
  i18n/                  routing, navigation, request config
  lib/                   cn(), theme script + storage key
  proxy.ts               locale negotiation (Next 16 renamed `middleware`)
messages/
  en.json  ar.json       UI copy, independently maintainable
```

## Conventions that are enforced, not remembered

**Logical properties only.** `pl-6` is right in English and wrong in Arabic;
`ps-6` is right in both. ESLint rejects every physical-direction utility
(`pl/pr/ml/mr/left/right/border-l/text-left/…`) in a `className`. The mapping is
documented at the top of `eslint.config.mjs`. This is why RTL is a property of
the codebase rather than an audit at the end.

**Locale-aware links.** `next/link` is banned; import `Link` from
`@/i18n/navigation` so every href carries the active locale.

**Content is typed and status-tracked.** Every content record carries
`status: 'confirmed' | 'derived' | 'placeholder' | 'blocked'` (see
`src/content/types.ts`). `publishable()` gates rendering: `placeholder` records
render in development and disappear in production, `blocked` records never
render at all. Nothing about the business gets invented to fill a layout.

**Tokens are named by role, not by colour.** `ground`, `raised`, `fg`, `fg-60`,
`accent`, `edge` — never `bone` or `ink`, because those values invert between
themes and a token called "bone" that resolves to near-black is a bug waiting to
be written. One exception is deliberate: `on-accent` does *not* invert, because
the accent fill stays dark in both themes, so its text must stay light in both.

**Colour pairs are measured, not eyeballed.** Every foreground/background pair
in `globals.css` carries its WCAG ratio in a comment. Qatar maroon `#8A1538` is
2.0:1 on the dark ground — unusable — so dark mode uses a lifted fill
(`#B93052`, 3.2:1 as a UI boundary) and a further-lifted text form (`#D2607A`,
5.0:1). If you change a value, re-measure it.

**Semantic type classes.** Use `type-display-1`, `type-lede`, `type-eyebrow` —
not `text-6xl`. The size is a consequence of the role, and the role is what
changes between scripts: Arabic sets ~6% larger with materially more leading,
and the eyebrow drops uppercase and letter-spacing, because Arabic has no
uppercase and letter-spacing breaks its joined forms. All of that lives in
`globals.css` and none of it lives in a component.

## Theme

Light and dark, with three states: an explicit choice is stored under
`ynwa-theme` and stamped on `<html data-theme>`; no stored value means follow the
operating system, which is where most visitors stay. A small script in `<head>`
(`src/lib/theme.ts`) sets the attributes before first paint, so a visitor who
chose dark never sees a flash of the light palette.

`data-theme` drives the palette. A second attribute, `data-resolved`, records
what is actually on screen and is what the theme button reads — which icon and
which label to show is decided in CSS, not React state, so the button's markup
is identical on server and client and there is no hydration mismatch.

## Positioning note

The old site sold "expert legal services" and called the team "legal experts".
The work is **government, licensing and administrative process, not legal
practice**. Nothing on this site describes it as legal services, and the footer
states the boundary explicitly. Keep it that way.

## Fonts

Vendored as woff2 in `src/fonts` (400 KB total, subset per script) and loaded
with `next/font/local`. The build needs no network, the exact bytes are pinned,
and a page only downloads the script it renders in — English pages never fetch
the Arabic faces.

| Role    | Latin          | Arabic               |
| ------- | -------------- | -------------------- |
| Display | Newsreader     | Noto Naskh Arabic    |
| Text    | IBM Plex Sans  | IBM Plex Sans Arabic |
| Data    | IBM Plex Mono  | —                    |

All four families are SIL Open Font License 1.1.

## Status

Phase A of eight, on Next 16. Shell, token system, both themes, the identity and
bilingual routing are done and verified in both directions and both themes. Page
content lands in phase C, after the content modules in phase B.
