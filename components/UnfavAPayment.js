import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import helpers from "../constants/Helpers";
import * as BankingIcons from "./BankingIcons";

const UnfavAPayment = (props) => {
  const [showModal, setShowModal] = useState(false);
  return !showModal ? (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: props.bankTransfer ? 0 : 10,
      }}
      onPress={() => {
        setShowModal(true);
      }}
    >
      {props.bankTransfer ? (
        <Text style={{ color: "red" }}>Remove</Text>
      ) : (
        <BankingIcons.DeleteIcon fill={"red"} width={15} height={15} />
      )}
    </TouchableOpacity>
  ) : (
    <Modal animationType="slide" transparent={true} visible={showModal}>
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
            <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 20 }}>
              Confirmation
            </Text>
            <Text
              style={{
                fontFamily: "Medium",
                fontSize: 17,
                marginTop: 10,
                paddingHorizontal: 5,
                textAlign: "center",
              }}
            >
              Remove Saved Payment?
            </Text>
          </View>
          <View style={styles.down}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "gray" }]}
              onPress={() => {
                setShowModal(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#343EDF" }]}
              onPress={async () => {
                await helpers.RemoveFromSaved(props.id);
                setShowModal(false);
                if (props.bankTransfer) {
                  props.updateList(props.id);
                } else {
                  await props.updateList();
                }
              }}
            >
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default UnfavAPayment;

const styles = StyleSheet.create({
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
  },
  down: {
    marginTop: 20,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  modalButton: {
    height: 40,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
});
