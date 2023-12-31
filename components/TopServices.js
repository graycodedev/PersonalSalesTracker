// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import IconFontAwesome from "react-native-vector-icons/FontAwesome";
// import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
// import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import Iconionicons from "react-native-vector-icons/Ionicons";
// import ToastMessage from "./Toast/Toast";
// import COLORS from "../screens/style/Theme";

// const TopServices = ({ navigation }) => {
//   let iconSize = 45;
//   return (
//     //Bank Transfer, Statement,  , QR

//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("BankTransfer", { title: `Bank Transfer` });
//         }}
//       >
//         <View style={styles.item}>
//           <IconMaterialCommunityIcons
//             style={{ color: COLORS.COLORS.SERVICES_ICON }}
//             size={iconSize}
//             name="bank"
//           />
//           <Text style={styles.title}>Bank Transfer</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("Wallets");
//         }}
//       >
//         <View style={styles.item}>
//           <IconMaterialCommunityIcons
//             style={{ color: COLORS.COLORS.SERVICES_ICON }}
//             size={iconSize}
//             name="wallet"
//           />
//           <Text style={styles.title}>Load Wallet</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("TransactionList");
//         }}
//       >
//         <View style={styles.item}>
//           <IconMaterialIcons
//             style={{ color: COLORS.COLORS.SERVICES_ICON }}
//             size={iconSize}
//             name="library-books"
//           />
//           <Text style={styles.title}>Transactions</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("ScanPay");
//         }}
//       >
//         <View style={styles.item}>
//           <Icon
//             style={{ color: COLORS.COLORS.SERVICES_ICON }}
//             size={iconSize}
//             name="qrcode"
//           />
//           <Text style={styles.title}>{"Scan & Pay"}</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };
// export default TopServices;

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "space-around",
//     width: "100%",
//     flexDirection: "row",
//     padding: 10,
//     marginTop: 10,
//   },
//   item: {
//     maxWidth: 65,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontFamily: "Regular",
//     color: "gray",
//     fontSize: 12,
//     marginTop: 10,
//     textAlign: "center",
//   },
// });
