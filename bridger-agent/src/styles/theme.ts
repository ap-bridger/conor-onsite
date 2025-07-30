import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      green: "#007F2F",
      lightGreen: "#28A01C",
      white: "#FFFFFF",
      blue: "#006FBA",
      darkBlue: "#004C80",
      lightBlue: "#E6F2FF",
      lightGrey: "#F3F4F6",
      grey: "#8D9096",
      darkGrey: "#606166",
      orange: "#FF8338",
      red: "#FF4D4F",
    },
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
    "3xl": "30px",
  },
  components: {
    Text: {
      sizes: {
        sm: {
          fontSize: "sm",
        },
        md: {
          fontSize: "md",
        },
        lg: {
          fontSize: "lg",
        },
        h2: {
          fontSize: "3xl",
        },
      },
    },
    Button: {
      sizes: {
        sm: {
          fontSize: "sm",
        },
        md: {
          fontSize: "md",
        },
      },
      variants: {
        solid: {
          borderRadius: "5px",
          backgroundColor: "brand.green",
          color: "brand.white",
        },
        caution: {
          borderRadius: "5px",
          backgroundColor: "brand.orange",
          color: "brand.white",
        },
        ghost: {
          borderRadius: "5px",
          borderColor: "brand.grey",
        },
      },
    },
  },
});
export default theme;
