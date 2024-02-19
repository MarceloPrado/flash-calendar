import {
  Calendar,
  useOptimizedDayMetadata,
} from "@marceloterreiro/flash-calendar";
import { Text } from "react-native";

import type { CalendarItemDayWithContainerProps } from "@/components/CalendarItemDay";

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
            fontSize: 8,
            fontStyle: "italic",
            textAlign: "center",
            color: metadata.state === "active" ? "white" : "black",
          }}
        >
          {"\n"}render: {renderCounter}x
        </Text>
      </Calendar.Item.Day>
    </Calendar.Item.Day.Container>
  );
};
