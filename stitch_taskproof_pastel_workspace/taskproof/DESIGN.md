---
name: TaskProof
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4a454c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7c757d'
  outline-variant: '#cdc4cd'
  surface-tint: '#6b5779'
  primary: '#6b5779'
  on-primary: '#ffffff'
  primary-container: '#cdb4db'
  on-primary-container: '#584465'
  inverse-primary: '#d7bde5'
  secondary: '#40627b'
  on-secondary: '#ffffff'
  secondary-container: '#bee1ff'
  on-secondary-container: '#42647e'
  tertiary: '#7c5264'
  on-tertiary: '#ffffff'
  tertiary-container: '#e3aec3'
  on-tertiary-container: '#684051'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f3daff'
  primary-fixed-dim: '#d7bde5'
  on-primary-fixed: '#251432'
  on-primary-fixed-variant: '#533f60'
  secondary-fixed: '#cae6ff'
  secondary-fixed-dim: '#a8cbe8'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#274a63'
  tertiary-fixed: '#ffd8e6'
  tertiary-fixed-dim: '#edb8cc'
  on-tertiary-fixed: '#301020'
  on-tertiary-fixed-variant: '#623b4c'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-brand:
    fontFamily: Bitcount Single
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Outfit
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  decorative-callout:
    fontFamily: Great Vibes
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  card-padding: 24px
---

## Brand & Style
The design system embodies a "Playful Precision" aesthetic, merging the structural clarity of high-end productivity tools with a whimsical, candy-toned palette. It targets a demographic that values both professional utility and expressive, high-fidelity UI. 

The style is a refined execution of **Soft Glassmorphism**. It utilizes translucent, multi-layered surfaces and vibrant background blurs to create a sense of depth without weight. The emotional response is intended to be light, airy, and optimistic, moving away from the "industrial" feel of traditional blockchain applications toward a "lifestyle" productivity experience. Every interaction should feel like a soft physical click—graceful, dampened, and high-quality.

## Colors
The palette is built on a foundation of sophisticated pastels. 
- **Lavender (#CDB4DB)** acts as the primary anchor for actions and primary branding elements.
- **Icy Blue (#BDE0FE) and Sky Blue (#A2D2FF)** are used for information-dense areas and secondary navigational cues.
- **Soft Pink (#FFC8DD) and Baby Pink (#FFAFCC)** serve as emotive accents for status, rewards, and highlights.
- **Surface Strategy:** Backgrounds are kept extremely light (near-white neutrals) to allow the pastel gradients and glassmorphism effects to maintain their luminosity without looking muddy. Pure black is forbidden; use deep muted lavenders for text to maintain the soft aesthetic.

## Typography
The typography system prioritizes legibility with a flair of personality. 
- **UI & Logic:** **Outfit** is used for all functional interfaces. Its geometric clarity matches the modern SaaS influence.
- **Branding:** **Bitcount Single** is reserved strictly for the main logo and primary "Proof" markers, providing a subtle technical/pixel-inspired nod to the Stellar network.
- **Accentuation:** **Great Vibes** is used sparingly for decorative sub-headers, empty state messages, or "congratulatory" task completion notes to inject a human, handwritten touch.
- **Scale:** Maintain generous line-heights to support the "airy" feel of the brand.

## Layout & Spacing
The layout follows a **Fluid-Fixed Hybrid** model. Content is centered within a 1200px max-width container on desktop, utilizing a 12-column grid. 
- **Floating Philosophy:** Elements should rarely feel "stuck" to the edges. Use generous outer margins and internal padding to create a "floating" effect for main content areas.
- **Rhythm:** An 8px base unit drives all spacing. For the "TaskProof" aesthetic, prioritize larger spacing values (24px, 32px, 48px) to reduce visual density and stress.
- **Mobile:** Reflow to a single column with 16px side margins. Cards should retain their rounded corners rather than spanning full-width to maintain the "object" feel.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional drop shadows.
- **Surfaces:** Use high-diffusion backdrop blurs (20px - 40px) with a semi-transparent white fill (opacity 60-80%).
- **Borders:** Instead of heavy shadows, use 1.5px "Inner Glow" borders. These are solid white or light pastel strokes with very low opacity (20-30%) that catch the light at the edges of elements.
- **Floating State:** For elements that need high emphasis (active modals or floating action buttons), use an "Ambient Bloom"—a very large, soft shadow tinted with the primary Lavender or Sky Blue, at no more than 10% opacity.

## Shapes
The shape language is defined by **Extreme Softness**. 
- **Standard Radius:** 24px (captured as `rounded-xl` in this system) is the default for all cards, modals, and main containers.
- **Buttons:** Use fully pill-shaped (999px) or 16px rounded corners to maintain the approachable feel.
- **Interaction:** On hover, shapes can slightly expand (1-2%) to provide a tactile, responsive feedback. 
- **Strokes:** Use consistent thin strokes (1px to 1.5px) for all outlines, never using heavy or harsh black borders.

## Components
- **Buttons:** Primary buttons use the `brand_flow` gradient with white text. Secondary buttons use a glassmorphic style with a Lavender border and text.
- **Cards:** Must feature the 24px corner radius and a 20px backdrop blur. Use a 1px white internal stroke to simulate a glass edge.
- **Inputs:** Soft Lavender backgrounds (#CDB4DB at 10% opacity). On focus, the border transitions to a Sky Blue gradient glow.
- **Chips/Badges:** Use the pastel palette for categorization (e.g., Pink for "Urgent", Blue for "On Chain"). Use low-saturation versions of the colors for the background and high-saturation for the text.
- **Lists:** Items should be separated by whitespace and soft dividers rather than hard lines. Each list item should feel like a "mini-card" with subtle hover elevations.
- **Floating Action Button (FAB):** A large, circular gradient button with a "plus" icon, always positioned with significant padding from the screen edge.