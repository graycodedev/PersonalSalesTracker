// import React from "react";
// import {
//   ImageBackground,
//   Image,
//   StyleSheet,
//   StatusBar,
//   Dimensions,
//   Platform,
//   Linking,
//   BackHandler,
// } from "react-native";
// import { BackgroundImage } from "../../constants/Images";

// const { height, width } = Dimensions.get("screen");
// export class RegisterSuccess extends React.Component {
//   render() {
//     return (
//       <Block flex>
//         <StatusBar barStyle="light-content" />
//         <Block flex>
//           <ImageBackground
//             source={BackgroundImage}
//             style={{ flex: 1, height: height, width, zIndex: 1 }}
//           />
//           <Block space="between" style={styles.padded}>
//             <Block>
//               <Block>
//                 {/* <Image source={Images.LogoText}
//                   style={{ marginBottom: theme.SIZES.BASE * 1.5}}/> */}
//               </Block>
//               <Block>
//                 <Block>
//                   <Text color="white" size={60}>
//                     Thank You
//                   </Text>
//                 </Block>
//               </Block>
//               <Text
//                 size={16}
//                 color="rgba(255,255,255,0.6)"
//                 style={{ marginTop: 5, marginBottom: 65, textAlign: "center" }}
//               >
//                 Your information will be reviewed and notified upon service
//                 activation.
//               </Text>
//               <Button
//                 shadowless
//                 style={styles.button}
//                 // color={argonTheme.COLORS.INFO}
//                 onPress={() => BackHandler.exitApp()}
//               >
//                 <Text bold color={"#FFF"}>
//                   Close App
//                 </Text>
//               </Button>
//             </Block>
//           </Block>
//         </Block>
//       </Block>
//     );
//   }
// }
// export default RegisterSuccess;
// const styles = StyleSheet.create({
//   padded: {
//     paddingHorizontal: theme.SIZES.BASE * 2,
//     zIndex: 3,
//     position: "absolute",
//     marginTop: 100,
//     //  bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 3 : theme.SIZES.BASE * 3,
//   },
//   button: {
//     width: width - theme.SIZES.BASE * 4,
//     height: theme.SIZES.BASE * 3,
//     shadowRadius: 0,
//     shadowOpacity: 0,
//   },
//   pro: {
//     paddingHorizontal: 8,
//     marginLeft: 3,
//     borderRadius: 4,
//     height: 22,
//     marginTop: 15,
//   },
//   gradient: {
//     zIndex: 1,
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 66,
//   },
// });
