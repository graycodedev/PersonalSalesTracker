import { Colors } from "./Theme";
import { StyleSheet } from "react-native";
const fontfamily = {
  Regular: "Regular",
  Medium: "Medium",
  Light: "Light",
  Bold: "Bold",
  ExtraBold: "ExtraBold",
};
const FavouriteStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 10,
  },
  box: {
    margin: 20,
  },
  note: {
    color: "rgba(94,108,128,1)",
    fontSize: 14,
    marginBottom: 2,
  },
});
export default FavouriteStyles;
