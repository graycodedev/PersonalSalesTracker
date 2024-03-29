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
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import ImagePicker from 'react-native-image-picker';
import { ButtonPrimary } from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../style/Theme";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import qs from "qs"



const AddNote = (props) => {
    const update = props.route.params?.update;
    const notes = props.route.params?.note;
    const [title, setTitle] = useState(notes?.NoteTitle);
    const [note, setNote] = useState(notes?.Note);
    const [isLoading, setIsLoading] = useState(false);

    const goToNotesList = () => {
        props.navigation.goBack();
    }


    const saveNote = async () => {
        let strData = qs.stringify({
            Id: update ? notes.Id : 0,
            NoteTitle: title,
            Note: note,
            IsActive: true,
            CompanyId: 1
        })
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Notes.Save, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error Occurred Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                goToNotesList();
                return response.data.Data;

            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error Occurred Contact Support");
        }
        setIsLoading(false);

    }

    const isFormFilled = title && note;

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
                        key="title"
                        placeholder="Title"
                        onChangeText={(text) => {
                            setTitle(text)
                        }}
                        value={title}
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
                        multiline={true}
                        numberOfLines={15}
                        style={{ alignItems: 'flex-start', borderWidth: 0, height: 150 }}
                    />
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (isFormFilled) {
                                saveNote();
                            }
                        }}
                        disabled={!isFormFilled}
                    >
                        <ButtonPrimary title={update ? "Update" : "Save"} />
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

export default AddNote;

