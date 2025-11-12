import type { Preview } from "@storybook/react-native";
import { backgroundDecorator } from "@/developer/decorators";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const decorators = [backgroundDecorator];
