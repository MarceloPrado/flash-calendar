import { darken, size } from "polished";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { windowsXpTokens } from "./utils";

const styles = StyleSheet.create({
  chevronContainer: {
    backgroundColor: windowsXpTokens.colors.button.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
    borderColor: windowsXpTokens.colors.accent,
    borderWidth: 1,
    borderStyle: "solid",
  },
  chevronText: {
    color: windowsXpTokens.colors.button.content,
    textAlignVertical: "center",
    textAlign: "center",
  },

  buttonContainer: {
    borderColor: windowsXpTokens.colors.accent,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 2,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    // FIXME: can't make this fit the content automatically
    width: 110,
    flexDirection: "row",
  },
  buttonContent: {
    color: windowsXpTokens.colors.content.inverse.primary,
    backgroundColor: windowsXpTokens.colors.accent,
    fontStyle: "italic",
  },

  chevronButtonContainer: {
    borderColor: windowsXpTokens.colors.accent,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
});

const BASE_CHEVRON = "▼";

const WindowsXPChevron = memo(
  ({ type }: { type: "left" | "bottom" | "top" | "right" }) => {
    return (
      <Text
        style={[
          styles.chevronText,
          {
            transform: [
              type === "left" ? { rotate: "90deg" } : { rotate: "0deg" },
              type === "top" ? { rotate: "180deg" } : { rotate: "0deg" },
              type === "right" ? { rotate: "-90deg" } : { rotate: "0deg" },
            ],
          },
        ]}
      >
        {BASE_CHEVRON}
      </Text>
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
        <View style={{ ...styles.chevronContainer, ...size(18) }}>
          <WindowsXPChevron type="bottom" />
        </View>
      </Pressable>
    );
  }
);

export const WindowsXpChevronButton = memo(
  ({
    type,
    onPress,
    size: sizeProp,
  }: {
    type: "left" | "bottom" | "top" | "right";
    size: number;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          ...styles.chevronButtonContainer,
          ...size(sizeProp),
          backgroundColor: pressed
            ? darken(0.1, windowsXpTokens.colors.button.primaryBackground)
            : windowsXpTokens.colors.button.primaryBackground,
        })}
      >
        <View style={{ ...styles.chevronContainer, ...size(sizeProp - 8) }}>
          <WindowsXPChevron type={type} />
        </View>
      </Pressable>
    );
  }
);
