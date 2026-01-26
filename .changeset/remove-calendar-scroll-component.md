---
"@marceloterreiro/flash-calendar": major
---

Remove CalendarScrollComponent prop from Calendar.List

The `CalendarScrollComponent` prop has been removed from `Calendar.List`. LegendList is now the only supported list implementation and cannot be replaced.

**Migration:**

If you were using `CalendarScrollComponent` to integrate with bottom sheets or other custom scroll containers:

1. Wrap `Calendar.List` in your custom scroll container, or
2. Use the standalone `Calendar` component with your own list implementation

This change simplifies the API and reduces maintenance burden by focusing on a single, well-supported list implementation.
