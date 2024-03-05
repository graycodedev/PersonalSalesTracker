import Api from "../constants/Api";
import qs from "qs";
import ToastMessage from "./Toast/Toast";
import request from "../config/RequestManager";
import TokenManager from "../config/TokenManager";
import DeviceStorage from "../config/DeviceStorage";
import axios from "axios";
import helpers from "../constants/Helpers";
const ApiRequestPost = async (route, data) => {
  let strData = qs.stringify(data);
  // console.log("Request of " + route + "with data " + strData);
  var response = await (await request())
    .post(route, strData)
    .catch(function (error) {
      console.log("error");
      ToastMessage.Short("Error Ocurred Contact Support");
      return false;
    });
  if (response != undefined && response.data != undefined) {
    if (response.data.Code == 200) {
      if (response.data.Data == null || response.data.Data == undefined) {
        return true;
      } else {
        return response.data.Data;
      }
    } else {
      ToastMessage.Short(response.data.Message);
      return false;
    }
  } else {
    ToastMessage.Short("Error Ocurred Contact Support");
    return false;
  }
};
const ApiRequestGet = async (route, data) => {
  let query = "";
  if (data != null || data != undefined) {
    query = createQueryString(data);
  }
  let url = route + query;
  // console.log("url", url);
  var response = await (await request()).get(url).catch(function (error) {
    ToastMessage.Short("Error Ocurred Contact Support");
    return false;
  });
  if (response != undefined && response.data != undefined) {
    if (response.data.Code == 200) {
      return response.data.Data;
    } else {
      ToastMessage.Short(response.data.Message);
      return false;
    }
  } else {
    ToastMessage.Short("Error Ocurred Contact Support");
    return false;
  }
};

const ApiRequestWithImage = async (route, data, imageData) => {
  await TokenManager.restoreNewToken();
  const access_token = await DeviceStorage.getKey("token");

  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  for (const key in imageData) {
    if (imageData.hasOwnProperty(key)) {
      formData.append(key, {
        uri: imageData[key],
        type: "image/png",
        name: "photo",
      });
    }
  }
  var res= await axios.post(route, formData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return await res;
};
const ApiRequestWithImageAndFiles = async (route, data, imageData,files) => {
  try{
    await TokenManager.restoreNewToken();
    const access_token = await DeviceStorage.getKey("token");

    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    for (const key in imageData) {
      if (imageData.hasOwnProperty(key)) {
        formData.append(key, {
          uri: imageData[key],
          type: "image/png",
          name: "photo",
        });
      }
    }
   
        files.forEach((file, index) => {
          console.log("file 1", file); 
          const fle = {
            uri: file.uri,
            type: "application/octet-stream",
            name: file.name,
          };
          formData.append("Files", fle);
        })
     
    var res= await axios.post(route, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return await res;
  }
  catch(error){
    await helpers.PostException("while sending images"+ error); 
    console.log(error)
    ToastMessage.Short(error)
  }
 
 
};

function createQueryString(data) {
  let params = "?";
  let index = 1;
  const length = Object.keys(data).length;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      params += key + "=" + data[key];
    }
    if (index != length) {
      params += "&";
    }
    index++;
  }
  return params;
}

export { ApiRequestGet, ApiRequestPost, ApiRequestWithImage, ApiRequestWithImageAndFiles };
