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
const ForgotPassword = BaseUrl + "api/v1/mobilebanking/user/forgotpassword";
const ResetPassword = BaseUrl + "api/v1/mobilebanking/user/resetpassword";
const ChequeRequest = [
  BaseUrl + "api/v1/chequerequest/register",
  BaseUrl + "api/v1/chequerequest/gridList",
];
const BalanceTopup = BaseUrl + "api/v1/mobiletopup/khalti";
// const LandlineAdslPayment = BaseUrl + "api/v1/phone/landlineAdsl";

const AdslPayment = BaseUrl + "api/v1/adsl/payment";
const ListInterestRates = BaseUrl + "api/v1/companyinterestrate/list";
const ListMblBankingSettings =
  BaseUrl + "api/v1/mobilebankingsettings/list?companyId=";
// const Nea = {
//   ListCounters: BaseUrl + "api/v1/electricity/nea/counters",
//   CheckCustomer: BaseUrl + "api/v1/electricity/nea/inquiry",
//   MakePayment: BaseUrl + "api/v1/electricity/nea/payment",
// };
const Nea = {
  ListCounters: BaseUrl + "api/v1/khalti/electricity/nea/counters",
  CheckCustomer: BaseUrl + "api/v1/khalti/electricity/nea/details",
  MakePayment: BaseUrl + "api/v1/khalti/electricity/nea/payment",
};
const Bpc = {
  ListCounters: BaseUrl + "api/v1/electricity/bpc/counters",
  CheckCustomer: BaseUrl + "api/v1/electricity/bpc/inquiry",
  MakePayment: BaseUrl + "api/v1/electricity/bpc/payment",
};
const CommmunityKhanepani = {
  ListCounters: BaseUrl + "api/v1/water/community/counters",
  GetDetails: BaseUrl + "api/v1/water/community/customerdetails",
  MakePayment: BaseUrl + "api/v1/water/community/payment",
};
const GetFileUrlById =
  BaseUrl + "api/v1/transactionlog/getPaymentPdfByTransactionId";
const AccountTransfer = BaseUrl + "api/v1/transfer/accounttransfer";
const UploadProfilePic = BaseUrl + "api/v1/user/picture/upload";
const ValidateAccountNo = BaseUrl + "api/v1/banking/validateaccount"; //?userid=1&companyid=1&accountno=HSV00814
const RecentTransaction = BaseUrl + "api/v1/transactionlog/list";
const TransactionDetail = BaseUrl + "api/v1/transactionlog/detail";
const TransactionDetailByUniqueId =
  BaseUrl + "api/v1/transactionlog/detailbyuniqueid";
const Pages = [(AboutUs = ""), (privacy = "")];
const AccountList = BaseUrl + "api/v1/banking/accountlist"; //?code=safdsafs&mobileNo=9851031769
const CooperativeBalance =
  BaseUrl + "api/v1/companybalancesummary/remainingbalance";
const StatementGet = BaseUrl + "api/v1/banking/statement"; //?code=safdsafs&accountno=HSV00027&fromDate=2019-7-17&toDate=2020-8-21";
const GetCategories = BaseUrl + "api/v1/service/category/all";
const GetMerchantsByCategory = BaseUrl + "api/v1/service/utility/all";
const GetDynamicForm = BaseUrl + "api/v1/service/utility/form";
const DynamicInqury = BaseUrl + "api/v1/service/utility/billing/inquiry";
const DynamicPayment = BaseUrl + "api/v1/service/utility/billing/pay";
const ChangePassword = BaseUrl + "api/v1/account/changepassword";
const UserCommissionRateApi = BaseUrl + "api/v1/commisionrate/user/"; //{servicekey}?companyId=1&amount=1
const LoadEsewa = BaseUrl + "api/v1/esewa/wallet/load";
const LoadKhalti = BaseUrl + "api/v1/khalti/wallet/load";
const GetNotifications = BaseUrl + "api/v1/notification/ListByUser";
const TermsOfServices = "https://thefinmax.com/salesapp-privacypolicy";
const CooperatveTermsOfServices =
  "https://graycode.com.np/mobilebanking-coop-policy/cid-";
const GetCompanyInfo = BaseUrl + "api/v1/mobilebanking/company/GetCompanyInfo?companyId=";
const GetCompaniesDetails =
  BaseUrl + "api/v1/mobilebankingsettings/companiesConfigs";
const ListFAQ = BaseUrl + "api/v1/FAQ/list";
const Favourite = {
  TopUp: BaseUrl + "api/v1/favourite?Service=topup",
  BANKTRANSFER: BaseUrl + "api/v1/favourite?Service=banktransfer",
  NEA: BaseUrl + "api/v1/favourite?Service=ELECTRICITY_NEA",
  BPC: BaseUrl + "api/v1/electricity/bpc/favourite",
  Khalti: BaseUrl + "api/v1/khalti/wallet/favourite",
  Esewa: BaseUrl + "api/v1/esewa/wallet/favourite",
  CommmunityKhanepani: BaseUrl + "api/v1/electricity/nea/favourite", //backend ma milaauna baaki
};
const UnFavourite = BaseUrl + "api/v1/unfavourite";

const LoadAccountFromBank = {
  BankingList:
    BaseUrl + "api/v1/paymentgateway/khalti/bankinglist",
  InitiateTransfer: BaseUrl + "api/v1/paymentgateway",
  LookUp: BaseUrl + "api/v1/paymentgateway",
  GetPaymentGateways: BaseUrl + "api/v1/paymentgateway/all"
};
const Offers = {
  SignIn: BaseUrl + "api/v1/promotion/all?key=signin&companyId=",
  Home: BaseUrl + "api/v1/promotion/all?key=home&companyId=",
  Modal: BaseUrl + "api/v1/promotion/all?key=signinpopup&companyId=",
};
const QRPayment = {
  FonePayQrVerify: BaseUrl + "api/v1/qr/verify",
  FonePayQrPay: BaseUrl + "api/v1/qr/payment/process",
};
const Worldlink = {
  GetDetails: BaseUrl + "api/v1/worldlink/details",
  MakePayment: BaseUrl + "api/v1/worldlink/payment",
};
const Vianet = {
  GetDetails: BaseUrl + "api/v1/vianet/details",
  MakePayment: BaseUrl + "api/v1/vianet/payment",
};
const PokharaInternet = {
  MakePayment: BaseUrl + "api/v1/pokharainternet/payment",
};
const Subisu = {
  GetDetails: BaseUrl + "api/v1/subisu/details",
  MakePayment: BaseUrl + "api/v1/subisu/payment",
};
const DishHome = {
  UserLoopUp: BaseUrl + "api/v1/dishhome/userlookup",
  MakePayment: BaseUrl + "api/v1/dishhome/payment",
};
const PrabhuTV = {
  GetDetails: BaseUrl + "api/v1/prabhutv/details",
  MakePayment: BaseUrl + "api/v1/prabhutv/payment",
};
const SkyTV = {
  GetDetails: BaseUrl + "api/v1/skytv/details",
  MakePayment: BaseUrl + "api/v1/skytv/payment",
};
const Reliance = {
  GetDetails: BaseUrl + "api/v1/insurance/reliance/details",
  MakePayment: BaseUrl + "api/v1/insurance/reliance/payment",
};

const NepalLife = {
  GetDetails: BaseUrl + "api/v1/insurance/nepallife/details",
  MakePayment: BaseUrl + "api/v1/insurance/nepallife/payment",
};
const PrimeLife = {
  GetDetails: BaseUrl + "api/v1/insurance/primelife/details",
  MakePayment: BaseUrl + "api/v1/insurance/primelife/payment",
};

const Insurance = {
  GetDetails: BaseUrl + "api/v1/insurance/details",
  MakePayment: BaseUrl + "api/v1/insurance/payment",
};
const Tv = {
  GetDetails: BaseUrl + "api/v1/tv/details",
  MakePayment: BaseUrl + "api/v1/tv/payment",
};
const Internet = {
  GetDetails: BaseUrl + "api/v1/internet/details",
  MakePayment: BaseUrl + "api/v1/internet/payment",
};

const ServerImages = {
  Insurance: {
    Sagarmatha: BaseUrl + "insurance_logo/sagarmatha.png",
    Reliance: BaseUrl + "insurance_logo/reliance.png",
    NepalLife: BaseUrl + "insurance_logo/nepalLife.png",
    PrimeLife: BaseUrl + "insurance_logo/primeLife.png",
    MahalaxmiLife: BaseUrl + "insurance_logo/mahalaxmiLife.png",
    UnionLife: BaseUrl + "insurance_logo/unionLife.png",
    SuryaLife: BaseUrl + "insurance_logo/suryaLife.png",
    JyotiLife: BaseUrl + "insurance_logo/jyotiLife.png",
  },
  TV: {
    DishHome: BaseUrl + "tv_logo/dishHome.png",
    PrabhuTV: BaseUrl + "tv_logo/prabhu.png",
    SkyTV: BaseUrl + "tv_logo/skytv.png",
    ClearTV: BaseUrl + "tv_logo/cleartv.png",
    MeroTV: BaseUrl + "tv_logo/merotv.png",
    MaxTV: BaseUrl + "tv_logo/maxtv.png",
    SimTV: BaseUrl + "tv_logo/simtv.png",
  },
  Internet: {
    Worldlink: BaseUrl + "internet_logo/worldlink.png",
    Arrownet: BaseUrl + "internet_logo/arrownet.png",
    Classictech: BaseUrl + "internet_logo/classictech.png",
    RoyalNetwork: BaseUrl + "internet_logo/royalnet.png",
    PokharaInternet: BaseUrl + "internet_logo/pokharaInternet.png",
    Vianet: BaseUrl + "internet_logo/vianet.png",
  },
};


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
  Save: BaseUrl + "api/v1/st_order/save",
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
  CooperatveTermsOfServices,
  BranchId,
  Login,
  MobileBankingActivation,
  ChequeRequest,
  RecentTransaction,
  TransactionDetail,
  AccountTransfer,
  Pages,
  AccountList,
  StatementGet,
  BalanceTopup,
  // LandlineAdslPayment,
  Nea,
  ValidateAccountNo,
  GetCategories,
  GetMerchantsByCategory,
  GetDynamicForm,
  DynamicInqury,
  DynamicPayment,
  MobileBankingVerification,
  ResendOtp,
  ForgotPassword,
  ResetPassword,
  ListInterestRates,
  ChangePassword,
  UserCommissionRateApi,
  Offers,
  GetCompanyInfo,
  GetCompaniesDetails,
  ListFAQ,
  Favourite,
  QRPayment,
  LoadEsewa,
  DishHome,
  PrabhuTV,
  LoadKhalti,
  GetNotifications,
  Bpc,
  Worldlink,
  Vianet,
  Subisu,
  AdslPayment,
  Reliance,
  NepalLife,
  CommmunityKhanepani,
  CooperativeBalance,
  ListMblBankingSettings,
  SkyTV,
  PokharaInternet,
  PrimeLife,
  Insurance,
  Tv,
  ServerImages,
  Internet,
  GetFileUrlById,
  UnFavourite,
  IsAppForMultiple,
  TransactionDetailByUniqueId,
  LoadAccountFromBank,
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
  ContactUs, Reports, Deliver, Dispatch, PaymentDue, PostException, VisitPurpose, Vehicles, Fuel
};
export const endPoints = {
  GetTemporaryToken: BaseUrl + "connect/token", //TO GENERATE TOKEN
  RefreshToken: BaseUrl + "api/v1/user/refresh/token",
  CheckUserPin: BaseUrl + "api/v1/mobilebanking/user/pin/check",
  ChangeUserPin: BaseUrl + "api/v1/mobilebanking/user/pin/change",
  AddNewPin: BaseUrl + "api/v1/mobilebanking/user/pin/new",
  MatchUserPin: BaseUrl + "api/v1/mobilebanking/user/pin/match",
  GetFlightLocation: BaseUrl + "api/v1/airlines/list/domesticsectors",
  SearchFlights: BaseUrl + "api/v1/airlines/search/domestic",
  BookFlightTicket: BaseUrl + "api/v1/airlines/book/domestic",
};
