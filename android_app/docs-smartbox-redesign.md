# SmartBox Android App — UI Redesign Design Doc

**Date:** 2026-06-06
**Type:** Preserve-mode redesign (visual only, IA preserved)
**Status:** Draft

---

## 1. Concept & Vision

SmartBox is a self-service smart locker kiosk app for Vietnamese university students. The redesign elevates the existing functional dark-mode app into a **premium Vibrant Neon-Tech consumer experience** — dark glass surfaces with layered depth, warm orange ambient glow radiating from active elements, and spring-first microinteractions that make every touch feel responsive and alive. The app should feel like a premium consumer product, not a utility tool.

---

## 2. Design Language

### 2.1 Aesthetic Direction
**Vibrant Neon-Tech / Dark Glass** — Near-black backgrounds with frosted glass panels. Orange (#FF6600) is the hero accent, radiating subtle glow from active states. The feel is premium consumer dark-tech: modern, confident, tech-forward but approachable for university students.

### 2.2 Color Palette

| Token | Value | Usage |
|---|---|---|
| `brand` | `#FF6600` | Primary accent — CTAs, active states, FAB, QR corners |
| `brandLight` | `#FF8533` | Lighter brand variant for hover/focus |
| `brandGlow` | `rgba(255,102,0,0.20)` | Ambient glow for active elements |
| `brandGlowStrong` | `rgba(255,102,0,0.35)` | Stronger glow for FAB, selected states |
| `background` | `#0A0A0A` | Root background |
| `surface` | `#1C1C1B` | Glass card base (semi-transparent for glass effect) |
| `surfaceElevated` | `#2A2A29` | Higher elevation surfaces |
| `surfaceGlass` | `rgba(28,28,27,0.80)` | Frosted glass surface (with backdrop blur) |
| `border` | `#252525` | Refined warm border (slightly darker than surface) |
| `borderFocused` | `#FF6600` | Input focus ring |
| `text` | `#FFFFFF` | Primary text |
| `textSecondary` | `#A1A1A0` | Secondary/muted text |
| `textMuted` | `#6B6B6A` | Very muted text |
| `success` | `#00C853` | Active status, success states |
| `successBg` | `rgba(0,200,83,0.12)` | Success background |
| `warning` | `#FFB300` | Warning state |
| `warningBg` | `rgba(255,179,0,0.12)` | Warning background |
| `error` | `#FF3D00` | Error/danger states |
| `errorBg` | `rgba(255,61,0,0.12)` | Error background |
| `info` | `#2196F3` | Info badge |
| `online` | `#00FF41` | Online indicator |

### 2.3 Typography

| Role | Font | Weight | Size | Line Height |
|---|---|---|---|---|
| Display/H1 | Be Vietnam Pro | 700 | 28px | 36 |
| H2 | Be Vietnam Pro | 600 | 22px | 28 |
| H3 | Be Vietnam Pro | 600 | 18px | 24 |
| Body | Be Vietnam Pro | 400 | 16px | 22 |
| Body Bold | Be Vietnam Pro | 600 | 16px | 22 |
| Caption | Be Vietnam Pro | 400 | 14px | 18 |
| Small | Be Vietnam Pro | 400 | 12px | 16 |
| Small Bold | Be Vietnam Pro | 700 | 12px | 16 |
| OTP Code | JetBrains Mono | 700 | 40px | 48 |
| OTP Code Large | JetBrains Mono | 700 | 56px | 64 |
| Price | Be Vietnam Pro | 700 | 20px | 26 |
| Button | Be Vietnam Pro | 600 | 16px | 20 |
| Code | JetBrains Mono | 700 | 12px | — |

**Note:** Font loading via `expo-font` or `@expo-google-fonts/be-vietnam-pro` + `@expo-google-fonts/jetbrains-mono`.

### 2.4 Spacing Scale

| Token | Value |
|---|---|
| `half` | 2px |
| `one` | 4px |
| `two` | 8px |
| `three` | 16px |
| `four` | 24px |
| `five` | 32px |
| `six` | 64px |

### 2.5 Border Radius System

| Element | Radius |
|---|---|
| Inputs, buttons | 8px |
| Cards, small panels | 12px |
| Modals, large cards | 16px |
| Bottom sheet | 24px (top corners only) |
| FAB | 28px (full circle) |
| Badges | 6px |
| Avatar (small) | 10px |
| Avatar (large) | 40px |

### 2.6 Motion System

**Spring config:** `stiffness: 120, damping: 15` (applied everywhere)

| Interaction | Animation |
|---|---|
| Bottom sheet drag | Spring translation, snap points at 88/360/full |
| FAB press | `scale(0.92)` on `:active`, spring back |
| Card press | `scale(0.98)` + border glow fade-in on `:active` |
| Button press | `scale(0.97)` + opacity 0.8 on `:active` |
| Tab indicator | Sliding underline with spring |
| Screen transitions | Slide from right (existing) |
| Modal appear | Slide up with spring |
| Tab switch | Spring slide for indicator bar |

**Ambient motion:** None (performance-safe, battery-friendly).

### 2.7 Icon Library

**Phosphor Icons** replaces Ionicons throughout the app.

- Import from `@phosphor-icons/react`
- `strokeWidth: 1.5` globally
- One family per project — no mixing with Ionicons

---

## 3. Surface & Glass System

### 3.1 Dark Glass Treatment

Cards and elevated surfaces use a frosted glass effect:

```tsx
// Glass card base style
backgroundColor: 'rgba(28, 28, 27, 0.80)'
borderWidth: 1
borderColor: '#252525'
borderRadius: 12
// Inner top highlight (subtle refraction)
shadowColor: '#FF6600'
shadowOffset: { width: 0, height: 0 }
shadowOpacity: 0.05
shadowRadius: 8
```

On Android (where `backdrop-filter` is limited), use the semi-transparent background + subtle gradient overlay instead:

```tsx
// Gradient overlay for glass effect (Android fallback)
backgroundColor: '#1C1C1B'
// No backdrop-filter — rely on color depth + border + shadow for glass feel
```

### 3.2 Brand Glow System

Active/selected elements emit orange glow:

```tsx
// FAB glow
shadowColor: '#FF6600'
shadowOffset: { width: 0, height: 0 }
shadowOpacity: 0.4
shadowRadius: 12

// Selected card border glow
borderColor: '#FF6600'
borderWidth: 1
// + subtle box-shadow
shadowColor: '#FF6600'
shadowOpacity: 0.15
shadowRadius: 6
```

### 3.3 Surface Hierarchy

| Level | Token | Usage |
|---|---|---|
| Background | `#0A0A0A` | Root, map, full-screen backgrounds |
| Surface 1 | `#1C1C1B` | Cards, inputs, bottom sheet base |
| Surface 2 | `#2A2A29` | Elevated elements, avatar inner, profile card |
| Border | `#252525` | All borders, dividers |
| Border Focused | `#FF6600` | Input focus, selected states |

---

## 4. Screen-by-Screen Design

### 4.1 Splash (`index.tsx`)
- **No changes** — keep the pulsing dots animation, auto-navigate to `/login`

### 4.2 Login (`login.tsx`)
- Background: `#0A0A0A`
- Logo container: glass card with subtle orange border glow
- Input fields: glass surface with focused orange border
- "ĐĂNG NHẬP" button: solid brand orange, spring press
- Brand title: Be Vietnam Pro 700
- Bottom link: brand color for "Đăng ký ngay"

### 4.3 Register (`register.tsx`)
- **No structural changes** — same form, updated typography + glass inputs
- Spring press on buttons

### 4.4 Forgot Password (`forgot-password.tsx`)
- **No structural changes** — same 2-step flow, updated styling

### 4.5 Reset Password (`reset-password.tsx`)
- **No structural changes** — same flow, updated styling

### 4.6 Home (`home.tsx`) — Primary redesign
- **Map**: Full-screen, `#0A0A0A` base with mock roads/parks (existing)
- **Header overlay**: Glass pill (brand glow on active), not pure surface
- **Location cards**: Glass floating chips above map, orange glow on selected
- **Bottom sheet**: Glass surface, 88px collapsed peek, spring drag, 24px top radius
- **FAB**: Brand orange with ambient glow, spring press scale
- **Rental cards**: Glass surface, left border color indicates status, spring press
- **Location list items**: Glass cards, orange glow on press
- **Profile modal**: Full-screen, glass sections, spring slide-up

### 4.7 Rent (`rent.tsx`) — 4-step wizard
- **Step indicator**: Glass pill style, orange fill + glow for completed steps
- **Size cards**: Glass surface, orange glow + border on selected
- **Plan rows**: Glass rows, radio with orange active state
- **Payment method cards**: Glass rows, orange glow on selected
- **Success screen**: Animated checkmark (spring scale), glass QR container

### 4.8 Rental Detail (`rental-detail.tsx`)
- **QR container**: White QR on glass card with orange corner accents
- **OTP box**: Glass surface, mono font, copy icon
- **Metadata grid**: Glass card with subtle dividers
- **Action buttons**: Spring press, full-width
- **Modals**: Glass panels, spring slide-up

### 4.9 Notifications (`notifications.tsx`)
- **Segmented control**: Glass pill style, orange active fill
- **Notification cards**: Glass rows, orange left border for unread
- **Unread dot**: Brand orange

---

## 5. Component Updates

### 5.1 ThemedText
- **No changes** to types or API
- Font family updated to Be Vietnam Pro (via `expo-font`)
- JetBrains Mono for `otpCode`, `otpCodeLarge`, `code` types

### 5.2 ThemedView
- **No changes** to API
- Surfaces updated per section 3

### 5.3 Button
- Spring press: `scale(0.97)` on `:active`
- Primary: `#FF6600` → `#E65C00` on press
- Disabled primary: desaturated orange
- Secondary: glass surface + border
- Danger: glass surface + error border
- Glow shadow on primary variant

### 5.4 Input
- Glass surface base
- Orange border on focus
- Icon color transitions to brand on focus
- Error state: red border

### 5.5 Badge
- Status backgrounds use semi-transparent variants (see color palette)
- **No structural changes**

### 5.6 BottomSheet
- Glass surface with subtle orange glow on handle
- Spring drag physics (stiffness 120, damping 15)
- 24px top border radius
- Handle bar: 40×4px, `#333332` → brand on active

---

## 6. Animation Specs

### 6.1 Spring Config (global)
```ts
const SPRING = {
  damping: 15,
  stiffness: 120,
  mass: 1,
};
```

### 6.2 Per-Element Specs

| Element | Entry | Exit | Press |
|---|---|---|---|
| Bottom sheet | Spring translateY | Spring translateY | Spring snap |
| FAB | Fade + scale (0.8→1) | Fade | scale(0.92) |
| Cards | FadeIn (200ms) | — | scale(0.98) + glow |
| Buttons | — | — | scale(0.97) + opacity 0.8 |
| Tab indicator | Spring slide | Spring slide | Spring slide |
| Modals | Spring slide up | Spring slide down | — |
| Success checkmark | Spring scale (0→1, friction 4) | — | — |

### 6.3 Reduced Motion
All animations degrade to instant/invisible under `AccessibilityInfo.isReduceMotionEnabled()`.

---

## 7. Technical Approach

### 7.1 Dependencies to Add
```bash
npx expo install @expo-google-fonts/be-vietnam-pro @expo-google-fonts/jetbrains-mono
npx expo install @phosphor-icons/react
```

### 7.2 Files to Modify
- `src/constants/theme.ts` — update color palette, add glow tokens, update fonts
- `src/global.css` — update font stacks for Be Vietnam Pro + JetBrains Mono
- `src/components/themed-text.tsx` — update fontFamily references
- `src/components/ui/button.tsx` — add spring press, glow shadow
- `src/components/ui/input.tsx` — glass surface styling
- `src/components/ui/bottom-sheet.tsx` — spring config, glass styling
- `src/components/ui/badge.tsx` — semi-transparent backgrounds
- `src/app/login.tsx` — logo glass treatment
- `src/app/home.tsx` — glass surfaces, glow, spring throughout
- `src/app/rent.tsx` — glass cards, step indicator, spring
- `src/app/rental-detail.tsx` — glass QR, spring modals
- `src/app/notifications.tsx` — glass segmented control
- `src/app/register.tsx` — glass inputs
- `src/app/forgot-password.tsx` — glass inputs
- `src/app/reset-password.tsx` — glass inputs
- `src/app/_layout.tsx` — load fonts on mount

### 7.3 Icon Migration
Replace all Ionicons imports:
```ts
// Before
import { Ionicons } from '@expo/vector-icons';

// After
import { Cube, Bell, Person, QrCode, ... } from '@phosphor-icons/react';
```
Phosphor uses named exports per icon. Map each Ionicons glyph to its Phosphor equivalent.

### 7.4 Font Loading
```tsx
// In _layout.tsx or a FontLoader component
import { BeVietnamPro_400Regular, BeVietnamPro_600SemiBold, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';

const [fontsLoaded] = useFonts({
  'BeVietnamPro-Regular': BeVietnamPro_400Regular,
  'BeVietnamPro-SemiBold': BeVietnamPro_600SemiBold,
  'BeVietnamPro-Bold': BeVietnamPro_700Bold,
  'JetBrainsMono-Bold': JetBrainsMono_700Bold,
});
```

---

## 8. Non-Goals (Out of Scope)

- No new screens or routes
- No changes to information architecture
- No changes to business logic or API integration
- No changes to mock data structure
- No light mode
- No new fonts beyond Be Vietnam Pro + JetBrains Mono
- No tab bar navigation (bottom sheet remains the navigation paradigm)

---

##9. Pre-Flight Checklist

- [ ] All Ionicons replaced with Phosphor Icons
- [ ] Be Vietnam Pro + JetBrains Mono loaded via expo-font
- [ ] Color palette updated with glow variants
- [ ] Glass surface treatment applied to all cards
- [ ] Brand glow applied to FAB, QR corners, selected states
- [ ] Spring physics on all interactive elements
- [ ] Button press: scale(0.97) + opacity 0.8
- [ ] Card press: scale(0.98) + border glow
- [ ] FAB press: scale(0.92)
- [ ] Bottom sheet: spring drag with snap points
- [ ] Tab indicator: spring slide
- [ ] Reduced motion degrades all animations
- [ ] WCAG AA contrast on all text (4.5:1 body, 3:1 large)
- [ ] No CTA button wraps to 2+ lines
- [ ] All imports verified before adding packages
