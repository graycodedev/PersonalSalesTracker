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
  Text, 
  Alert, BackHandler
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import api, { endPoints } from "../constants/Api";
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
import { ProfileIcon } from "../components/IconsAll";
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

  _onRefresh = async () => {
    await this.GetUserInfo();
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
         <View style={styles.headerAndCard}>
         <View style={styles.headContainer} />
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
              {api.CompanyName}
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
                <View>
                <ProfileIcon height={25} width={25} fill={"white"} />
                </View>
              )}
            </TouchableOpacity>
          </View> 
             <View style={styles.swiper}>
                        <AccountCard
                          navigation={this.props.navigation}
                          data={"blank"}
                        />
            
            
            </View>  
        </View> 

         <DashBoardServices navigation={this.props.navigation} />  

   
        <View style={{ paddingBottom: 20 }}>
          {this.state.offers && this.state.offers.length > 0 && (
            <ImgSlider
              navigation={this.props.navigation}
              data={this.state.offers}
            />
          )}
        </View>  
      
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
    height: 100,
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
        marginBottom: 90,
      },
      android: {
        marginBottom: 90,
      },
    }),
  },
});

export default Home;


