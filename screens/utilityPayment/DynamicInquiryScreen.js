import React from "react";
import { View, StyleSheet, Dimensions, Keyboard } from "react-native";
import qs from "qs";
import api from "../../constants/Api";
const { width, height } = Dimensions.get("screen");
import { DynamicForm } from "../../components/DynamicForm";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../style/Theme";
export class DynamicInquiryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      form: {},
      dform: [],
      spinner: false,
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.props.route.params.form.Title,
    });
    this.arrangeDynamicForm();
  }
  arrangeDynamicForm = () => {
    let fields = [];
    this.props.route.params.form.Contents.map((c) => {
      fields.push(JSON.parse(c.FormContent));
    });

    this.setState({ dform: fields });
  };
  handleSubmit = async (formValues) => {
    this.setState({ spinner: true });
    Keyboard.dismiss();
    var m2 = this.props.route.params.merchant;
    //serviceId=6&formType=inquiry
    var dyInquiry = api.DynamicInqury;
    // var response = await axios({
    //   method: 'POST',
    //   url: dyInquiry,
    //   data: formValues,
    //   headers: {
    //     'content-type': 'application/json;charset=utf-8'
    //   }

    // }).catch(function (error) {
    //   ToastMessage.Short("Error Ocurred Contact Support");
    // });
    var response = await (await request()).post(dyInquiry, formValues);
    if (response != undefined) {
      this.setState({ spinner: false });
      if (response.data.Code == 200) {
        this.props.navigation.navigate("dynamicpayment", {
          formFields: formValues,
          ...response.data.Data,
          ...formValues,
          merchant: m2,
        });
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      this.setState({ spinner: false });
      ToastMessage.Short("Error Ocurred Contact Support");
      // this.setState({ isLoading: false });
    }
  };
  render() {
    const { dform } = this.state;

    // const fields = [

    //   {
    //     name: "username",
    //     label: "User Name",
    //     type: "text",
    //     placeholder: 'Worldlink UserName...',
    //     required:true,
    //     fieldStyle: {
    //     },
    //     inputProps: {
    //     }
    //   },
    //   {
    //     name: "email",
    //     label: "Email",
    //     type: "email",
    //     placeholder: 'email...',
    //     fieldStyle: {
    //       borderRadius: 10,
    //       height: 50,
    //       borderWidth: 0
    //     },
    //     inputProps: {
    //       autoCorrect: false,
    //       autoCapitalize: "none",
    //       keyboardType: "email-address"
    //     }
    //   },

    //   {
    //     name: "password",
    //     label: "Password",
    //     type: "password",
    //     inputProps: {

    //     }
    //   }

    // ];
    // const validate = ({ firstName, lastName, email, subject, password }) => {
    //   const errors = {};

    //   if (!firstName.value) {
    //     errors.firstName = "First name is required";
    //   }
    //   if (!lastName.value) {
    //     errors.lastName = "Last name is required";
    //   }

    //   if (!email.value) {
    //     errors.email = "Email address is required";
    //   } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    //     errors.email = "Email address is invalid";
    //   }

    //   if (!subject.value) {
    //     errors.subject = "A subject of interest is required.";
    //   }

    //   if (!password.value) {
    //     errors.password = "Password is required";
    //   }

    //   return errors;
    // };
    const validate = (fields) => {
      const arrErrors = fields.map(({ type, value, name, label, required }) => {
        const errors = {};

        switch (type) {
          case "email":
            if (!value) {
              errors[name] = "Email address is required";
            } else if (!/\S+@\S+\.\S+/.test(value)) {
              errors[name] = "Email address is invalid";
            }
            break;

          default:
            break;
        }

        if (required) {
          if (!value) {
            errors[name] = `${label} is required`;
          }
        }

        return errors;
      });
      //7191 0961 16 9
      return arrErrors.reduce((objs, o) => o, {});
    };
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <DynamicForm
          forms={dform}
          validation={validate}
          onSubmitHandler={this.handleSubmit}
        />
      </>
    );
  }
}
const blockStyle = StyleSheet.create({
  rect2: {
    backgroundColor: "#fff",
    width: 180,
    height: 130,
    margin: 5,
    marginRight: 5,
    alignItems: "center",
    borderRadius: 10,
  },
  icon: {
    // color: "rgba(128,128,128,1)",
    fontSize: 0,
    height: 80,
    width: 150,
    marginTop: 10,
  },
  title: {
    fontFamily: "Light",
    color: "rgba(94,108,128,1)",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
});
