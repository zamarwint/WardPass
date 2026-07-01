---
name: Kinetic Vault
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cac8aa'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#939277'
  outline-variant: '#484831'
  surface-tint: '#cdcd00'
  primary: '#ffffff'
  on-primary: '#323200'
  primary-container: '#eaea00'
  on-primary-container: '#686800'
  inverse-primary: '#626200'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaea00'
  primary-fixed-dim: '#cdcd00'
  on-primary-fixed: '#1d1d00'
  on-primary-fixed-variant: '#494900'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is engineered to evoke a sense of "Active Security"—a departure from static, passive protection toward a dynamic, high-performance digital vault. The brand personality is authoritative, technical, and alert. It targets power users, developers, and security-conscious professionals who view their data as a high-value asset.

The design style is **High-Contrast / Bold** meets **Minimalism**. By leveraging a "Cyber-Industrial" aesthetic, the system uses deep blacks and high-visibility yellows to signal both danger (to intruders) and clarity (to the user). The UI feels like a precision tool, utilizing raw structural elements, ample whitespace to reduce cognitive load during sensitive tasks, and a strict adherence to a "less but better" philosophy.

## Colors
The palette is built on a "Signal & Shadow" logic. 

- **Primary (#FFFF00):** Used exclusively for actionable items, critical security alerts, and high-level status indicators. It is the "Searchlight" in the dark.
- **Background (#1A1A1A):** The primary structural canvas. It provides a non-distracting, low-strain environment for managing complex data.
- **Surface (#2E2E2E):** Used for cards, input fields, and hover states to create subtle depth against the background.
- **Text/Neutral (#FFFFFF):** High-contrast white for maximum legibility. Sub-labels should use an 80% opacity variant to maintain hierarchy.

## Typography
The system uses a pairing of **Geist** for structural/heading elements and **Inter** for long-form data reading. 

- **Geist** provides a technical, developer-centric feel that reinforces the "military-grade" narrative. It is used for headlines and navigational labels.
- **Inter** handles the heavy lifting of password lists and settings, ensuring neutral, high-speed scanning.
- **JetBrains Mono** (Special Addition): Use this specifically for actual passwords, recovery keys, and hash strings to ensure characters like '0' and 'O' or '1' and 'l' are indistinguishable.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict vertical rhythm based on an 8px square unit. 

- **Desktop:** 12-column grid. Vault items should ideally span 4 columns (3-up) or 6 columns (2-up) to maintain wide, readable rows.
- **Mobile:** Single column with 16px side margins.
- **Whitespace:** Use generous padding (32px+) inside vault cards to emphasize the "Vault" metaphor—objects are protected by a "buffer zone" of empty space.

## Elevation & Depth
Depth is communicated through **Tonal Layers** rather than soft shadows. In a high-security environment, clarity is paramount; shadows can feel "fuzzy" and imprecise.

- **Level 0 (Base):** #1A1A1A (The void).
- **Level 1 (Cards/Inputs):** #2E2E2E (The structure).
- **Interactions:** Use #FFFF00 1px borders for "active" or "focused" states. This creates a "glow" effect that signifies the element is currently under the user's control.
- **Overlays (Modals):** Use a 60% blur backdrop with a solid #2E2E2E container to simulate a physical door closing over the background content.

## Shapes
The system utilizes **Sharp (0px)** roundedness. Every element—buttons, cards, input fields—features hard 90-degree angles. This geometry reinforces the industrial, uncompromising nature of high-security software. It suggests precision engineering and removes any "softness" that might detract from the professional, military-grade aesthetic.

## Components
- **Primary Action Buttons:** Solid #FFFF00 background with black (#1A1A1A) text. No border. Sharp corners. Hover state: 10% brightness reduction.
- **Vault Cards:** Background #2E2E2E. On hover, apply a 1px solid #FFFF00 border. Use a mono-spaced font for the "Last Modified" metadata at the bottom.
- **Input Fields:** Background transparent, 1px solid #FFFFFF (30% opacity). On focus, border becomes 1px solid #FFFF00. Labels sit above the field in "label-sm" style.
- **Security Trust Bar:** A horizontal gauge using the primary yellow. Segmented blocks are used rather than a smooth gradient to indicate discrete "levels" of encryption strength.
- **Iconography:** Thin-stroke (1.5pt) icons. Use metaphors like "Shields," "Nodes," and "Tunnels." Icons representing active protection should be #FFFF00; decorative icons should be #FFFFFF (50% opacity).
- **Process Timelines:** Vertical lines connecting steps, using #FFFF00 for completed phases to simulate a "live circuit."