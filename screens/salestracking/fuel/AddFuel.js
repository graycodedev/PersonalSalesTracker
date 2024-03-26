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


const AddFuel = (props) => {
    const fuelVehicle= props.route.params?.fuelVehicle;
    const [selectedImage, setSelectedImage] = useState(null);
    const [fuelUnit, setFuelUnit] = useState(fuelVehicle?.FuelUnit?.toString());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState(fuelVehicle?.FuelAmount?.toString());
    const [mode, setMode] = useState("");
    const [note, setNote] = useState(fuelVehicle?.Remarks);
    const [odometer, setOdometer]= useState(fuelVehicle?.Odometer?.toString());
    const [showVehiclesList, setshowVehiclesList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVehicle, setselectedVehicle] = useState();
    const [fuelUniterror, setFuelUnitError]= useState("");
    const [amountError, setAmountError]= useState(""); 
    

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
            title: "Add Fuel",
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

    const updateselectedVehicle = (item) => {
        setselectedVehicle(item);
        setshowVehiclesList(false);
    }


    const onClose = () => {
        setshowVehiclesList(false);
    }

    const validateForm=()=>{
        let isValid= true;
        if(!fuelUnit){
            isValid= false;
            setFuelUnitError("Fuel Unit is required!!")
        }
        else{
            setFuelUnitError("")
        }
        if(!amount){
            isValid= false;
            setAmountError("Fuel Unit is required!!")
        }
        else{
            setAmountError("")
        }
        return isValid;

    }
    const saveFuel = async () => {

        let data = {
            Id: fuelVehicle? fuelVehicle.Id:0,
            VehicleId: selectedVehicle?selectedVehicle.VehicleId:fuelVehicle?fuelVehicle.VehicleId:0, 
            FuelUnit: fuelUnit,
            Remarks: note,
            FuelAmount: amount, 
            Odometer: odometer
        };

        if(fuelVehicle?.UserId){
            data.UserId= fuelVehicle.UserId
        }

        if(data.VehicleId == 0){
            ToastMessage.Short("Select the vehicle")
            return
        }




        setIsLoading(true);
        var response = await (await request())
            .post(Api.Fuel.Save, qs.stringify(data))
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
                    <TouchableOpacity onPress={() => setshowVehiclesList(true)} style={{ paddingLeft: 10, paddingVertical: 14, backgroundColor: "white", borderRadius: 5 }}>

                        <Text style={{ fontFamily: "Regular", fontSize: 14 }}>  {!selectedVehicle ? fuelVehicle? fuelVehicle.VehicleName: "Select Vehicle" : selectedVehicle.VehicleName +" - "+  selectedVehicle.PlateNo}</Text>

                    </TouchableOpacity>


                    {showVehiclesList && (
                        <AutoCompleteList
                            autocompleteurl={Api.Vehicles.List}
                            noItemFoundText={"No vehicles found!"}
                            searchablePlaceholder="Search Vehicle"
                            itemSelected={updateselectedVehicle}
                            visible={showVehiclesList}
                            onClose={() => onClose()}
                            renderItem={(item) => (
                                <View style={styles.item}>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>{item.VehicleName}</Text>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>{item.PlateNo}</Text>
                                    <Text style={{ fontFamily: "Regular", fontSize: 14 }}>{item.FuelType =="p"?"Petrol":item.FuelType =="d"?"Diesel":item.FuelType =="e"?"Electric": item.FuelType}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
                <Text style={{fontFamily:"SemiBold", marginBottom: 4}}>Fuel Unit {"(liters)"}</Text>
                <View>
                    <RegularInputText
                        key="fuelUnit"
                        placeholder="fuel unit"
                        onChangeText={(text) => {
                            setFuelUnit(text)
                        }}
                        value={fuelUnit}
                        keyboardType="numeric"
                        error={fuelUniterror}
                    />
                </View>

                <Text style={{fontFamily:"SemiBold", marginBottom: 4}}>Amount {"(Rs.)"}</Text>
                <View>
                    <RegularInputText
                        key="amount"
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount}
                        placeholder="amount"
                        keyboardType="numeric"
                        error={amountError}
                    />
                </View>

                <Text style={{fontFamily:"SemiBold", marginBottom: 4}}>Odometer {"(Kms.)"}</Text>
                <View>
                    <RegularInputText
                        key="odometer"
                        onChangeText={(text) => {
                            setOdometer(text)
                        }}
                        value={odometer}
                        placeholder="odometer"
                        keyboardType="numeric"
                    />
                </View>

                <Text style={{fontFamily:"SemiBold", marginBottom: 4}}>Remarks</Text>
                <View>
                    <RegularInputText
                        key="note"
                        placeholder="Remarks"
                        onChangeText={(text) => {
                            setNote(text)
                        }}
                        value={note}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                </View>

              

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={async() => {
                            if(validateForm()){
                                await saveFuel()
                            }
                           
                        }}
                    >
                        <ButtonPrimary title={fuelVehicle?"Update":"Save"} />
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

export default AddFuel;

