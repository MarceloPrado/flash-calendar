import * as path from "path";
import type { StorybookConfig } from "@storybook/react-native";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const flashCalendarStories = path.resolve(
  __dirname,
  "../../../packages/flash-calendar/src/components/**/*.stories.?(ts|tsx|js|jsx)",
);

const exampleStories = path.resolve(
  __dirname,
  "../src/components/**/*.stories.?(ts|tsx|js|jsx)",
);

const main: StorybookConfig = {
  stories: [flashCalendarStories, exampleStories],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
    "@storybook/addon-ondevice-backgrounds",
  ],
};

export default main;
