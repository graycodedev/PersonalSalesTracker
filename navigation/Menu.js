// import React from "react";
// import { Linking } from "react-native";
// import { useSafeArea } from "react-native-safe-area-context";
// import api from "../constants/Api";
// import {
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   BackHandler,
// } from "react-native";
// import tokenManager from "../config/TokenManager";

// import { DrawerItem as DrawerCustomItem } from "../components";
// import {
//   StackActions,
//   NavigationActions,
//   CommonActions,
// } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import SignIn from "../screens/general/SignIn";
// function CustomDrawerContent({
//   drawerPosition,
//   navigation,
//   profile,
//   focused,
//   state,
//   ...rest
// }) {
//   const insets = useSafeArea();
//   const screens = [
//     "Home",
//     "Change Password",
//     "Change Pin",
//     "Setup Fingerprint",
//   ];
//   var appInfo = require("../app.json");
//   var appVersion = appInfo.expo.version;

//   return (
//     <Block
//       style={styles.container}
//       forceInset={{ top: "always", horizontal: "never" }}
//     >
//       <Block flex={0.06} style={styles.header}>
//         {/* <Image styles={styles.logo} source={Images.LogoText} /> */}
//       </Block>
//       <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
//         <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//           {screens.map((item, index) => {
//             return (
//               <DrawerCustomItem
//                 title={item}
//                 key={index}
//                 navigation={navigation}
//                 focused={state.index === index ? true : false}
//               />
//             );
//           })}

//           <Block
//             flex
//             style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
//           >
//             <Block
//               style={{
//                 borderColor: "rgba(0,0,0,0.2)",
//                 width: "100%",
//                 borderWidth: StyleSheet.hairlineWidth,
//               }}
//             />
//             <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>
//               CONTACT DETAILS
//             </Text>
//           </Block>
//           <DrawerCustomItem title="9851181209" navigation={navigation} />
//           <DrawerCustomItem
//             title="support@graycode.com.np"
//             navigation={navigation}
//           />
//           <TouchableOpacity
//             color="primary"
//             onPress={async () => {
//               tokenManager.clearAndRestoreNewToken().then(() => {
//                 navigation.dispatch(StackActions.replace("SignIn"));
//                 navigation.navigate("SignIn");
//               });
//             }}
//           >
//             <Block flex style={{ paddingHorizontal: 15, flexDirection: "row" }}>
//               <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>
//                 <Icon
//                   name="sign-out-alt"
//                   size={16}
//                   color={focused ? "white" : "red"}
//                 />
//                 Log Out
//               </Text>
//             </Block>
//           </TouchableOpacity>

//           <Text color="#8898AA" style={{ marginTop: 40, marginLeft: 8 }}>
//             version: {appVersion}
//           </Text>
//         </ScrollView>
//       </Block>
//     </Block>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingHorizontal: 28,
//     paddingBottom: theme.SIZES.BASE,
//     paddingTop: theme.SIZES.BASE * 3,
//     justifyContent: "center",
//   },
// });

// export default CustomDrawerContent;
