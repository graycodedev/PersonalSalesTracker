// import React from "react";
// import { StyleSheet, TouchableOpacity, Linking } from "react-native";
// import request from "../config/RequestManager";
// import ToastMessage from "../components/Toast/Toast";

// import Icon from "react-native-vector-icons/FontAwesome5";
// import argonTheme from "../screens/style/Theme";

// class DrawerItem extends React.Component {
//   renderIcon = () => {
//     const { title, focused } = this.props;

//     switch (title) {
//       case "Home":
//         return (
//           <Icon
//             name="home"
//             size={14}
//             color={focused ? "white" : Colors.primary}
//           />
//         );
//       case "Change Password":
//         return (
//           <Icon
//             name="list-ul"
//             size={14}
//             color={focused ? "white" : Colors.primary}
//           />
//         );
//       case "Change Pin":
//         return (
//           <Icon
//             name="receipt"
//             size={14}
//             color={focused ? "white" : Colors.primary}
//           />
//         );
//       case "Scan & Pay":
//         return (
//           <Icon
//             name="receipt"
//             size={14}
//             color={focused ? "white" : Colors.primary}
//           />
//         );
//       case "Setup Fingerprint":
//         return (
//           <Icon
//             name="fingerprint"
//             size={14}
//             color={focused ? "white" : Colors.primary}
//           />
//         );
//         break;
//       case "Log Out":
//         return (
//           <Icon
//             name="sign-out-alt"
//             size={16}
//             color={focused ? "white" : "red"}
//           />
//         );
//       case "9851181209":
//         return (
//           <Icon
//             name="phone"
//             size={14}
//             color={focused ? "white" : "rgba(0,0,0,0.5)"}
//           />
//         );
//       case "support@graycode.com.np":
//         return (
//           <Icon
//             name="mail-bulk"
//             size={14}
//             color={focused ? "white" : "rgba(0,0,0,0.5)"}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   render() {
//     const { focused, title, navigation } = this.props;

//     const containerStyles = [
//       styles.defaultStyle,
//       focused ? [styles.activeStyle, styles.shadow] : null,
//     ];

//     return (
//       <>
//         <TouchableOpacity
//           style={{ height: 60 }}
//           onPress={() => {
//             if (title == "Getting Started") {
//               Linking.openURL("https://www.graycode.com.np").catch((err) =>
//                 console.error("An error occurred", err)
//               );
//             } else if (title == "9851181209") {
//               Linking.openURL("tel:" + title);
//             } else if (title == "support@graycode.com.np") {
//               Linking.openURL("mailto:" + title);
//             } else {
//               navigation.navigate(title);
//             }
//           }}
//         >
//           <Block flex row style={containerStyles}>
//             <Block middle flex={0.1} style={{ marginRight: 5 }}>
//               {this.renderIcon()}
//             </Block>
//             <Block row center flex={0.9}>
//               <Text
//                 size={15}
//                 bold={focused ? true : false}
//                 color={focused ? "white" : "rgba(0,0,0,0.5)"}
//               >
//                 {title}
//               </Text>
//             </Block>
//           </Block>
//         </TouchableOpacity>
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   defaultStyle: {
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//   },
//   activeStyle: {
//     backgroundColor: argonTheme.COLORS.ACTIVE,
//     borderRadius: 4,
//   },
//   shadow: {
//     shadowColor: theme.COLORS.BLACK,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//   },
// });

// export default DrawerItem;
