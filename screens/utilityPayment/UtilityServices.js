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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ElectricityIcon,
  InternetIcon,
  TopBackgroundIcon,
  TvIcon,
  WaterIcon,
} from "../../components/IconsAll";
import { Poppins_100Thin } from "@expo-google-fonts/poppins";
export class UtilityList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Choose Service",
    });
  }
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <ScrollView>
        <View style={{ backgroundColor: "#eee" }}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("electricity");
              }}
            >
              <View style={styles.utilityRect}>
                <View style={{ margin: 10 }}>
                  <ElectricityIcon />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Electricity bills</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    Pay your electricity bill online
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(`dynamicmerchant`, {
                  Name: `khanepani`,
                  ServiceCategoryId: 7,
                });
              }}
            >
              <View style={styles.utilityRect}>
                <View style={{ margin: 10 }}>
                  <WaterIcon />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Water Payment</Text>
                  <Text style={styles.accountType}> Pay your water bills</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(`dynamicmerchant`, {
                  Name: `TV`,
                  ServiceCategoryId: 9,
                });
              }}
            >
              <View style={styles.utilityRect}>
                <View style={{ margin: 10 }}>
                  <TvIcon />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Television Payment</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    pay you television bills
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(`dynamicmerchant`, {
                  Name: `Internet`,
                  ServiceCategoryId: 8,
                });
              }}
            >
              <View style={styles.utilityRect}>
                <View style={{ margin: 10 }}>
                  <InternetIcon />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Internet</Text>
                  <Text style={styles.accountType}>
                    {" "}
                    pay your internet bills
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(`dynamicmerchant`, {
                  Name: `Insurance`,
                  ServiceCategoryId: 10,
                });
              }}
            >
              <View style={styles.utilityRect}>
                <View style={{ margin: 10 }}>
                  <WaterIcon />
                </View>
                <View>
                  <Text style={styles.accountNumber}>Insurance Premium</Text>
                  <Text style={styles.accountType}> pay your premium</Text>
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
    height: 70,
    flexDirection: "row",
  },
  accountNumber: {
    fontFamily: "Regular",
    color: "rgba(94,108,128,1)",
    fontSize: 16,
    marginTop: 5,
    marginLeft: 15,
    //flex:1
  },
  accountType: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 13,
    marginTop: 0,
    marginLeft: 15,
  },
  balance: {
    fontFamily: "Regular",
    color: "rgba(42,186,0,1)",
    fontSize: 15,
    marginTop: 5,
    marginLeft: 15,
    alignContent: "flex-end",
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 23,
    height: 23,
    width: 23,
    marginTop: 5,
    marginLeft: 318,
  },
});
