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
import { Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ButtonPrimary } from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import * as BankingIcons from "../../../components/BankingIcons";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import { SearchableList } from "../../../components/SearchableList";
import { AutoCompleteList } from "../../../components/AutoCompleteList";
import Api from "../../../constants/Api";
import qs from "qs";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";


const AddCollection = (props) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("");
    const [note, setNote] = useState("");


    const [showPartiesList, setShowPartiesList] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedParty, setSelectedParty] = useState();

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    };

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    useEffect(() => {

    }, [selectedDate]);

    useEffect(() => {
        props.navigation.setOptions({
            title: "Save Collection",
        });
    }, []);


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.uri);
        }
    };

    const updateSelectedParty = (item) => {
        setSelectedParty(item);
        setShowPartiesList(false);
    }


    const onClose = () => {
        setShowPartiesList(false);
    }

    const saveCollection = async () => {
        console.log('Selected Image:', selectedImage);
        console.log('Selected Party:', selectedParty);

        let strData = qs.stringify({
            Id: 0,
            PartyId: selectedParty.Id,  // Make sure PartyId is present
            PaymentDate: formattedDate,
            PaymentMode: mode,
            Remarks: note,
            Amount: amount,
        });

        console.log('Data being sent to API:', strData);


        setIsLoading(true);
        var response = await (await request())
            .post(Api.Collections.Save, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error Occurred Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                props.navigation.goBack();
                return response.data.Data;

            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error Occurred Contact Support");
        }
        setIsLoading(false);

    }
    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={PageStyle.container}>

                <View style={{ marginBottom: 15, zIndex: 99 }}>
                    <TouchableOpacity onPress={() => setShowPartiesList(true)} style={{ paddingLeft: 10, paddingVertical: 14, backgroundColor: "white", borderRadius: 5 }}>

                        <Text style={{ fontFamily: "Regular", fontSize: 14 }}>  {!selectedParty ? "Add Party" : selectedParty.PartyName}</Text>

                    </TouchableOpacity>


                    {showPartiesList && (
                        <AutoCompleteList
                            autocompleteurl={Api.Parties.List}
                            noItemFoundText={"No parties found!"}
                            searchablePlaceholder="Search Party"
                            itemSelected={updateSelectedParty}
                            visible={showPartiesList}
                            onClose={() => onClose()}
                            renderItem={(item) => (
                                <View style={styles.item}>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>{item.PartyName}</Text>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>{item.ContactPersonName}</Text>
                                    <Text style={{ fontFamily: "Regular", fontSize: 14 }}>{item.Email}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>

                <View>
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>Recieved Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <RegularInputText
                            key="date"
                            placeholder="Received Date"
                            value={formattedDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                </View>

                <View style={{marginBottom: 12}}>
                    <DropDownPicker
                        containerStyle={{ height: 50 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            fontFamily: "Regular",
                            borderColor: "#fff",
                            borderWidth: 0,
                        }}
                        itemStyle={{
                            justifyContent: "flex-start",
                            fontFamily: "Medium",
                            color: "red",
                        }}
                        labelStyle={{
                            fontFamily: "Medium",
                            color: "#9A9A9A",
                        }}
                        arrowColor={"#9A9A9A"}
                        placeholder="Payment Mode"
                        label="Select Payment Mode"
                        items={[
                            { label: 'Cash', value: 'C' },
                            { label: 'Cheque', value: 'B' },
                            { label: 'Bank Transfer', value: 'T' },
                        ]}
                        defaultValue={mode}
                        onChangeItem={(item) => setMode(item.value)}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="amount"
                        placeholder="Amount"
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount}
                        keyboardType="numeric"
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
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", marginBottom: 20 }}>Select Image (Optional)</Text>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
                        <View style={styles.ImagePicker}>
                            {selectedImage ? (
                                <Image style={styles.image} source={{ uri: selectedImage }} />
                            ) : (
                                <Image style={styles.defaultImage} source={require('../../../assets/newImg/plus.png')} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            saveCollection()
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
        </ScrollView >
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
    ImagePicker: {
        height: 150,
        width: 150,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#9A9A9A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    defaultImage: {
        width: '50%',
        height: '50%',
        resizeMode: 'cover',
        opacity: 0.1
    },
    item: {
        padding: 8,
        borderBottomColor: "#e2e2e2",
        borderBottomWidth: 1,
        marginBottom: 5,
        backgroundColor: "#fff",
        paddingLeft: 18
    },
});

export default AddCollection;

