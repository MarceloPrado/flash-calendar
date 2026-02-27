import { StorybookConfig } from "@storybook/react-native";
import { resolve } from "path";
// ESM workaround for __dirname
import { fileURLToPath } from "url";
import { dirname } from "path";

// @ts-ignore we need esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const flashCalendarStories = resolve(
  __dirname,
  "../../../packages/flash-calendar/src/components/**/*.stories.?(ts|tsx|js|jsx)",
);

const exampleStories = resolve(
  __dirname,
  "../src/components/**/*.stories.?(ts|tsx|js|jsx)",
);

const main: StorybookConfig = {
  stories: [flashCalendarStories, exampleStories],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};

export default main;
