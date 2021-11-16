import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import { format } from "date-fns";

export type TimeOptions = {
  date: Date;
  format?: string;
  formattedDate?: string;
};

export interface TimeProps extends BoxProps, TimeOptions {}

export const Time = forwardRef<TimeProps, "time">(
  ({ date, format: formatString, formattedDate, ...boxProps }, ref) => {
    return (
      <Box as="time" dateTime={date.toISOString()} ref={ref} {...boxProps}>
        {formattedDate ?? format(date, formatString ?? "")}
      </Box>
    );
  }
);

Time.displayName = "Time";
