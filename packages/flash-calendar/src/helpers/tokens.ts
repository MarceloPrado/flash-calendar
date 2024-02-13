/**
 * Minimal design systems tokens for the Flash Calendar component.
 * @internal
 */
export const tokens = {
  colors: {
    content: {
      disabled: "#B0B0B0",
      primary: "#000000",
      secondary: "#212121",
      inverse: {
        primary: "#FFFFFF",
      },
    },
    background: {
      primary: "#000000",
      tertiary: "#EDEFEE",
      tertiaryPressed: "#D1D2D3",
    },
    borders: {
      default: "#E0E0E0",
    },
    transparent: "transparent",
  },

  spacing: {
    0: 0,
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
  },
} as const;
