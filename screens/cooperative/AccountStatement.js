import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { InputText } from "../../components/Input";
import { theme } from "galio-framework";
import api from "../../constants/Api";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import ModalPopUp from "../../components/Modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ButtonPrimary } from "../../components/Button";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import { Colors } from "../style/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
class AccountStatement extends React.Component {
  constructor(props) {
    super(props);
    var { accountNo, fromDate, toDate } = this.props.route.params;
    //const date = moment().format("DD-MM-YYYY");

    if (fromDate == "") {
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
    }
    toDate = toDate == "" ? new Date() : toDate;
    this.state = {
      isLoading: true,
      showModal: false,
      accountNo: accountNo,
      fromDate: fromDate,
      toDate: toDate,
      showFromDatePicker: false,
      showToDatePicker: false,
      tableHead: ["Date", "Debit", "Credit", "Balance"],
      statement: [],
      statementList: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Account Statement",
    });
    this.getStatement();
  }
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    const onChangeFromDate = (event, selectedDate) => {
      this.setState({ showFromDatePicker: false });
      const currentDate = selectedDate || this.state.fromDate;
      this.setState({ fromDate: currentDate });
    };
    const onChangeToDate = (event, selectedDate) => {
      this.setState({ showToDatePicker: false });
      const currentDate = selectedDate || this.state.toDate;
      this.setState({ toDate: currentDate });
    };
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#ecf0f1" }}
        >
          <View
            style={{ paddingTop: 10, paddingBottom: 5, alignItems: "center" }}
          >
            <Text style={{ color: "#474747", fontSize: 16, marginBottom: 2 }}>
              Statement for{" "}
            </Text>
            <Text>{this.state.accountNo} </Text>
            <Text
              style={{ color: "#474747", fontSize: 12, fontFamily: "Regular" }}
            >
              {" "}
              {moment(this.state.fromDate).format("DD-MM-YYYY")} to{" "}
              {moment(this.state.toDate).format("DD-MM-YYYY")}{" "}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginBottom: 3,
              padding: 10,
              borderBottomColor: "red",
              borderBottomWidth: 1,
              borderTopWidth: 1,
              paddingRight: 0,
              marginRight: 0,
            }}
          >
            <View style={{ width: "40%" }}>
              <Text>Particualrs</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>Debit</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>Credit</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>Balance</Text>
            </View>
          </View>
          <ScrollView nestedScrollEnabled={true} style={styles.dataWrapper}>
            <View>
              {this.state.statementList &&
                this.state.statementList.map((rowData, index) => (
                  <View style={styles.container} key={index}>
                    <View style={{ flexDirection: "row", paddingBottom: 5 }}>
                      <View style={{ width: "70%" }}>
                        <Text style={{ fontSize: 12 }}>
                          {rowData.Particulars}
                        </Text>
                      </View>
                      <View style={{ width: "30%" }}></View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "40%" }}>
                        <Text style={{ color: "rgba(94,108,128,1)" }}>
                          {rowData.TxnDate}
                        </Text>
                      </View>
                      <View style={{ width: "20%" }}>
                        <Text style={{ color: "red" }}>
                          {rowData.Debit ??
                            parseFloat(rowData.Debit).toFixed(2)}
                        </Text>
                      </View>
                      <View style={{ width: "20%" }}>
                        <Text style={{ color: "green" }}>
                          {rowData.Credit ??
                            parseFloat(rowData.Credit).toFixed(2)}
                        </Text>
                      </View>

                      <View style={{ width: "20%" }}>
                        <Text>{parseFloat(rowData.Balance).toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
          <ActivityIndicator
            animating={this.state.isLoading}
            color="#ffa500"
          ></ActivityIndicator>
        </ScrollView>

        <View style={styles.bottomView}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={async () => {
              this.setState({ showModal: true });
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Change Date
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              ToastMessage.Short("Available Soon");
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Export
            </Text>
          </TouchableOpacity>
        </View>

        <ModalPopUp
          visible={this.state.showModal}
          onPress={() => {}}
          onRequestClose={() => {
            this.setState({ showModal: false });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 18 }}> Filter By Date</Text>
            <TouchableOpacity
              onPress={() => this.setState({ showModal: false })}
            >
              <Icon
                style={{ color: Colors.primary }}
                name="window-close"
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <View style={{ margin: 10 }}>
              <Text style={{ fontSize: 16 }}>From Date </Text>
              <TouchableOpacity
                onPress={async () => {
                  this.setState({ showFromDatePicker: true });
                }}
              >
                <InputText
                  editable={false}
                  iconContent={
                    <Icon
                      size={16}
                      color="green"
                      name="calendar-alt"
                      style={{ color: Colors.primary }}
                    />
                  }
                  onChangeText={(fromDate) => this.setState({ fromDate })}
                  value={moment(this.state.fromDate).format("DD-MM-YYYY")}
                />
              </TouchableOpacity>
              {this.state.showFromDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.fromDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeFromDate}
                />
              )}
            </View>
            <View style={{ margin: 10 }}>
              <Text style={{ fontSize: 16 }}>To Date </Text>
              <TouchableOpacity
                onPress={async () => {
                  this.setState({ showToDatePicker: true });
                }}
              >
                <InputText
                  editable={false}
                  iconContent={
                    <Icon
                      size={16}
                      color="green"
                      name="calendar-alt"
                      style={{ color: Colors.primary }}
                    />
                  }
                  onChangeText={(toDate) => this.setState({ toDate })}
                  value={moment(this.state.toDate).format("DD-MM-YYYY")}
                />
              </TouchableOpacity>
              {this.state.showToDatePicker && (
                <DateTimePicker
                  testID="todatepicker"
                  value={this.state.toDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeToDate}
                />
              )}
            </View>
            <View style={{ margin: 10 }}>
              <TouchableOpacity
                onPress={async () => {
                  this.setState({ showModal: false });
                  this.getStatement();
                }}
              >
                <ButtonPrimary style={{ marginTop: 20 }} title="OK" />
              </TouchableOpacity>
            </View>
          </View>
        </ModalPopUp>
      </View>
    );
  }

  getStatement = async () => {
    this.setState({ isLoading: true });
    const accList = await AsyncStorage.getItem("UserAccountsInfo");
    var url =
      api.StatementGet +
      "?code=" +
      api.SecretKey +
      "&accountno=" +
      this.state.accountNo +
      "&fromDate=" +
      moment(this.state.fromDate).format("YYYY-MM-DD") +
      "&toDate=" +
      moment(this.state.toDate).format("YYYY-MM-DD");
    var response = await (await request()).get(url).catch(function(error) {
      ToastMessage.Short("Error Contact Support");
    });

    if (response != undefined && response.data.Code == 200) {
      this.setState({ statementList: response.data.Data });
    } else {
      ToastMessage.Short(response.data.Message);
    }
    this.setState({ isLoading: false });
  };
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    backgroundColor: "#D3D3D3",
    height: 60,
    paddingBottom: 5,
    paddingTop: 10,
    marginBottom: 5,
    paddingStart: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  container: { flex: 1, padding: 10, backgroundColor: "#fff", margin: 5 },
  rect2: {
    width: 300,
    height: 90,
  },
  header: { height: 40, borderWidth: 0, backgroundColor: "#2FBB07" },
  headerText: { color: "#fff", textAlign: "center", fontFamily: "Bold" },
  text: { textAlign: "center", fontFamily: "Regular" },
  dataWrapper: { marginTop: -1, marginBottom: 52 },
  row: { height: 40, backgroundColor: "#eee" },
  bottomView: {
    zIndex: 999,
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
  },
});
export default AccountStatement;
