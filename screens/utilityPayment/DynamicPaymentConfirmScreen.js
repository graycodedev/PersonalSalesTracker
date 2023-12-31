import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Text } from "galio-framework";
import { ButtonPrimary } from "../../components/Button";
import { ScrollView } from "react-native";
import { TopBackgroundIcon } from "../../components/IconsAll";

export class DynamicPaymentConfirmScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      merchants: [],
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Thank you for the payment...`,
    });
  }

  render() {
    const {
      TransactionCode,
      accountNo,
      billingAmount,
      Message,
    } = this.props.route.params;
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#ecf0f1" }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ width: "100%", backgroundColor: "#eee" }}
          >
            <View>
              <TopBackgroundIcon
                style={{
                  position: "absolute",
                  color: Colors.primary,
                }}
                preserveAspectRatio="none"
                width="100%"
              />
            </View>

            <Text
              style={[
                {
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#fff",
                  marginLeft: 30,
                  marginTop: 60,
                },
              ]}
            >
              {"Transaction Successfull"}
            </Text>
            <View style={successStyle.card}>
              <View style={successStyle.row}>
                <Text style={successStyle.label}>From Account </Text>
                <Text style={successStyle.value}>{accountNo}</Text>
              </View>
              <View style={successStyle.row}>
                <Text style={successStyle.label}>TransactionCode</Text>
                <Text style={successStyle.value}>{TransactionCode}</Text>
              </View>

              <View style={successStyle.row}>
                <Text style={successStyle.label}>Transaction Amount </Text>
                <Text style={successStyle.value}>{billingAmount}</Text>
              </View>

              <View style={{ textAlign: "center", margin: 20 }}>
                <Text style={{ textAlign: "center" }}>{Message}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 0.6,
                margin: 20,
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                color="success"
                onPress={() => {
                  this.props.navigation.replace("Home");
                }}
              >
                <ButtonPrimary title={"OK"} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}
const successStyle = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
    paddingStart: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  label: {
    color: "#000",
  },
});
const blockStyle = StyleSheet.create({
  rect2: {
    backgroundColor: "#fff",
    width: 180,
    height: 130,
    margin: 5,
    marginRight: 5,
    alignItems: "center",
    borderRadius: 10,
  },
  icon: {
    // color: "rgba(128,128,128,1)",
    fontSize: 0,
    height: 80,
    width: 150,
    marginTop: 10,
  },
  title: {
    fontFamily: "Light",
    color: "rgba(94,108,128,1)",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
});
