---
name: Industrial Gourmet Aesthetic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#121212'
  on-primary-container: '#7e7d7d'
  inverse-primary: '#5f5e5e'
  secondary: '#ffb59e'
  on-secondary: '#5e1700'
  secondary-container: '#ff571a'
  on-secondary-container: '#521300'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#101212'
  on-tertiary-container: '#7c7d7e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#852400'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system is crafted for a premium, high-energy dining experience. It balances the raw, tactile nature of an industrial kitchen with the refined comfort of a high-end restaurant. The brand personality is bold, confident, and "appetizingly aggressive," designed to evoke hunger and excitement through high-contrast visuals and striking photography.

The visual style is **High-Contrast / Modern Industrial**. It utilizes a deep, immersive dark mode as its foundation to let food photography pop, paired with vibrant, heat-inspired accents. The interface should feel "thick" and substantial, reflecting the quality and scale of the culinary offerings.

## Colors

This design system operates primarily in a dark mode environment to create a "night-out" atmosphere.

- **Fondo Primario (#121212):** A deep charcoal that provides a sophisticated backdrop for vibrant ingredients.
- **Acento Vibrante (#FF4D00):** A high-energy orange-red used exclusively for "Call to Action" (CTA) elements, notifications, and critical brand highlights. It mimics the glow of a grill.
- **Crema Cálido (#F5F5F5):** Used for primary typography and secondary surfaces to soften the high contrast and add a "cozy" editorial feel.
- **Superficie Neutra (#2A2A2A):** Used for card backgrounds and input fields to create subtle separation from the primary background.

## Typography

The typography in the design system is punchy and authoritative. 

- **Montserrat** is used for all headlines (Encabezados). Use 'ExtraBold' or 'Black' weights for hero sections to create a massive, impactful presence.
- **Inter** handles the functional aspects of the UI, ensuring that descriptions (Descripciones) and prices (Precios) remain highly legible even on mobile devices.
- **Text Transform:** All labels and short CTA buttons should use uppercase with slight letter spacing to reinforce the industrial, structural look.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Ritmo Espacial:** All spacing is based on an 8px scale. 
- **Márgenes:** Container margins are generous (24px on mobile, up to 120px on wide desktop) to allow the content to breathe and maintain a premium "gallery" feel.
- **Grids de Productos:** Menu items should be displayed in a 2-column grid on mobile and a 3 or 4-column grid on desktop to emphasize large, appetizing imagery.

## Elevation & Depth

To maintain the "Industrial yet cozy" vibe, the design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Capas (Layers):** The base level is #121212. Cards and interactive containers sit on a slightly lighter surface (#1C1C1C).
- **Sombras (Shadows):** Shadows on dark backgrounds are subtle. Use a large blur radius (24px-32px) with very low opacity (40-50%) and a slight warm tint to simulate the soft ambient lighting of a steakhouse.
- **Efectos de Hover:** Interactive elements should lift slightly on the Y-axis and increase shadow spread to provide tactile feedback.

## Shapes

The shape language is modern and approachable. While the brand is "Industrial," the corners are significantly rounded to add the "Coziness" required for a food brand.

- **Contenedores y Tarjetas:** Use `rounded-xl` (1.5rem / 24px) for all menu cards and main sections to create a soft, high-end feel.
- **Botones e Inputs:** Use `rounded-lg` (1rem / 16px) for a consistent but slightly tighter appearance.
- **Imágenes:** Food photography should always follow the container's corner radius to feel integrated into the UI.

## Components

### Botones (Buttons)
- **Primario:** Background #FF4D00, Text #121212 (Bold/Uppercase). On hover, the background should shift to a slightly lighter orange-red with a soft glow effect (drop shadow tinted orange).
- **Secundario:** Outlined with Cream #F5F5F5. Text in Cream.

### Tarjetas de Menú (Menu Cards)
- Background: #2A2A2A.
- Top: Full-bleed image with `rounded-t-xl`.
- Bottom: Padding of 24px. Price should be prominently displayed in Montserrat Bold.
- Interaction: Entire card scales 1.02x on hover.

### Campos de Entrada (Inputs)
- Background: #1C1C1C.
- Border: 1px solid #333333.
- Focus: Border color changes to #FF4D00 with a subtle outer glow.
- Labels: Placed above the field in `caption` style, uppercase.

### Paneles de Administración (Admin Panels)
- **Tablas:** Use a clean, stripped-back layout. Row borders should be low-contrast (#333333). 
- **Chips de Estado:** Use pill shapes with a low-opacity background of the status color (e.g., light green tint for "Entregado") and full-saturation text for high readability.

### Fotografía
- All food imagery should feature high saturation and warm lighting. Use a slight darkening gradient at the bottom of images if text is overlaid to ensure the typography remains punchy.