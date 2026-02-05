// src/theme.js or src/theme.ts

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
        secondBackground: "#6880D0", // Light Muted Blue
        button: "#F070B8", // Light Pink
        idek: "#F0F0E8", // Very Light Yellowish Gray
        accent: "#80E0B8", // Light Teal
        background: "#C0A8F8", // Very Light Indigo
    },
    fonts: {
        heading: "Montserrat, sans-serif",
        body: "Montserrat, sans-serif",
    },
    // make the default theme dark mode
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
});

export default theme;
