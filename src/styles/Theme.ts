/**
 * NativeBase Default Theme
 * https://docs.nativebase.io/default-theme
 */

import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    primary: {
      10: "#fcf5ea",
      50: "#ECDEC4",
      200: "#F0C99D",
      300: "#F4B476",
      400: "#F79F4E",
      500: "#FC8721",
      600: "#FF7500",
    },
    //   light: {
    //     text: "#000",
    //     background: "#FFF",
    //     secondaryText: "gray.600",
    //     secondaryBackground: "#FFF",
    //     tertiaryBackground: "#FFF",
    //     tint: "primary.600",
    //   },
    //   dark: {
    //     text: "#FFF",
    //     background: "coolGray.900", // #111827
    //     secondaryText: "coolGray.200",
    //     secondaryBackground: "coolGray.800", // #1f2937
    //     tertiaryBackground: "coolGray.700", // #374151
    //     tint: "primary.600",
    //   },
  },
  shadows: {
    0: {
      shadowColor: "#F4B476",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 4,
    },
    1: {
      shadowColor: "#505C62",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.13,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  components: {
    Text: {
      baseStyle: {
        lineHeight: 6,
      },
    },
    Heading: {
      baseStyle: {
        lineHeight: 7,
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 24,
      },
      variants: {
        primary: {
          backgroundColor: "primary.600",
          _pressed: {
            backgroundColor: "primary.400",
          },
          _text: {
            color: "white",
          },
        },
        secondary: {
          backgroundColor: "white",
          _pressed: {
            backgroundColor: "primary.50",
          },
          _text: {
            color: "black",
          },
        },
        secondary2: {
          backgroundColor: "white",
          _pressed: {
            backgroundColor: "primary.50",
          },
          _text: {
            color: "black",
          },
          border: {
            color: "black",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        borderColor: "gray.300",
      },
    },
    FormControlLabel: {
      baseStyle: {
        _text: {
          fontSize: "sm",
        },
      },
    },
    Toast: {
      defaultProps: {
        isClosable: false, // NOT WORKING
        duration: 2000,
      },
    },
    FlatList: {
      baseStyle: {
        _light: { bg: "white" },
        _dark: { bg: "coolGray.900" },
      },
    },
    ScrollView: {
      baseStyle: {
        _light: { bg: "white" },
        _dark: { bg: "coolGray.900" },
      },
    },
  },
});

export default theme;
