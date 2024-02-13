import type { Preview } from "@storybook/react";
import { backgroundDecorator } from "@marceloterreiro/flash-calendar/src/developer/decorators";

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
