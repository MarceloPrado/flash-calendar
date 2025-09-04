import BottomSheet from "@gorhom/bottom-sheet";
import { Calendar } from "@marceloterreiro/flash-calendar";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { BottomSheetFlashList } from "./components/BottomSheetFlashList";

const SafeFlashList = Platform.select({
  // @ts-expect-error TODO: fix this TS error. It's not critical, just a nit to fix.
  android: BottomSheetFlashList,
  ios: FlashList,
});

export const BottomSheetCalendar = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheet
        index={1}
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
      >
        <View style={styles.contentContainer}>
          <Calendar.List
            CalendarScrollComponent={SafeFlashList}
            calendarInitialMonthId="2024-02-01"
            onCalendarDayPress={(dateId: string) =>
              console.log(`Pressed ${dateId}`)
            }
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
  },
});
