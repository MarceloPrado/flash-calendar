import type { ReactNode } from "react";
import { memo, useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { HStack } from "@/components/HStack";
import { BaseTheme } from "@/helpers/tokens";

export interface CalendarRowWeekProps {
  children: ReactNode;
  spacing?: keyof BaseTheme["spacing"];
  theme?: CalendarRowWeekTheme;
}

type CalendarRowWeekTheme = {
  container?: ViewStyle;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export const CalendarRowWeek = memo(
  ({ children, spacing = 0, theme }: CalendarRowWeekProps) => {
    const { containerStyles } = useMemo(() => {
      return {
        containerStyles: { ...styles.container, ...(theme?.container ?? {}) },
      };
    }, [theme?.container]);
    return (
      <HStack
        alignItems="center"
        grow
        justifyContent="space-between"
        spacing={spacing}
        style={containerStyles}
      >
        {children}
      </HStack>
    );
  }
);
