import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "react-native";

import {
  CalendarItemDay,
  CalendarItemDayProps,
  DayState,
} from "./CalendarItemDay";

import { VStack } from "@/components/VStack";
import { paddingDecorator } from "@/developer/decorators";

const Demo = (props: CalendarItemDayProps) => {
  return (
    <VStack alignItems="center" spacing={12}>
      <CalendarItemDay {...props} />
      <Text>State: {props.state}</Text>
    </VStack>
  );
};

const CalendarItemDayMeta: Meta<typeof CalendarItemDay> = {
  title: "CalendarItemDay",
  component: Demo,
  argTypes: {
    hideActiveDayFiller: { type: "boolean" },
    onPress: { action: "onPress" },
    state: {
      options: ["active", "disabled", "idle", "today"] satisfies DayState[],
      control: {
        type: "select",
      },
    },
  },
  args: {
    hideActiveDayFiller: false,
    state: "idle",
    children: "03",
    id: "2024-02-03",
  },
  decorators: [paddingDecorator],
};

export default CalendarItemDayMeta;

export const Idle: StoryObj<typeof CalendarItemDay> = {};
export const Active: StoryObj<typeof CalendarItemDay> = {
  args: { state: "active" },
};
