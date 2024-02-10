import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

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
});

export const centeredDecorator = (storyFn: () => ReactNode) => (
  <View style={styles.centered}>{storyFn()}</View>
);

export const paddingDecorator = (storyFn: () => ReactNode) => (
  <View style={styles.paddedContainer}>{storyFn()}</View>
);
