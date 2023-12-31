import {
    View,
    Text,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  import React from "react";
  import { Colors } from "../screens/style/Theme";
import * as SVG from "../components/BankingIcons"; 
import Line from "./shapes/Line";
  
  const ConfirmationModal = ({
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
                {text1 && <Text style={styles.confirmTextView}>{text1}</Text>}

                <Line orientataion={"horizontal"} width={1} color={"red"}/>
                
                {text2 && (
                  <Text
                    style={[styles.confirmText, { paddingTop: !text1 ? 12 : 0 }]}
                  >
                    {text2}
                  </Text>
                )}
              </View>
  
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  paddingVertical: 4,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                onPress={onConfirm}
             activeOpacity={1}
              >
                <View
                  style={{
                    borderColor: "gray",
                    justifyContent: "center",
                    borderRadius: 6,
                    alignItems: "center",
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                  }}
                 
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Medium",
                        fontSize: 16,
                        color: "red",
                        marginLeft: 8,
                      }}
                    >
                      OK
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  export default ConfirmationModal;
  
  const styles = StyleSheet.create({
    modalContainer: {
      // flex: 1,
      // alignItems: "center",
      // justifyContent: "center",
    },
    confirmTextView: {
      color: "red",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Bold",
      marginBottom: 2
    },
    confirmText: {
      // color: "red",
      fontSize: 16,
      textAlign: "justify",
      fontFamily: "Medium",
      color: "#000",
      marginTop: 4,
    },
    buttonTitle: {
      fontFamily: "Medium",
      fontSize: 16,
      color: "#fff",
    },
  });