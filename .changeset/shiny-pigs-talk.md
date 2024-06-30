---
"@marceloterreiro/flash-calendar": major
---

# Flash Calendar 1.0.0 🚢 🎉

This release officially marks the package as ready for production use (`1.0.0`).
While it's been stable since the first release, bumping to `1.0.0` was something
I had in mind for a while.

- New: Add `.scrollToMonth` and `.scrollToDate`, increasing the options available for imperative scrolling.

## Breaking changes

This release introduces one slightly change in behavior if you're app uses
imperative scrolling. Previously, `.scrollToDate` would scroll to the month
containing the date instead of the exact date. Now, `.scrollToDate` will scroll
to the exact date as the name suggests.

If you intentionally want to scroll to the month instead, a new `.scrollToMonth`
method was added (same signature).

I don't expect this to cause any issues for existing apps, but worth mentioned
nonetheless.
