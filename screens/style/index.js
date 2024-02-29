import { StyleSheet } from "react-native";
import TextViewStyle from "./textViewStyle";
import TextBoxStyle from "./textBoxStyle";
import ButtonViewStyle from "./buttonStyle";
import { HeaderHeight } from "./../../constants/utils";
const MiscStyle = StyleSheet.create({
  profile: {
   // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileCard: {
    // position: "relative",
    backgroundColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  Icon: {
    color: "#59D3C8",
    padding: 15,
  },
  IconMore: {
    width: 25,
    height: 25,
    borderWidth: 1,
    backgroundColor: "green",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  IconImages: {
    width: 60,
    height: 80,
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  IconImagesUtility: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0165A3",
  },
  UserBlock: {
    backgroundColor: "#1194F4",
    height: 70,
    paddingBottom: 10,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  TopBackground: {
    position: "absolute",
  },
});
export { TextViewStyle, TextBoxStyle, ButtonViewStyle, MiscStyle };
