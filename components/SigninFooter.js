import React, { useState, useEffect } from "react";
import ToastMessage from "../components/Toast/Toast";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Modal,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import helpers from "../constants/Helpers";
import { Colors } from "../screens/style/Theme";
import * as BankingIcons from "./BankingIcons";
const SigninFooter = ({ navigation }) => {
  let iconSize = 30;
  const makeCall = () => {
    if (modalText === "Contact Details") {
      let phoneNumber = "";
      if (Platform.OS === "android") {
        phoneNumber = "tel:${" + companyDetails.Phone + "}";
      } else {
        phoneNumber = "telprompt:${" + companyDetails.Phone + "}";
      }
      Linking.openURL(phoneNumber);
    }
  };

  const [companyDetails, setCompanyDetails] = useState([]);
  useEffect(() => {
    getCompanyDetails();
  }, []);
  const getCompanyDetails = async () => {
    var response = await helpers.GetCompanyDetails();
    if (response != undefined) {
      if (response.Code == 200) {
        setCompanyDetails(response.Data);
      } else {
        ToastMessage.Short("Error Loading Company Details");
      }
    } else {
      ToastMessage.Short("Error Loading Company Details ");
    }
  };

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const showModal = (text) => {
    setModalText(text);
    toggleModal();
  };
  const details = () => {
    if (modalText === "Company Address") {
      return (
        // companyDetails &&
        // companyDetails.Address1 + ", " + companyDetails.City
        "Banepa"
      );
    } else {
      // return companyDetails && companyDetails.Phone
      return "011660887";
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => toggleModal()}
      >
        <TouchableOpacity
          style={styles.modalView}
          activeOpacity
          onPress={() => toggleModal()}
        >
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <Text style={styles.modalHeading}>{modalText} </Text>
            </View>
            <TouchableOpacity
              style={styles.modalBody}
              onPress={() => makeCall()}
            >
              <Text style={styles.modalBodyText}>{details()}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity
          style={styles.buttonContainer}
          onPress={() => showModal("Company Address")}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.anIconContainer}>
              <BankingIcons.checkInIcon fill="white" />
            </View>
            <Text style={styles.footerText}>Location</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Exchange Rates")}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.anIconContainer}>
              <BankingIcons.investInGoldIcon fill="white" />
            </View>
            <Text style={styles.footerText}>Exchange Rate</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            showModal("Contact Details");
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.anIconContainer}>
              <BankingIcons.callIcon fill="white" />
            </View>
            <Text style={styles.footerText}>Call Us</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            navigation.navigate("FAQ");
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.anIconContainer}>
              <BankingIcons.queryIcon fill="white" />
            </View>
            <Text style={styles.footerText}>Help</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SigninFooter;

const styles = StyleSheet.create({
  footer: {
    borderTopColor: "#e2e2e2",
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 5,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  buttonContainer: {
    flex: 1,
  },
  icon: {
    height: 30,
    width: 30,
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .65)",
  },
  modal: {
    margin: 20,
    width: Dimensions.get("screen").width - 80,
    minHeight: 100,
    backgroundColor: "white",
  },
  modalHead: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: 50,
  },
  modalHeading: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  modalBodyText: {
    fontSize: 15,
    marginTop: 5,
  },
  iconStyle: {
    color: Colors.primary,
  },
  anIconContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Regular",
    color: "white",
  },
});
