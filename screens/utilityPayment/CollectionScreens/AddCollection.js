import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import ImagePicker from 'react-native-image-picker';
import { ButtonPrimary } from "../../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../style/Theme";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";

const { width, height } = Dimensions.get("screen");

const AddCollection = () => {
    useEffect(() => {
    }, []);

    const [partyName, setPartyName] = useState("");
    const [amount, setAmount] = useState("");
    const [website, setWebsite] = useState("");
    const [date, setDate] = useState("");
    const [mode, setMode] = useState("");
    const [note, setNote] = useState("");

    const [isLoading, setIsLoading] = useState(false);


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={PageStyle.container}>

                <View>
                    <RegularInputText
                        key="partyName"
                        placeholder="Party Name"
                        onChangeText={(text) => {
                            setPartyName(text)
                        }}
                        value={partyName}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="amount"
                        placeholder="Recieved Amount"
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="date"
                        placeholder="Recieved Date"
                        onChangeText={(text) => {
                            setDate(text)
                        }}
                        value={date}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="mode"
                        placeholder="Paymet Mode"
                        onChangeText={(text) => {
                            setMode(text)
                        }}
                        value={mode}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="note"
                        placeholder="Note"
                        onChangeText={(text) => {
                            setNote(text)
                        }}
                        value={note}
                    />
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsLoading(true);
                        }}
                    >
                        <ButtonPrimary title={"Save"} />
                        <ActivityIndicator
                            animating={isLoading}
                            color="#ffa500"
                            style={styles.activityIndicator}
                        ></ActivityIndicator>
                    </TouchableOpacity>
                </View>


            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        alignContent: "center",
        justifyContent: "flex-start",
    },
});

export default AddCollection;