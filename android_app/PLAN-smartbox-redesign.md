# SmartBox Android App Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the SmartBox android_app UI with Dark Glass surfaces, Be Vietnam Pro typography, Phosphor Icons, spring-first motion, and brand glow — preserving all IA and functionality.

**Architecture:** 5 phases: (1) Foundation — dependencies + theme tokens, (2) Components — update Button/Input/Badge/BottomSheet with glass + spring, (3) Screens — apply glass treatment + glow + spring to all screens, (4) Icons — migrate Ionicons → Phosphor, (5) Polish — reduced motion + visual audit. Each phase is self-contained.

**Tech Stack:** Expo SDK 56, React Native, react-native-reanimated v4, @phosphor-icons/react, @expo-google-fonts/be-vietnam-pro, @expo-google-fonts/jetbrains-mono

---

## Phase 1: Foundation — Dependencies + Theme Tokens

### Task 1.1: Install New Dependencies

**Files:**
- Modify: `android_app/package.json`

- [ ] **Step 1: Install Phosphor Icons**

Run: `cd android_app && npx expo install @phosphor-icons/react`

- [ ] **Step 2: Install Google Fonts**

Run: `cd android_app && npx expo install @expo-google-fonts/be-vietnam-pro @expo-google-fonts/jetbrains-mono expo-font`

- [ ] **Step 3: Verify package.json**

Check that all three packages are listed with correct versions. Confirm `expo-font` is present (often a transitive dep but should be explicit).

---

### Task 1.2: Update Theme Tokens

**Files:**
- Modify: `android_app/src/constants/theme.ts`

- [ ] **Step 1: Update color palette**

Replace the existing `Colors` object with the new palette (per design doc section 2.2). Key changes:
- `border` changes from `#333332` → `#252525`
- Add `brandGlow: 'rgba(255,102,0,0.20)'` and `brandGlowStrong: 'rgba(255,102,0,0.35)'`
- Update status backgrounds to semi-transparent variants:
  - `successBg: 'rgba(0,200,83,0.12)'`
  - `warningBg: 'rgba(255,179,0,0.12)'`
  - `errorBg: 'rgba(255,61,0,0.12)'`
  - `infoBg: 'rgba(33,150,243,0.12)'`

- [ ] **Step 2: Update font references**

The `Fonts` object stays (it's a platform selector). The actual font loading happens in `_layout.tsx`. No changes needed here — fonts are referenced by name string in `StyleSheet.create`.

- [ ] **Step 3: Verify theme compiles**

Run: `cd android_app && npx tsc --noEmit`
Expected: No errors related to theme.ts

---

### Task 1.3: Load Fonts in App Layout

**Files:**
- Modify: `android_app/src/app/_layout.tsx`

- [ ] **Step 1: Add font loading**

Add `expo-font` font loading to the root layout. Use `useFonts` hook from `expo-font`. Load:
- `BeVietnamPro-Regular` (400Regular)
- `BeVietnamPro-SemiBold` (600SemiBold)
- `BeVietnamPro-Bold` (700Bold)
- `JetBrainsMono-Bold` (700Bold)

Wait for fonts to load before rendering children. Show a minimal loading state (just the dark background, no spinner) while fonts load.

- [ ] **Step 2: Verify fonts load**

Run: `cd android_app && npx expo start --android` (or web)
Expected: App renders with Be Vietnam Pro font on all text elements

---

### Task 1.4: Update Global CSS Font Stacks

**Files:**
- Modify: `android_app/src/global.css`

- [ ] **Step 1: Update font stacks**

```css
:root {
  --font-display: 'BeVietnamPro-Regular', 'BeVietnamPro-SemiBold', 'BeVietnamPro-Bold', system-ui, sans-serif;
  --font-mono: 'JetBrainsMono-Bold', ui-monospace, monospace;
  --font-rounded: 'BeVietnamPro-SemiBold', system-ui, sans-serif;
  --font-serif: Georgia, serif;
}
```

Remove any existing Spline Sans or other font references.

---

## Phase 2: Component Updates — Glass + Spring

### Task 2.1: Update Button Component

**Files:**
- Modify: `android_app/src/components/ui/button.tsx`

- [ ] **Step 1: Add spring press animation**

Import `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming` from `react-native-reanimated`. Add a `scale` shared value and an `opacity` shared value. On press, animate to `scale: 0.97` + `opacity: 0.8` with spring config `{ damping: 15, stiffness: 120 }` for scale and `withTiming(0.8, { duration: 100 })` for opacity. On release, spring back to `scale: 1` and `opacity: 1`.

- [ ] **Step 2: Add brand glow to primary variant**

Add `shadowColor: '#FF6600'`, `shadowOpacity: 0.3`, `shadowRadius: 8` to the primary button base style (not just on press — always glowing).

- [ ] **Step 3: Update primary press color**

Change `pressed ? '#E65C00' : theme.brand` to use the spring animated scale instead of opacity. Keep the color change.

- [ ] **Step 4: Update disabled primary color**

Change from `#4D331A` to a desaturated orange: `rgba(255,102,0,0.35)`

- [ ] **Step 5: Verify all variants**

Check that primary, secondary, ghost, danger all render correctly with the new styles.

---

### Task 2.2: Update Input Component

**Files:**
- Modify: `android_app/src/components/ui/input.tsx`

- [ ] **Step 1: Apply glass surface to input container**

Update `getInputContainerStyle()`: change `backgroundColor` from `theme.surface` to a slightly transparent variant — since we can't use backdrop-filter reliably on Android, use solid `#1C1C1B` with the refined border `#252525`.

- [ ] **Step 2: Add subtle inner shadow for glass depth**

Add a faint inner top highlight. On Android (no `shadowColor` inner support), achieve this with a pseudo-inner-border: add a 1px top border with `rgba(255,255,255,0.05)`.

- [ ] **Step 3: Verify focus and error states**

Focus: orange border `#FF6600`. Error: red border `#FF3D00`. Both should have the glass treatment.

---

### Task 2.3: Update Badge Component

**Files:**
- Modify: `android_app/src/components/ui/badge.tsx`

- [ ] **Step 1: Replace solid backgrounds with semi-transparent**

Update all status backgrounds from solid hex to semi-transparent:
- `active`: `rgba(0,200,83,0.12)` (was `#0D2818`)
- `completed`: `rgba(42,42,41,0.50)` (was `#1A1A1A`)
- `expired`: `rgba(255,61,0,0.12)` (was `#2A0D00`)
- `warning`: `rgba(255,179,0,0.12)` (was `#2A1F00`)
- `info`: `rgba(33,150,243,0.12)` (was `#0D1F2A`)

- [ ] **Step 2: Verify badge renders**

Check all 5 badge states render with correct colors and text.

---

### Task 2.4: Update BottomSheet Component

**Files:**
- Modify: `android_app/src/components/ui/bottom-sheet.tsx`

- [ ] **Step 1: Apply glass surface**

Update `bottomSheetContainer` style: `backgroundColor: 'rgba(28,28,27,0.95)'` for glass effect. Keep `borderTopLeftRadius: 24` and `borderTopRightRadius: 24`.

- [ ] **Step 2: Add glow to handle bar on active**

The handle bar (`line`, spec: 40x4px, borderRadius: 2px) changes from `#333332` to `#FF6600` when the sheet is being dragged. Use the existing `translateY` shared value from the pan gesture — when `translateY` changes from user drag (not from programmatic snap), set a `isDragging` shared value to `true`. The `line` style uses `useAnimatedStyle` to read `isDragging`: `backgroundColor: isDragging ? '#FF6600' : '#333332'`. Spring back to neutral color on release (when gesture ends).

Note: The handle bar dimensions (40x4px) are already correct per the existing code. No dimension changes needed.

- [ ] **Step 3: Verify spring snap points**

The existing spring config `{ damping: 15, stiffness: 120 }` should already be present. Verify it is and confirm bottom sheet snaps smoothly at 88px, 360px, and full height.

---

### Task 2.5: Update ThemedText Component

**Files:**
- Modify: `android_app/src/components/themed-text.tsx`

- [ ] **Step 1: Verify font family mapping**

Check that `otpCode`, `otpCodeLarge`, and `code` types use `Fonts.mono` (JetBrains Mono). All other types use the default system font (which will be overridden by the font loading in `_layout.tsx`).

- [ ] **Step 2: No structural changes needed**

The component API stays the same. Font families are applied via `StyleSheet.create`.

---

## Phase 3: Screen Updates — Glass + Glow + Spring

### Task 3.1: Update Login Screen

**Files:**
- Modify: `android_app/src/app/login.tsx`

- [ ] **Step 1: Glass logo container**

Update `logoBackground` style: add `borderWidth: 1`, `borderColor: 'rgba(255,102,0,0.20)'`, `shadowColor: '#FF6600'`, `shadowOpacity: 0.15`, `shadowRadius: 8` for subtle orange glow.

- [ ] **Step 2: Update border color references**

Replace all hardcoded `#333332` border colors with the theme token approach. Since `ThemedView` doesn't support border color theming, use inline styles with the new `#252525` border.

- [ ] **Step 3: Verify login flow**

Test: login → home navigation works. Fonts render correctly. Glass logo container glows subtly.

---

### Task 3.2: Update Register Screen

**Files:**
- Modify: `android_app/src/app/register.tsx`

- [ ] **Step 1: Update border colors**

Replace `#333332` → `#252525` throughout. Apply glass treatment to form inputs via the updated Input component.

- [ ] **Step 2: Verify register flow**

Test: register → home navigation works.

---

### Task 3.3: Update Home Screen

**Files:**
- Modify: `android_app/src/app/home.tsx`

- [ ] **Step 1: Glass header overlay**

Update `logoWrapper` style: add `backgroundColor: 'rgba(28,28,27,0.85)'` (glass), `borderColor: 'rgba(255,102,0,0.15)'` (subtle orange glow border).

- [ ] **Step 2: Glass header action buttons**

Update `iconButton` and `avatarButton`: `backgroundColor: 'rgba(28,28,27,0.85)'`, `borderColor: 'rgba(255,102,0,0.15)'`.

- [ ] **Step 3: Glass location card**

Update `locationCard`: `backgroundColor: 'rgba(28,28,27,0.95)'`, refined border `#252525`, add `shadowColor: '#FF6600'`, `shadowOpacity: 0.12`, `shadowRadius: 10` for ambient glow.

- [ ] **Step 4: FAB glow**

Update `fab` style: `shadowColor: '#FF6600'`, `shadowOpacity: 0.5`, `shadowRadius: 16` (stronger glow than cards).

- [ ] **Step 5: Glass rental and location list cards**

Update `rentalCard`, `locationListItem`: `backgroundColor: 'rgba(28,28,27,0.80)'`, border `#252525`. Add spring press: on `:active`, scale to `0.98` and add orange border glow.

- [ ] **Step 6: Bottom sheet glass**

The `BottomSheet` component handles this. Ensure the home screen's `tabButtonActive` uses `borderBottomColor: '#FF6600'`.

- [ ] **Step 7: Profile modal glass**

Update `profileContainer`: glass sections. Update `profileCard`: glass avatar with subtle glow. Update `menuItem`: glass rows with refined borders.

- [ ] **Step 8: FAB modal glass**

Update `fabModalContent`: glass surface with `borderColor: 'rgba(255,102,0,0.15)'`.

- [ ] **Step 9: Verify home screen**

Test: map renders, markers tap, bottom sheet drags, FAB press animates, profile modal opens, all spring animations work.

---

### Task 3.4: Update Rent Screen

**Files:**
- Modify: `android_app/src/app/rent.tsx`

- [ ] **Step 1: Glass step indicator**

Update `stepDotActive`: add `shadowColor: '#FF6600'`, `shadowOpacity: 0.3`, `shadowRadius: 6` for active step glow.

- [ ] **Step 2: Glass size cards**

Update `card` style: `backgroundColor: 'rgba(28,28,27,0.80)'`, border `#252525`. When `cardSelected`: add `shadowColor: '#FF6600'`, `shadowOpacity: 0.15`, `shadowRadius: 8`.

- [ ] **Step 3: Glass plan rows**

Update `cardRow`: glass surface. When `cardRowSelected`: orange border glow.

- [ ] **Step 4: Glass summary and payment cards**

Update `summaryCard`, `paymentMethodCard`: glass surfaces, orange glow on selected.

- [ ] **Step 5: Spring on success checkmark**

The existing `Animated.spring` on `checkScale` should use the spring config. Verify `{ friction: 4 }` gives a satisfying bounce.

- [ ] **Step 6: Verify rent flow**

Test: all 4 steps navigate correctly, glass surfaces render, spring animations on card selection.

---

### Task 3.5: Update Rental Detail Screen

**Files:**
- Modify: `android_app/src/app/rental-detail.tsx`

- [ ] **Step 1: Glass detail card**

Update `detailCard`: `backgroundColor: 'rgba(28,28,27,0.80)'`, refined border, subtle shadow.

- [ ] **Step 2: Glass QR container**

The QR container stays white-on-white (for scannability). Add orange corner accents via CSS — update `scannerCornerTL/TR/BL/BR` to use `shadowColor: '#FF6600'` with a glow effect.

- [ ] **Step 3: Glass OTP box**

Update `otpWrapper`: glass surface with refined border.

- [ ] **Step 4: Glass section cards**

Update `sectionCard`: glass surfaces.

- [ ] **Step 5: Glass modals**

Update `qrModalContent`, `unlockedModalContent`, `confirmModalContent`: glass surfaces with orange glow on borders.

- [ ] **Step 6: Unlock indicator glow**

Update `unlockIndicator`: `backgroundColor: 'rgba(255,102,0,0.12)'` with `shadowColor: '#FF6600'`, `shadowOpacity: 0.2`, `shadowRadius: 12`.

- [ ] **Step 7: Verify rental detail**

Test: QR renders, OTP copy works, modals slide up with spring, unlock countdown works.

---

### Task 3.6: Update Notifications Screen

**Files:**
- Modify: `android_app/src/app/notifications.tsx`

- [ ] **Step 1: Glass segmented control**

Update `segmentBtnActive`: `backgroundColor: '#FF6600'` stays, but ensure it has subtle glow via shadow.

- [ ] **Step 2: Glass notification cards**

Update `cardUnread`: `backgroundColor: 'rgba(28,28,27,0.80)'` (glass unread card). Update `cardRead`: `backgroundColor: 'rgba(28,28,27,0.50)'` (slightly more transparent for read state).

- [ ] **Step 3: Unread border glow**

Update `unreadBorder`: keep `#FF6600` but add `shadowColor: '#FF6600'`, `shadowOpacity: 0.3`, `shadowRadius: 4` for a soft glow effect on the border.

- [ ] **Step 4: Verify notifications**

Test: filter switching works, unread/read states render correctly, glass treatment visible.

---

### Task 3.7: Update Forgot/Reset Password Screens

**Files:**
- Modify: `android_app/src/app/forgot-password.tsx`, `android_app/src/app/reset-password.tsx`

- [ ] **Step 1: Apply glass input treatment**

Both screens use the `Input` component which is already updated. Replace any hardcoded border colors with `#252525`.

- [ ] **Step 2: Verify flows**

Test: forgot password2-step flow works, reset password flow works.

---

## Phase 4: Icon Migration — Ionicons → Phosphor

### Task 4.1: Migrate Icons in App Screens

**Files:**
- Modify: `android_app/src/app/*.tsx` (all screen files)

- [ ] **Step 1: Replace Ionicons imports**

In every screen file, replace:
```ts
import { Ionicons } from '@expo/vector-icons';
```
with:
```ts
import {
  Cube, Bell, BellSlash, Person, User, QrCode, Check, X, CaretRight,
  LockOpen, Warning, CheckCircle, AlertCircle, MapPin, Clock, Key,
  Eye, EyeSlash, Copy, ArrowLeft, DeviceMobile, Lock, SquaresFour,
  Info, FileText, Question, Camera, Grid, ArrowRight
} from '@phosphor-icons/react';
```

- [ ] **Step 2: Map icon names**

Replace each Ionicons usage with its Phosphor equivalent:

| Ionicons | Phosphor |
|---|---|
| `cube` | `Cube` |
| `notifications-outline` | `Bell` |
| `notifications` | `Bell` |
| `person` | `Person` |
| `qr-code-outline` | `QrCode` |
| `checkmark-circle` | `CheckCircle` |
| `checkmark` | `Check` |
| `close` | `X` |
| `chevron-forward` | `CaretRight` |
| `chevron-right` | `CaretRight` |
| `lock-open-outline` | `LockOpen` |
| `warning-outline` | `Warning` |
| `warning` | `Warning` |
| `alert-circle` | `AlertCircle` |
| `notifications-off-outline` | `BellSlash` |
| `location-outline` | `MapPin` |
| `time-outline` | `Clock` |
| `key-outline` | `Key` |
| `eye` | `Eye` |
| `eye-off` | `EyeSlash` |
| `copy-outline` | `Copy` |
| `arrow-back` | `ArrowLeft` |
| `phone-portrait-outline` | `DeviceMobile` |
| `lock-closed-outline` | `Lock` |
| `cube-outline` | `Cube` |
| `grid-outline` | `SquaresFour` |
| `information-circle-outline` | `Info` |
| `document-text-outline` | `FileText` |
| `help-circle-outline` | `Question` |
| `person-outline` | `User` |

- [ ] **Step 3: Update icon props**

Phosphor icons use `size` and `color` props directly (no `name` prop). Replace:
```tsx
<Ionicons name="cube" size={32} color="#FF6600" />
```
with:
```tsx
<Cube size={32} color="#FF6600" />
```

- [ ] **Step 4: Update all screen files**

Go through each screen file:
- `login.tsx` — `cube`, `phone-portrait-outline`, `lock-closed-outline`, `eye`, `eye-off`
- `register.tsx` — `arrow-back`, `phone-portrait-outline`, `lock-closed-outline`
- `forgot-password.tsx` — `arrow-back`, `lock-closed-outline`, `key-outline`, `eye`, `eye-off`
- `reset-password.tsx` — `arrow-back`, `lock-closed-outline`, `eye`, `eye-off`
- `home.tsx` — `cube`, `notifications-outline`, `person`, `qr-code-outline`, `close`, `chevron-forward`, `lock-open-outline`, `key-outline`
- `rent.tsx` — `arrow-back`, `checkmark`, `cube-outline`, `grid-outline`, `location-outline`, `time-outline`, `qr-code-outline`
- `rental-detail.tsx` — `arrow-back`, `checkmark-circle`, `alert-circle`, `close`, `lock-open-outline`, `warning-outline`
- `notifications.tsx` — `arrow-back`, `notifications-off-outline`

- [ ] **Step 5: Verify all icons render**

Run: `cd android_app && npx expo start --android`
Expected: All icons render correctly with Phosphor, correct size and color.

---

### Task 4.2: Migrate Icons in Components

**Files:**
- Modify: `android_app/src/components/ui/*.tsx`, `android_app/src/components/*.tsx`

- [ ] **Step 1: Update component icon imports**

Replace Ionicons in:
- `input.tsx` — `phone-portrait-outline`, `lock-closed-outline`, `eye`, `eye-off`
- `collapsible.tsx` — uses `expo-symbols` (keep as-is, not Ionicons)
- `animated-icon.tsx` — uses `Ionicons` for the cube logo → replace with `Cube` from Phosphor
- `app-tabs.tsx` / `app-tabs.web.tsx` — any Ionicons usage

- [ ] **Step 2: Verify components**

Check all components render correctly with Phosphor icons.

---

## Phase 5: Polish & Pre-Flight

### Task 5.1: Implement Reduced Motion

**Files:**
- Modify: `android_app/src/components/ui/button.tsx`
- Modify: `android_app/src/components/ui/bottom-sheet.tsx`
- Modify: `android_app/src/app/home.tsx`
- Modify: `android_app/src/app/rent.tsx`
- Modify: `android_app/src/app/rental-detail.tsx`

- [ ] **Step 1: Add reduced motion hook**

Create a helper in `src/hooks/use-reduced-motion.ts`:
```ts
import { useSharedValue } from 'react-native-reanimated';
import { AccessibilityInfo } from 'react-native';
import { useEffect } from 'react';

export function useReducedMotion() {
  const reduced = useSharedValue(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reduced.value = enabled;
    });
  }, [reduced]);
  return reduced;
}
```

- [ ] **Step 2: Guard button spring animation**

In `button.tsx`, wrap the spring press animation so it skips when `reduced.value === true`. When reduced motion is on, use a simple `withTiming(0.97, { duration: 100 })` instead of spring, or skip the animation entirely.

- [ ] **Step 3: Guard bottom sheet spring**

In `bottom-sheet.tsx`, use `useReducedMotion()` hook. When `reduced.value === true`, use `withTiming` instead of `withSpring` for translateY snaps.

- [ ] **Step 4: Guard home screen animations**

Any spring animations in `home.tsx` (FAB press, card press) should check `useReducedMotion()` and degrade to instant/static.

- [ ] **Step 5: Guard rent screen animations**

The success checkmark spring scale animation in `rent.tsx` should degrade to instant `scale(1)` when reduced motion is on.

- [ ] **Step 6: Guard rental detail modals**

Modal slide-up animations in `rental-detail.tsx` should use `withTiming` instead of `withSpring` when reduced motion is on.



- [ ] **Step 1: Run Pre-Flight Checklist**

Go through the design doc checklist (section 9):
- [ ] All Ionicons replaced with Phosphor Icons
- [ ] Be Vietnam Pro + JetBrains Mono loaded
- [ ] Color palette updated with glow variants
- [ ] Glass surface treatment on all cards
- [ ] Brand glow on FAB, QR corners, selected states
- [ ] Spring physics on all interactive elements
- [ ] Button press: scale(0.97) + opacity(0.8)
- [ ] Card press: scale(0.98) + border glow
- [ ] FAB press: scale(0.92)
- [ ] Bottom sheet: spring drag
- [ ] Tab indicator: spring slide
- [ ] Reduced motion degrades all animations gracefully
- [ ] No CTA button wraps to 2+ lines
- [ ] WCAG AA contrast on all text

- [ ] **Step 2: Test on Android device/emulator**

Build and run on Android. Verify:
- Fonts load correctly (Be Vietnam Pro visible)
- Glass surfaces render (semi-transparent backgrounds)
- Orange glow visible on FAB, selected cards
- Spring animations smooth (bottom sheet, FAB, cards)
- All icons render (Phosphor)
- All navigation flows work

- [ ] **Step 3: Commit redesign**

```bash
git add -A
git commit -m "feat(android): complete UI redesign — dark glass, spring motion, phosphor icons

- Dark Glass surfaces with brand glow
- Be Vietnam Pro + JetBrains Mono typography
- Spring-first microinteractions
- Phosphor Icons replacing Ionicons
- Refined color palette with glow variants

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
