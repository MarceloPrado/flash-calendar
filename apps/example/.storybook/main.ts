import { StorybookConfig } from "@storybook/react-native";
import * as path from "path";

const flashCalendarStories = path.resolve(
  __dirname,
  "../../../packages/flash-calendar/src/components/**/*.stories.?(ts|tsx|js|jsx)"
);

const exampleStories = path.resolve(
  __dirname,
  "../src/components/**/*.stories.?(ts|tsx|js|jsx)"
);

const main: StorybookConfig = {
  stories: [flashCalendarStories, exampleStories],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};

export default main;
