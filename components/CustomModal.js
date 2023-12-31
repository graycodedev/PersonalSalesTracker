import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomModal = ({
  visible,
  closeModal,
  children,
  showConfirm,
  containerStyle,
  fullScreen,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={closeModal}
      style={{ backgroundColor: "white" }}
    >
      <View
        style={[
          styles.modalContainer,
          {
            justifyContent: !fullScreen ? "center" : null,
            paddingHorizontal: !fullScreen ? 10 : 0,
          },
          containerStyle,
          
        ]}
      >
        {!fullScreen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeModal}
          />
        )}
        {!fullScreen ? (
          <View style={[styles.modalContent]}>{children}</View>
        ) : (
          <View style={[styles.fullContent]}>{children}</View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  fullContent: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default CustomModal;
