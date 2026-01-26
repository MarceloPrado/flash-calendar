# Migration Plan: FlashList → LegendList

## Summary

The migration is straightforward since **LegendList maintains API compatibility with FlashList**. The main file requiring changes is `packages/legend-calendar/src/components/CalendarList.tsx`.

---

## Step 1: Update Dependencies

**In `packages/legend-calendar/package.json`:**

- **Remove** `@shopify/flash-list` from `devDependencies` and `peerDependencies`
- **Add** `@legendapp/list` as a dependency or peerDependency

```json
"dependencies": {
  "mitt": "^3.0.1",
  "@legendapp/list": "^1.0.0"  // or latest version
},
"peerDependencies": {
  "@legendapp/list": "*",
  "react": "*",
  "react-native": "*"
}
```

---

## Step 2: Update CalendarList.tsx Imports

**Change lines 1-2:**

```diff
- import type { FlashListProps } from "@shopify/flash-list";
- import { FlashList } from "@shopify/flash-list";
+ import type { LegendListProps } from "@legendapp/list";
+ import { LegendList, LegendListRef } from "@legendapp/list";
```

---

## Step 3: Update Type References

**Line 32** – Update the `CalendarListProps` interface:
```diff
- Omit<FlashListProps<CalendarMonthEnhanced>, "renderItem" | "data"> {
+ Omit<LegendListProps<CalendarMonthEnhanced>, "renderItem" | "data"> {
```

**Line 74** – Update `CalendarScrollComponent` prop type:
```diff
- CalendarScrollComponent?: typeof FlashList;
+ CalendarScrollComponent?: typeof LegendList;
```

**Line 89** – Update `renderItem` prop type:
```diff
- renderItem?: FlashListProps<CalendarMonthEnhanced>["renderItem"];
+ renderItem?: LegendListProps<CalendarMonthEnhanced>["renderItem"];
```

---

## Step 4: Update Default Value and Ref

**Line 124** – Update default component:
```diff
- CalendarScrollComponent = FlashList,
+ CalendarScrollComponent = LegendList,
```

**Line 226-228** – Update `overrideItemLayout` callback to `getFixedItemSize`:
```diff
- const handleOverrideItemLayout = useCallback<
-   NonNullable<FlashListProps<CalendarMonth>["overrideItemLayout"]>
- >(
-   (layout, item) => {
-     const monthHeight = getHeightForMonth({
-       calendarMonth: item,
-       calendarSpacing,
-       calendarDayHeight,
-       calendarMonthHeaderHeight,
-       calendarRowVerticalSpacing,
-       calendarAdditionalHeight,
-       calendarWeekHeaderHeight,
-     });
-     layout.size = monthHeight;
-   },
+ const handleGetFixedItemSize = useCallback(
+   (_index: number, item: CalendarMonth) => {
+     return getHeightForMonth({
+       calendarMonth: item,
+       calendarSpacing,
+       calendarDayHeight,
+       calendarMonthHeaderHeight,
+       calendarRowVerticalSpacing,
+       calendarAdditionalHeight,
+       calendarWeekHeaderHeight,
+     });
+   },
```

> **Note:** LegendList uses `getFixedItemSize` instead of `overrideItemLayout`. The function signature is `(index, item, type?) => number | undefined`.

**Line 293** – Update ref type:
```diff
- const flashListRef = useRef<FlashList<CalendarMonthEnhanced>>(null);
+ const flashListRef = useRef<LegendListRef>(null);
```

---

## Step 5: Update Component Props

**Lines 346-362** – Update the rendered component:

```diff
  <CalendarScrollComponent
    data={monthListWithCalendarProps}
    estimatedItemSize={273}
    initialScrollIndex={initialMonthIndex}
    keyExtractor={keyExtractor}
    onEndReached={handleOnEndReached}
-   overrideItemLayout={handleOverrideItemLayout}
+   getFixedItemSize={handleGetFixedItemSize}
+   recycleItems={true}
    ref={flashListRef}
    renderItem={({ item }) => (
      <View style={calendarContainerStyle}>
        <Calendar calendarMonthId={item.id} {...item.calendarProps} />
      </View>
    )}
    showsVerticalScrollIndicator={false}
    {...flatListProps}
  />
```

---

## Step 6: Update Calendar.tsx Comment

**Lines 204-211** in `packages/legend-calendar/src/components/Calendar.tsx` – Update the comment referencing FlashList recycling:

```diff
-    * While `calendarMonthId` is not used by the effect, we still need it in
-    * the dependency array since [FlashList uses recycling
-    * internally](https://shopify.github.io/flash-list/docs/recycling).
+    * While `calendarMonthId` is not used by the effect, we still need it in
+    * the dependency array since [LegendList uses recycling
+    * internally](https://legendapp.com/open-source/list/).
```

---

## Step 7: Update index.ts Comment

**Line 16** in `packages/legend-calendar/src/components/index.ts`:

```diff
- * This file houses the public API for the flash-calendar package.
+ * This file houses the public API for the legend-calendar package.
```

---

## Key API Differences

| FlashList | LegendList | Notes |
|-----------|------------|-------|
| `overrideItemLayout` | `getFixedItemSize` | Returns size directly instead of mutating layout object |
| `FlashListProps` | `LegendListProps` | Type import |
| `FlashList` | `LegendList` | Component import |
| N/A | `recycleItems` | Enable recycling (recommended for performance) |
| N/A | `maintainVisibleContentPosition` | Useful for bidirectional scrolling |

---

## Benefits of Migration

1. **No native module linking** – 100% JavaScript implementation
2. **Better bidirectional scrolling** – No flashes or scroll jumping
3. **Smaller dependency** – Minimal footprint
4. **API compatible** – Drop-in replacement for most use cases

---

## Files to Modify

- [ ] `packages/legend-calendar/package.json`
- [ ] `packages/legend-calendar/src/components/CalendarList.tsx`
- [ ] `packages/legend-calendar/src/components/Calendar.tsx`
- [ ] `packages/legend-calendar/src/components/index.ts`
