import { darken } from "polished";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { windowsXpTokens } from "src/components/ThemeableCalendar/WindowsXpCalendar/utils";

const sharedStyles = {
  fitContent: {
    flexBasis: "auto" as const,
    flexGrow: 0,
    flexShrink: 0,
  },
};

const styles = StyleSheet.create({
  chevronContainer: {
    backgroundColor: windowsXpTokens.colors.button.secondaryBackground,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderColor: windowsXpTokens.colors.accent,
    borderWidth: 1,
    borderStyle: "solid",
  },
  chevronText: {
    color: windowsXpTokens.colors.button.content,
  },

  buttonContainer: {
    borderColor: windowsXpTokens.colors.accent,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 4,
    gap: 4,
    // FIXME: can't make this fit the content automatically
    width: 110,
    flexDirection: "row",
  },
  buttonContent: {
    color: windowsXpTokens.colors.content.inverse.primary,
    backgroundColor: windowsXpTokens.colors.accent,
  },
});

type ChevronType = "left" | "bottom" | "top" | "right";
const typeToChevron: Record<ChevronType, string> = {
  left: "◄",
  bottom: "▼",
  top: "▲",
  right: "►",
};

export const WindowsXPChevron = memo(
  ({ type }: { type: "left" | "bottom" | "top" | "right" }) => {
    return (
      <View style={styles.chevronContainer}>
        <Text style={styles.chevronText}>{typeToChevron[type]}</Text>
      </View>
    );
  }
);

export const WindowsXpButton = memo(
  ({ children, onPress }: { children: string; onPress: () => void }) => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          ...styles.buttonContainer,
          backgroundColor: pressed
            ? darken(0.05, windowsXpTokens.colors.button.primaryBackground)
            : windowsXpTokens.colors.button.primaryBackground,
        })}
      >
        <Text style={styles.buttonContent}>{children}</Text>
        <WindowsXPChevron type="bottom" />
      </Pressable>
    );
  }
);
