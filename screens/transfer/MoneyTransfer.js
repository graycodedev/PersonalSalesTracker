import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import * as BankingIcons from "../../components/BankingIcons";
import { Colors } from "../style/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class MoneyTransferList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Choose Service",
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
                this.props.navigation.navigate("AccountTransfer");
              }}
            >
              <View style={styles.utilityRect}>
                <View style={styles.icon}>
                  <BankingIcons.TransferIcon
                    width={50}
                    height={50}
                    fill={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Account Transfer</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    Transfer amount from one account to another with in the
                    co-operative
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("BankTransfer");
              }}
            >
              <View style={styles.utilityRect}>
                <View style={styles.icon}>
                  <BankingIcons.BankIcon
                    width={50}
                    height={50}
                    fill={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Bank Transfer</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    Transfer balance directly to bank
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("CommingSoon");
              }}
            >
              <View style={styles.utilityRect}>
                <View style={styles.icon}>
                  <BankingIcons.InterCopTransIcon
                    width={50}
                    height={50}
                    fill={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.accountNumber}>
                    Co-operative Transfer
                  </Text>
                  <Text style={styles.accountType}>
                    {" "}
                    Transfer amount with in co-operatives
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View> */}
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
    marginLeft: 15,
    //flex:1
  },
  accountType: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    marginTop: 0,
    marginLeft: 15,
    textAlign: "left",
  },
  icon: {
    margin: 10,
  },
});
