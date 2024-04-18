import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type { ColorSchemeName } from "react-native";

export interface CalendarThemeContextType {
  colorScheme?: ColorSchemeName;
}

const CalendarThemeContext = createContext<CalendarThemeContextType>({
  colorScheme: undefined,
});

export const CalendarThemeProvider = ({
  children,
  colorScheme,
}: {
  children: ReactNode;
  /**
   * When set, Flash Calendar will use this color scheme instead of the system's
   * value (`light|dark`). This is useful if your app doesn't support dark-mode,
   * for example.
   *
   * We don't advise using this prop - ideally, your app should reflect the
   * user's preferences.
   */
  colorScheme?: ColorSchemeName;
}) => {
  const calendarThemeContextValue = useMemo<CalendarThemeContextType>(
    () => ({ colorScheme }),
    [colorScheme]
  );

  return (
    <CalendarThemeContext.Provider value={calendarThemeContextValue}>
      {children}
    </CalendarThemeContext.Provider>
  );
};

export const useCalendarTheme = () => {
  const context = useContext(CalendarThemeContext);
  return context;
};
