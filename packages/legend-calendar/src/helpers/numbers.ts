/**
 * Returns a list of numbers from `start` (inclusive) to `stop`
 * (inclusive). In mathematical terms, `range(a, b)` is equivalent to
 * the interval `[a, b]`.
 *
 * An optional `step` can be provided to control the size of the increemnt (defaults to `1`).
 *
 * Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */
export const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
