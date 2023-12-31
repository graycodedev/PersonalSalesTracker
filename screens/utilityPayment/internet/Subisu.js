import React from "react";
import { TextInput, TouchableOpacity, KeyboardAvoidingView, View, Text, StyleSheet } from "react-native";
import AppConfig from '../../../config/AppConfig'
import request from "../../../config/RequestManager";
import uuid from "react-native-uuid";
import qs from "qs";
import api from '../../../constants/Api'
export class Subisu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerid: "",
            emptycustomerid: false,
            mobilenumber: "",
            emptymobilenumber: false,
            amount: "",
            emptyamount: false,
        }
    }
    checkifempty = () => {
        if (this.state.customerid == "") {
            this.setState({emptycustomerid: true})
            return true;
        }else {
            this.setState({emptycustomerid: false})
            return false;
        }
        if (this.state.mobilenumber == "") {
            this.setState({emptymobilenumber: true})
            return true;
        }else {
            this.setState({emptymobilenumber: false})
            return false;
        }
        if (this.state.customerid == "") {
            this.setState({emptyamount: true})
            return true;
        } else {
            this.setState({emptyamount: false})
            return false;
        }
    }
    getDetails = async () => {
        // var data = qs.stringify({
        //     Customerid: this.state.customerid,
        // });
        // console.log(data)
        var response = await (await request())
            .get(
                api.Subisu.GetDetails +
                "?customerid=" +
                this.state.customerid +
                "&mobilenumber=" +
                this.state.mobilenumber +
                "&amount=" +
                this.state.amount
            )
            .catch(function (error) {
                console.log("error while sending data")
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                this.props.navigation.navigate("Subisu Detail");
            } else {
                console.log("unsuccessful")
            }
        } else {
            console.log("undefined response")
        }
    }
    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} enabled >
                <View style={styles.container} >
                    <View style={{marginBottom: 15}}>
                    <Text style={styles.bold_text}>Customer ID</Text>
                    <TextInput style={styles.input_field}
                        placeholder='Customer ID...'
                        onChangeText={(text) => { this.setState({ customerid: text }) }}
                    />
                    {
                        this.state.emptycustomerid ?
                            <Text style={styles.requiredmessage}>Customer ID is required !!</Text>
                            :
                            null
                    }
                    </View>
                    <View style={{marginBottom: 15}}>
                    <Text style={styles.bold_text}>Mobile Number</Text>
                    <TextInput style={styles.input_field}
                        placeholder='Phone number...'
                        onChangeText={(text) => { this.setState({ mobilenumber: text }) }}
                    />
                    {
                        this.state.emptymobilenumber ?
                            <Text style={styles.requiredmessage}>Mobile number is required !!</Text>
                            :
                            null
                    }
                    </View>
                    <View style={{marginBottom: 15}}>
                    <Text style={styles.bold_text}>Amount</Text>
                    <TextInput style={styles.input_field}
                        placeholder='Amount...'
                        onChangeText={(text) => { this.setState({ amount: text }) }}
                    />
                    {
                        this.state.emptyamount ?
                            <Text style={styles.requiredmessage}>Amount is required !!</Text>
                            :
                            null
                    }
                    </View>
                    <TouchableOpacity onPress={async () => {
                        if (!this.checkifempty()) {
                            this.getDetails();
                        }
                        else {
                            console.log("empty username")
                        }
                    }} style={styles.proceedbtn}>
                        <Text style={styles.btntext}>Proceed</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    bold_text: {
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 5,
    },
    proceedbtn: {
        width: '90%',
        height: 45,
        borderRadius: 5,
        backgroundColor: AppConfig.ThemeConfig.primaryColor,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    btntext: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    requiredmessage: {
        fontSize: 12,
        fontWeight: '400',
        color: 'red',
    },
    input_field: {
        width: '100%',
        height: 45,
        borderRadius: 5,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    }
})