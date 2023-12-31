import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";

const IdleTimerPopUP = (props) => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <KeyboardAvoidingView
        keyboardShouldPersistTaps="always"
        style={styles.modalContainer}
      >
        <View
          style={{
            backgroundColor: "#EEEEEE",
            paddingVertical: 10,
            width: "80%",
            maxWidth: 550,
          }}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.up} keyboardShouldPersistTaps="always">
            <Text style={{ fontFamily: "Bold", color: "red", fontSize: 20 }}>
              Session Expired !!
            </Text>
            <Text
              style={{
                fontFamily: "Regular",
                fontSize: 15,
                marginTop: 10,
                paddingHorizontal: 5,
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              Your login session is expired. Please login again to continue.
            </Text>
          </View>
          <View style={styles.down}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "red" }]}
              onPress={() => {
                setModalVisible(false);
                props.onOk();
                props.navigation.navigate("SignIn");
              }}
            >
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default IdleTimerPopUP;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  up: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  modalinput: {
    height: 70,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#343EDF",
    textAlign: "center",
    marginVertical: 15,
    borderRadius: 12,
    color: "#000",
    fontFamily: "Bold",
    fontSize: 20,
  },
  down: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  modalButton: {
    marginTop: 10,
    height: 30,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
});
