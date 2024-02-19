import { Calendar } from "@marceloterreiro/flash-calendar";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { CalendarDemo } from "./Calendar";
import { CalendarListDemo } from "./CalendarList";

export default function App() {
  const [demo, setDemo] = useState<"calendar" | "calendarList">("calendar");

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.paddedContainer}>
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

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
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
});
