import { type ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});

export interface VStackDividerProps {
  marginBottom: number;
}

export interface VStackProps {
  children: ReactNode;
  spacing?: number;

  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];

  /** If the VStack should `flex: 1` to fill the parent's height */
  grow?: boolean;
}

export function VStack({
  children,
  spacing = 0,
  alignItems,
  justifyContent,
  grow,
}: VStackProps) {
  const containerStyles: ViewStyle = {
    ...styles.container,
    gap: spacing,
    alignItems,
    justifyContent,
    flex: grow ? 1 : undefined,
  };

  return <View style={containerStyles}>{children}</View>;
}
