import AppConfig from "../../config/AppConfig";
export const Colors = {
  AccentColor: "#F7DB4F",
  BackgroundColor: "#EFF0F4",
  HeadingColor: "#3A3A3A",
  SubtitleColor: "#9A9A9A",
  ModalBackgroud: "#191919",
  primary: AppConfig.ThemeConfig.primaryColor,
  secondary: AppConfig.ThemeConfig.secondoryColor,
  backGround: "#F5F5F5",
  text: "#232323",
  defaultBlack: "#232323BF", //first two 75% opacity value
  muted: "#ADB5BD",
  switchOn: "#5E72E4",
  switchOff: "#D4D9DD",
  pending: "#FF0",
};

export const TEXT = {
  primary: {
    regular: {
      small: {},
      medium: {},
      large: {},
    },
  },
  normal: {
    regular: {
      small: {
        fontFamily: "Regular",
        fontSize: 12,
      },
      medium: {
        fontFamily: "SemiBold",
        fontSize: 14,
      },
      large: {
        fontFamily: "Bold",
        fontSize: 16,
      },
    },
  },
  light: {
    regular: {
      small: {
        fontFamily: "Regular",
        fontSize: 12,
        color: "gray",
      },
      medium: {},
      large: {},
    },
  },
};
