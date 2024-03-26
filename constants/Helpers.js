import { Platform } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import api from "../constants/Api";
import DeviceStorage from "../config/DeviceStorage";
import request from "../config/RequestManager";
import axios from "axios";
import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
import ToastMessage from "../components/Toast/Toast";
import qs from "qs";
import React, { useState } from "react";
import AppConfig from "../config/AppConfig";
import * as Location from 'expo-location';

const helpers = {
  GetUserInfo: async function GetUserInfo() {
    var userInfo = await DeviceStorage.getKey("UserInfo");
    if (userInfo != null) {
      return JSON.parse(userInfo);
    } else {
    }
  },
  GetUserId: async function GetUserId() {
   let user= await this.GetUserInfo(); 
   return user.Id;
   
  },
  GetCompanyId: async function GetCompanyId() {
    let user= await this.GetUserInfo(); 
    return user.CompanyId;
    
   },
  uploadFileToServer: async function uploadFileToServer(photo) {
    const data = new FormData();

    data.append("file", {
      name: "profile",
      type: "jpg",
      uri:
        Platform.OS === "android"
          ? photo.uri
          : photo.uri.replace("file://", ""),
    });

    await (await request())
      .post(api.UpdloadProfilePic, data)
      .then((res) => {})
      .catch((err) => {});
  },
 
  GetCompaniesDetails: async function GetCompaniesDetails() {
    var response = await (await request())
      .get(api.GetCompaniesDetails)
      .catch(function(error) {});
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data != null) {
          return response.data.Data;
        } else {
          ToastMessage.Short("Error Loading Cooperatives");
        }
      } else {
        ToastMessage.Short("Error Loading Cooperatives");
      }
    } else {
      ToastMessage.Short("Error! Contact Support");
    }
  },
  GetCompanyLogoPath: async function getCompanyLogoPath() {
    return await DeviceStorage.getKey("LogoPath");
  },
  GetCompanyLogoPathHeader: async function GetCompanyLogoPathHeader() {
    return await DeviceStorage.getKey("LogoHeaderPath");
  },
  // DownloadFile: async function DownloadFile(fileUrl) {
  //   let downloadProg = 0;
  //   let document = null;
  //   const callback = (downloadProgress) => {
  //     const progress =
  //       downloadProgress.totalBytesWritten /
  //       downloadProgress.totalBytesExpectedToWrite;
  //     downloadProg = progress * 100;
  //   };
  //   const filename = fileUrl.split("/").slice(-1)[0];
  //   const downloadResumable = FileSystem.createDownloadResumable(
  //     api.BaseUrl + fileUrl,
  //     FileSystem.documentDirectory + filename,
  //     {},
  //     callback(downloadProg)
  //   );

  //   try {
  //     const { uri } = await downloadResumable.downloadAsync();
  //     document = uri;
  //   } catch (e) {
  //   }
  //   if (!(await Sharing.isAvailableAsync())) {
  //     alert(`Uh oh, sharing isn't available on your platform`);
  //     return;
  //   }
  //   Sharing.shareAsync(document);
  // },
  GetFileUrlById: async function GetFileUrlById(id) {
    var url = api.GetFileUrlById + "?id=" + id;
    var response = await (await request()).get(url).catch(function(error) {
      ToastMessage.Short("Error Occurred Contact Support");
    });
    if (response != undefined) {
      if (response.data.Code == 200) {
        return response.data.Data;
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error Loading Pdf Url");
    }
  },
  GetCompanyCode: async function GetCompanyCode() {
    let CompanyDetail = await this.GetCompanyInfoIOS();
    let companyCode = api.IsAppForMultiple
      ? CompanyDetail.CompanyCode
      : api.CompanyCode;
    return companyCode;
  },
  GetPaymentMethods: async function getPaymentMethods() {
    var response = await (await request())
      .get(api.LoadAccountFromBank.GetPaymentGateways)
      .catch(function(error) {
        ToastMessage.Short("Error Occurred Contact Support");
      });
    if (response != undefined || response?.data != undefined) {
      if (response.data.Code == 200) {
        let pgs = response.data.Data;
        let modes = [];
        let id = 0;
        if (pgs.length > 0) {
          pgs.forEach((obj) => {
            methods = obj.PaymentModes.split(",");
            methods.forEach((method) => {
              let met = {
                Id: id,
                Name: method,
                ServiceProvider: obj.PaymentGatewayName.toLowerCase(),
                IconPath:
                  api.BaseUrl.slice(0, -1) +
                  obj.Image +
                  method.replace(" ", "") +
                  ".png",
              };
              modes.push(met);
              id = id + 1;
            });
          });
        }
        return modes;
      } else {
        ToastMessage.Short("Error Loading Payment Gateways !");
      }
    } else {
      ToastMessage.Short("Error Loading Payment Gateways !!");
    }
  },
  GetCheckInStatus: async function  GetCheckInStatus(){
    let isCheckedIn= false;
    let date = new Date();
    let nowDate = date.toISOString().split('T')[0];

    let checkInInfo= await DeviceStorage.getKey("checkInInfo");
    if(checkInInfo){
      let lastCheckedInDate= JSON.parse(checkInInfo); 
      if(nowDate == lastCheckedInDate.AttendanceDate){
        isCheckedIn= true;
      }
    }
    return isCheckedIn; 
  }, 
  PostException: async function PostException(message) {
    var response = await (await request())
      .get(api.PostException +"?message="+message)
      .catch(function(error) {});
  }, 
  GetLocation: async function GetLocation(){
    try{
    let location=  await Location.getCurrentPositionAsync();
    if(location!=null){
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
    }}
    catch(error){
      ToastMessage.Long("Unable to give location"+error);
      this.PostException(error);
    }
  }
};

export default helpers;
