import * as path from "path";
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

const main = {
  stories: [flashCalendarStories, exampleStories],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};

export default main;
