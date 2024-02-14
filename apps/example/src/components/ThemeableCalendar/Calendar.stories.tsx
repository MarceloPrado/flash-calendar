import { Calendar } from "@marceloterreiro/flash-calendar";
import type { Meta } from "@storybook/react";

import { LinearCalendar } from "./LinearCalendar";

const CalendarMeta: Meta<typeof Calendar> = {
  title: "Calendar/Themes",
  decorators: [],
};

export default CalendarMeta;

export const Linear = () => <LinearCalendar />;
