import {
    View,
    Text,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  import React from "react";
import * as SVG from "./BankingIcons";

import { Colors } from "../screens/style/Theme";

  
  const WarningModal = ({
    isVisible,
    onConfirm,
    onCancel,
    text1,
    text2,
    confirmBox,
    warning,
  }) => {
    return (
      <Modal
        isVisible={isVisible}
        animationType="slide"
        transparent={true}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          onPress={onCancel}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.55)",
          }}
        >
          <KeyboardAvoidingView
            keyboardShouldPersistTaps="always"
            style={styles.modalContainer}
          >
            <View>
              <View
                style={{
                  padding: 20,
                  backgroundColor: "white",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                {!warning ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <SVG.tickMark height={40} width={40} fill={Colors.primary} />
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <SVG.warning height={40} width={40} fill={"#FFD21E"} />
                  </View>
                )}
                {text1 && <Text style={styles.confirmTextView}>{text1}</Text>}
                {text2 && (
                  <Text
                    style={[styles.confirmText, { paddingTop: !text1 ? 12 : 0 }]}
                  >
                    {text2}
                  </Text>
                )}
              </View>
  
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderColor: "gray",
                    borderWidth: 1,
                    justifyContent: "center",
                    borderRadius: 6,
                    alignItems: "center",
                    paddingHorizontal: 8,
                    backgroundColor: "white",
                    paddingVertical: 5,
                  }}
                  onPress={onCancel}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SVG.close height={10} width={10} fill={"gray"} />
                    <Text
                      style={{
                        fontFamily: "Medium",
                        fontSize: 16,
                        color: "gray",
                        marginLeft: 8,
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={{
                    borderColor: "gray",
                    justifyContent: "center",
                    borderRadius: 6,
                    alignItems: "center",
                    paddingHorizontal: 8,
                    backgroundColor: Colors.primary,
                    paddingVertical: 5,
                  }}
                  onPress={onConfirm}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SVG.tick height={10} width={10} fill={"white"} />
                    <Text
                      style={{
                        fontFamily: "Medium",
                        fontSize: 16,
                        color: "white",
                        marginLeft: 8,
                      }}
                    >
                      Confirm
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  export default WarningModal;
  
  const styles = StyleSheet.create({
    modalContainer: {
      // flex: 1,
      // alignItems: "center",
      // justifyContent: "center",
    },
    confirmTextView: {
      // color: "red",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Bold",
    },
    confirmText: {
      // color: "red",
      fontSize: 16,
      textAlign: "justify",
      fontFamily: "Medium",
      color: "gray",
      marginTop: -8,
    },
    buttonTitle: {
      fontFamily: "Medium",
      fontSize: 16,
      color: "#fff",
    },
  });
  
  const CloseButton = () => {
    return (
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "gray",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVG.close height={10} width={10} fill={"gray"} />
        {/* <Text>A</Text> */}
      </View>
    );
  };
  const IconText = ({ icon, text, containerStyle }) => {
    return (
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "gray",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVG.tick height={10} width={10} fill={"gray"} />
      </View>
    );
  };
  