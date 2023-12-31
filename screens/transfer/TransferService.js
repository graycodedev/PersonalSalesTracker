import api from "../../constants/Api";
import request from "../../config/RequestManager";
import DeviceStorage from "../../config/DeviceStorage";
import helpers from "../../constants/Helpers";
const qs = require("qs");
const endPoints = {
  BankList: api.BaseUrl + "api/v1/banktransfer/bank/all",
  CheckBankAccount: api.BaseUrl + "api/v1/banktransfer/bank/check/account",
  TransferToBank: api.BaseUrl + "api/v1/banktransfer/transfer",
  CheckBankTransferEnabled: api.BaseUrl + "api/v1/banktransfer/status",
  BankTransferServiceCharge: api.BaseUrl + "api/v1/banktransfer/servicecharge",
};
class TransferService {
  CheckBankAccount = async (model) => {
    try {
      let companyId = await helpers.GetCompanyId();
      let companyCode = await helpers.GetCompanyCode();
      model.CompanyId = companyId;
      model.CompanyCode = companyCode;
      var data = qs.stringify({ model });
      var res = await (await request()).post(endPoints.CheckBankAccount, data);
      const response = await res.data;
      return {
        Data: response.Data,
        Message: response.Message,
        Code: response.Code,
        loading: false,
      };
    } catch (error) {
      return {
        Message: error.response.statusText,
        Code: error.response.status,
        Data: null,
        loading: true,
      };
    }
  };
  TransferToBank = async (model) => {
    try {
      let companyId = await helpers.GetCompanyId();
      let companyCode = await helpers.GetCompanyCode();
      model.CompanyId = companyId;
      model.CompanyCode = companyCode;
      var data = qs.stringify({ model });
      var res = await (await request()).post(endPoints.TransferToBank, data);
      const response = await res.data;
      return {
        Data: response.Data,
        Message: response.Message,
        Code: response.Code,
        loading: false,
      };
    } catch (error) {
      return {
        Message: error.response.statusText,
        Code: error.response.status,
        Data: null,
        loading: true,
      };
    }
  };
  GetBankList = async () => {
    try {
      let url = endPoints.BankList;
      var res = await (await request()).get(url);
      const response = await res.data;
      return {
        Data: response.Data,
        Message: response.Message,
        Code: response.Code,
        loading: false,
      };
    } catch (error) {
      return {
        Message: "Server Error",
        Code: 500,
        Data: null,
        loading: true,
      };
    }
  };
  CheckBankTransferEnabled = async () => {
    try {
      let companyId = await helpers.GetCompanyId();
      let url = endPoints.CheckBankTransferEnabled + "?companyId=" + companyId;
      var res = await (await request()).get(url);
      const response = await res.data;
      return {
        Data: response.Data,
        Message: response.Message,
        Code: response.Code,
        loading: false,
      };
    } catch (error) {
      return {
        Message: "Server Error",
        Code: 500,
        Data: null,
        loading: true,
      };
    }
  };
  GetTransferServiceCharge = async (amount) => {
    try {
      let companyId = await helpers.GetCompanyId();
      let url =
        endPoints.BankTransferServiceCharge +
        "?companyId=" +
        companyId +
        "&amount=" +
        amount;
      var res = await (await request()).get(url);
      const response = await res.data;
      return {
        Data: response.Data,
        Message: response.Message,
        Code: response.Code,
        loading: false,
      };
    } catch (error) {
      return {
        Message: "Server Error",
        Code: 500,
        Data: null,
        loading: true,
      };
    }
  };
}

export default new TransferService();
