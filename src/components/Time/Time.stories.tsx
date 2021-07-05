import { Story } from "@storybook/react";
import { Time, TimeProps } from "./Time";

export default {
  title: "Components / Time",
  component: Time,
};

export const Primary: Story<TimeProps> = ({ date, format, ...props }) => (
  <Time
    date={date instanceof Date ? date : new Date()}
    format={typeof format === "string" ? format : "MMMM dd, yyyy"}
    {...props}
  />
);

Primary.args = {
  date: new Date(),
  format: "MMMM dd, yyyy",
};
