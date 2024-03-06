import { Colors } from "./Theme";
import { StyleSheet } from "react-native";

const fontfamily = {
  Regular: "Regular",
  Medium: "Medium",
  Light: "Light",
  Bold: "Bold",
  ExtraBold: "ExtraBold",
};
const TextBoxStyle = StyleSheet.create({
  BorderLess: {
    borderRadius: 10,
    height: 50,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    color: "#AEB9CA",
    fontSize: 14,
    fontFamily: fontfamily.Medium,
  },
  WithBorder: {
    borderRadius: 10,
    height: 50,
    borderWidth: 2,
    borderColor: "#ECEBEB",
    backgroundColor: Colors.secondary,
    color: Colors.SubtitleColor,
    fontSize: 14,
    fontFamily: fontfamily.Medium,
  },
});
export default TextBoxStyle;
