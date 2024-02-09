import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

import { Month } from "./Month";

const MonthMeta: Meta<typeof Month> = {
  title: "Month",
  component: Month,
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

export default MonthMeta;

export const Basic: StoryObj<typeof Month> = {};

export const AnotherExample: StoryObj<typeof Month> = {
  args: {
    name: "Another example",
  },
};
