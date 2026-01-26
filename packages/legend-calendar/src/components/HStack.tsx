import { useMemo, type ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
});

export interface HStackProps {
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];
  children: ReactNode;
  grow?: boolean;
  shrink?: boolean;
  spacing?: number;
  wrap?: ViewStyle["flexWrap"];
  backgroundColor?: string;
  style?: ViewStyle;
  width?: ViewStyle["width"];
}

export const HStack = ({
  alignItems,
  children,
  justifyContent = "flex-start",
  grow = false,
  shrink = false,
  spacing = 0,
  wrap = "nowrap",
  backgroundColor,
  width,
  style = {},
}: HStackProps) => {
  const containerStyles = useMemo<ViewStyle[]>(
    () => [
      styles.container,
      { gap: spacing },
      grow ? { flexGrow: 1 } : {},
      shrink ? { flexShrink: 1 } : {},
      wrap ? { flexWrap: wrap } : {},
      alignItems ? { alignItems } : {},
      justifyContent ? { justifyContent } : {},
      backgroundColor ? { backgroundColor } : {},
      width ? { width } : {},
      style,
    ],
    [
      alignItems,
      backgroundColor,
      grow,
      justifyContent,
      shrink,
      spacing,
      style,
      width,
      wrap,
    ]
  );

  return <View style={containerStyles}>{children}</View>;
};
