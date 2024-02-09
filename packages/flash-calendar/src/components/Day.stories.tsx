import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

import { Day } from "./Day";

const DayMeta: Meta<typeof Day> = {
  title: "Day",
  component: Day,
  argTypes: {
    name: { type: "string" },
  },
  args: {
    name: "Example",
  },
  decorators: [
    (Story) => (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default DayMeta;

export const Basic: StoryObj<typeof Day> = {};

export const AnotherExample: StoryObj<typeof Day> = {
  args: {
    name: "Another example",
  },
};
