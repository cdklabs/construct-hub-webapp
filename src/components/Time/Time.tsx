import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import { format } from "date-fns";

export interface TimeOptions {
  date: Date;
  format: string;
}

export interface TimeProps extends BoxProps, TimeOptions {}

export const Time = forwardRef<TimeProps, "time">(
  ({ date, format: formatString, ...boxProps }, ref) => {
    return (
      <Box as="time" dateTime={date.toISOString()} ref={ref} {...boxProps}>
        {format(date, formatString)}
      </Box>
    );
  }
);

Time.displayName = "Time";
