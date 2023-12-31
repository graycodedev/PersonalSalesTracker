import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Block, theme } from "galio-framework";
import api from "../../constants/Api";
import { Table, Row } from "react-native-table-component";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import { Colors } from "../style/Theme";
import helpers from "../../constants/Helpers";
class IntrestRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tableHead: ["A/C Type", "A/C Plan", "Rate"],
      intrestRates: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Intrest Rates",
    });
    this.getIntrestRates();
  }
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <ScrollView
        style={{ width: "100%", backgroundColor: "#eee" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Table borderStyle={{ borderWidth: 0, borderColor: "#c8e1ff" }}>
          <Row
            style={styles.header}
            data={this.state.tableHead}
            textStyle={styles.headerText}
            borderStyle={{ borderWidth: 0 }}
          />
        </Table>

        <ScrollView nestedScrollEnabled={true} style={styles.dataWrapper}>
          <Table style={{ fontFamily: "Regular" }}>
            {this.state.intrestRates &&
              this.state.intrestRates.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={[styles.row, index % 2 && { backgroundColor: "#fff" }]}
                  textStyle={styles.text}
                ></Row>
              ))}
          </Table>
        </ScrollView>
        <ActivityIndicator
          animating={this.state.isLoading}
          color="#ffa500"
        ></ActivityIndicator>
      </ScrollView>
    );
  }

  getIntrestRates = async () => {
    this.setState({ isLoading: true });
    const accList = await AsyncStorage.getItem("UserAccountsInfo");
    let companyId = await helpers.GetCompanyId();
    var url = api.ListInterestRates + "?companyId=" + companyId;

    var response = await (await request()).get(url).catch(function(error) {
      ToastMessage.Short("Error Contact Support");
    });
    if (response != undefined && response.data.Code == 200) {
      var dataArray = [];
      response.data.Data.map((data, index) => {
        var arr = [
          data.AccountType,
          data.PlanName,
          data.InterestRate.toFixed(2) + "%",
        ];
        dataArray.push(arr);
      });
      this.setState({ intrestRates: dataArray });
    } else {
      ToastMessage.Short(response.data.Message);
    }
    this.setState({ isLoading: false });
  };
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    backgroundColor: "#D3D3D3",
    height: 60,
    paddingBottom: 5,
    paddingTop: 10,
    marginBottom: 5,
    paddingStart: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: {
    height: 40,
    borderWidth: 0,
    backgroundColor: Colors.primary,
  },
  headerText: { color: "#fff", textAlign: "center", fontFamily: "Bold" },
  text: { textAlign: "center", fontFamily: "Regular" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#eee" },
});
export default IntrestRate;
