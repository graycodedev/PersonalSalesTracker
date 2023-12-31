import React from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import api from "../constants/Api";
import qs from "qs";
import { Text } from "galio-framework";
import { RowDetailedView } from "../components/Row";
import helpers from "../constants/Helpers";
import request from "../config/RequestManager";
import ToastMessage from "../components/Toast/Toast";
import { Colors } from "../screens/style/Theme";
export class TransactionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoding: false,
      hasDate: true,
      transactionList: [],
      refreshing: false,
    };
  }
  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: "Transactions",
    });
    this.getTransactions();
  };
  getTransactions = async () => {
    let companyId = await helpers.GetCompanyId();
    let companyCode = await helpers.GetCompanyCode();
    this.setState({ isLoding: true });
    var data = qs.stringify({
      ClientId: companyId,
      CompanyId: companyId,
      CompanyCode: companyCode,
      SecretKey: api.SecretKey,
      UserId: (await helpers.GetUserInfo()).Id,
      PageNo: 1,
      PageSize: 20,
    });
    var response = await (await request())
      .post(api.RecentTransaction, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ transactionList: response.data.Data });
        if (response.data.Data.length == 0) {
          this.setState({ hasDate: false });
        }
      } else {
        ToastMessage.Short("Error Loading  Transactions");
        this.setState({ hasDate: false });
      }
    } else {
      ToastMessage.Short("Error Loading  Transactions");
      this.setState({ hasDate: false });
    }
    this.setState({ isLoding: false });
  };
  _onRefresh = () => {
    this.getTransactions();
  };
  render() {
    var date = "";
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        style={{ width: "100%", backgroundColor: "#D8DADF", padding: 10 }}
      >
        {this.state.transactionList.length > 0 &&
          this.state.transactionList &&
          this.state.transactionList.map((data, index) => {
            if (data.TranDate != date) {
              date = data.TranDate;
              return (
                <View key={index} style={{ paddingBottom: 20 }}>
                  <View>
                    <Text style={{ paddingLeft: 10, fontFamily: "Medium" }}>
                      {data.TranDate}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("TransactionDetail", {
                          id: data.Id,
                        });
                      }}
                    >
                      <RowDetailedView data={data} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            } else {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("TransactionDetail", {
                        id: data.Id,
                      });
                    }}
                  >
                    <RowDetailedView data={data} />
                  </TouchableOpacity>
                </View>
              );
            }
          })}
        {this.state.transactionList.length == 0 && (
          <View style={{ marginTop: 30, alignItems: "center" }}>
            {this.state.hasDate ? (
              <ActivityIndicator
                animating={this.state.isLoading}
                color="#ffa500"
              ></ActivityIndicator>
            ) : (
              <>
                <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>
                  No Transactions Found
                </Text>
                <Text style={{ fontFamily: "SemiBold", fontSize: 12 }}>
                  {"\n"}Pull Down to Refresh
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    );
  }
}

export class TransactionDetail extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.route.params;
    this.state = {
      isLoading: false,
      id: id,
      data: "",
    };
    this.props.navigation.setOptions({
      title: "Transaction Detail",
    });
    this.getTransactionDetail();
  }
  getTransactionDetail = async () => {
    this.setState({ isLoding: true });
    var url = api.TransactionDetail + "?id=" + this.state.id;
    var response = await (await request()).get(url).catch(function(error) {
      ToastMessage.Short("Error Contact Support");
    });
    this.setState({ isLoding: false });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ data: response.data.Data });
      } else {
        ToastMessage.Short("Could Not Load Data");
      }
    } else {
      ToastMessage.Short("Error Loading Transaction Detail");
    }
  };
  downloadFile = async () => {
    let fileUrl = await helpers.GetFileUrlById(this.state.data.UniqueId);
    await helpers.DownloadFile(fileUrl);
  };
  render() {
    var date = "";
    return (
      <ScrollView>
        {this.state.data != "" && (
          <View>
            <View style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.label}>{this.state.data.Title}</Text>
                  <Text style={{ paddingTop: 5 }}>
                    {this.state.data.TranDate}
                  </Text>
                  <View style={{ paddingTop: 5 }}>
                    {this.state.data.IsSuccessfulTransaction ? (
                      <Text style={{ color: "green" }}>Completed</Text>
                    ) : this.state.data.IsPendingTransaction ? (
                      <Text style={{ color: "blue" }}>Pending</Text>
                    ) : (
                      <Text style={{ color: "red" }}>Failed</Text>
                    )}
                  </View>
                </View>
                {Number(this.state.data.Amount) > 0 ? (
                  <Text style={styles.pricePositive}>
                    {Math.abs(this.state.data.Amount)}
                  </Text>
                ) : (
                  <Text style={styles.price}>
                    {Math.abs(this.state.data.Amount)}
                  </Text>
                )}
              </View>
              <View></View>
            </View>
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Account No </Text>
                <Text style={styles.value}>{this.state.data.FromAccount}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Transaction Code</Text>
                <Text style={styles.value}>{this.state.data.UniqueId}</Text>
              </View>
              {this.state.data.UserComission > 0 ? (
                <View style={styles.row}>
                  <Text style={styles.label}>Cash Back</Text>
                  <Text style={styles.value}>
                    {this.state.data.UserComission}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
              {this.state.data.IsSuccessfulTransaction && (
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    padding: 10,
                  }}
                  onPress={() => this.downloadFile()}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: Colors.primary,
                    }}
                  >
                    download receipt
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        <ActivityIndicator
          animating={this.state.isLoading}
          color="#ffa500"
        ></ActivityIndicator>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  label: {
    color: "#000",
  },
  price: {
    fontFamily: "Regular",
    color: "rgba(254,104,90,1)",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    margin: 15,
  },
  pricePositive: {
    fontFamily: "Regular",
    color: "green",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    margin: 15,
  },
});
