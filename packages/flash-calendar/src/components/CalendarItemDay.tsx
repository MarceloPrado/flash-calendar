import type { ReactNode } from "react";
import { memo, useCallback, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  type ViewStyle,
} from "react-native";

import { tokens } from "@/helpers/tokens";

const styles = StyleSheet.create({
  baseContainer: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    flex: 1,
  },
  baseContent: {
    color: tokens.colors.content.primary,
    textAlign: "center",
  },
});

export type DayState = "idle" | "active" | "today" | "disabled";

type DayTheme = {
  container: ViewStyle;
  content: TextStyle;
};
type CalendarItemDayTheme = Record<
  DayState,
  (params: {
    isStartOfRange: boolean;
    isEndOfRange: boolean;
    isPressed: boolean;
  }) => DayTheme
>;

const baseStyles: CalendarItemDayTheme = {
  active: ({ isPressed, isStartOfRange, isEndOfRange }) => {
    const baseStyles: DayTheme = isPressed
      ? {
          container: {
            ...styles.baseContainer,
            backgroundColor: "#424242",
          },
          content: {
            ...styles.baseContent,
            color: tokens.colors.content.inverse.primary,
          },
        }
      : {
          container: {
            ...styles.baseContainer,
            backgroundColor: tokens.colors.background.primary,
          },
          content: {
            ...styles.baseContent,
            color: tokens.colors.content.inverse.primary,
          },
        };

    baseStyles.container.borderRadius = 0;
    if (isStartOfRange) {
      baseStyles.container.borderTopLeftRadius = 16;
      baseStyles.container.borderBottomLeftRadius = 16;
    }
    if (isEndOfRange) {
      baseStyles.container.borderTopRightRadius = 16;
      baseStyles.container.borderBottomRightRadius = 16;
    }
    if (!isStartOfRange && !isEndOfRange) {
      baseStyles.container.borderRadius = 0;
    }
    return baseStyles;
  },
  disabled: () => ({
    container: styles.baseContainer,
    content: {
      ...styles.baseContent,
      color: tokens.colors.content.disabled,
    },
  }),
  idle: ({ isPressed }) => {
    return isPressed
      ? {
          container: {
            ...styles.baseContainer,
            backgroundColor: tokens.colors.background.tertiary,
          },
          content: {
            ...styles.baseContent,
            color: tokens.colors.content.primary,
          },
        }
      : {
          container: styles.baseContainer,
          content: styles.baseContent,
        };
  },
  today: ({ isPressed }) => {
    return isPressed
      ? {
          container: {
            ...styles.baseContainer,
            backgroundColor: tokens.colors.background.tertiaryPressed,
          },
          content: styles.baseContent,
        }
      : {
          container: {
            ...styles.baseContainer,
            borderColor: tokens.colors.borders.default,
            borderStyle: "solid",
            borderWidth: 1,
          },
          content: styles.baseContent,
        };
  },
};

export interface CalendarItemDayProps {
  children: ReactNode;
  id: string;
  /** Whether this day is the end of a range. Useful to control the border
   * radius. */
  isEndOfRange?: boolean;
  /** Whether this day is the start of a range. Useful to control the border
   * radius. */
  isStartOfRange?: boolean;
  onPress: (id: string) => void;
  /** The current state of this day */
  state: DayState;
  theme?: Partial<
    Record<
      DayState,
      (params: {
        isStartOfRange: boolean;
        isEndOfRange: boolean;
        isPressed: boolean;
      }) => Partial<DayTheme>
    >
  >;
  /** The cell's height */
  height: number;
}

export const CalendarItemDay = memo(
  ({
    state,
    id,
    isEndOfRange,
    isStartOfRange,
    onPress,
    children,
    theme,
    height,
  }: CalendarItemDayProps) => {
    const handlePress = useCallback(() => {
      onPress?.(id);
    }, [id, onPress]);

    return (
      <Pressable
        disabled={state === "disabled"}
        onPress={handlePress}
        style={({ pressed: isPressed }) => {
          const params = {
            isPressed,
            isEndOfRange: isEndOfRange ?? false,
            isStartOfRange: isStartOfRange ?? false,
          };
          const { container } = baseStyles[state](params);
          return {
            ...container,
            height,
            ...theme?.[state]?.(params).container,
          };
        }}
      >
        {({ pressed: isPressed }) => {
          const params = {
            isPressed,
            isEndOfRange: isEndOfRange ?? false,
            isStartOfRange: isStartOfRange ?? false,
          };
          const { content } = baseStyles[state](params);
          return (
            <Text style={{ ...content, ...theme?.[state]?.(params).content }}>
              {children}
            </Text>
          );
        }}
      </Pressable>
    );
  }
);

type CalendarItemDayContainerTheme = {
  /** An empty view that acts as a spacer between each day. The spacing is
   * controlled by the `daySpacing` prop. */
  spacer?: ViewStyle;
  /** An absolute positioned filler to join the active days together in a single
   * complete range. */
  activeDayFiller?: ViewStyle;
};

export interface CalendarItemDayContainerProps {
  children: ReactNode;
  isStartOfWeek: boolean;
  /**
   * If true, the active day filler/extension will be shown. The filler is used
   * as a visual effect to join the active days together in a complete range.
   */
  shouldShowActiveDayFiller?: boolean;
  theme?: CalendarItemDayContainerTheme;
  /**
   * The spacing between each day
   */
  daySpacing: number;
  /** The day's height */
  dayHeight: number;
}

export const CalendarItemDayContainer = memo(
  ({
    children,
    isStartOfWeek,
    shouldShowActiveDayFiller,
    theme,
    daySpacing,
    dayHeight,
  }: CalendarItemDayContainerProps) => {
    const spacerStyles = useMemo<ViewStyle>(() => {
      return {
        position: "relative",
        marginLeft: isStartOfWeek ? 0 : daySpacing,
        flex: 1,
        height: dayHeight,
        ...theme?.spacer,
      };
    }, [dayHeight, daySpacing, isStartOfWeek, theme?.spacer]);

    const activeDayFiller = useMemo<ViewStyle | null>(() => {
      if (!shouldShowActiveDayFiller) {
        return null;
      }

      return {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: -(daySpacing + 1), // +1 to cover the 1px gap
        width: daySpacing + 2, // +2 to cover the 1px gap (distributes evenly on both sides)
        backgroundColor: tokens.colors.background.primary,
        ...theme?.activeDayFiller,
      };
    }, [daySpacing, shouldShowActiveDayFiller, theme?.activeDayFiller]);

    return (
      <View style={spacerStyles}>
        {children}
        {activeDayFiller ? <View style={activeDayFiller} /> : null}
      </View>
    );
  }
);
