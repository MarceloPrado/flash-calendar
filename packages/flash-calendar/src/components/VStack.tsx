import {
  Children,
  Fragment,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { BaseTheme } from "@/helpers/tokens";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});

export type VStackDividerProps = {
  marginBottom: number;
};

export interface VStackProps {
  children: ReactNode;
  spacing?: keyof BaseTheme["spacing"];

  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];

  /** If the VStack should `flex: 1` to fill the parent's height */
  grow?: boolean;
}

function isFragment(child: ReactNode): child is ReactElement {
  return isValidElement(child) && child.type === Fragment;
}

export const VStack = ({
  children,
  spacing = 0,
  alignItems,
  justifyContent,
  grow,
}: VStackProps) => {
  const containerStyles = useMemo<ViewStyle>(
    () => ({
      ...styles.container,
      gap: spacing,
      alignItems,
      justifyContent,
      flex: grow ? 1 : undefined,
    }),
    [alignItems, grow, justifyContent, spacing]
  );

  return (
    <View style={containerStyles}>
      {Children.toArray(children)
        .map((c) => (isFragment(c) ? c.props.children : c))
        .flat()
        .filter((c) => c !== null && typeof c !== "undefined")
        .map((child, i, arr) => (
          <Fragment key={i}>{child}</Fragment>
        ))}
    </View>
  );
};
