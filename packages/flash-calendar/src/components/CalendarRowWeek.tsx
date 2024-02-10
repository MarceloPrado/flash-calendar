import type { ReactNode } from "react";
import { memo } from "react";
import { StyleSheet } from "react-native";

import { HStack } from "@/components/HStack";
import { tokens } from "@/helpers/tokens";

export interface CalendarRowWeekProps {
  children: ReactNode;
  spacing?: keyof typeof tokens.spacing;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export const CalendarRowWeek = memo(
  ({ children, spacing = 0 }: CalendarRowWeekProps) => (
    <HStack
      alignItems="center"
      grow
      justifyContent="space-between"
      spacing={spacing}
      style={styles.container}
    >
      {children}
    </HStack>
  )
);
