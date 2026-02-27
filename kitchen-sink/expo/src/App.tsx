/* eslint-disable @typescript-eslint/no-unused-vars */
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { CalendarDemo } from "./Calendar";
import { CalendarListDemo } from "./CalendarList";
import { BottomSheetCalendar } from "./BottomSheetCalendar";
import { CalendarCustomFormatting } from "./CalendarCustomFormatting";
import { ImperativeScrolling } from "./ImperativeScroll";
// import { SlowExampleAddressed } from "./SlowExampleAddressed";

export default function App() {
  const [demo, setDemo] = useState<"calendar" | "calendarList">("calendar");

  return (
    <SafeAreaProvider>
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
          <ImperativeScrolling />
          {/* <BottomSheetCalendar /> */}
          {/* <SlowExampleAddressed /> */}
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
