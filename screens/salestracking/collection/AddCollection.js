import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    Modal, ImageBackground
} from "react-native";
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
import * as SVG from "../../../components/BankingIcons"
import { Camera } from "expo-camera";
import { Colors } from "../../style/Theme";
import { ApiRequestWithImage } from "../../../components/ApiRequest";


const AddCollection = (props) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("");
    const [note, setNote] = useState("");
      const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState(false);


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
        

        let strData = {
            Id: 0,
            PartyId: selectedParty.Id,  // Make sure PartyId is present
            PaymentDate: formattedDate,
            PaymentMode: mode,
            Remarks: note,
            Amount: amount, 
        };

        let imageData={
            ImageFile: photo.uri
        }
        


        setIsLoading(true);

        var response= await ApiRequestWithImage(Api.Collections.Save,strData,imageData)
        
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

    const handlePhotoUpload = async () => {
    setIsCameraReady(true);
    if (!cameraRef.current) {
      return;
    }
  };

  const takePhoto = async () => {
    const options = { quality: 1, base64: true };
    var photo = await cameraRef.current.takePictureAsync(options);
    setPhoto(photo);
    setIsCameraReady(false);
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

                {!photo ?  <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "Medium", marginBottom: 20 }}>
            Collection Image
          </Text>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={handlePhotoUpload}
          >
            <View style={styles.ImagePicker}>
             <SVG.Camera  fill={Colors.primary}  height={60} width={60} />
            </View>
          </TouchableOpacity>
        </View>:
          <View
                  style={{
                    height: 300,
                    width: "100%",
                     marginTop: 20
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: photo.uri,
                    }}
                  
                    resizeMode="cover"
                    style={{
                      backgroundColor: "yellow",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={handlePhotoUpload}
                      style={{ alignItems: "center" }}
                    >
                      <SVG.Camera
                        height={50}
                        width={50}
                        fill={Colors.primary}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
        }

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
             {isCameraReady && (
        <Modal
        animationType="slide"
        transparent={true}
        visible={isCameraReady}
        style={{flex: 1}}
        >
                <Camera
                  ref={cameraRef}
                  isCameraReady={isCameraReady}
                  focusMode="continuous"
                  style={{ flex: 1,zIndex: 999, justifyContent:"flex-end", alignItems:"center"}}
                  ratio="16:9"
                >
                  {/* <Text> HI</Text> */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => takePhoto()}
                    ></TouchableOpacity>
                  </View>
                </Camera>
                </Modal>
              )}
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
    button: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: "white",
      },
});

export default AddCollection;

