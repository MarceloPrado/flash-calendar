import { View, StyleSheet } from "react-native";

import { WindowsXpText } from "./WindowsXpText";
import { windowsXpTokens } from "./utils";

const styles = StyleSheet.create({
  windowContent: {
    backgroundColor: windowsXpTokens.colors.background,
    borderWidth: 2,
    borderColor: windowsXpTokens.colors.accent,
    borderStyle: "solid",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
  },

  windowHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: windowsXpTokens.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  windowsXpText: {
    color: "#ffffff",
    width: "100%",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  weekDivider: {
    height: 2,
    backgroundColor: "#000000",
    position: "absolute",
    left: 4,
    right: 4,
    bottom: 0,
  },
});

export const WindowsXpWindowHeader = ({ children }: { children: string }) => {
  return (
    <View style={styles.windowHeaderContainer}>
      <WindowsXpText>{children}</WindowsXpText>
    </View>
  );
};

export const WindowsXpWindow = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <View style={{ flex: 1 }}>
      <WindowsXpWindowHeader>{title}</WindowsXpWindowHeader>
      <View style={styles.windowContent}>{children}</View>
    </View>
  );
};
