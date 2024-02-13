const baseTokens = {
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

/**
 * Minimal theme for the Flash Calendar component.
 * @internal
 */
export const lightTheme = {
  ...baseTokens,
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
      primary: "#FFFFFF",
      tertiary: "#EDEFEE",
      tertiaryPressed: "#D1D2D3",
      inverse: {
        primary: "#000000",
      },
    },
    borders: {
      default: "#E0E0E0",
    },
    transparent: "transparent",
  },
} as const;

export const darkTheme = {
  ...baseTokens,
  colors: {
    content: {
      disabled: "#bdbdbd",
      primary: "#FFFFFF",
      secondary: "#e8e8e8",
      inverse: {
        primary: "#000000",
      },
    },
    background: {
      primary: "#000000",
      tertiary: "#111111",
      tertiaryPressed: "#212121",
      inverse: {
        primary: "#FFFFFF",
      },
    },
    borders: {
      default: "#5c5c5c",
    },
    transparent: "transparent",
  },
} as const;

export type BaseTheme = typeof lightTheme | typeof darkTheme;
