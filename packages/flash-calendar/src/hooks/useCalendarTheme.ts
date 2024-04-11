import { createContext, useContext } from "react";
import type { ColorSchemeName } from "react-native";

export interface CalendarThemeContext {
  /** The overridden color scheme */
  colorScheme?: ColorSchemeName;
}

export const calendarThemeContext = createContext<
  CalendarThemeContext | undefined
>(undefined);

export const useCalendarThemeContext = () => {
  const context = useContext(calendarThemeContext);

  if (!context) {
    throw new Error(
      "useCalendarThemeContext must be called inside <calendarThemeContext.Provider>"
    );
  }
  return context;
};
