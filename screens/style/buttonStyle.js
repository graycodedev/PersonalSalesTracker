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
const ButtonViewStyle = StyleSheet.create({
  ButtonContainer: {
    elevation: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 70,
    width: 70,
    margin: 10,
  },
  PrimaryButtonText: {
    fontSize: 30,
    color: Colors.secondary,
    alignSelf: "center",
    textTransform: "uppercase",
  },
  Primary: {
    backgroundColor: Colors.primary,
    color: "#fff",
    borderRadius: 10,
    fontFamily: "Regular",
    width: "100%",
    height: 50,
    textAlign: "center",
    justifyContent:"center",
    fontSize: 16,
    textTransform: "uppercase",
    alignSelf:"center",
  },
  PinButtonContainer: {
    elevation: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 70,
    width: 102,
    margin: 10,
  },
  PinButtnoStyle: {
    fontSize: 30,
    color: "#5E6C80",
    textTransform: "uppercase",
    fontFamily: "Regular",
    textAlign: "center",
  },
});
export default ButtonViewStyle;
