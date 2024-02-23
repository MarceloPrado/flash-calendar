/* eslint-disable @typescript-eslint/no-unused-vars */
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { CalendarDemo } from "./Calendar";
import { CalendarListDemo } from "./CalendarList";
import { BottomSheetCalendar } from "./BottomSheetCalendar";
import { CalendarCustomFormatting } from "./CalendarCustomFormatting";
import { ImperativeScrolling } from "./ImperativeScroll";

export default function App() {
  const [demo, setDemo] = useState<"calendar" | "calendarList">("calendar");

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <SafeAreaView style={styles.pageContainer}>
        <StatusBar style="auto" />
        {/* <View style={styles.paddedContainer}>
          <Calendar.HStack alignItems="center" justifyContent="space-between">
            <Text>
              Demo: {demo === "calendar" ? "Calendar" : "Calendar List"}
            </Text>
            <Button
              onPress={() =>
                setDemo(demo === "calendar" ? "calendarList" : "calendar")
              }
              title="Toggle"
            />
          </Calendar.HStack>

          {demo === "calendar" ? <CalendarDemo /> : <CalendarListDemo />}
        </View> */}
        {/* <ImperativeScrolling /> */}
        {/* <ImperativeScrolling /> */}
        <BottomSheetCalendar />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  paddedContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flexOne: {
    flex: 1,
  },
});
