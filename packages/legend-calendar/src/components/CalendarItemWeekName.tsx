import type { ReactNode } from "react";
import { memo } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import type { CalendarTextProps } from "@/components/Text";
import { Text } from "@/components/Text";
import { lightTheme } from "@/helpers/tokens";
import { useTheme } from "@/hooks/useTheme";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: lightTheme.spacing[6],
  },
  content: {},
});

interface CalendarItemWeekNameTheme {
  container?: ViewStyle;
  content?: TextStyle;
}

export interface CalendarItemWeekNameProps {
  children: ReactNode;
  /**
   * The height of the week name, needed to correctly measure the calendar's
   */
  height: number;
  /** The theme of the week name, useful for customizing the component. */
  theme?: CalendarItemWeekNameTheme;
  /** Optional TextProps to spread to the <Text> component. */
  textProps?: Omit<CalendarTextProps, "children">;
}

export const CalendarItemWeekName = memo(function CalendarItemWeekName({
  children,
  height,
  theme,
  textProps,
}: CalendarItemWeekNameProps) {
  const { colors } = useTheme();
  const containerStyles = [styles.container, { height }, theme?.container];
  const contentStyles = [
    styles.content,
    { color: colors.content.primary },
    textProps?.style,
    theme?.content,
  ];

  return (
    <View style={containerStyles}>
      <Text {...textProps} style={contentStyles}>
        {children}
      </Text>
    </View>
  );
});
