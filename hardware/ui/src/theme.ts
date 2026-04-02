import { createTheme } from "@mantine/core";

const primary = [
  "#e5f0ff",
  "#c7dfff",
  "#93caff",
  "#5eb3ff",
  "#3a9fff",
  "#238dfe",
  "#1182fe",
  "#006ee6",
  "#005fcc",
  "#0051b3",
] as const;

const success = [
  "#e6f9ed",
  "#c5f0d4",
  "#8ce2aa",
  "#4fd47e",
  "#25c461",
  "#0db953",
  "#06b34d",
  "#049c3e",
  "#008933",
  "#007627",
] as const;

const warning = [
  "#fff4e5",
  "#ffe4c4",
  "#ffc77a",
  "#ffa73a",
  "#ff9020",
  "#ff7c0e",
  "#ff7104",
  "#e36000",
  "#ca5400",
  "#b04700",
] as const;

const danger = [
  "#ffebe9",
  "#ffd0ca",
  "#ff9e95",
  "#ff6960",
  "#ff4837",
  "#ff3124",
  "#ff2519",
  "#e4130b",
  "#cd0900",
  "#b70000",
] as const;

export const theme = createTheme({
  fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
  primaryColor: "primary",
  colors: {
    primary,
    success,
    warning,
    danger,
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  other: {
    screen: {
      width: 800,
      height: 480,
    },
    sidebarWidth: 80,
  },
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: "all 150ms ease",
        },
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        withBorder: true,
      },
    },
  },
});
