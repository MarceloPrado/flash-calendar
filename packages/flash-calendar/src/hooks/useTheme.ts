import { useColorScheme } from "react-native";

import type { BaseTheme } from "@/helpers/tokens";
import { darkTheme, lightTheme } from "@/helpers/tokens";
import { useCalendarContext } from "@/components/Calendar";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  const darkMode = useCalendarContext();

  if (darkMode) {
    return darkTheme;
  }

  if (darkMode === false) {
    return lightTheme;
  }

  return appearance === "dark" ? darkTheme : lightTheme;
};
