# Backward Infinite Scrolling Implementation Plan

## Overview

Now that we've migrated to Legend List, we can implement backward infinite scrolling using the `onStartReached` prop. The `prependMonths` function already exists in `useCalendarList` - we just need to wire it up.

## Current State

- **`onEndReached`**: Already implemented in `CalendarList.tsx` - calls `appendMonths` when user scrolls to the end
- **`prependMonths`**: Already implemented in `useCalendarList.tsx` - prepends months to the list
- **Tests**: Already exist for `prependMonths` in `useCalendarList.test.ts`

## Implementation Steps

### 1. Add `onStartReached` prop to `CalendarListProps`

**File**: `packages/legend-calendar/src/components/CalendarList.tsx`

Add `onStartReached` to the destructured props (similar to how `onEndReached` is handled):

```tsx
const {
  // ... existing props
  onEndReached,
  onStartReached, // Add this
  // ...
} = props;
```

### 2. Create `handleOnStartReached` callback

**File**: `packages/legend-calendar/src/components/CalendarList.tsx`

Create a handler similar to `handleOnEndReached`:

```tsx
const handleOnStartReached = useCallback(
  (info: { distanceFromStart: number }) => {
    prependMonths(calendarPastScrollRangeInMonths);
    onStartReached?.(info);
  },
  [prependMonths, calendarPastScrollRangeInMonths, onStartReached]
);
```

### 3. Pass `onStartReached` to LegendList

**File**: `packages/legend-calendar/src/components/CalendarList.tsx`

Add the prop to the `LegendList` component:

```tsx
<LegendList
  // ... existing props
  onEndReached={handleOnEndReached}
  onStartReached={handleOnStartReached} // Add this
  // ...
/>
```

### 4. Export `prependMonths` from `useCalendarList` hook

**File**: `packages/legend-calendar/src/hooks/useCalendarList.tsx`

`prependMonths` is already returned from the hook - no changes needed here.

### 5. Update the limitations documentation

**File**: `apps/docs/docs/fundamentals/limitations.mdx`

Remove or update the "Infinite scrolling doesn't work backwards" section since this limitation is now resolved.

## Testing

1. Run existing tests to ensure `prependMonths` still works:
   ```bash
   pnpm test -- useCalendarList
   ```

2. Manual testing in kitchen-sink app:
   - Scroll backward past the initial months
   - Verify new months are prepended
   - Verify scroll position is maintained (Legend List handles this via `maintainVisibleContentPosition`)

## Notes

- Legend List's `onStartReached` automatically handles scroll position maintenance when items are prepended
- The `onStartReachedThreshold` prop can be used to control when the callback fires (defaults to screen-based percentage)
- Consider adding `onStartReachedThreshold` as an optional prop if users need to customize it
