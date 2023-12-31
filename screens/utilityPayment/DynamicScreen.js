import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlightBase,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Block, Text, theme, TextInput } from "galio-framework";
import api from "../../constants/Api";
import { ScrollView } from "react-native";
const { width, height } = Dimensions.get("screen");
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../style/Theme";
import * as BankingIcons from "../../components/BankingIcons";

export class DynamicScreen extends React.Component {
  constructor(props) {
    super(props);
    const params = this.props.route.params;
    this.state = {
      isLoading: false,
      serviceType: params.Name,
      merchants: [],
      spinner: true,
    };
  }
  componentDidMount() {
    this.getServiceMerchants();
    this.props.navigation.setOptions({
      title: this.state.serviceType,
    });
  }
  getServiceMerchants = async () => {
    var merchantslistapi =
      api.GetMerchantsByCategory +
      "?offset=1&limit=20&categoryId=" +
      this.props.route.params.ServiceCategoryId;
    var merchantsReponse = await (await request()).get(merchantslistapi);
    if (merchantsReponse.data != null && merchantsReponse.data.Code == 200) {
      this.setState({ merchants: merchantsReponse.data.Data, spinner: false });
    } else {
      ToastMessage.Short("Could not load services");
    }
  };
  onMerchantClick = (merchant) => {
    //console.log(merchant)
    this.getMerchantForm(merchant.Id, merchant);
  };

  getMerchantForm = async (serviceId, merchant) => {
    this.setState({ spinner: true });

    if (merchant.ServiceName == "DISHHOME") {
      this.props.navigation.navigate("DishHome");
      this.setState({ spinner: false });
      return;
    }
    //serviceId=6&formType=inquiry
    var merchantFormApi =
      api.GetDynamicForm + "?formType=inquiry&serviceId=" + serviceId;
    var merchantsFormReponse = await (await request()).get(merchantFormApi);
    if (
      merchantsFormReponse.data != null &&
      merchantsFormReponse.data.Code == 200
    ) {
      this.setState({ spinner: false });
      this.setState({ merchantForm: merchantsFormReponse.data.Data });
      this.props.navigation.navigate(`dynamicinquiry`, {
        form: this.state.merchantForm,
        merchant: merchant,
      });
    } else {
      this.setState({ spinner: false });
    }
  };
  render() {
    const { merchants, spinner } = this.state;

    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#ecf0f1" }}
        >
          {merchants.length > 0 && (
            <View
              style={{
                marginLeft: 5,
                marginRight: 5,
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {merchants.map((merchant, index) => {
                return (
                  <View key={merchant.ServiceName} style={{ width: 125 }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.onMerchantClick(merchant);
                      }}
                    >
                      <View style={blockStyle.rect2}>
                        {/* <Image
                          source={{
                            uri: `${api.BaseUrl}${merchant.Image}?w=300&h=300&mode=pad`,
                          }}
                          //source={{ uri: 'https://blog.apnic.net/wp-content/uploads/2020/06/WorldLink_white_banner-555x202.png?v=09862861d39bab1f96cc5cc93ff7f9c0' }}
                          style={blockStyle.icon}
                        /> */}
                      </View>
                      <Text style={blockStyle.title}>
                        {merchant.ServiceName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {this.state.serviceType == "Water" && (
                <View style={{ width: 125 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("CommunityWaterPayment");
                    }}
                  >
                    <View
                      style={[
                        blockStyle.rect2,
                        { alignItems: "center", justifyContent: "center" },
                      ]}
                    >
                      {/* <Image
                          source={{
                            uri: `${api.BaseUrl}${merchant.Image}?w=300&h=300&mode=pad`,
                          }}
                          //source={{ uri: 'https://blog.apnic.net/wp-content/uploads/2020/06/WorldLink_white_banner-555x202.png?v=09862861d39bab1f96cc5cc93ff7f9c0' }}
                          style={blockStyle.icon}
                        /> */}
                      <BankingIcons.KhanepaniSVG
                        fill={Colors.primary}
                        height="80"
                        width="80"
                      />
                    </View>
                    <Text style={blockStyle.title}>Community Khanepani</Text>
                  </TouchableOpacity>
                </View>
              )}
              {merchants.length == 0 && (
                <View style={blockStyle.rect2}>
                  <Text style={blockStyle.title}></Text>
                </View>
              )}
            </View>
          )}
          {merchants.length == 0 && spinner == false && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "#fff",
                height: 130,
                margin: 5,
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text style={blockStyle.title}>
                We are soon adding more merchants...
              </Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  }
}
const blockStyle = StyleSheet.create({
  rect2: {
    backgroundColor: "#fff",
    width: 105,
    height: 105,
    margin: 5,
    marginTop: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  icon: {
    height: 80,
    width: 80,
    marginTop: 5,
  },
  title: {
    fontFamily: "Light",
    color: "#000",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
});
