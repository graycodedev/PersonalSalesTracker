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
import qs from "qs"; 




const AddTask = (props) => {
    const update = props.route.params?.update;
    const task = props.route.params?.task;
    const [title, setTitle] = useState(task?.Title);
    const [description, setDescription] = useState(task?.Description);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(task?.EndDate ? new Date(task.EndDate) : new Date());
    const [startDate, setStartDate] = useState(task?.StartDate ? new Date(task.StartDate) : new Date());
      const [showDatePicker, setShowDatePicker] = useState(false);
      const [showStartDatePicker,setShowStartDatePicker]= useState(false)


    const goToTasks = () => {
       
        props.navigation.goBack();
    }

    useEffect(()=>{
        props.navigation.setOptions({title: "Add Task"})
    }, [])

     const onChangeDate = (ref,selectDate) => {
    const currentDate = selectDate || selectedDate;
    if(ref== "startdate"){
        setStartDate(currentDate);
        setShowStartDatePicker(false);
    }
    else{
        setSelectedDate(currentDate);
        setShowDatePicker(false);

    }
  };

  const formattedDate = selectedDate.toDateString("en-NP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedStartDate = startDate.toDateString("en-NP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });


    const saveTask = async () => {
        let strData = qs.stringify({
            Id: update ? task.Id : 0,
            Title: title,
            Description: description,
            IsActive: true, 
            Priority: "H", 
            // AssignedUserId: 45723, 
            EndDate: new Date(selectedDate),
            Tags: "T1, T3", 
            StartDate: new Date(startDate)
        })
        console.log(strData)
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Task.Save, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error Occurred Contact Support");
            });

            console.log(response.data)
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                goToTasks();
                return response.data.Data;

            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error Occurred Contact Support");
        }
        setIsLoading(false);

    }

    const isFormFilled = title && description;

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
                        key="description"
                        placeholder="Description"
                        onChangeText={(text) => {
                            setDescription(text)
                        }}
                        value={description}
                        multiline={true}
                        numberOfLines={15}
                        style={{ alignItems: 'flex-start', borderWidth: 0, height: 150 }}
                    />
                </View>
                <View>
          <Text style={{ fontFamily: "Medium", marginBottom: 2 }}>
            Start Date
          </Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <RegularInputText
              key="date"
              placeholder="Due Date"
              value={formattedStartDate}
              editable={false}
            />
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event,Date)=>onChangeDate("startdate", Date)}
            />
          )}
        </View>
                <View>
          <Text style={{ fontFamily: "Medium", marginBottom: 2 }}>
            Due Date
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <RegularInputText
              key="date"
              placeholder="Due Date"
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
              onChange={(event,Date)=>onChangeDate("duedate", Date)}
            />
          )}
        </View>
               

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (isFormFilled) {
                                saveTask();
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

export default AddTask;

