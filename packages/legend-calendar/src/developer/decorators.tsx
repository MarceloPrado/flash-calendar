import type { PropsWithChildren, ReactNode } from "react";
import { StatusBar } from "expo-status-bar";
import { memo, useMemo } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  paddedContainer: {
    padding: 12,
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export const centeredDecorator = (storyFn: () => ReactNode) => (
  <View style={styles.centered}>{storyFn()}</View>
);

export const paddingDecorator = (storyFn: () => ReactNode) => (
  <View style={styles.paddedContainer}>{storyFn()}</View>
);

const BackgroundStory = memo(({ children }: PropsWithChildren) => {
  const { colors } = useTheme();
  const containerStyles = useMemo<ViewStyle[]>(
    () => [
      styles.container,
      {
        backgroundColor: colors.background.primary,
      },
    ],
    [colors]
  );

  return (
    <View style={containerStyles}>
      <StatusBar />
      {children}
    </View>
  );
});
BackgroundStory.displayName = "BackgroundStory";

export const backgroundDecorator = (storyFn: () => ReactNode) => (
  <BackgroundStory>{storyFn()}</BackgroundStory>
);
