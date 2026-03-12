import type { ReactNode } from "react";
import { memo } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";

import type { CalendarTextProps } from "@/components/Text";
import { Text } from "@/components/Text";
import type { BaseTheme } from "@/helpers/tokens";
import type { CalendarDayMetadata } from "@/hooks/useCalendar";
import { useOptimizedDayMetadata } from "@/hooks/useOptimizedDayMetadata";
import { useTheme } from "@/hooks/useTheme";

import type { PressableLike } from "./Calendar";

// react-native-web/overrides.ts
declare module "react-native" {
  interface PressableStateCallbackType {
    hovered?: boolean;
    focused?: boolean;
  }
}

const styles = StyleSheet.create({
  baseContainer: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    flex: 1,
  },
  baseContent: {
    textAlign: "center",
  },
});

export type DayState = "idle" | "active" | "today" | "disabled";

interface DayTheme {
  container: ViewStyle;
  content: TextStyle;
}
type CalendarItemDayTheme = Record<
  DayState,
  (params: {
    isStartOfRange: boolean;
    isEndOfRange: boolean;
    isPressed: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
  }) => DayTheme
>;

const buildBaseStyles = (theme: BaseTheme): CalendarItemDayTheme => {
  const baseContent = {
    ...styles.baseContent,
    color: theme.colors.content.primary,
  };

  return {
    active: ({ isPressed, isHovered }) => {
      const baseStyles: DayTheme & { container: ViewStyle } =
        isPressed || isHovered
          ? {
              container: {
                ...styles.baseContainer,
                backgroundColor: theme.colors.background.tertiary,
              },
              content: {
                ...baseContent,
                color: theme.colors.content.primary,
              },
            }
          : {
              container: {
                ...styles.baseContainer,
                backgroundColor: theme.colors.background.inverse.primary,
              },
              content: {
                ...baseContent,
                color: theme.colors.content.inverse.primary,
              },
            };

      return baseStyles;
    },
    disabled: () => ({
      container: styles.baseContainer,
      content: {
        ...baseContent,
        color: theme.colors.content.disabled,
      },
    }),
    idle: ({ isPressed, isHovered }) => {
      return isPressed || isHovered
        ? {
            container: {
              ...styles.baseContainer,
              backgroundColor: theme.colors.background.tertiary,
            },
            content: {
              ...baseContent,
              color: theme.colors.content.primary,
            },
          }
        : {
            container: styles.baseContainer,
            content: baseContent,
          };
    },
    today: ({ isPressed, isHovered }) => {
      return isPressed || isHovered
        ? {
            container: {
              ...styles.baseContainer,
              backgroundColor: theme.colors.background.tertiaryPressed,
            },
            content: baseContent,
          }
        : {
            container: {
              ...styles.baseContainer,
              borderColor: theme.colors.borders.default,
              borderStyle: "solid",
              borderWidth: 1,
            },
            content: baseContent,
          };
    },
  };
};

export interface CalendarItemDayProps {
  children: ReactNode;
  onPress: (id: string) => void;
  metadata: CalendarDayMetadata;
  theme?: Partial<
    Record<
      DayState | "base",
      (
        params: CalendarDayMetadata & {
          isPressed: boolean;
          isHovered?: boolean;
          isFocused?: boolean;
        }
      ) => Partial<DayTheme>
    >
  >;
  /** The cell's height */
  height: number;
  /** Optional TextProps to spread to the <Text> component. */
  textProps?: Omit<CalendarTextProps, "children">;
  /** Optional component to replace the default <Pressable> component. */
  CalendarPressableComponent?: PressableLike;
}

/**
 * The base calendar item day component. This component is responsible for
 * rendering each day cell, along with its event handlers.
 *
 * This is not meant to be used directly. Instead, use the
 * `CalendarItemDayWithContainer`, since it also includes the spacing between
 * each day.
 */
export const CalendarItemDay = memo(function CalendarItemDay({
  onPress,
  children,
  theme,
  height,
  metadata,
  textProps,
  CalendarPressableComponent = Pressable as PressableLike,
}: CalendarItemDayProps) {
  const baseTheme = useTheme();
  const baseStyles = buildBaseStyles(baseTheme);

  const handlePress = () => {
    onPress(metadata.id);
  };

  return (
    <CalendarPressableComponent
      disabled={metadata.state === "disabled"}
      onPress={handlePress}
      style={({
        pressed: isPressed,
        hovered: isHovered,
        focused: isFocused,
      }) => {
        const params = {
          isPressed,
          isHovered,
          isFocused,
          isEndOfRange: metadata.isEndOfRange ?? false,
          isStartOfRange: metadata.isStartOfRange ?? false,
        };
        const { container } = baseStyles[metadata.state](params);
        const baseThemeContainer = theme?.base?.({ ...metadata, isPressed })
          .container as ViewStyle | undefined;
        const stateThemeContainer = theme?.[metadata.state]?.({
          ...metadata,
          isPressed,
        }).container as ViewStyle | undefined;
        const mergedContainer: ViewStyle = {
          ...container,
          height,
          ...baseThemeContainer,
          ...stateThemeContainer,
        };
        if (metadata.state === "active") {
          const hasCustomRadius =
            baseThemeContainer?.borderRadius !== undefined ||
            baseThemeContainer?.borderTopLeftRadius !== undefined ||
            baseThemeContainer?.borderBottomLeftRadius !== undefined ||
            baseThemeContainer?.borderTopRightRadius !== undefined ||
            baseThemeContainer?.borderBottomRightRadius !== undefined ||
            stateThemeContainer?.borderRadius !== undefined ||
            stateThemeContainer?.borderTopLeftRadius !== undefined ||
            stateThemeContainer?.borderBottomLeftRadius !== undefined ||
            stateThemeContainer?.borderTopRightRadius !== undefined ||
            stateThemeContainer?.borderBottomRightRadius !== undefined;

          if (!hasCustomRadius) {
            const defaultRadius = styles.baseContainer.borderRadius ?? 0;
            mergedContainer.borderRadius = 0;
            if (metadata.isStartOfRange) {
              mergedContainer.borderTopLeftRadius = defaultRadius;
              mergedContainer.borderBottomLeftRadius = defaultRadius;
            }
            if (metadata.isEndOfRange) {
              mergedContainer.borderTopRightRadius = defaultRadius;
              mergedContainer.borderBottomRightRadius = defaultRadius;
            }
            if (!metadata.isStartOfRange && !metadata.isEndOfRange) {
              mergedContainer.borderRadius = 0;
            }
          } else if (mergedContainer.borderRadius !== undefined) {
            const radius = mergedContainer.borderRadius;
            if (
              metadata.isStartOfRange &&
              mergedContainer.borderTopLeftRadius === undefined
            ) {
              mergedContainer.borderTopLeftRadius = radius;
            }
            if (
              metadata.isStartOfRange &&
              mergedContainer.borderBottomLeftRadius === undefined
            ) {
              mergedContainer.borderBottomLeftRadius = radius;
            }
            if (
              metadata.isEndOfRange &&
              mergedContainer.borderTopRightRadius === undefined
            ) {
              mergedContainer.borderTopRightRadius = radius;
            }
            if (
              metadata.isEndOfRange &&
              mergedContainer.borderBottomRightRadius === undefined
            ) {
              mergedContainer.borderBottomRightRadius = radius;
            }
          }
        }
        return mergedContainer;
      }}
    >
      {({ pressed: isPressed, hovered: isHovered, focused: isFocused }) => {
        const params = {
          isPressed,
          isHovered,
          isFocused,
          isEndOfRange: metadata.isEndOfRange ?? false,
          isStartOfRange: metadata.isStartOfRange ?? false,
        };
        const { content } = baseStyles[metadata.state](params);
        return (
          <Text
            {...textProps}
            style={{
              ...content,
              ...(textProps?.style ?? ({} as object)),
              ...theme?.base?.({ ...metadata, isPressed, isHovered, isFocused })
                .content,
              ...theme?.[metadata.state]?.({
                ...metadata,
                isPressed,
                isHovered,
                isFocused,
              }).content,
            }}
          >
            {children}
          </Text>
        );
      }}
    </CalendarPressableComponent>
  );
});

interface CalendarItemDayContainerTheme {
  /** An empty view that acts as a spacer between each day. The spacing is
   * controlled by the `daySpacing` prop. */
  spacer?: ViewStyle | ((params: CalendarDayMetadata) => ViewStyle);
  /** An absolute positioned filler to join the active days together in a single
   * complete range. */
  activeDayFiller?: ViewStyle | ((params: CalendarDayMetadata) => ViewStyle);
  /** An absolutely-positioned background view rendered inside the spacer,
   * behind the day button. Useful for rendering a range band that doesn't
   * extend behind the circular edge days. */
  activeDayRangeBackground?:
    | ViewStyle
    | ((params: CalendarDayMetadata) => ViewStyle | undefined);
}

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
  /** The metadata for the day, extracted from the calendar's state. */
  metadata?: CalendarDayMetadata;
}

export const CalendarItemDayContainer = memo(function CalendarItemDayContainer({
  children,
  isStartOfWeek,
  shouldShowActiveDayFiller,
  theme,
  daySpacing,
  dayHeight,
  metadata,
}: CalendarItemDayContainerProps) {
  const baseTheme = useTheme();
  const spacerTheme =
    typeof theme?.spacer === "function" && metadata
      ? theme.spacer(metadata)
      : theme?.spacer;
  const spacerStyles: ViewStyle = {
    position: "relative",
    marginLeft: isStartOfWeek ? 0 : daySpacing,
    flex: 1,
    height: dayHeight,
    ...(spacerTheme ?? {}),
  };

  const activeDayFiller: ViewStyle | null = !shouldShowActiveDayFiller
    ? null
    : {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: -(daySpacing + 1), // +1 to cover the 1px gap
        width: daySpacing + 2, // +2 to cover the 1px gap (distributes evenly on both sides)
        backgroundColor: baseTheme.colors.background.inverse.primary,
        ...(typeof theme?.activeDayFiller === "function" && !!metadata
          ? theme.activeDayFiller(metadata)
          : theme?.activeDayFiller),
      };

  const rangeBackgroundTheme =
    typeof theme?.activeDayRangeBackground === "function" && metadata
      ? theme.activeDayRangeBackground(metadata)
      : theme?.activeDayRangeBackground;
  const rangeBackground: ViewStyle | null = rangeBackgroundTheme
    ? {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        ...rangeBackgroundTheme,
      }
    : null;

  return (
    <View style={spacerStyles}>
      {rangeBackground ? <View style={rangeBackground} /> : null}
      {activeDayFiller ? <View style={activeDayFiller} /> : null}
      {children}
    </View>
  );
});

export interface CalendarItemDayWithContainerProps
  extends Omit<CalendarItemDayProps, "height">,
    Pick<CalendarItemDayContainerProps, "daySpacing" | "dayHeight"> {
  containerTheme?: CalendarItemDayContainerTheme;
  /**
   * A unique identifier for this calendar instance. This is useful if you
   * need to render more than one calendar at once. This allows Legend Calendar
   * to scope its state to the given instance.
   *
   * No need to get fancy with `uuid` or anything like that - a simple static
   * string is enough.
   *
   * If not provided, Legend Calendar will use a default value which will hoist
   * the state in a global scope.
   */
  calendarInstanceId?: string;
}

export const CalendarItemDayWithContainer = memo(
  function CalendarItemDayWithContainer({
    children,
    metadata: baseMetadata,
    onPress,
    theme,
    dayHeight,
    daySpacing,
    containerTheme,
    calendarInstanceId,
    CalendarPressableComponent,
  }: CalendarItemDayWithContainerProps) {
    const metadata = useOptimizedDayMetadata(baseMetadata, calendarInstanceId);

    return (
      <CalendarItemDayContainer
        dayHeight={dayHeight}
        daySpacing={daySpacing}
        isStartOfWeek={metadata.isStartOfWeek}
        metadata={metadata}
        shouldShowActiveDayFiller={
          metadata.isRangeValid && !metadata.isEndOfWeek
            ? !metadata.isEndOfRange
            : false
        }
        theme={containerTheme}
      >
        <CalendarItemDay
          CalendarPressableComponent={CalendarPressableComponent}
          height={dayHeight}
          metadata={metadata}
          onPress={onPress}
          theme={theme}
        >
          {children}
        </CalendarItemDay>
      </CalendarItemDayContainer>
    );
  }
);
