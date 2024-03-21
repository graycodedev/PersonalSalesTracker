import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ToastAndroid,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import qs from "qs";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import { Images } from "../../constants";
import api from "../../constants/Api";
import { TextViewStyle } from "../style/index";
import { InputText } from "../../components/Input";
import { ButtonPrimary } from "../../components/Elements";
import { Colors } from "../style/Theme";
import IMAGES from "../../constants/newImages";
import * as BankingIcons from "../../components/BankingIcons";
import { colors } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import helpers from "../../constants/Helpers";

const { width, height } = Dimensions.get("screen");
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      code: "",
      codeError: "",
      phoneNumber: "",
      phoneNumberError: "",
    };
  }
  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: "Forgot Password",
    });
  };
  validateForm() {
    let isvalid = true;
    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Username is required !" }));
    } 

    return isvalid;
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          color={Colors.primary}
          visible={this.state.isLoading}
          textContent={"Please Wait..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <View style={styles.headerBackGround} />
        <View style={styles.box}>
          <View style={styles.registerText}>
            <Text style={{ fontSize: 24 }}>Forgot Password</Text>
          </View>
          <View style={{ marginBottom: 31 }}>
            <View style={styles.ringingBackGround}></View>
            <BankingIcons.passwordIcon fill={Colors.primary} />
          </View>
          <View
            style={{
              marginLeft: 51,
              marginRight: 30,
              marginBottom: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>Input your username</Text>
          </View>
          <View style={{ marginBottom: 2 }}>
            <InputText
              style={styles.inputNumber}
              placeholder="Username"
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              value={this.state.phoneNumber}
            />
            <Text style={{ color: "red" }}>{this.state.phoneNumberError}</Text>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (this.validateForm()) {
                this.setState({ isLoading: true });
                this.ResetPassword();
              }
            }}
          >
            <Text style={styles.submit}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  ResetPassword = async () => {
    var url =
      api.ForgotPassword +
      "?userName=" +
      this.state.phoneNumber;
    var response = await (await request()).post(url).catch(function(error) {
      ToastMessage.Short("Error Ocurred Contact Support");
    });
    if (response != "undefined") {
      if (response.data.Code == 200) {
        this.setState({ isLoading: false });
        this.props.navigation.navigate("ForgotPasswordReset", {
          phoneNumber: this.state.phoneNumber,
        });
      } else {
        ToastMessage.Short(response.data.Message);
      }
    }
    this.setState({ isLoading: false });
  };
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  headerBackGround: {
    width: "100%",
    height: "45%",
    backgroundColor: Colors.primary,
  },
  box: {
    // width: "90%",
    // height: 420,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
    position: "absolute",
    marginTop: 60,
    alignItems: "center",
    shadowColor: "red",
    shadowRadius: 5,
  },
  registerText: {
    marginTop: 36,
    marginBottom: 24,
  },
  ringingBackGround: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F5F5F5",
    position: "absolute",
    marginTop: 23,
  },
  flagContainer: {
    width: 65,
    height: 33,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  // inputContainer: {width: 210,
  //     height: 33,
  //     borderColor: "#EEEEEE",
  //     borderWidth: 2,
  //     borderTopRightRadius: 4,
  //     borderBottomRightRadius: 4,
  //     borderLeftWidth: 0,
  //     padding: 8,
  //     letterSpacing: 1,
  //     },
  submitButton: {
    // marginTop: 20,
    width: 272,
    height: 36,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  inputNumber: {
    width: 272,
    height: 48,
    borderRadius: 4,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    paddingLeft: 18,
    // marginBottom: 8,
    flexDirection: "row",
    paddingRight: 16,
    justifyContent: "space-between",
  },
  submit: {
    alignSelf: "center",
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ForgotPassword;
