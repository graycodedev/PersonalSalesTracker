import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl, Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";
import IMAGES from "../../../constants/newImages";
import WarningModal from "../../../components/WarningModal";
import qs from "qs"; 
import CustomModal from "../../../components/CustomModal";
import ResizableModal from "../../../components/ResizeableModal";
import Circle from "../../../components/shapes/Circle";


const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const Tasks = ({ navigation }) => {
    let thisTasks=[{
        Title: "Go to hospital", 
        DueDate: new Date(),
        Description: " I want to go to hospital for self checkup"
    }
    , {
        Title: "Go to Home", 
        DueDate: new Date(),
        Description: " I want to go to home"
    }
    , {
        Title: "Meet Binit Lamichhane", 
        DueDate: new Date(),
        Description: "Have to make a business deal with him"
    }
]
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showWarningModal, setShowWarningModal]= useState(false);
  const [selectedTask, setSelectedTask]= useState(); 
  const [modalVisible, setModalVisible]= useState();
  const [taskDetail, setTaskDetail]= useState();


  const Task = ({item}) => {
    const [isChecked, setIsChecked] = useState(item.IsActive);
  
    const toggleSelection = () => {
      setIsSelected(!isSelected);
    };
  
    return (
        <TouchableOpacity style={styles.noteContainer} onPress={async()=>{
          
            setSelectedTask(item);

            navigation.navigate("Task", { item });
            // await  getTaskDetail(item.Id)

            // setModalVisible(true);
        }}>
       
    <View style={{flexDirection:"row"}}>
    <TouchableOpacity
      value={item.IsCompleted}
      onPress={() => {
        setSelectedTask(item);
        
        setShowWarningModal(true);
        // item.IsCompleted
        //   ?setIsChecked(false)
        //   : setIsChecked(true)
      }}
    >
      <View style={styles.rememberUnCheck}></View>
      {item?.IsCompleted && (
        <View
          style={[
            styles.rememberChecked,
            { backgroundColor: Colors.primary },
          ]}
        >
          <Image
            source={IMAGES.VectortickMark}
            style={{ tintColor: "white" }}
          />
        </View>
      )}
    </TouchableOpacity>
        <Text style={styles.noteHead}>{item.Title}</Text>
    </View>
    <View style={styles.noteView}>
      <Text style={styles.noteText}>{item.Description}</Text>
    </View>
    <View style={{flexDirection:
  "row"}}>

      <BankingIcons.calendar fill={Colors.primary} height={20} width={20} style={{marginRight: 6}}/>
      <View style={{flexDirection:
  "row", justifyContent:"space-between", flex:0.7}}>
          <DateDisplay date={item?.EndDate} />
      </View>
  </View>
  </TouchableOpacity>
    );
  };
  

  const onRefresh = () => {
    wait(2000).then(() => {
      setRefreshing(false);
      getList();
    }
    );
  };

  const handleReadMore = (note) => {
    navigation.navigate("NoteInfo", { note });
  };
  useEffect(() => {
    getList();
  }, [])

  const getList = async () => {
    try {
      var response = await (await request())
        .get(Api.Task.List)
        .catch(function (error) {
          setIsLoading(false)
          ToastMessage.Short("Error! Contact Support");
        });

      if (response != undefined) {
        if (response.data.Code == 200) {
          console.log(response.data.Data[0])
          setTasks(response.data.Data);
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error Loading Tasks");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const completeTask = async () => {
    try {
      let url=!selectedTask?.IsCompleted? Api.Task.Complete:Api.Task.Uncomplete;
      var response = await (await request())
        .post(url, qs.stringify({id: selectedTask.Id}))
        .catch(function (error) {
          setIsLoading(false)
          ToastMessage.Short("Error! Contact Support");
        });

      if (response != undefined) {
        if (response.data.Code == 200) {
            setShowWarningModal(false)
          getList();
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error Loading Tasks");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskDetail = async (id) => {
    try {
      var response = await (await request())
        .get(Api.Task.Detail+"?id="+id)
        .catch(function (error) {
          setIsLoading(false)
          ToastMessage.Short("Error! Contact Support");
        });
      if (response != undefined) {
        if (response.data.Code == 200) {
            // console.log("Taks", response.data.Data)
            setTaskDetail(response.data.Data);
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error Loading Tasks");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getList();
      return () => {
        // Cleanup function (optional)
        // Additional cleanup logic (if needed)
      };
    }, [])
  );

  return (
    <>
      {!isLoading ? <View style={{ height: "100%" }}>
        {tasks.length > 0 ? (
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.container}>
              {tasks.map((item, index) =>{
                // coinst [isChecked, setIsChecked]= useState(false)
                return(
                <Task item={item} key={index}/>
              )})}
            </View>
            {showWarningModal && selectedTask &&  (
            <WarningModal
              text1={!selectedTask?.IsCompleted?"Complete the task?":"Uncomplete the task?"}
              text2={!selectedTask?.IsCompleted?"Are you sure you want to mark this task as Completed?":"Are you sure you want to mark this task as Uncompleted?"}
              onConfirm={completeTask}
              onCancel={() => {
                setShowWarningModal(false)
              }}
              warning
            />
          )}
           {/* {modalVisible &&
        <CustomModal
          visible={modalVisible}
          closeModal={() => setModalVisible(false)}
          containerStyle={{top: 400, backgroundColor:"white"}}
        >
                        
                                        <TouchableOpacity style={{ width:"100%",  zIndex: 99, top:200, height: "100%" }} onPress={()=>{
                                            setModalVisible(false)
                                        }}>
                                            <Text>{taskDetail?.Title}</Text>
                                        </TouchableOpacity>
                                        </CustomModal>
           } */}

{modalVisible && <ResizableModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
                                            <SubTask task={taskDetail}/>
        </ResizableModal>}
          </ScrollView>
        ) : (
          <View style={styles.noDataContainer}>
            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
            <Text style={[styles.noDataText, { fontSize: 20 }]}>No tasks available</Text>
          </View>
        )}
          <TouchableOpacity
            style={styles.circle}
            onPress={() => {
              navigation.navigate('AddTask');
            }}
          >
            <BankingIcons.plus fill="white" />
          </TouchableOpacity>
      </View> :

        <View style={styles.spinnercontainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>}
    </>
  );
};

const SubTask=({task})=>{
 // task={"AssignedUserId": 45723, "Description": "Holiday Trip to Chhaimale Resort", "EndDate": "2024-03-15T00:00:00", "Id": 4, 
 //"IsActive": true, "IsCompleted": true, "ParentId": 0, "Priority": "A", "StartDate": "2024-03-15T00:00:00", "Tags": "T1", "Title": "Holiday Trip Point"}

 
 return(
  <View style={{padding: 10}}>
    <View style={{flexDirection:"row", alignItems:"center"}}>
    <Circle backgroundColor={"white"} radius={10} containerStyle={{alignItems:"center", justifyContent:"center",borderColor: "gray", borderWidth: 1}} />
    <Text style={[styles.noteHead, {marginLeft: 12}]}>{task?.Title}</Text>
    </View>
    <View style={{flexDirection:"row", alignItems:"center", marginTop: 8}}>
   <BankingIcons.Menu fill={"gray"} height={20} width={20} />
    <Text style={[styles.noteText,{marginLeft: 12}]}>{task?.Description}</Text>
    </View>
    <View style={{flexDirection:"row", alignItems:"center", marginTop: 8}}>
    <BankingIcons.calendar fill={Colors.primary} height={20} width={20} style={{marginRight: 6}}/>
    <Text style={{marginLeft: 12}}>{task?.Title}</Text>
    </View>
   

  </View>
 )

}

const SubTaskStyle=StyleSheet.create({
  row:{
    flexDirection:"row"
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    alignContent: "center",
    justifyContent: "flex-start",
  },
  noteContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  noteHead: {
    fontSize: 16,
    fontWeight: '700',
  },
  noteView: {
    marginVertical: 2
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  circle: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  spinnercontainer: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 20,
  },
  rememberUnCheck: {
    marginRight: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 0.5,
  },
  rememberChecked: {
    marginRight: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 0.5,
    position: "absolute",
  },
});

export default Tasks;
