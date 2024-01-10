import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { RegularInputText } from "../../../components/Input";
import { ButtonPrimary } from "../../../components/Button";
import PageStyle from "../../style/pageStyle";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AutoCompleteList } from "../../../components/AutoCompleteList";
import Api from "../../../constants/Api";


const { width } = Dimensions.get("screen");

const AddVisit = ({ route }) => {

    const [selectedParty, setSelectedParty] = useState();

    useEffect(() => {
        navigation.setOptions({
            title: 'Add Visit',
        });
    }, []);


    const parties = route.params.parties || [];
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('existingParty');
    const [location, setLocation] = useState("");
    const [remark, setRemark] = useState("");

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    };

    const formattedDate = selectedDate.toLocaleDateString("en-UK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const [showPartiesList, setShowPartiesList] = useState(false);
    const updateSelectedParty = (item) => {
        setSelectedParty(item);
        setShowPartiesList(false);
    }


    const onClose = () => {
        setShowPartiesList(false);
    }

    const renderAdditionalComponent = () => {
        if (selectedOption === 'existingParty') {
            return (
                <View style={{ marginBottom: 15, zIndex: 98 }}>
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
            );
        } else if (selectedOption === 'addParty') {
            return (
                <View>
                    <RegularInputText
                        key="title"
                        placeholder="Location"
                        onChangeText={(text) => {
                            setLocation(text)
                        }}
                        value={location}
                    />
                </View>
            );
        }
        return null;
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
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>Existing Party?</Text>
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
                        items={[
                            { label: 'Yes', value: 'existingParty' },
                            { label: 'No', value: 'addParty' },
                        ]}
                        onChangeItem={(item) => setSelectedOption(item.value)}
                        defaultValue={'existingParty'}
                    />
                </View>



                {renderAdditionalComponent()}

                <View>
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>Visited Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <RegularInputText
                            key="date"
                            placeholder="Visited Date"
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
                    <RegularInputText
                        key="remark"
                        placeholder="Remarks:"
                        onChangeText={(text) => {
                            setRemark(text)
                        }}
                        value={remark}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        alignContent: "center",
        justifyContent: "flex-start",
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

export default AddVisit;
