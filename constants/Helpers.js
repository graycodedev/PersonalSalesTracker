import { Platform } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import api from "../constants/Api";
import DeviceStorage from "../config/DeviceStorage";
import request from "../config/RequestManager";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ToastMessage from "../components/Toast/Toast";
import qs from "qs";
import React, { useState } from "react";
import AppConfig from "../config/AppConfig";

const helpers = {
  GetUserInfo: async function GetUserInfo() {
    var userInfo = await DeviceStorage.getKey("UserInfo");
    if (userInfo != null) {
      return JSON.parse(userInfo);
    } else {
    }
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
  //use this to show accounts in drop down list
  GetBankAccoutList: async function GetBankAccoutListArray() {
    var arr = [];
    var userAccounts = await DeviceStorage.getKey("UserAccountsInfo");
    if (userAccounts != null) {
      var acc = JSON.parse(userAccounts);
      if (acc != null) {
        if (acc.length > 0) {
          for (let a of acc) {
            if (
              a.AccType.toLowerCase() == "saving" &&
              (a.IsAllowMobileBankingTransaction == undefined ||
                a.IsAllowMobileBankingTransaction == true ||
                a.IsAllowMobileBankingTransaction == "True")
            ) {
              const obj = { label: "Account - " + a.AccNum, value: a.AccNum };
              arr.push(obj);
            }
          }
        }
      }
    }
    return arr;
  },
  GetCreditableBankAccoutList: async function GetCreditableBankAccoutList() {
    var arr = [];
    var userAccounts = await DeviceStorage.getKey("UserAccountsInfo");
    if (userAccounts != null) {
      var acc = JSON.parse(userAccounts);
      if (acc != null) {
        if (acc.length > 0) {
          for (let a of acc) {
            if (a.AccType.toLowerCase() == "saving") {
              const obj = { label: "Account - " + a.AccNum, value: a.AccNum };
              arr.push(obj);
            }
          }
        }
      }
    }
    return arr;
  },
  CheckAmount: async function CheckAmount({
    accountNumber,
    amount,
    isCheckCompanyBalance = false,
    isCheckUtilityBalance = true, // assign false if banktransfer balance is required
  }) {
    var message = "";
    var accounts = await this.GetBankAccountWithBal();
    var accountBalance;
    // var hasEnoughBalance;
    accounts.map((account) => {
      if (account.AccNum === accountNumber) {
        accountBalance = account.AvlBalance
          ? account.AvlBalance
          : account.Balance;
      }
    });

    if (parseFloat(accountBalance) < parseFloat(amount)) {
      message = "Insufficient Balance!";
    } else {
      if (isCheckCompanyBalance == true) {
        var enoughCompanyBalance = await this.CheckCooperativeBalance(
          amount,
          isCheckUtilityBalance
        );
        if (enoughCompanyBalance == false) {
          message = "Insufficient Cooperative Balance!";
        }
      }
    }
    return message;
  },
  CheckCooperativeBalance: async function CheckCooperativeBalance(
    amount,
    isCheckUtilityBalance
  ) {
    var balance = await this.GetCooperativeBalance();
    if (isCheckUtilityBalance) {
      if (parseFloat(balance.Balance) >= parseFloat(amount)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (parseFloat(balance.BankTransferBalance) >= parseFloat(amount)) {
        return true;
      } else {
        return false;
      }
    }
  },
  // array of accounts is returned (not for dropdown)
  GetSavingAccounts: async function GetSavingAccounts() {
    var arr = [];
    var userAccounts = await DeviceStorage.getKey("UserAccountsInfo");
    if (userAccounts != null) {
      var acc = JSON.parse(userAccounts);
      if (acc != null) {
        if (acc.length > 0) {
          for (let a of acc) {
            if (
              a.AccType.toLowerCase() == "saving" &&
              (a.IsAllowMobileBankingTransaction == undefined ||
                a.IsAllowMobileBankingTransaction == true ||
                a.IsAllowMobileBankingTransaction == "True")
            ) {
              arr.push(a);
            }
          }
        }
      }
    }
    return arr;
  },
  //account list with balance and other general info
  GetBankAccountWithBal: async function GetAccountWithBal() {
    var data = await DeviceStorage.getKey("UserAccountsInfo");
    if (data != null && data != undefined) {
      return JSON.parse(data);
    } else {
      return null;
    }
  },
  GetCooperativeBalance: async function GetCooperativeBalance() {
    var data = await DeviceStorage.getKey("CooperativeBalance");
    if (data != null && data != undefined) {
      return JSON.parse(data);
    } else {
      return null;
    }
  },
  ListAllAccountsWithBal: async function ListAllAccountsWithBal() {
    var data = await DeviceStorage.getKey("UserAccountsInfo");
    if (data != null && data != undefined) {
      return JSON.parse(data);
    } else {
      return null;
    }
  },
  GetCommissionByKey: async function GetCommissionForServie(
    amount,
    serviceKey
  ) {
    let CompanyDetail = await this.GetCompanyInfoIOS();
    let companyId = api.IsAppForMultiple
      ? CompanyDetail.CompanyId
      : api.CompanyId;
    var commissionRateUrl =
      api.UserCommissionRateApi +
      "/" +
      serviceKey +
      "?companyId=" +
      companyId +
      "&amount=" +
      amount;
    var commissionAmount = await (await request()).get(commissionRateUrl);
    return commissionAmount;
  },
  GetCompanyDetails: async function GetCompanyDetails() {
    let CompanyDetail = await this.GetCompanyInfoIOS();
    let companyId = api.IsAppForMultiple
      ? CompanyDetail.CompanyId
      : api.CompanyId;
    // console.log("cmpI", companyId);
    var response = await (await request())
      .get(api.GetCompanyInfo + companyId)
      .catch(function(error) {});
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data != null) {
          if (api.IsAppForMultiple) {
            return response.data;
          }
          await DeviceStorage.saveKey("LogoPath", response.data.Data.LogoPath);
          await DeviceStorage.saveKey(
            "LogoHeaderPath",
            response.data.Data.LogoHeaderPath
          );
        }
      }
    }
    return response.data;
  },
  GetCompanyInfoIOS: async function GetCompanyInfoIOS() {
    // debugger;
    let cmpInfo = {
      CompanyId: -1,
      Name: "Company Name",
      PrimaryColor: "#009D4B",
      AppStoreUrl: null,
      CompanyCode: "Company Code",
    };
    let savedCompanyDetail =
      (await DeviceStorage.getKey("SavedCompanyDetail")) == "true";
    if (!savedCompanyDetail) {
      return cmpInfo;
    }
    var companyInfo = await DeviceStorage.getKey("CompanyDetail");
    if (companyInfo != null) {
      return JSON.parse(companyInfo);
    } else {
    }
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
    // const companiesDetails = [
    //   {
    //     CompanyId: 2,
    //     CompanyCode: "Aabhas",
    //     CompanyName: "Aabhas Cooperative",
    //     WalletName: "Aabhas Saving",
    //     BaseUrl: "https://finmanv4.graycode.com.np/",
    //     AppstoreUrl: "",
    //     PrimaryColor: "blue",
    //   },
    //   {
    //     CompanyId: 5,
    //     CompanyCode: "Aarthik Bikash",
    //     CompanyName: "Aarthik Bikash",
    //     WalletName: "Wallate Name",
    //     BaseUrl: "https://finmanv4.graycode.com.np/",
    //     AppstoreUrl: "",
    //     PrimaryColor: "blue",
    //   },
    // ];
    // return companiesDetails;
  },
  GetCompanyLogoPath: async function getCompanyLogoPath() {
    return await DeviceStorage.getKey("LogoPath");
  },
  GetCompanyLogoPathHeader: async function GetCompanyLogoPathHeader() {
    return await DeviceStorage.getKey("LogoHeaderPath");
  },
  DownloadFile: async function DownloadFile(fileUrl) {
    let downloadProg = 0;
    let document = null;
    const callback = (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      downloadProg = progress * 100;
    };
    const filename = fileUrl.split("/").slice(-1)[0];
    const downloadResumable = FileSystem.createDownloadResumable(
      api.BaseUrl + fileUrl,
      FileSystem.documentDirectory + filename,
      {},
      callback(downloadProg)
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log("Finished downloading to ", uri);
      document = uri;
    } catch (e) {
      console.error(e);
    }
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }
    Sharing.shareAsync(document);
  },
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
  GetTransactionDetailByUniqueId: async function GetTransactionDetailByUniqueId(
    uniqueId
  ) {
    var url = api.TransactionDetailByUniqueId + "?uniqueid=" + uniqueId;
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
      ToastMessage.Short("Error Loading Transaction Detail");
    }
  },
  RemoveFromSaved: async function RemveFromSaved(id) {
    var data = qs.stringify({
      id: id,
    });
    var url = api.UnFavourite + "?id=" + id;
    var response = await (await request())
      .post(url, data)
      .catch(function(error) {
        ToastMessage.Short("Error Occurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        return response.data.Data;
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error Occurred Contact Support");
    }
  },
  GetCompanyId: async function GetCompanyId() {
    let CompanyDetail = await this.GetCompanyInfoIOS();
    // console.log("Frpm api", api.IsAppForMultiple, api.CompanyId);
    let companyId = api.IsAppForMultiple
      ? CompanyDetail.CompanyId
      : api.CompanyId;
    return companyId;
  },
  GetCompanyCode: async function GetCompanyCode() {
    let CompanyDetail = await this.GetCompanyInfoIOS();
    let companyCode = api.IsAppForMultiple
      ? CompanyDetail.CompanyCode
      : api.CompanyCode;
    return companyCode;
  },
  GetPrimaryColor: async function GetPrimaryColor() {
    let CompanyDetail = await this.GetCompanyInfoIOS();
    let primaryColor = api.IsAppForMultiple
      ? CompanyDetail.PrimaryColor
      : AppConfig.ThemeConfig.primaryColor;
    return primaryColor;
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
    console.log("checkIn", checkInInfo)
    if(checkInInfo){
      let lastCheckedInDate= JSON.parse(checkInInfo); 
      if(nowDate == lastCheckedInDate.AttendanceDate){
        isCheckedIn= true;
      }
    }
    return isCheckedIn; 
  }
};

export default helpers;
