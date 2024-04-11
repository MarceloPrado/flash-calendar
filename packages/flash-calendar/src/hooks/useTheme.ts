import { useColorScheme } from "react-native";

import type { BaseTheme } from "@/helpers/tokens";
import { darkTheme, lightTheme } from "@/helpers/tokens";

import { useCalendarThemeContext } from "./useCalendarTheme";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  const { colorScheme } = useCalendarThemeContext();

  const effectiveTheme = colorScheme ?? appearance;

  return effectiveTheme === "dark" ? darkTheme : lightTheme;
};
