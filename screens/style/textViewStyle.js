import { Colors } from "./Theme";
import { StyleSheet } from "react-native";

const fontfamily = {
  // Regular: 'Poppins-Regular',
  // Medium: 'Poppins-Medium',
  // Light: 'Poppins-Light',
  // Bold: 'Poppins-Bold',
  // ExtraBold: 'Poppins-Black',
  Regular: "Regular",
  Medium: "Medium",
  Light: "Light",
  Bold: "Bold",
  ExtraBold: "ExtraBold",
};
const TextViewStyle = StyleSheet.create({
  PageHeader: {
    fontFamily: fontfamily.Bold,
    color: Colors.secondary,
    fontSize: 28,
    textTransform: "uppercase",
  },
  Title: {
    fontFamily: fontfamily.Bold,
    color: Colors.HeadingColor,
    fontSize: 24,
  },
  SubTitle: {
    fontFamily: fontfamily.Medium,
    color: Colors.SubtitleColor,
    fontSize: 16,
  },
  NormalText: {
    fontFamily: fontfamily.Regular,
    fontSize: 14,
  },
  SmallText: {
    fontFamily: fontfamily.Light,
    fontSize: 10,
  },
});
export default TextViewStyle;
