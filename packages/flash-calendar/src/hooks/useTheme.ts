import { useColorScheme } from "react-native";

import { BaseTheme, darkTheme, lightTheme } from "@/helpers/tokens";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  return appearance === "dark" ? darkTheme : lightTheme;
};
