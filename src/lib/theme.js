import { extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/josefin-sans";
import "@fontsource-variable/open-sans";
import "@fontsource/poppins/600.css";

const theme = extendTheme({
  fonts: {
    poppins: "Poppins, sans-serif",
    josefin: "Josefin Sans, sans-serif",
    open: "Open Sans, sans-serif",
  },
});

export default theme;
