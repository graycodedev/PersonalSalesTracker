import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs"


import Api from "../../../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";



const Task = (props) => {
  const  task  = props.route.params.item;

  const [taskDetails, setTaskDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete]= useState(false);





 

  useFocusEffect(
    React.useCallback(() => {
      getDetail();
      
      return () => {
        // Cleanup function (optional)
        // Additional cleanup logic (if needed)
      };
    }, [])
  );

  useEffect(() => {
    getDetail();
    setIsLoading(false);
  }, [])


  const getDetail = async () => {
    var response = await (await request())
      .get(Api.Task.Detail + "?id=" + task.Id)
      .catch(function (error) {
        
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        
        setTaskDetails(response.data.Data);
      } else {
        ToastMessage.Short("Error Loading Note Detail");
      }
    } else {
      ToastMessage.Short("Error Loading Note Detail");
    }
  };


  const deleteTask= async ()=>{
    let data= qs.stringify({
      id: task.Id
    })
    var response = await (await request())
    .post(Api.Task.Delete, data)
    .catch(function (error) {
      
      ToastMessage.Short("Error! Contact Support");
    });
  if (response != undefined) {
    if (response.data.Code == 200) {
      setShowConfirmDelete(false)
      ToastMessage.Short(response.data.Message);
      props.navigation.goBack();
    } else {
      ToastMessage.Short("Error deleting the note");
    }
  } else {
    ToastMessage.Short("Error deleting the note");
  }
  }

  const updateTask=()=>{
    props.navigation.navigate('AddTask', {update:true, task:taskDetails});
  }




  return (
    <>
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}>
    
      {!taskDetails ?
        <Spinner
          color={Colors.primary}
          visible={isLoading}
          textContent={"Getting Details"}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        /> :
        <View style={styles.container}>
            {taskDetails.IsCompleted?<Text style={{fontSize: 14, color: "green", alignSelf:"flex-end"}}>Completed</Text>
            :
            <Text style={{fontSize: 14, color: "red", alignSelf:"flex-end"}}>Due Task</Text>}
          <Text style={styles.noteHead}>{taskDetails.Title}</Text>
          <View style={styles.noteView}>
            <Text style={styles.noteText}>{taskDetails.Description}</Text>
          </View>
          <View style={{flexDirection:
  "row", marginTop: 4}}>

      <BankingIcons.calendar fill={Colors.primary} height={20} width={20} style={{marginRight: 6}}/>
      <View style={{flexDirection:
  "row", justifyContent:"space-between", flex:0.7}}>
          <DateDisplay date={taskDetails?.EndDate} />
      </View>
  </View>
        </View>}
    </ScrollView>
        <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle,{marginBottom: 8, backgroundColor:Colors.primary}]}
                    onPress={() => {
                      updateTask()
                      
                    }}
                >
                    <BankingIcons.Edit fill={"white"} height={25} width={25}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.circle, {backgroundColor:"#FF5F7F"}]}
                    onPress={() => {
                      setShowConfirmDelete(true)
                      
                    }}
                >
                  
                    <BankingIcons.DeleteIcon fill="white" />
                </TouchableOpacity>
               
            </View>
            {showConfirmDelete && (
            <WarningModal
              text1={"Delete Task?"}
              text2={"Are you sure you want to delete the task?"}
              onConfirm={deleteTask}
              onCancel={() => {
                setShowConfirmDelete(false)
              }}
              warning
            />
          )}
    </>
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
  noteHead: {
    fontSize: 24,
    fontWeight: "700",
  },
  noteView: {
    marginTop: 8,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  circle: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent:"center",
    alignItems:"center", 
}, 
buttons:{
  position: 'absolute',
  bottom: 20,
  right: 20,
  zIndex: 1,

}
});

export default Task;