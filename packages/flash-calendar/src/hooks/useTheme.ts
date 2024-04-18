import { useColorScheme } from "react-native";

import type { BaseTheme } from "@/helpers/tokens";
import { darkTheme, lightTheme } from "@/helpers/tokens";
import { useCalendarTheme } from "@/components/CalendarThemeProvider";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  const { colorScheme } = useCalendarTheme();

  const theme = colorScheme ?? appearance;

  return theme === "dark" ? darkTheme : lightTheme;
};
