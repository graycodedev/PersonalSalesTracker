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
import * as ImagePicker from "expo-image-picker";
import { ButtonPrimary } from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import * as BankingIcons from "../../../components/BankingIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../style/Theme";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";

const { width, height } = Dimensions.get("screen");

const AddCollection = ({ route }) => {

    const partyNames = route.params?.partyNames || []

    const [selectedImage, setSelectedImage] = useState(null);


    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("");
    const [note, setNote] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.uri);
        }
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={PageStyle.container}>

                <View style={{ marginBottom: 15, zIndex: 99 }}>
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
                        placeholder="Select Party"
                        label="Select Party"
                        items={partyNames.map((name, index) => ({
                            label: name,
                            value: `option${index + 1}`,
                        }))}
                    />
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

                <View>
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
                            { label: 'Cash', value: 'cash' },
                            { label: 'Credit Card', value: 'creditCard' },
                            { label: 'Bank Transfer', value: 'bankTransfer' },
                        ]}
                        defaultValue={mode}
                        onChangeItem={(item) => setMode(item.value)}
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
    }
});

export default AddCollection;