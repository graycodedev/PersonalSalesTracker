import React from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
  View,
  AppState,
  RefreshControl,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { Alert, BackHandler } from "react-native";
import api, { endPoints } from "../constants/Api";
import qs from "qs";
import { Text, theme } from "galio-framework";
import Swiper from "react-native-swiper";
import { HeaderHeight } from "../constants/utils";
import { AccountCard } from "../components/Card";
import { DashBoardServices } from "../components/DashboardServices";
import tokenManager from "../config/TokenManager";
import request from "../config/RequestManager";
import ToastMessage from "../components/Toast/Toast";
import DeviceStorage from "../config/DeviceStorage";
import helpers from "../constants/Helpers";
import { Colors } from "./style/Theme";
import ImgSlider from "../components/ImgSlider";
import IMAGES from "../constants/newImages";
import * as BankingIcons from "../components/BankingIcons";
import { Profile } from "../components/IconsAll";
import * as SVG from "../components/BankingIcons";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      userId: 0,
      fullName: "",
      memberId: "",
      phoneNumber: "",
      accountList: [],
      recentTransactions: [],
      showmerchantModal: false,
      categories: [],
      pinSetup: false,
      pincode: "",
      repincode: "",
      refreshing: false,
      logOut: false,
      offers: [],
      logoPathHeader: "",
      ProfilePicture: "",
      balanceError: "",
      IosCompanyId: 0,
      IosCompanyCode: "",
      IosCompanyName: "",
      IosWalletName: "",
      IosAppstoreUrl: "",
      IosPrimaryColor: "",
      compInfo: null,
    };
this.subscription;
    this.handleIos();
    this.GetUserInfo();
    this.getCategoryAll();
    this.getLogoPathHeader();
    this.getOffers();
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: "",
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
 this.subscription=  AppState.addEventListener("change", this._handleAppStateChange);

  }
  //commented if no error than remove later oct 28
  // componentWillReceiveProps(nextProps) {
  //   this.GetUserInfo();
  // }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
   this.subscription.remove();
  }
  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      //app forground dont call on mount;
     await DeviceStorage.getKey("refreshtoken").then((t) => {
        if (t == null || t == "") {
          this.props.navigation.navigate("SignIn");
        }
      });
    }
    this.setState({ appState: nextAppState });
  }

  handleBackButton = async () => {
    var currentScreen = await DeviceStorage.getKey("currentScreen");
    if (currentScreen == "Dashboard" || currentScreen == "Home") {
      Alert.alert(
        "Exit App",
        "Exiting the application?",

        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              tokenManager.clearAndRestoreNewToken().then(() => {
                BackHandler.exitApp();
              });
            },
          },
        ],
        {
          cancelable: false,
        }
      );

      return true;
    } else {
      // console.error(this.props.navigation, this.props)
      if (this.props.navigation.canGoBack()) {
        this.props.navigation.dispatch(CommonActions.goBack());
        // this.props.navigation.goBack(null);

        return true;
      }

    }

  };
  GetCompanyInfo = async () => {
    let compInfo = await helpers.GetCompanyDetails();
    this.setState({ compInfo: compInfo });
  };
  GetUserInfo = async () => {
    const u = await helpers.GetUserInfo();
    var accList = await helpers.GetSavingAccounts();
    if (u != null) {
      this.setState({
        fullName: u.FullName,
        memberId: u.UserName,
        userId: u.Id,
        PhoneNumber: u.PhoneNumber,
        ProfilePicture: u.ProfilePicture,
      });
      if (accList != null && accList.length > 0) {
        if (accList[0].Mobile == u.PhoneNumber) {
          this.setState({ accountList: accList });
        }
      }
      await this.getAccountList();
      await this.getCooperativeBalance();
      await this.getRecentTransactions();
      await this.checkUserHasPin();
    }
  };
  getCategoryAll = async () => {
    var GetCategories = api.GetCategories + "?offset=1&limit=" + 20;
    (await request()).get(GetCategories).then((categories) => {
      if (categories.data != null && categories.data.Code == 200) {
        this.setState({ categories: categories.data.Data });
      } else {
      }
    });
  };

  getAccountList = async () => {
    this.setState({ balanceError: "" });
    var accountListUrl =
      api.AccountList + "?code=graycode&mobileno=" + this.state.PhoneNumber;
    var accountList = await (await request()).get(accountListUrl);
    if (accountList.data != null && accountList.data.Code == 200) {
      this.setState({ balanceError: "" });
      this.setState({ accountList: accountList.data.Data });
      await DeviceStorage.saveKey(
        "UserAccountsInfo",
        JSON.stringify(accountList.data.Data)
      );
    } else {
      this.setState({ balanceError: "Error syncing live balance" });
      ToastMessage.Short("Error syncing account numbers and balance");
    }
  };
  getCooperativeBalance = async () => {
    var companyBalance = await (await request()).get(api.CooperativeBalance);
    if (companyBalance.data != null && companyBalance.data.Code == 200) {
      await DeviceStorage.saveKey(
        "CooperativeBalance",
        JSON.stringify(companyBalance.data.Data)
      );
    } else {
      ToastMessage.Short("Error syncing company balance");
    }
  };
  getRecentTransactions = async () => {
    let clientId = api.IsAppForMultiple
      ? this.state.IosCompanyId
      : api.CompanyId;
    let companyId = api.IsAppForMultiple
      ? this.state.IosCompanyId
      : api.CompanyId;
    var data = qs.stringify({
      ClientId: clientId,
      SecretKey: api.SecretKey,
      UserId: this.state.userId,
      CompanyId: companyId,
      UserId: this.state.userId,
      PageNo: 1,
      PageSize: 10,
    });
    var response = await (await request()).post(api.RecentTransaction, data);
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ recentTransactions: response.data.Data });
      } else {
        ToastMessage.Short("Error Loading Recent Transactions");
      }
    } else {
      ToastMessage.Short("Error Loading Recent Transactions");
    }
  };
  handleIos = async () => {
    let CompanyDetail = await helpers.GetCompanyInfoIOS();
    this.setState({
      IosCompanyId: CompanyDetail.CompanyId,
      IosWalletName: CompanyDetail.Name,
      IosAppstoreUrl: CompanyDetail.AppStoreUrl,
      IosPrimaryColor: CompanyDetail.PrimaryColor,
    });
  };
  checkUserHasPin = async () => {
    var pinurl = endPoints.CheckUserPin;
    (await request()).get(pinurl).then((staus) => {
      let response = staus.data;
      if (response.Code == 200) {
        DeviceStorage.saveKey("UserHasPin", response.Data.toString());
        if (!response.Data) {
          this.props.navigation.navigate("savepin");
        }
      } else {
        ToastMessage.Short(response.Message);
      }
    });
  };
  _onRefresh = async () => {
    await this.GetUserInfo();
    this.getCategoryAll();
    helpers.GetUserInfo().then((userinfo) => {
      if (userinfo == null) {
        this.props.navigation.navigate("SignIn");

        //this.props.navigation.navigate('SignIn')
      }
    });
  };
  getOffers = async () => {
    let companyId = api.IsAppForMultiple
      ? this.state.IosCompanyId
      : api.CompanyId;
    var response = await (await request())
      .get(api.Offers.Home + companyId)
      .catch(function(error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ offers: response.data.Data });
      } else {
        ToastMessage.Short("Error Loading Offers");
      }
    } else {
      ToastMessage.Short("Error Loading Offers");
    }
  };
  getLogoPathHeader = async () => {
    let path = await helpers.GetCompanyLogoPathHeader();
    this.setState({ logoPathHeader: path });
  };
  render() {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        // style={{ backgroundColor: "#ecf0f1" }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {/* <View style={styles.topPanel}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
            >
              <Icon style={styles.iconStyle} name="bars" size={25} />
            </TouchableOpacity>

            <Image
              style={styles.headerImage}
              source={{ uri: `${api.BaseUrl}${this.state.logoPathHeader}` }}
            ></Image>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Notifications");
              }}
            >
              <IconMatirealCommunityIcons
                name="bell"
                size={30}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.swiperView}>
            <View style={styles.swiper}>
              <Swiper
                activeDotColor={Colors.primary}
                paginationStyle={{
                  bottom: -25,
                }}
                key={this.state.accountList.length}
              >
                {this.state.accountList.length > 0 &&
                  this.state.accountList.map((item, index) => {
                    if (item.AccType != "Loan") {
                      return <AccountCard key={item.AccNum} data={item} />;
                    }
                  })}
              </Swiper>
            </View>
          </View>
          <TopServices navigation={this.props.navigation} />
        </View> */}
        {/* <HomeHeader /> */}
        <View style={styles.headerAndCard}>
          {/* <BankingIcons.ScreenheaderIcon fill={Colors.primary} width="100%" /> */}
          <View style={styles.headContainer} />
          {/* <Image source={IMAGES.Ellipse} style={{ width: "100%" }} /> */}
          {/* <Image source={BankingIcons.ScreenheaderEllipse} width="100%" /> */}
          <BankingIcons.ScreenheaderEllipse
            width="100%"
            fill="white"
            style={styles.ellipse}
            resizeMode="cover"
          />
          <View style={styles.accountAndBankName}>
            <Text style={{ fontSize: 16, color: "white", fontFamily: "Bold" }}>
              Hi, {this.state.fullName}
            </Text>
            <Text
              style={{ fontSize: 12, color: "white", fontFamily: "Regular" }}
            >
              WELCOME TO{" "}
              {api.IsAppForMultiple
                ? this.state.IosCompanyName
                : api.CompanyName}
            </Text>
          </View>
          <View style={styles.notificationAndProfile}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Notifications");
              }}
            >
              <BankingIcons.notificationIcon
                fill={Colors.primary}
                style={{ marginRight: 20 }}
              ></BankingIcons.notificationIcon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Profile");
              }}
            >
              {this.state.ProfilePicture ? (
                <Image
                  source={{ uri: api.BaseUrl + this.state.ProfilePicture }}
                />
              ) : (
                // <Image source={IMAGES.profile} />
                <Profile height={25} width={25} fill={"white"} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.swiper}>
            <Swiper
              activeDotColor={Colors.primary}
              paginationStyle={{
                bottom: -15,
              }}
              key={this.state.accountList.length}
            >
              {this.state.accountList.length > 0 ? (
                this.state.accountList.map((item, index) => {
                  if (item.AccType != "Loan") {
                    return (
                      <AccountCard
                        navigation={this.props.navigation}
                        key={item.AccNum}
                        data={item}
                        callback={()=>this.getAccountList()}
                        balanceError={this.state.balanceError}
                      />
                    );
                  }
                })
              ) : (
                <AccountCard
                  data={"blank"}
                  navigation={this.props.navigation}
                  callback={()=>this.getAccountList()}
                />
              )}
            </Swiper>
          </View>
        </View>

        <DashBoardServices navigation={this.props.navigation} />

        {/* <View style={{ marginLeft: 20, marginVertical: 14 }}>
          <Text style={{ fontSize: 14, fontFamily: "Bold" }}>
            Check New Promo
          </Text>
          <Text style={{ color: "#777777", fontSize: 10 }}>
            Shift through our latest offers
          </Text>
        </View> */}
        <View style={{ paddingBottom: 20 }}>
          {this.state.offers && this.state.offers.length > 0 && (
            <ImgSlider
              navigation={this.props.navigation}
              data={this.state.offers}
            />
          )}
        </View>

        {/* <View style={styles.transactionHeading}>
          <Text style={{ fontSize: 16, fontFamily: "Regular" }}>
            {" "}
            Recent Transactions
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("TransactionList");
            }}
          >
            <View style={styles.IconMore}>
              <Icon style={{ color: "#fff" }} name="bars" size={15} />
            </View>
          </TouchableOpacity>
        </View> */}
        {/* {this.state.recentTransactions.length == 0 && (
          <View style={styles.transactionBackground}>
            <View style={styles.transactions}>
              <Text style={styles.transactionText}>
                No recent transactions found.
              </Text>
            </View>
          </View>
        )}
        {this.state.recentTransactions.length > 0 && (
          <View style={styles.recentTransactionsBackground}>
            <ScrollView
              nestedScrollEnabled={true}
              horizontal={false}
              style={{ maxHeight: 160, borderRadius: 5, width: "100%" }}
            >
              {this.state.recentTransactions &&
                this.state.recentTransactions.map((item, index) => {
                  return <SimpleRow data={item} key={index} />;
                })}
            </ScrollView>
          </View>
        )}
        <View style={styles.merchantHeading}>
          <Text style={styles.merchantHeadingText}> Merchants</Text>
        </View>

        <View style={{ marginBottom: 40 }}>
          <CategoryViewer categories={this.state.categories} {...this.props} />
        </View> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  headContainer: {
    width: "100%",
    height: 105,
    backgroundColor: Colors.primary,
  },
  ellipse: {
    position: "absolute",
    width: "100%",
  },
  topPanel: {
    backgroundColor: "#e1e1e1",
    marginBottom: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    justifyContent: "space-around",
    marginBottom: 10,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
  },
  headerImage: {
    height: 60,
    width: "80%",
    resizeMode: "contain",
  },
  swiperView: {
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    position: "absolute",
  },
  swiper: {
    marginTop: 80,
    height: 130,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
  },

  servicesHeading: { fontSize: 16, fontFamily: "Regular", fontWeight: "bold" },
  transactionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  transactionBackground: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#F7F7F7",
  },
  transactions: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 5,
    flex: 1,
  },
  transactionText: {
    fontFamily: "Regular",
    color: "rgba(54,71,93,1)",
    fontSize: 14,
    marginTop: 7,
    marginLeft: 11,
  },
  recentTransactionsBackground: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#F7F7F7",
  },
  merchantHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
  },
  merchantHeadingText: { fontSize: 16, fontFamily: "Regular" },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  IconMore: {
    width: 25,
    height: 25,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  UserBlock: {
    backgroundColor: "#1194F4",
    height: 70,
    paddingBottom: 10,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  iconStyle: {
    color: Colors.primary,
  },
  container: {
    height: 105,
    backgroundColor: Colors.primary,
  },
  notificationAndProfile: {
    position: "absolute",
    marginTop: 25,
    alignSelf: "flex-end",
    paddingRight: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  accountAndBankName: {
    position: "absolute",
    marginTop: 30,
    marginLeft: 25,
  },
  headerAndCard: {
    ...Platform.select({
      ios: {
        marginTop: 40,
        marginBottom: 120,
      },
      android: {
        marginBottom: 120,
      },
    }),
  },
});

export default Home;
