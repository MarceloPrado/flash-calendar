import type { CalendarItemDayWithContainerProps } from "@/components/CalendarItemDay";
import { Calendar, useOptimizedDayMetadata } from "@lazerlen/legend-calendar";
import { Text } from "react-native";

import { useRenderCount } from "./useRenderCount";

export const PerfTestCalendarItemDayWithContainer = ({
  children,
  metadata: baseMetadata,
  onPress,
  theme,
  dayHeight,
  daySpacing,
  containerTheme,
}: CalendarItemDayWithContainerProps) => {
  const metadata = useOptimizedDayMetadata(baseMetadata);
  const renderCounter = useRenderCount();

  return (
    <Calendar.Item.Day.Container
      dayHeight={dayHeight}
      daySpacing={daySpacing}
      isStartOfWeek={metadata.isStartOfWeek}
      shouldShowActiveDayFiller={
        metadata.isRangeValid && !metadata.isEndOfWeek
          ? !metadata.isEndOfRange
          : false
      }
      theme={containerTheme}
    >
      <Calendar.Item.Day
        height={dayHeight}
        metadata={metadata}
        onPress={onPress}
        theme={theme}
      >
        {children}
        <Text
          style={{
            fontSize: 7,
            fontStyle: "italic",
            textAlign: "center",
            color: metadata.state === "active" ? "white" : "gray",
            marginTop: -2,
          }}
        >
          {renderCounter}x
        </Text>
      </Calendar.Item.Day>
    </Calendar.Item.Day.Container>
  );
};
