# SafeRouteAI Design System

## 1. Design Philosophy
**"Guardian of the City"**
The design should evoke feelings of **Safety**, **Trust**, and **Advanced Technology**. It should feel like a futuristic "Mission Control" for personal safety.
- **Aesthetic**: **High-End Cyberpunk / Sci-Fi Interface**.
- **Core Visuals**: Deep dark backgrounds with subtle grids, frosted glass panels (Glassmorphism), and vibrant neon data points.

## 2. Visual Identity

### Color Palette
A high-contrast, dark-themed palette.

| Role | Color Name | Hex Code | Usage |
|------|------------|----------|-------|
| **Background** | **Void Black** | `#020617` | Main app background |
| **Grid Lines** | **Cyber Grid** | `#1e293b` | Subtle background grid pattern |
| **Surface** | **Glass Dark** | `rgba(15, 23, 42, 0.6)` | Cards, Bottom Sheets (with blur) |
| **Primary** | **Neon Emerald** | `#10b981` | "Safe" status, Primary Actions, Glows |
| **Secondary** | **Hologram Blue** | `#3b82f6` | Info, Nav Active, Route Lines |
| **Danger** | **Plasma Red** | `#ef4444` | Danger zones, SOS, Critical Alerts |
| **Warning** | **Amber Light** | `#f59e0b` | Caution zones |
| **Text** | **Pure White** | `#ffffff` | Headings |
| **Text Muted** | **Stardust** | `#94a3b8` | Secondary Text |

### Typography
Modern, geometric, and legible.
- **Headings**: **'Outfit'** (Bold). Wide tracking for a cinematic feel.
- **Body**: **'Inter'** (Regular).
- **Data/Numbers**: **'JetBrains Mono'** or **'Roboto Mono'**.

## 3. Core UI Elements

### The "Grid" Background
The app background should not be a flat color.
- **Base**: `#020617`
- **Pattern**: A subtle square grid overlay (1px lines, 40px spacing, opacity 0.1).
- **Vignette**: Darken the edges of the screen to focus attention on the center map/content.

### Glassmorphism (The "Glass" Look)
All floating panels (Nav bar, Status cards, Search bar) must use this style:
```css
.glass-panel {
  background: rgba(15, 23, 42, 0.65); /* Semi-transparent dark blue */
  backdrop-filter: blur(16px);        /* Strong blur */
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1); /* Thin white border */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); /* Deep shadow */
  border-radius: 24px;
}
```

### Neon Glows
Active elements should emit light.
- **Primary Button**:
  - Background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`
  - Box Shadow: `0 0 20px rgba(16, 185, 129, 0.5)` (Green Glow)
- **SOS Button**:
  - Background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`
  - Box Shadow: `0 0 30px rgba(239, 68, 68, 0.6)` (Red Pulsing Glow)
- **Status Indicators**: Small dots with `box-shadow: 0 0 10px [color]`.

## 4. Component Specifics

### Navigation Bar
- **Shape**: Floating "Pill" shape at the bottom, detached from edges.
- **Style**: Full Glassmorphism.
- **Icons**: Simple outline icons. Active icon gets filled + a small glowing dot underneath.

### Status Card (Top of Screen)
- **Style**: Glass panel.
- **Content**: "Current Status: Safe" (Green text with glow) or "Warning" (Amber).
- **Icon**: Shield icon with a subtle pulse animation.

### Map Interface
- **Map Style**: Custom Dark Mode (hide standard POIs, emphasize roads in dark grey).
- **Heatmap**:
  - **Safe Areas**: Transparent Green (low opacity).
  - **Danger Zones**: Red radial gradients.
- **User Location**:
  - Avatar circle with a white border.
  - "Radar" ripple effect animating outward from the user.

## 5. Animations
- **Pulse**: For SOS button and live markers.
- **Slide & Fade**: Smooth entry for cards.
- **Radar Scan**: Subtle sweeping animation on the map to imply "scanning for threats".

## 6. Assets
- **Icons**: Lucide React or Heroicons (Rounded).
- **Avatars**: Circular with white borders.
