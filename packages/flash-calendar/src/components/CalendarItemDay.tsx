import { borderRadius, darken, padding } from "polished";
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
import { exhaustiveCheck } from "@/helpers/types";

export const DAY_HEIGHT = 32;

/** The gap between each day */
const DAY_GAP = tokens.spacing[8];

const styles = StyleSheet.create({
  container: {
    ...padding(6),
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    height: DAY_HEIGHT,
    justifyContent: "center",
  },
  empty: {
    ...padding(6),
    flex: 1,
    height: DAY_HEIGHT,
  },
});

export type DayState = "idle" | "active" | "today" | "disabled";

const createStyles = ({
  state,
  isEndOfRange,
  isStartOfRange,
}: Pick<CalendarItemDayProps, "state" | "isStartOfRange" | "isEndOfRange">): {
  container: ViewStyle;
  textStyle: TextStyle;
} => {
  const textStyle = { color: tokens.colors.content.primary };

  const baseContainerStyles: ViewStyle = { ...styles.container };

  switch (state) {
    case "active": {
      let updatedContainer: ViewStyle = {
        ...baseContainerStyles,
        backgroundColor: tokens.colors.background.primary,
      };

      // Reset
      updatedContainer.borderRadius = 0;

      if (isStartOfRange) {
        updatedContainer = {
          ...updatedContainer,
          ...borderRadius("left", 16),
        };
      }
      if (isEndOfRange) {
        updatedContainer = {
          ...updatedContainer,
          ...borderRadius("right", 16),
        };
      }
      if (!isStartOfRange && !isEndOfRange) {
        updatedContainer.borderRadius = 0;
      }

      return {
        container: updatedContainer,
        textStyle,
      };
    }
    case "today": {
      return {
        container: {
          ...baseContainerStyles,
          borderColor: tokens.colors.borders.default,
          borderStyle: "solid",
          borderWidth: 2,
        },
        textStyle,
      };
    }
    case "idle": {
      return {
        container: {
          ...baseContainerStyles,
          backgroundColor: tokens.colors.background.tertiary,
        },
        textStyle,
      };
    }
    case "disabled": {
      return {
        container: {
          ...baseContainerStyles,
          backgroundColor: tokens.colors.transparent,
        },
        textStyle: {
          color: tokens.colors.content.disabled,
        },
      };
    }
    default:
      exhaustiveCheck(state);
  }
};

export interface CalendarItemDayProps {
  children: ReactNode;
  id: string;
  isEndOfMonth?: boolean;
  isEndOfRange?: boolean;
  isEndOfWeek?: boolean;
  isStartOfMonth?: boolean;
  isStartOfRange?: boolean;
  isStartOfWeek?: boolean;
  onPress: (id: string) => void;
  /**
   * If true, the active day filler/extension will be hidden. The filler is used
   * as a visual effect to join the active days together in a complete range.
   *
   * Defaults to `true` when:
   * - `isEndOfRange` is true
   * - `isEndOfWeek` is true
   * - `isEndOfMonth` is true
   */
  hideActiveDayFiller?: boolean;
  state: DayState;
}

const BaseCalendarItemDay = memo(
  ({
    state,
    id,
    isEndOfRange,
    isStartOfRange,
    onPress,
    children,
  }: CalendarItemDayProps) => {
    const { container: containerStyles, textStyle } = useMemo(
      () => createStyles({ state, isStartOfRange, isEndOfRange }),
      [state, isStartOfRange, isEndOfRange]
    );

    const handlePress = useCallback(() => {
      onPress?.(id);
    }, [id, onPress]);

    return (
      <Pressable
        disabled={state === "disabled"}
        onPress={handlePress}
        style={({ pressed }) => ({
          ...containerStyles,
          backgroundColor: pressed
            ? darken(0.1, tokens.colors.background.tertiary)
            : containerStyles.backgroundColor,
        })}
      >
        <Text style={textStyle}>{children}</Text>
      </Pressable>
    );
  }
);

type SpacerProps = {
  children: ReactNode;
} & Omit<CalendarItemDayProps, "children" | "onPress" | "id">;

const Spacer = memo(
  ({
    children,
    isStartOfWeek,
    state,
    isEndOfRange,
    isEndOfWeek,
    isEndOfMonth,
    hideActiveDayFiller = isEndOfRange || isEndOfWeek || isEndOfMonth,
  }: SpacerProps) => {
    const spacerStyles = useMemo<ViewStyle>(() => {
      const skipMargin = isStartOfWeek;

      return {
        position: "relative",
        marginLeft: skipMargin ? 0 : DAY_GAP,
        flex: 1,
        height: DAY_HEIGHT,
      };
    }, [isStartOfWeek]);

    const activeDayFiller = useMemo<ViewStyle | null>(() => {
      if (state !== "active" || hideActiveDayFiller) {
        return null;
      }

      return {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: -(DAY_GAP + 1), // +1 to cover the 1px gap
        width: DAY_GAP + 2, // +2 to cover the 1px gap (distributes evenly on both sides)
        backgroundColor: tokens.colors.background.primary,
      };
    }, [state, hideActiveDayFiller]);

    return (
      <View style={spacerStyles}>
        {children}

        {activeDayFiller ? <View style={activeDayFiller} /> : null}
      </View>
    );
  }
);

export const CalendarItemDay = memo((props: CalendarItemDayProps) => {
  if (props.state === "active") {
    return (
      <Spacer {...props}>
        <BaseCalendarItemDay {...props} />
      </Spacer>
    );
  }

  return (
    <Spacer {...props}>
      <BaseCalendarItemDay {...props} />
    </Spacer>
  );
});

export const CalendarItemEmpty = memo(
  ({
    isEndOfWeek,
    isStartOfWeek,
  }: Pick<CalendarItemDayProps, "isStartOfWeek" | "isEndOfWeek">) => (
    <Spacer
      isEndOfWeek={isEndOfWeek}
      isStartOfWeek={isStartOfWeek}
      state="idle"
    >
      <View style={styles.empty} />
    </Spacer>
  )
);
