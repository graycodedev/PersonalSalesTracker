import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity
  
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IntraBankIcon } from "../../components/IconsAll";
import { KhaltiLogo, EsewaLogo } from "../../constants/Images";

export default class WalletList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Choose Wallet",
    });
  }
  render() {
    const { style } = this.props;
    return (
      <ScrollView>
        <View style={{ backgroundColor: "#eee" }}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Load Esewa");
              }}
            >
              <View style={styles.utilityRect}>
                <View style={styles.icon}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("../../assets/imgs/esewa.png")}
                  />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Load Esewa</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    Transfer amount from your account to Esewa
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Load Khalti");
              }}
            >
              <View style={styles.utilityRect}>
                <View style={styles.icon}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("../../assets/imgs/khalti.png")}
                  />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Load Khalti</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    Transfer amount from your account to khalti
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 10,
  },
  utilityRect: {
    padding: 5,
    width: 300,
    minHeight: 70,
    flexDirection: "row",
  },
  accountNumber: {
    fontFamily: "Regular",
    color: "rgba(94,108,128,1)",
    fontSize: 16,
    marginTop: 10,
    marginLeft: 20,
    //flex:1
  },
  accountType: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    marginTop: 0,
    marginLeft: 18,
    textAlign: "left",
  },
  icon: {
    height: 30,
    width: 30,
    margin: 5,
  },
});
