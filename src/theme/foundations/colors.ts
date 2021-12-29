import { theme } from "@chakra-ui/react";

const blue = {
  50: "#dcf3ff",
  100: "#aed9ff",
  200: "#7dbeff",
  300: "#4aa4ff",
  400: "#1a8aff",
  500: "#0070e6",
  600: "#0057b4",
  700: "#003e82",
  800: "#002551",
  900: "#000d21",
};

// TODO: See if brand palette can be configured?
const brand = blue;

export const colors = {
  ...theme.colors,
  blue,
  brand,
  // Declares light-theme colors, overwritten via global styles in global.ts
  // Backgrounds
  bgPrimary: "#F8F8F8",
  bgSecondary: theme.colors.white,
  // Hovers
  hoverPrimary: theme.colors.gray[100],
  // Text colors
  link: blue[500],
  textPrimary: theme.colors.gray[800],
  textSecondary: theme.colors.gray[700],
  textTertiary: theme.colors.gray[600],
  // Accents
  borderColor: "transparent",
  shadowColor: theme.colors.blackAlpha[300],
};
