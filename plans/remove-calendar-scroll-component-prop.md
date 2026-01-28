# Plan: Remove CalendarScrollComponent Prop

## Summary

Remove the `CalendarScrollComponent` prop from `CalendarList` since we will only support LegendList internally. This simplifies the API and removes the need for users to provide custom scroll components.

---

## Rationale

- LegendList is now the only supported list implementation
- No need to support external lists (FlashList, BottomSheet variants, etc.)
- Simplifies the component API and reduces maintenance burden

---

## Files to Modify

### 1. `packages/legend-calendar/src/components/CalendarList.tsx`

**Remove prop definition (lines 72-78):**

```diff
- /**
-  * The scroll component to use. Useful if you need to replace the LegendList
-  * with an alternative (e.g. a BottomSheet LegendList).
-  * @defaultValue LegendList
-  */
- CalendarScrollComponent?: typeof LegendList;
```

**Remove from destructuring (line 127):**

```diff
  const {
    // List-related props
    calendarInitialMonthId,
    calendarPastScrollRangeInMonths = 12,
    calendarFutureScrollRangeInMonths = 12,
    calendarFirstDayOfWeek = "sunday",
-   CalendarScrollComponent = LegendList,
    calendarFormatLocale,
    ...
```

**Remove ScrollComponent alias and use LegendList directly (lines 349-369):**

```diff
- const ScrollComponent = CalendarScrollComponent as any;
-
  return (
-   <ScrollComponent
+   <LegendList
      data={monthListWithCalendarProps}
      estimatedItemSize={273}
      getFixedItemSize={handleGetFixedItemSize}
      initialScrollIndex={initialMonthIndex}
      keyExtractor={keyExtractor}
      onEndReached={handleOnEndReached}
      recycleItems
      ref={legendListRef}
      renderItem={({ item }: { item: CalendarMonthEnhanced }) => (
        <View style={calendarContainerStyle}>
          <Calendar calendarMonthId={item.id} {...item.calendarProps} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      {...flatListProps}
    />
  );
```

---

### 2. `apps/docs/docs/fundamentals/usage.mdx`

**Remove the "Custom Scroll Component" section (lines 350-396)** that documents the `CalendarScrollComponent` prop and the BottomSheet example.

---

## Breaking Change

This is a **breaking change** for users who were passing a custom `CalendarScrollComponent`.

### Migration Guide

Users who need BottomSheet integration should:

1. Wrap `Calendar.List` in a BottomSheet-compatible scroll container
2. Or use the standalone `Calendar` component with their own list implementation

---

## Checklist

- [ ] Remove `CalendarScrollComponent` prop type from `CalendarListProps`
- [ ] Remove `CalendarScrollComponent` from component destructuring
- [ ] Remove `ScrollComponent` alias variable
- [ ] Use `LegendList` directly in JSX
- [ ] Remove documentation section about custom scroll components
- [ ] Add changeset for breaking change
