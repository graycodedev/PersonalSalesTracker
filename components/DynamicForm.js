import React from "react";
import PropTypes from "prop-types";
import { Input } from "galio-framework";
import Icon from "./Icon";
import { TextBoxStyle } from "../screens/style/index";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ButtonPrimary } from "./Button";
import request from "../config/RequestManager";
import ToastMessage from "./Toast/Toast";
import Api from "../constants/Api";
import { Colors } from "../screens/style/Theme";
const errorMessages = {
  required: () => "This field is required",
  pattern: () => "Incorrect format",
  minlength: (param) => `Min chars required is ${param.requiredLength}`,
  maxlength: (param) => `Max chars allowed is ${param.requiredLength}`,
};

export const getErrorMsg = (err, errObj) => {
  return errorMessages[err](errObj);
};
const requiredValidator = (value) => {
  return value !== "";
};

const minLengthValidator = (value, minlength) => {
  return !(value.length < minlength);
};

const maxLengthValidator = (value, maxlength) => {
  return !(value.length > maxlength);
};

const patternValidator = (value, regex) => {
  return regex.test(value);
};

const checkValidators = (value, err, errObj) => {
  switch (err) {
    case "required":
      return requiredValidator(value);
    case "minlength":
      return minLengthValidator(value, errObj.requiredLength);
    case "maxlength":
      return maxLengthValidator(value, errObj.requiredLength);
    case "pattern":
      return patternValidator(value, errObj);
  }
};

export const checkErrors = (value, validators) => {
  const errors = Object.keys(validators);
  let errorsOccured = [];
  for (let err of errors) {
    if (!checkValidators(value, err, validators[err])) {
      errorsOccured.push(getErrorMsg(err, validators[err]));
    }
  }
  return errorsOccured;
};
class ShowErrors extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    validations: PropTypes.object,
    display: PropTypes.bool,
  };

  static defaultProps = {
    display: false,
  };

  listOfErrors() {
    const { validations, value } = this.props;
    const errors = checkErrors(value, validations);
    return errors;
  }

  render() {
    // if (!this.props.display) { return null; }
    return (
      <View>
        {this.listOfErrors().map((err) => (
          <Text key={err}>{err}</Text>
        ))}
      </View>
    );
  }
}
export default ShowErrors;

export class DynamicForm extends React.Component {
  constructor(props) {
    super(props);
    //const { forms } = props;
    this.state = { forms: [] };
  }
  formValues = {};
  componentDidMount() {
    this.props.forms.map((element, index) => {
      if (element.type == "hidden") {
        this.setState({ [element.name]: element.value });
      }
    });
  }
  loadDropdownDatas = async (element) => {
    var apiResponse = await (await request()).get(
      Api.BaseUrl + element.apiEndpoint
    );
    // console.log("dropdown", apiResponse)
    if (apiResponse.data != null && apiResponse.data.Code == 200) {
      const { forms } = this.state;
      let indexNo = 0;
      forms.filter((ele, index) => {
        indexNo = index;
        return ele.name == element.name;
      });
      forms[indexNo].options = apiResponse.data.Data;
      forms[indexNo].feteched = true;
      this.setState({ forms });
      // this.setState(prevState => ({
      //   jasper: {                   // object that we want to update
      //     ...prevState.jasper,    // keep all other key-value pairs
      //     name: 'something'       // update the value of specific key
      //   }
      // }))
    } else {
      ToastMessage.Short("Failed to load data");
    }
  };

  handleOnChangeValue = async (key, val) => {
    this.formValues[key] = val;
    // console.log(this.formValues);
  };

  resetForm = () => {};
  renderElement = (element) => {
    const inputStyles = [{ ...element.fieldStyle }, TextBoxStyle.BorderLess];
    const capitalize = [{ ...element.inputProps.autoCapitalize }, "none"];
    // fieldStyle
    let validations = {
      name: {
        required: true,
        // minlength: { requiredLength: 5 }
      },
    };
    if (element.value) this.formValues[element.name] = element.value;
    if (element.type == "dropdown") {
      if (element.fetchapi != undefined && element.fetchapi) {
        //this.setState({ [element.name + "_options"]: [] });
        //api/v1/water/nwsc/listcounters
        if (element.feteched == undefined || element.feteched == false)
          this.loadDropdownDatas(element);
      }
    }
    if (element.type == "hidden") {
      return <View key={element.name} style={{ height: 0 }}></View>;
    } else {
      return (
        <View key={element.name}>
          <Text style={{ fontSize: 16, fontFamily: "Regular" }}>{element.label}</Text>
          {element.type == "dropdown" && (
            <>
              <DropDownPicker
                key={element.name}               
                dropDownMaxHeight={500}
                searchable={true}
                containerStyle={{
                  height: 55,
                }}
                listMode="FLATLIST"
                style={{
                  backgroundColor: "#fff",
                  color: "red",
                  borderRadius: 10,
                  fontFamily: "Regular",
                  borderColor: "#fff",
                  borderWidth: 0,
                  marginTop:5
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                  fontFamily: "Medium",
                }}
                labelStyle={{
                  fontFamily: "Medium",
                  color: "#9A9A9A",
                }}
                arrowColor={"#9A9A9A"}
                items={element.options}
                controller={(instance) => (this.controller = instance)}
                onChangeItem={(item) =>
                  this.handleOnChangeValue(element.name, item.value)
                }
              />
            </>
          )}
          {element.type == "text" && (
            <Input
              key={element.name}
              type={element.type}
              placeholder={element.placeholder}
              placeholderTextColor={Colors.muted}
              secureTextEntry={element.type === "password"}
              keyboardType={
                element.type === "email" ? "email-address" : "default"
              }
              style={inputStyles}
              onChangeText={(val) =>
                this.handleOnChangeValue(element.name, val)
              }
              {...this.props}
            />
          )}

          {/* <ShowErrors  value={this.state[element.name]} validations={ validations}/> */}
        </View>
      );
    }
  };
  validateForm() {
    let isvalid = true;

    return isvalid;
  }
  listOfErrors = () => {
    const { validations, value } = this.props;
    const errors = checkErrors(value, validations);
    return errors;
  };
  render() {
    //console.log("form here", this.props.forms)
    if (this.props.forms.length > 0 && this.props.forms != this.state.forms) {
      this.setState({ forms: this.props.forms });
    }
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{ width: "100%", backgroundColor: "#eee" }}>
        <View style={{ flex: 1, justifyContent: "center", margin: 20}}>
          {this.state.forms.map((element, index) => {
            return this.renderElement(element);
          })}
          <View
            style={{
              flex: 1,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (this.validateForm()) {
                  this.props.onSubmitHandler(this.formValues);
                }
              }}
            >
              <ButtonPrimary title={"Submit"} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
