# Plan: Remove Remaining "Flash Calendar" References

## Summary

After migrating from FlashList to LegendList, there are still various "Flash Calendar" naming references throughout the codebase that should be updated to "Legend Calendar" for consistency.

---

## Files with Remaining References

### 1. `packages/legend-calendar/package.json` (Line 2)

**Current:**

```json
"name": "@marceloterreiro/flash-calendar",
```

**Action:** Update package name to legend-calendar equivalent (coordinate with maintainer on final name)

---

### 2. `packages/legend-calendar/src/components/CalendarList.tsx`

**Variable naming (Line 296):**

```typescript
const flashListRef = useRef<LegendListRef>(null);
```

**Action:** Rename to `legendListRef` and update all usages:

- Line 307: `flashListRef.current?.scrollToOffset`
- Line 335: `flashListRef.current?.scrollToOffset`
- Line 341: `flashListRef.current?.scrollToOffset`
- Line 360: `ref={flashListRef}`

---

### 3. `packages/legend-calendar/src/components/Calendar.tsx`

**Documentation comments referencing "Flash Calendar":**

- **Lines 52-58:** JSDoc comment mentions "Flash Calendar" twice

  ```typescript
  * A unique identifier for this calendar instance. This is useful if you
  * need to render more than one calendar at once. This allows Flash Calendar
  * to scope its state to the given instance.
  ...
  * If not provided, Flash Calendar will use a default value which will hoist
  ```

- **Line 211:** GitHub issue reference
  ```typescript
  * [#11](https://github.com/MarceloPrado/flash-calendar/issues/11).
  ```

**Action:** Update comments to reference "Legend Calendar" and update GitHub URL if applicable

---

### 4. `packages/legend-calendar/src/components/CalendarItemDay.tsx`

**Documentation comments (Lines 336-343):**

```typescript
* A unique identifier for this calendar instance. This is useful if you
* need to render more than one calendar at once. This allows Flash Calendar
* to scope its state to the given instance.
...
* If not provided, Flash Calendar will use a default value which will hoist
```

**Action:** Update "Flash Calendar" → "Legend Calendar"

---

### 5. `packages/legend-calendar/src/components/CalendarThemeProvider.tsx`

**Documentation comment (Line 19):**

```typescript
* When set, Flash Calendar will use this color scheme instead of the system's
```

**Action:** Update "Flash Calendar" → "Legend Calendar"

---

### 6. `packages/legend-calendar/src/helpers/tokens.ts`

**Comment (Line 16):**

```typescript
* Minimal theme for the Flash Calendar component.
```

**Action:** Update "Flash Calendar" → "Legend Calendar"

---

### 7. `packages/legend-calendar/src/hooks/useOptimizedDayMetadata.ts`

**Constant (Line 30):**

```typescript
const DEFAULT_CALENDAR_INSTANCE_ID = "flash-calendar-default-instance";
```

**Action:** Update to `"legend-calendar-default-instance"`

> ⚠️ **Breaking Change Warning:** This is a runtime value. Changing it could affect existing users who rely on the default instance ID. Consider if this needs a migration path or major version bump.

---

### 8. `packages/legend-calendar/CHANGELOG.md`

**Historical references to flash-calendar**

**Action:** Leave as-is (historical record) or note the rename in a new changelog entry

---

## Execution Checklist

- [ ] **Step 1:** Rename `flashListRef` → `legendListRef` in `CalendarList.tsx`
- [ ] **Step 2:** Update JSDoc comments in `Calendar.tsx`
- [ ] **Step 3:** Update JSDoc comments in `CalendarItemDay.tsx`
- [ ] **Step 4:** Update JSDoc comment in `CalendarThemeProvider.tsx`
- [ ] **Step 5:** Update comment in `tokens.ts`
- [ ] **Step 6:** Update `DEFAULT_CALENDAR_INSTANCE_ID` in `useOptimizedDayMetadata.ts`
- [ ] **Step 7:** (Optional) Update `package.json` name - requires coordination
- [ ] **Step 8:** (Optional) Add changelog entry documenting the rename

---

## Notes

- The `CHANGELOG.md` references are historical and should likely remain unchanged
- The `package.json` name change requires coordination with npm publishing strategy
- The `DEFAULT_CALENDAR_INSTANCE_ID` change is technically a breaking change for edge cases
