import { createElement } from "react";
import type { TextProps } from "react-native";

export type CalendarTextProps = Omit<
  TextProps,
  "onPress" | "onLongPress" | "onPressIn" | "onPressOut"
>;

export const Text = (props: CalendarTextProps) =>
  createElement("RCTText", props);
