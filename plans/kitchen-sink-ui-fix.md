# Kitchen Sink UI Fix Plan

## Problem

After migrating from FlashList to LegendList and upgrading to Expo 54, the kitchen-sink app shows an empty calendar list (only header buttons visible, no calendar items render).

## Root Cause Analysis

### Issue 1: Missing `@legendapp/list` dependency in kitchen-sink/expo ✅ FIXED

The `@legendapp/list` package is a **peer dependency** of `@marceloterreiro/flash-calendar` but was **not declared** in `kitchen-sink/expo/package.json`.

**Fix Applied:** Added `"@legendapp/list": "^2.0.0"` to dependencies.

### Issue 2: Missing default `style={{ flex: 1 }}` on LegendList ✅ FIXED

LegendList (like FlatList) requires explicit height or `flex: 1` to render items. The `CalendarList` component was not providing a default style.

**Fix Applied:** Added `style={{ flex: 1 }}` to the `ScrollComponent` in `CalendarList.tsx` before spreading `flatListProps` (so users can override if needed).

### Issue 3: Dark mode causes white text on white background ✅ FIXED

The kitchen-sink app has a hardcoded white background (`backgroundColor: "#fff"`) but the calendar uses `useColorScheme()` to determine text colors. When the simulator is in dark mode, the calendar renders white text (`#FFFFFF`) on the white background, making it invisible.

**Evidence:** Pressing a day shows "26" with black background (active state), confirming items exist but have invisible text.

**Fix Applied:** Added `calendarColorScheme="light"` to all `Calendar.List` and `Calendar` components in the kitchen-sink examples to force light theme colors.

---

## Fix Steps

### Step 1: Add `@legendapp/list` to kitchen-sink/expo dependencies

```bash
cd kitchen-sink/expo
npx expo install @legendapp/list
```

Or manually add to `package.json`:

```json
"dependencies": {
  "@legendapp/list": "^2.0.0",
  ...
}
```

### Step 2: Add default `style={{ flex: 1 }}` to CalendarList ✅ DONE

Added `style={{ flex: 1 }}` to the `ScrollComponent` in `CalendarList.tsx`.

### Step 3: Add `calendarColorScheme="light"` to examples ✅ DONE

Fixed in:

- `src/ImperativeScroll.tsx`
- `src/CalendarList.tsx`
- `src/Calendar.tsx`
- `src/SlowExampleAddressed.tsx`

### Step 4: Clear caches and reinstall

```bash
rm -rf node_modules .expo
watchman watch-del-all
bun install
```

### Step 4: Rebuild the legend-calendar package

```bash
cd packages/legend-calendar
bun run build
```

### Step 5: Test the kitchen-sink app

```bash
cd kitchen-sink/expo
bun run ios
```

---

## Verification Checklist

- [ ] `@legendapp/list` is in kitchen-sink/expo dependencies
- [ ] Calendar items render in the list
- [ ] Scrolling works correctly
- [ ] `initialScrollIndex` positions correctly
- [ ] Past/Next month buttons work
- [ ] Day press callbacks work

---

## Rollback

If issues persist, temporarily revert to FlashList:

1. Revert `CalendarList.tsx` changes
2. Add `@shopify/flash-list` back to dependencies
3. Remove `@legendapp/list` from dependencies
