import { memo } from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 6,
    flex: 1,
  },
});

export interface CalendarItemEmptyProps {
  /** The height of the cell. Should be the same as `CalendarItemDay`. */
  height: number;
  /** The theme of the empty cell, useful for customizing the component. */
  theme?: {
    container?: ViewStyle;
  };
}

export const CalendarItemEmpty = memo(function CalendarItemEmpty(
  props: CalendarItemEmptyProps
) {
  const { height, theme } = props;
  const containerStyles = [{ ...styles.container, height }, theme?.container];

  return <View style={containerStyles} />;
});
