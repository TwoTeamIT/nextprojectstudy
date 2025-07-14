import { ColorSchemeOverrides, createTheme } from "@mui/material/styles";
import { colorSchemes } from "./colorSchemes.json";

export const theme = createTheme({
  colorSchemes: colorSchemes as ColorSchemeOverrides,
  typography: {
    fontFamily: "var(--font-bold)",
    h1: {
      fontFamily: "var(--font-extra-bold)",
    },
    h2: {
      fontFamily: "var(--font-extra-bold)",
    },
    h3: {
      fontFamily: "var(--font-extra-bold)",
    },
    h4: {
      fontFamily: "var(--font-bold-it)",
      textTransform: "uppercase"
    },
    h5: {
      fontFamily: "var(--font-bold-it)",
      textTransform: "uppercase"
    },
    h6: {
      fontFamily: "var(--font-bold-it)",
      textTransform: "uppercase"
    },
    button: {
      fontFamily: "var(--font-button)",
      textTransform: "uppercase",
      letterSpacing: "1.1px",
      lineHeight: 1.07
    },
    body1: {
      letterSpacing: "0.3px",
    },
    body2: {
      fontFamily: "var(--font-regular)",
      fontSize: 9,
      letterSpacing: "1px",
    }
  },
  shape: {
    borderRadius: 4, // medium
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-bold-it)",
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: "text" },
              style: {
                ":hover": {
                  backgroundColor: "#EEEEEE",
                }
              }
            },
            {
              props: { variant: "outlined" },
              style: {
                padding: "0.6rem 1rem",
                ":hover": {
                  backgroundColor: "#EEEEEE",
                }
              }
            }
          ],
          borderRadius: 2,
          padding: "0.8rem 1.2rem",
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderWidth: "1px", // dividerWeight
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: "0 0 2px rgba(0,0,0,0.30), 0 2px 4px rgba(0,0,0,0.25)"
        }
      }
    }
  },
});
