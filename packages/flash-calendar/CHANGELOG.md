# @marceloterreiro/flash-calendar

## 1.2.0

### Minor Changes

- f3b9ec8: Add the ability to pass TextProps to the <Text> fields especially when supporting accessibility

## 1.1.0

### Minor Changes

- 863edce: Add the ability to mount more than one calendar at once

## 1.0.0

### Major Changes

- 9bf22ed: Flash Calendar 1.0.0 🚢 🎉

  This release officially marks the package as production-ready (`1.0.0`).
  While it's been stable since the first release, bumping to `1.0.0` was something
  I had in mind for a while.

  - New: Add `.scrollToMonth` and `.scrollToDate`, increasing the options available for imperative scrolling.

  ## Breaking changes

  This release introduces one small change in behavior if your app uses
  imperative scrolling. Previously, `.scrollToDate` would scroll to the month
  containing the date instead of the exact date. Now, `.scrollToDate` scrolls
  to the exact date as implied by the name.

  If you intentionally want to scroll to the month instead, a new `.scrollToMonth`
  method is available (same signature).

  I don't expect this to cause any issues, but worth mentioned
  nonetheless.

## 0.0.9

### Patch Changes

- 6d00992: - Add an optional `calendarColorScheme` prop that enables overriding the color scheme used by Flash Calendar.

## 0.0.8

### Patch Changes

- 4fe1276: Remove `borderRadius` type from `itemDay.container`, given it gets overwritten by the base component.

## 0.0.7

### Patch Changes

- ee6b4e5: Fix incorrect scroll position when using the `calendarMinDateId` prop

## 0.0.6

### Patch Changes

- 5363835: Fix `<Calendar.List />` losing track of the active date ranges when the list is scrolled past certain amount

## 0.0.5

### Patch Changes

- cbc7728: Update the registry to Github Packages

## 0.0.4

### Patch Changes

- 801bc18: Fix locale not being forwarded to `Calendar` component

## 0.0.3

### Patch Changes

- e680a96: Add the `calendarFormatLocale` prop

## 0.0.2

### Patch Changes

- First release to test the publish scripts
