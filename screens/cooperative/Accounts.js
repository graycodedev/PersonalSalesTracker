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
import helpers from "../../constants/Helpers";
class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      accountList: [],
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Accounts",
    });

    this.getAccountList();
  }
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <ScrollView>
        <View style={{ backgroundColor: "#eee" }}>
          {this.state.accountList.map((account, index) => {
            return (
              <View style={styles.container} key={index}>
                <View style={styles.rect2}>
                  <Text style={styles.accountNumber} numberOfLines={1}>
                    {account.AccName}
                  </Text>
                  <Text style={styles.accountType}>{account.AccNum}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.balance}>Rs. {account.Balance}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("AccountStatement", {
                          accountNo: account.AccNum,
                          fromDate: "",
                          toDate: "",
                        })
                      }
                    >
                      <Text style={{ fontSize: 10, color: "orange" }}>
                        view statement
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
          <ActivityIndicator
            animating={this.state.isLoading}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </ScrollView>
    );
  }

  getAccountList = async () => {
    const accList = await helpers.ListAllAccountsWithBal();
    if (accList != null) {
      this.setState({ accountList: accList });
    }
    this.setState({ isLoading: false });
  };
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 10,
  },
  rect2: {
    width: 300,
    height: 90,
  },
  accountNumber: {
    // fontFamily: "Poppins_400Regular",
    color: "rgba(94,108,128,1)",
    fontSize: 16,
    marginTop: 11,
    marginLeft: 15,
    //flex:1
  },
  accountType: {
    // fontFamily: "Poppins_400Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 13,
    marginTop: 5,
    marginLeft: 15,
  },
  balance: {
    // fontFamily: "poppins-500",
    color: "rgba(42,186,0,1)",
    fontSize: 15,
    marginTop: 5,
    marginLeft: 15,
    alignContent: "flex-end",
  },
  icon: {
    //  color: "rgba(128,128,128,1)",
    fontSize: 23,
    height: 23,
    width: 23,
    marginTop: 5,
    marginLeft: 318,
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 25,
    top: 0,
    bottom: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
export default Accounts;
