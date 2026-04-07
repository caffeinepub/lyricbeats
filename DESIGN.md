# Design Brief

## Direction

LyricBeats — AI-powered music generation tool. Dark, minimalist interface focused on the creative input and audio output.

## Tone

Studio monitoring setup at night: introspective, focused, professional. A brutalist aesthetic where every UI element serves function, not decoration.

## Differentiation

Warm violet accent color on interactive elements creates tension against the pure monochrome background. The input textarea dominates the interface; everything else recedes.

## Color Palette

| Token      | OKLCH              | Role                          |
| ---------- | ------------------ | ----------------------------- |
| background | 0.12 0 0           | Primary dark surface          |
| foreground | 0.9 0 0            | Text on dark background       |
| card       | 0.16 0 0           | Elevated card surfaces        |
| primary    | 0.65 0.25 290      | Warm violet — CTAs, accents   |
| accent     | 0.65 0.25 290      | Same as primary for focus     |
| muted      | 0.2 0 0            | Secondary surfaces            |
| border     | 0.25 0 0           | Subtle dividers               |
| destructive| 0.55 0.22 25       | Delete actions (warm red)     |

## Typography

- Display: Space Grotesk — headings, app title, action labels
- Body: Satoshi — textarea, UI copy, composition titles
- Mono: JetBrains Mono — timestamps, technical info
- Scale: hero `text-4xl font-bold tracking-tight`, h2 `text-2xl font-bold`, label `text-xs uppercase tracking-widest`, body `text-base`

## Elevation & Depth

Minimal shadow hierarchy: cards have a subtle 1px border (border-border) instead of shadows. The card layer (0.16 L) lifts slightly from background (0.12 L) without blur effects. Brutalist, no depth trickery.

## Structural Zones

| Zone    | Background        | Border        | Notes                                |
| ------- | ----------------- | ------------- | ------------------------------------ |
| Header  | background        | border-b      | App name + nav; thin accent line     |
| Content | background        | —             | Textarea section + composition list  |
| Footer  | background (same) | —             | Minimal or omitted                   |

## Spacing & Rhythm

Tight grouping: textarea and submit button in compact section. Compositions list separated by larger gap (6–8 gap units). Micro-spacing inside cards (p-4) creates breathing room. No excessive padding.

## Component Patterns

- Buttons: sharp corners (rounded-sm), warm violet background, white text, no shadow
- Cards: 1px border only, rounded-sm, p-4, no background hover (subtle border shift)
- Input: border-input on focus; input-focus utility applies ring with ring color (accent violet)
- Badges: muted background with foreground text; small caps

## Motion

- Entrance: fade-in on composition list load (200ms)
- Hover: button brightens (accent becomes slightly lighter), card border brightens
- Generation: subtle pulsing on progress indicator while music generates

## Constraints

- No full-page gradients or decorative elements
- Accent color (violet) used only on interactive elements — never on static text
- Sharp radii (2-4px) throughout; never rounded pills or circles
- Typography weight varies for hierarchy; size is secondary

## Signature Detail

The warm violet accent on a pure black/grey monochrome creates an unsettling but memorable contrast. The accent feels like energy or focus cutting through silence — fitting for a music generation tool.

