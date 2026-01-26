/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Calendar } from "@marceloterreiro/flash-calendar";
import { CalendarDemo } from "./Calendar";
import { CalendarListDemo } from "./CalendarList";
// import { SlowExampleAddressed } from "./SlowExampleAddressed";

export default function App() {
  const [demo, setDemo] = useState<"calendar" | "calendarList">("calendar");

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <SafeAreaView style={styles.pageContainer}>
        <StatusBar style="auto" />
        <View style={styles.paddedContainer}>
          <Calendar.HStack alignItems="center" justifyContent="space-between">
            <Text>
              Demo: {demo === "calendar" ? "Calendar" : "Calendar List"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setDemo(demo === "calendar" ? "calendarList" : "calendar")
              }
            >
              <Text>Toggle</Text>
            </TouchableOpacity>
          </Calendar.HStack>

          {demo === "calendar" ? <CalendarDemo /> : <CalendarListDemo />}
        </View>
        {/* <ImperativeScrolling /> */}
        {/* <BottomSheetCalendar /> */}
        {/* <SlowExampleAddressed /> */}
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
