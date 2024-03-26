import AppConfig from "../config/AppConfig";
const CompanyId = AppConfig.CompanyConfig.CompanyId;
const CompanyCode = AppConfig.CompanyConfig.CompanyCode;
const CompanyName = AppConfig.CompanyConfig.CompanyName;
const WalletName = AppConfig.CompanyConfig.WalletName;
const SecretKey = AppConfig.CompanyConfig.SecretKey;
const BaseUrl = AppConfig.CompanyConfig.BaseUrl;
const AndroidAppUrl = AppConfig.CompanyConfig.AndroidAppUrl;
const BranchId = AppConfig.CompanyConfig.BranchId;
const IsAppForMultiple = AppConfig.GeneralConfig.IsAppForMultiple;
const Login = BaseUrl + "api/v1/salesuser/login";
const MobileBankingActivation =
  BaseUrl + "api/v1/mobilebankingactivationrequest/register";
const MobileBankingVerification = BaseUrl + "api/v1/otp/verifyotp";
const ResendOtp = BaseUrl + "api/v1/user/otp/resendotp";
const ForgotPassword = BaseUrl + "api/v1/user/forgotpassword";
const ResetPassword = BaseUrl + "api/v1/mobilebanking/user/resetpassword";
const Pages = [(AboutUs = ""), (privacy = "")];
const ChangePassword = BaseUrl + "api/v1/user/changepassword";
const GetNotifications = BaseUrl + "api/v1/notification/ListByUser";
const TermsOfServices = "https://thefinmax.com/salesapp-privacypolicy";
const GetCompanyInfo = BaseUrl + "api/v1/mobilebanking/company/GetCompanyInfo?companyId=";
const GetCompaniesDetails = BaseUrl + "api/v1/mobilebankingsettings/companiesConfigs";
const ListFAQ = BaseUrl + "api/v1/FAQ/list";
const Offers = {
  SignIn: BaseUrl + "api/v1/promotion/all?key=signin&companyId=",
  Home: BaseUrl + "api/v1/promotion/all?key=home&companyId=",
  Modal: BaseUrl + "api/v1/promotion/all?key=signinpopup&companyId=",
};
const QRPayment = {
  FonePayQrVerify: BaseUrl + "api/v1/qr/verify",
  FonePayQrPay: BaseUrl + "api/v1/qr/payment/process",
};
const CompanyDetail= BaseUrl + "api/v1/st_company/info";
const PostException = BaseUrl + "api/v1/exception/log";
const Notes = {
  List: BaseUrl + "api/v1/st_notes/list",
  Details: BaseUrl + "api/v1/st_notes/details",
  Save: BaseUrl + "api/v1/st_notes/save",
  Delete: BaseUrl + "api/v1/st_notes/delete"
}
const Parties = {
  List: BaseUrl + "api/v1/st_parties/list",
  ActiveList: BaseUrl + "api/v1/st_parties/list/active",
  Details: BaseUrl + "api/v1/st_parties/details",
  Save: BaseUrl + "api/v1/st_parties/save",
  SaveByUser: BaseUrl + "api/v1/st_parties/save/byuser",
  Delete: BaseUrl + "api/v1/st_parties/delete"
}
const Visits = {
  List: BaseUrl + "api/v1/st_visits/list",
  ActiveList: BaseUrl + "api/v1/st_visits/list/active",
  ListByUser: BaseUrl + "api/v1/st_visits/list/byuser",
  ListByParty: BaseUrl + "api/v1/st_visits/list/byParty/user",
  Details: BaseUrl + "api/v1/st_visits/details",
  Save: BaseUrl + "api/v1/st_visits/save",
  SaveByUser: BaseUrl + "api/v1/st_visits/save/byuser",
  Delete: BaseUrl + "api/v1/st_visits/delete"
}
const Collections = {
  List: BaseUrl + "api/v1/st_collection/list",
  ListByParty: BaseUrl + "api/v1/st_collection/list/byPartyId/byuserId",
  Details: BaseUrl + "api/v1/st_collection/details",
  Save: BaseUrl + "api/v1/st_collection/save",
  Delete: BaseUrl + "api/v1/st_collection/delete"
}
const Advance = {
  ListByUser: BaseUrl + "api/v1/st_advancerequest/list/byuser",
  ActiveList: BaseUrl + "api/v1/st_advancerequest/list/active",
  List: BaseUrl + "api/v1/st_advancerequest/list",
  Request: BaseUrl + "api/v1/st_advancerequest/request",
  Save: BaseUrl + "api/v1/st_advancerequest/save",
  Details: BaseUrl + "api/v1/st_advancerequest/details",
  Approve: BaseUrl + "api/v1/st_advancerequest/approve",
  Cancel: BaseUrl + "api/v1/st_advancerequest/cancel",
}
const Leave = {
  ListByUser: BaseUrl + "api/v1/st_leave/list/byuser",
  ActiveList: BaseUrl + "api/v1/st_leave/list/active",
  List: BaseUrl + "api/v1/st_leave/list",
  Apply: BaseUrl + "api/v1/st_leave/apply",
  Save: BaseUrl + "api/v1/st_leave/save",
  Details: BaseUrl + "api/v1/st_leave/details",
  Approve: BaseUrl + "api/v1/st_leave/approve",
  Cancel: BaseUrl + "api/v1/st_leave/cancel",
}
const LeaveTypes = {
  List: BaseUrl + "api/v1/st_leavetype/list",
  ActiveList: BaseUrl + "api/v1/st_leavetype/list/active",
  Details: BaseUrl + "api/v1/st_leavetype/details",
  Save: BaseUrl + "api/v1/st_leavetype/save",
  Delete: BaseUrl + "api/v1/st_leavetype/delete"
}
const Products = {
  ListByUser: BaseUrl + "api/v1/st_product/list/byuser",
  ActiveList: BaseUrl + "api/v1/st_product/list/active",
  List: BaseUrl + "api/v1/st_product/list",
  Request: BaseUrl + "api/v1/st_product/request",
  Save: BaseUrl + "api/v1/st_product/save",
  Details: BaseUrl + "api/v1/st_product/details",
  Approve: BaseUrl + "api/v1/st_product/approve",
  Cancel: BaseUrl + "api/v1/st_product/cancel",
}
const Expenses = {
  ListByUser: BaseUrl + "api/v1/st_expenses/list/byuser",
  ActiveList: BaseUrl + "api/v1/st_expenses/list/active",
  List: BaseUrl + "api/v1/st_expenses/list",
  Request: BaseUrl + "api/v1/st_expenses/request",
  Save: BaseUrl + "api/v1/st_expenses/save",
  Details: BaseUrl + "api/v1/st_expenses/details",
  Approve: BaseUrl + "api/v1/st_expenses/approve",
  Cancel: BaseUrl + "api/v1/st_expenses/cancel",
}
const ExpenseTypes = {
  List: BaseUrl + "api/v1/st_expensetype/list",
  ActiveList: BaseUrl + "api/v1/st_expensetype/list/active",
  Details: BaseUrl + "api/v1/st_expensetype/details",
  Save: BaseUrl + "api/v1/st_expensetype/save",
  Delete: BaseUrl + "api/v1/st_expensetype/delete"
}
const Odometers = {
  List: BaseUrl + "api/v1/st_odometer/list",
  Start: BaseUrl + "api/v1/st_odometer/start",
  End: BaseUrl + "api/v1/st_odometer/end",
  Details: BaseUrl + "api/v1/st_odometer/details",
  Save: BaseUrl + "api/v1/st_odometer/save",
}
const Attendances = {
  List: BaseUrl + "api/v1/st_attendance/list",
  MonthlyList: BaseUrl + "api/v1/st_attendance/list/monthly",
  Save: BaseUrl + "api/v1/st_attendance/save",
  Details: BaseUrl + "api/v1/st_attendance/details",
  Approve: BaseUrl + "api/v1/st_attendance/approve",
  CheckIn: BaseUrl + "api/v1/st_attendance/checkin",
  CheckOut: BaseUrl + "api/v1/st_attendance/checkout"
}
const Orders = {
  List: BaseUrl + "api/v1/st_order/list",
  ListByParty: BaseUrl + "api/v1/st_order/list/byParty",
  Cancel: BaseUrl + "api/v1/st_order/cancel",
  Details: BaseUrl + "api/v1/st_order/details",
  Save: BaseUrl + "api/v1/st_order/save/byUser",
  Delete: BaseUrl + "api/v1/st_order/delete"
}
const Returns = {
  ListByUser: BaseUrl + "api/v1/st_orderreturn/list/byUser",
  ListToBeVerified: BaseUrl + "api/v1/st_orderreturn/list/toBeVerified",
  List: BaseUrl + "api/v1/st_orderreturn/list",
  Verified: BaseUrl + "api/v1/st_orderreturn/verified",
  Save: BaseUrl + "api/v1/st_orderreturn/save",
  Details: BaseUrl + "api/v1/st_orderreturn/details",
}
const ReturnReasons = {
  ListByUser: BaseUrl + "api/v1/st_OrderReturnReason/list/active",
  List: BaseUrl + "api/v1/st_OrderReturnReason/list",
  Delete: BaseUrl + "api/v1/st_OrderReturnReason/delete",
  Save: BaseUrl + "api/v1/st_OrderReturnReason/save",
  Details: BaseUrl + "api/v1/st_OrderReturnReason/details",
}

const Reports = {
  Eod: BaseUrl + "api/v1/st_order/eodReport/byUserId", // date
}

const Deliver = {
  DeliveredList: BaseUrl + "api/v1/st_order/list/delivered",
  Save: BaseUrl + "api/v1/st_order/delivered",
}

const Dispatch = {
  DispatchedList: BaseUrl + "api/v1/st_order/list/dispatched"

}

const PaymentDue = {
  List: BaseUrl + "api/v1/st_order/paymentduereport",
  ListByParty: BaseUrl + "api/v1/st_order/paymentduereport/byParty"

}

const VisitPurpose= {
  List: BaseUrl + "api/v1/st_visitpurpose/list/byuser",
  Details: BaseUrl + "api/v1/st_visitpurpose/details"
}

const Vehicles={
  List:BaseUrl +  "api/v1/st_vehicleuser/list/byUser"
}
const Fuel={
  Save: BaseUrl +"api/v1/st_vehiclefuel/save", 
  List: BaseUrl + "api/v1/st_vehiclefuel/list/byUser"
}

const Task={
  Save:BaseUrl + "api/v1/st_tasks/save", 
  List: BaseUrl + "api/v1/st_tasks/list/task/byUser", 
  Complete: BaseUrl + "api/v1/st_tasks/complete", 
  Uncomplete: BaseUrl + "api/v1/st_tasks/incomplete", 
  Detail: BaseUrl +"api/v1/st_tasks/details", 
  Delete: BaseUrl +"api/v1/st_tasks/delete"
}

const Request={
  Save:BaseUrl + "api/v1/st_requisitionform/save", 
  List: BaseUrl + "api/v1/st_requisitionform/list/byUser",  
  Details: BaseUrl +"api/v1/st_requisitionform/details", 
  // Delete: BaseUrl +"api/v1/st_tasks/delete"
}

const BeatPlan={
  Save:BaseUrl + "api/v1/st_tasks/save", 
  List: BaseUrl + "api/v1/st_tasks/list", 
  Complete: BaseUrl + "api/v1/st_tasks/complete", 
  Uncomplete: BaseUrl + "api/v1/st_tasks/incomplete", 
  Detail: BaseUrl +"api/v1/st_tasks/details", 
  Delete: BaseUrl +"api/v1/st_tasks/delete"
}

const Announcement={
  List:BaseUrl + "api/v1/pushNotifications/announcement", 
}

const DayLog={
  List:BaseUrl + "api/v1/st_daylog/list/byUser", 
  Details: BaseUrl + "api/v1/st_daylog/details", 
  Save: BaseUrl+ "api/v1/st_daylog/save"
}

const ApplicationSettingsByKey = BaseUrl + "api/v1/applicationsettings/valuebykey";
const ContactUs = BaseUrl + "api/v1/contactus/save";



export default {
  CompanyId,
  CompanyCode,
  CompanyName,
  WalletName,
  SecretKey,
  BaseUrl,
  AndroidAppUrl,
  TermsOfServices,
  BranchId,
  Login,
  MobileBankingActivation,
  ResendOtp,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  Offers,
  GetCompanyInfo,
  GetCompaniesDetails,
  ListFAQ,
  GetNotifications,
  IsAppForMultiple,
  Notes,
  Parties,
  Visits,
  Collections,
  Advance,
  Leave,
  Products,
  Expenses,
  LeaveTypes,
  ExpenseTypes,
  Odometers,
  Attendances,
  Orders,
  Returns,
  ReturnReasons,
  ApplicationSettingsByKey,
  ContactUs, Reports, Deliver, Dispatch, PaymentDue, PostException, VisitPurpose, Vehicles, Fuel, Task, Request, BeatPlan, Announcement, DayLog, CompanyDetail
};
export const endPoints = {
  GetTemporaryToken: BaseUrl + "connect/token", //TO GENERATE TOKEN
  RefreshToken: BaseUrl + "api/v1/user/refresh/token",
  CheckUserPin: BaseUrl + "api/v1/mobilebanking/user/pin/check",
  ChangeUserPin: BaseUrl + "api/v1/mobilebanking/user/pin/change",
  AddNewPin: BaseUrl + "api/v1/mobilebanking/user/pin/new",
  MatchUserPin: BaseUrl + "api/v1/mobilebanking/user/pin/match",
};
