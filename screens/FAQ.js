import React, { useState, useEffect  } from "react";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { StyleSheet, View, Text,ScrollView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import request from "../config/RequestManager";
import ToastMessage from "../components/Toast/Toast";
import api from "../constants/Api";
import { Colors } from "./style/Theme";

const FAQ = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading]= useState(true);
  useEffect(() => {
    getList();
    setIsLoading(false);
  }, []);

  const getList = async () => {
    var response = await (await request())
      .get(api.ListFAQ)
      .catch(function(error) {

        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setList(response.data.Data);
      } else {
        ToastMessage.Short("Error Loading FAQ");
      }
    } else {
      ToastMessage.Short("Error Loading FAQ");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <Spinner
        color={Colors.primary}
        visible={isLoading}
        textContent={"loading details..."}
        textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
      />
      {list.length> 0 && list.map((item,index) => {
        return (
          <View key={index}>
            <Collapse style={styles.list}>
              <CollapseHeader style={styles.question}>
                <Text style={styles.questionText}>{item.Question}</Text>
              </CollapseHeader>
              <CollapseBody style={styles.answer}>
                <Text style={styles.answerText}>{item.Answer}</Text>
              </CollapseBody>
            </Collapse>
          </View>
        );
      })}
    </ScrollView>
  );
};
export default FAQ;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  list: {
    justifyContent: "center",
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    width: "95%",
    alignSelf: "center",
    marginTop: 5,
  },
  question: {
    width: "100%",
    padding: 8,
  },
  answer: {
    width: "100%",
    padding: 8,
    backgroundColor: "#e5e5e5",
  },
  questionText: {
    fontSize: 18,
    textAlign: "justify",
  },
  answerText: {
    fontSize: 16,
    color: "#000",
    textAlign: "justify",
  },
});
