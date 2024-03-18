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
import { DateDisplay } from "../../../components/DateDisplay";



const Request = (props) => {
  const req = props.route.params.request;

  const [requestDetails, setRequestDetails] = useState();
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
      .get(Api.Request.Details + "?id=" + req.Id)
      .catch(function (error) {
        
        ToastMessage.Short("Error! Contact Support");
      });
      console.log("Requestss", response.data)
    if (response != undefined) {
      if (response.data.Code == 200) {
        console.log("Request", response.data.Data)
        setRequestDetails(response.data.Data);
      } else {
        ToastMessage.Short("Error Loading Request Detail");
      }
    } else {
      ToastMessage.Short("Error Loading Request Detail");
    }
  };


//   const deleteRequest= async ()=>{
//     let data= qs.stringify({
//       id: req.Id
//     })
//     var response = await (await request())
//     .post(Api.Request.Delete, data)
//     .catch(function (error) {
      
//       ToastMessage.Short("Error! Contact Support");
//     });
//   if (response != undefined) {
//     if (response.data.Code == 200) {
//       setShowConfirmDelete(false)
//       ToastMessage.Short(response.data.Message);
//       props.navigation.goBack();
//     } else {
//       ToastMessage.Short("Error deleting the request");
//     }
//   } else {
//     ToastMessage.Short("Error deleting the request");
//   }
//   }

  const updateRequest=()=>{
    props.navigation.navigate('AddRequest', {update:true, request:requestDetails});
  }




  return (
    <>
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}>
    
      {!requestDetails ?
        <Spinner
          color={Colors.primary}
          visible={isLoading}
          textContent={"Getting Details"}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        /> :
        <View style={styles.container}>
           <View style={{alignSelf:"flex-end"}}>
            {requestDetails?.IsCancelled?<Text style={{color:"orange"}}>Cancelled</Text>:requestDetails?.ApprovedOrRejected == true?
            <Text style={{color:"green"}}>Approved</Text>:requestDetails?.ApprovedOrRejected == false?<Text style={{color:"red"}}>Rejected</Text>:<Text style={{color:"orange"}}>Requested</Text> }
           </View>
          <Text style={styles.noteHead}>{requestDetails.ItemName}</Text>
          <View style={styles.noteView}>
            <Text style={styles.noteText}>{requestDetails.RequestRemarks}</Text>
          </View>
          <View style={styles.noteView}>
          <Text style={styles.noteText} numberOfLines={4}>Requested On: <DateDisplay date={requestDetails?.RequestedOn} /></Text>
          </View>
        </View>}
    </ScrollView>
        <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle,{marginBottom: 8, backgroundColor:Colors.primary}]}
                    onPress={() => {
                      updateRequest()
                      
                    }}
                >
                    <BankingIcons.Edit fill={"white"} height={25} width={25}/>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={[styles.circle, {backgroundColor:"#FF5F7F"}]}
                    onPress={() => {
                      setShowConfirmDelete(true)
                      
                    }}
                >
                  
                    <BankingIcons.DeleteIcon fill="white" />
                </TouchableOpacity> */}
               
            </View>
            {/* {showConfirmDelete && (
            <WarningModal
              text1={"Delete Request?"}
              text2={"Are you sure you want to delete the request?"}
              onConfirm={deleteRequest}
              onCancel={() => {
                setShowConfirmDelete(false)
              }}
              warning
            />
          )} */}
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
    marginTop: 15,
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

export default Request;
