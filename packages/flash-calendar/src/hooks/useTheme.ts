import { useColorScheme } from "react-native";

import type { BaseTheme } from "@/helpers/tokens";
import { darkTheme, lightTheme } from "@/helpers/tokens";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  return appearance === "dark" ? darkTheme : lightTheme;
};
