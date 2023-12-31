import React from "react";
import {
  Dimensions,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Touchable,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Text } from "galio-framework";
import Icon from "react-native-vector-icons/FontAwesome5";

import { TopBackgroundIcon, AirPlaneIcon } from "../components/IconsAll";
import NumericInput from "react-native-numeric-input";
import DropDownPicker from "react-native-dropdown-picker";
const { width, height } = Dimensions.get("screen");
import { ButtonPrimary } from "../components/Button";
import { RegularInputText } from "../components/Input";
import tokenManager from "../config/TokenManager";
import request from "../config/RequestManager";
import api, { endPoints } from "../constants/Api";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import ModalPopUp from "../components/Modal";
import qs from "qs";
import ToastMessage from "../components/Toast/Toast";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "./style/Theme";
import helpers from "../constants/Helpers";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { CustomDropdown } from "../components/CustomDropdown";
export class Airlines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nationalities: [
        { label: "Nepalese", value: "NP" },
        { label: "Indian", value: "IN" },
      ],
      nationality: "NP",
      destinations: [],
      airportList: [],
      flights: [],
      adult: 1,
      child: 0,
      from: "KTM",
      to: "PKR",
      departureDate: new Date(),
      arrivalDate: new Date(),
      trip: 1, //2  oneway or twoway,
      showArivalPicker: false,
      showDeparturePicker: false,
      showDeparture: false,
      showArrival: false,
      spinner: false,
      cashback: 0,
      travellerNumber: 1,
      showTravellers: false,
      fromName: "Kathmandu (KTM)",
      toName: "Pokhara (PKR)",
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Airlines",
    });
    this.getDestinationLists();
  }
  searchFlights = async () => {
    var model = {
      FromSector: this.state.from,
      ToSector: this.state.to,
      DepartureDate: this.state.departureDate,
      NoOfAdult: this.state.adult,
      NoOfChild: this.state.child,
      FlightMode: this.state.trip,
      Nationality: this.state.nationality,
    };
    if (this.state.adult == 0) {
      ToastMessage.Short("Please specify atlease 1 adult");
      return;
    }
    if (this.state.nationality == "") {
      ToastMessage.Short("Please select nationality");
      return;
    }
    //console.log('param', model)
    this.setState({ spinner: true });
    var response = await (await request()).post(
      endPoints.SearchFlights,
      qs.stringify(model)
    );
    if (response != undefined) {
      // console.log(response.data)
      if (response.data.Code == 200) {
        //console.log(response.data)
        this.setState({ flightResult: response.data.Data });
        this.setState({ spinner: false });
        this.props.navigation.navigate("AirlinesFlights", {
          results: response.data.Data,
          search: this.state,
        });
      } else {
        this.setState({ spinner: false });
        ToastMessage.Short(response.data.Message);
      }
    }
  };
  getDestinationLists = async () => {
    (await request())
      .get(endPoints.GetFlightLocation)
      .then((destinationResult) => {
        if (
          destinationResult.data != null &&
          destinationResult.data.Code == 200
        ) {
          // console.log(destinationResult.data.Data);
          this.setState({ destinations: destinationResult.data.Data });
          var arr = destinationResult.data.Data.map((list) => {
            return {
              label: list.Name + " (" + list.Code + ")",
              value: list.Code,
            };
          });
          this.setState({ airportList: arr });
        } else {
        }
      });
  };
  showDeparturePicker = () => {
    this.setState({ showDeparturePicker: true });
  };
  showArrivalPicker = () => {
    this.setState({ showArivalPicker: true });
  };
  onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (event.type == "dismissed" || event.type == "set") {
      this.setState({ departureDate: currentDate, showDeparturePicker: false });
    }
  };
  onArrivalDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    //const NewDate = moment(currentDate).format('DD-MM-YYYY')

    if (event.type == "dismissed" || event.type == "set") {
      this.setState({ arrivalDate: currentDate, showArivalPicker: false });
    }
  };
  renderArrivalPicker = () => {
    return (
      <DateTimePicker
        testID="dateTimePicker2"
        minimumDate={new Date(this.state.departureDate)}
        value={new Date(1598051730000)}
        mode={"date"}
        is24Hour={true}
        display="default"
        onChange={this.onArrivalDateChange}
      />
    );
  };
  setDeparture = (location) => {
    this.setState({ from: location.Code, showDeparture: false });
  };
  setArrival = (location) => {
    this.setState({ to: location.Code, showArrival: false });
  };
  childHandler = (props) => {
    if (props === "add") {
      if (this.state.travellerNumber < 10) {
        this.setState({
          child: this.state.child + 1,
          travellerNumber: this.state.travellerNumber + 1,
        });
      }
    } else if (props === "sub") {
      if (this.state.travellerNumber > 1) {
        if (this.state.child > 0) {
          this.setState({
            child: this.state.child - 1,
            travellerNumber: this.state.travellerNumber - 1,
          });
        }
      }
    }
  };
  adultHandler = (props) => {
    if (props === "add") {
      if (this.state.travellerNumber < 10) {
        this.setState({
          adult: this.state.adult + 1,
          travellerNumber: this.state.travellerNumber + 1,
        });
      }
    } else if (props === "sub") {
      if (this.state.travellerNumber > 1) {
        if (this.state.adult > 0) {
          this.setState({
            adult: this.state.adult - 1,
            travellerNumber: this.state.travellerNumber - 1,
          });
        }
      }
    }
  };
  updateArrival(value, label) {
    this.setState({
      to: value,
      toName: label,
    });
  }
  updateDeparture(value, label) {
    this.setState({
      from: value,
      fromName: label,
    });
  }
  render() {
    const { showDeparturePicker, showArivalPicker, trip } = this.state;
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#ecf0f1" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 6,
            }}
          >
            <View style={{ width: "48%", margin: 5 }}>
              <TouchableOpacity
                onPress={async () => {
                  this.setState({ trip: 1 });
                }}
              >
                {this.state.trip == 2 && (
                  <ButtonPrimary
                    title={"One Way"}
                    style={{ backgroundColor: "#fff", color: Colors.primary }}
                  />
                )}
                {this.state.trip == 1 && <ButtonPrimary title={"One Way"} />}
              </TouchableOpacity>
            </View>
            <View style={{ width: "48%", margin: 5 }}>
              <TouchableOpacity
                onPress={async () => {
                  this.setState({ trip: 2 });
                }}
              >
                {this.state.trip == 2 && <ButtonPrimary title={"Two way"} />}
                {this.state.trip == 1 && (
                  <ButtonPrimary
                    title={"Two way"}
                    style={{ backgroundColor: "#fff", color: Colors.primary }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginRight: 10,
              marginLeft: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "100%" }}>
                <Text
                  onPress={() => this.setState({ showDeparture: true })}
                  style={{
                    marginLeft: 20,
                    marginTop: 5,
                    color: "#8D91A2",
                    fontSize: 18,
                    fontFamily: "Light",
                  }}
                >
                  From
                </Text>
                <View
                  style={{
                    width: "95%",
                    marginRight: "auto",
                    marginLeft: "auto",
                    justifyContent: "center",
                  }}
                >
                  <CustomDropdown
                    placeholder={this.state.fromName}
                    searchablePlaceholder="Select Departure Location"
                    items={this.state.airportList}
                    itemSelected={this.updateDeparture.bind(this)}
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "100%" }}>
                <Text
                  onPress={() => this.setState({ showArrival: true })}
                  style={{
                    marginLeft: 20,
                    marginTop: 12,
                    color: "#8D91A2",
                    fontSize: 18,
                    fontFamily: "Light",
                  }}
                >
                  To
                </Text>
                <View
                  style={{
                    width: "95%",
                    marginRight: "auto",
                    marginLeft: "auto",
                    justifyContent: "center",
                    paddingBottom: 2,
                  }}
                >
                  <CustomDropdown
                    placeholder={this.state.toName}
                    searchablePlaceholder="Select Arrival Location"
                    items={this.state.airportList}
                    itemSelected={this.updateArrival.bind(this)}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginRight: 10,
              marginLeft: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    marginLeft: 20,
                    marginTop: 10,
                    color: "#8D91A2",
                    fontSize: 16,
                    fontFamily: "Light",
                  }}
                >
                  Departure Date
                </Text>
                <View
                  style={{
                    height: 50,
                    backgroundColor: Colors.secondary,
                    width: "90%",
                    marginRight: "auto",
                    marginLeft: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    marginTop: 8,
                  }}
                >
                  <Text
                    onPress={this.showDeparturePicker}
                    style={{
                      marginLeft: 0,
                      fontSize: 18,
                      color: Colors.HeadingColor,
                      fontFamily: "Regular",
                      textAlign: "center",
                    }}
                  >
                    {moment(this.state.departureDate).format("DD-MM-YYYY")}
                  </Text>
                </View>
              </View>
              <View
                pointerEvents={trip == 1 ? "none" : "auto"}
                style={{
                  opacity: trip == 1 ? 0.2 : 1,
                  width: "50%",
                  flexDirection: "column",
                  alignContent: "center",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    marginLeft: 20,
                    color: "#8D91A2",
                    fontSize: 16,
                    fontFamily: "Light",
                  }}
                >
                  Arrival Date
                </Text>
                <View
                  style={{
                    height: 50,
                    backgroundColor: Colors.secondary,
                    width: "90%",
                    marginRight: "auto",
                    marginLeft: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    marginTop: 8,
                  }}
                >
                  <Text
                    onPress={this.showArrivalPicker}
                    style={{
                      marginLeft: 0,
                      fontSize: 18,
                      color: Colors.HeadingColor,
                      fontFamily: "Regular",
                      textAlign: "center",
                    }}
                  >
                    {moment(this.state.arrivalDate).format("DD-MM-YYYY")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ height: 100 }}>
            <Text
              style={{
                marginLeft: 20,
                color: "#8D91A2",
                fontSize: 16,
                fontFamily: "Light",
              }}
            >
              Travellers
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ showTravellers: true });
              }}
            >
              <View
                style={{
                  height: 50,
                  backgroundColor: Colors.secondary,
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "90%",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: Colors.HeadingColor }}>
                    {this.state.travellerNumber}{" "}
                    {this.state.travellerNumber == 1
                      ? "Traveller"
                      : "Travellers"}
                  </Text>
                  <IconAntDesign name="caretdown" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: 15, marginRight: 15, zIndex: 99 }}>
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: Colors.secondary,
                color: "red",
                borderRadius: 10,
                fontFamily: "Regular",
                borderWidth: 0,
                borderColor: Colors.secondary,
              }}
              itemStyle={{
                justifyContent: "flex-start",
                fontFamily: "Medium",
                color: "red",
              }}
              labelStyle={{
                fontFamily: "Medium",
                color: "#9A9A9A",
              }}
              arrowColor={"#9A9A9A"}
              value={this.state.nationality}
              defaultValue={this.state.nationality}
              items={this.state.nationalities}
              controller={(instance) => (this.controller = instance)}
              onChangeItem={(item) =>
                this.setState({
                  nationality: item.value,
                })
              }
            />
          </View>
          <View
            style={{
              flex: 1,
              margin: 14,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                this.searchFlights();
              }}
            >
              <ButtonPrimary title={"Search"} />
            </TouchableOpacity>
          </View>

          <>
            {showDeparturePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                minimumDate={new Date()}
                value={new Date(1598051730000)}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={this.onDateChange}
              />
            )}

            {showArivalPicker && this.renderArrivalPicker()}

            <ModalPopUp
              visible={this.state.showDeparture}
              onPress={() => {}}
              onRequestClose={() => {
                this.setState({ showDeparture: false });
              }}
            >
              <>
                <Text
                  style={{
                    margin: 20,
                    fontSize: 20,
                    color: "#161646",
                    fontFamily: "Bold",
                  }}
                >
                  {" "}
                  Select Departure Location
                </Text>
                <ScrollView nestedScrollEnabled={true}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    {this.state.destinations.map((location) => {
                      return (
                        <View style={{ margin: 10, marginLeft: 20 }}>
                          <Text
                            onPress={() => this.setDeparture(location)}
                            style={{
                              marginLeft: 0,
                              fontSize: 18,
                              color: "#161646",
                              fontFamily: "Regular",
                            }}
                          >
                            {location.Name}({location.Code})
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </>
            </ModalPopUp>
            <ModalPopUp
              visible={this.state.showArrival}
              onPress={() => {}}
              onRequestClose={() => {
                this.setState({ showArrival: false });
              }}
            >
              <>
                <Text
                  style={{
                    margin: 20,
                    fontSize: 20,
                    color: "#161646",
                    fontFamily: "Bold",
                  }}
                >
                  {" "}
                  Select Arrival Location
                </Text>
                <ScrollView nestedScrollEnabled={true}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    {this.state.destinations.map((location) => {
                      return (
                        <View style={{ margin: 10, marginLeft: 20 }}>
                          <Text
                            onPress={() => this.setArrival(location)}
                            style={{
                              marginLeft: 0,
                              fontSize: 18,
                              color: "#161646",
                              fontFamily: "Regular",
                            }}
                          >
                            {location.Name}({location.Code})
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </>
            </ModalPopUp>
            <ModalPopUp
              visible={this.state.showTravellers}
              onPress={() => {}}
              onRequestClose={() => {
                this.setState({ showTravellers: false });
              }}
              height={0.4}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.secondary,
                }}
              >
                <View
                  style={{
                    height: "15%",
                    width: "90%",
                    borderBottomColor: Colors.secondary,
                    borderBottomWidth: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      marginTop: 10,
                      marginLeft: 20,
                      color: "#8D91A2",
                      fontSize: 20,
                      marginBottom: 5,
                      width: "100%",

                      fontFamily: "Bold",
                    }}
                  >
                    Passenger Information
                  </Text>
                </View>
                <View
                  style={{
                    height: "85%",
                    width: "90%",
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                >
                  <View
                    style={{
                      height: 80,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 15 }}>Adults</Text>
                      <Text style={{ fontSize: 15 }}>+12 years</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          height: 50,
                          backgroundColor: "#e2e2e2",
                          borderRadius: 20,
                          width: 100,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 18, marginLeft: 20 }}>
                          {this.state.adult}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "space-evenly",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.adultHandler("add");
                          }}
                        >
                          <Icon
                            name="arrow-up"
                            size={15}
                            style={{ padding: 7 }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.adultHandler("sub");
                          }}
                        >
                          <Icon
                            name="arrow-down"
                            size={15}
                            style={{ padding: 7 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 80,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 15 }}>Children</Text>
                      <Text style={{ fontSize: 15 }}>Under 12 years</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          height: 50,
                          backgroundColor: "#e2e2e2",
                          borderRadius: 20,
                          width: 100,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 18, marginLeft: 20 }}>
                          {this.state.child}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "space-evenly",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.childHandler("add");
                          }}
                        >
                          <Icon
                            name="arrow-up"
                            size={15}
                            style={{ padding: 7 }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.childHandler("sub");
                          }}
                        >
                          <Icon
                            name="arrow-down"
                            size={15}
                            style={{ padding: 7 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({ showTravellers: false })}
                  >
                    <View
                      style={{
                        width: "80%",
                        backgroundColor: Colors.primary,
                        height: 50,
                        marginLeft: "auto",
                        marginRight: "auto",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                        borderRadius: 14,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 20 }}>Apply</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ModalPopUp>
          </>
        </ScrollView>
      </>
    );
  }
}

export class AirlinesFlights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Flight Results...",
    });
  }
  gotoFlightDetail = (flightDetail) => {
    this.props.navigation.navigate("AirlinesFlightDetail", {
      detail: flightDetail,
      search: this.props.route.params.search,
    });
  };
  renderFlights = (flight) => {
    // "Adult": 1,
    // "AdultCommission": 0,
    // "AdultFare": 3130,
    // "AircraftType": "BEECH",
    // "AirlineCode": "RMK",
    // "AirlineName": "Simrik Airlines",
    // "Arrival": "POKHARA",
    // "ArrivalTime": "07:25",
    // "Child": 0,
    // "ChildCommission": 0,
    // "ChildFare": 2097.1,
    // "Currency": "NPR",
    // "Departure": "KATHMANDU",
    // "DepartureTime": "07:00",
    // "FlightClassCode": "Y",
    // "FlightDate": "2020-11-04",
    // "FlightId": "59ddc5bc-0841-42bb-8d8b-d6917f09f695",
    // "FlightNo": "RMK153",
    // "FreeBaggage": "20 KG",
    // "FuelSurcharge": 1500,
    // "Nationality": "NP",
    // "Refundable": "Refundable",
    // "Tax": 200,
    // "TotalAmount": 4830,
    // "TotalCommission": 0,

    return (
      <TouchableOpacity
        onPress={() => {
          this.gotoFlightDetail(flight);
        }}
      >
        <View
          style={{
            flex: 1,
            margin: 10,
            borderRadius: 10,
            flexDirection: "column",
            backgroundColor: "#fff",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              marginLeft: 10,
              color: "#8D91A2",
              fontSize: 18,
              fontFamily: "Light",
            }}
          >
            {flight.AirlineName}
          </Text>
          <View
            style={{
              flex: 1,
              margin: 10,
              borderRadius: 10,
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "20%",
              }}
            >
              <Icon
                style={{ color: "#8D91A2" }}
                name="plane-arrival"
                size={30}
              />
            </View>
            <View
              style={{
                margin: 0,
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text
                style={{ color: "#8D91A2", fontSize: 18, fontFamily: "Light" }}
              >
                {flight.AircraftType} {flight.FlightNo}
              </Text>
              <Text
                style={{
                  color: "#161646",
                  fontSize: 12,
                  fontFamily: "Regular",
                }}
              >
                {flight.Departure}-{flight.Arrival}
              </Text>

              <Text style={{ fontSize: 18, fontFamily: "Light" }}>
                {flight.DepartureTime}-{flight.ArrivalTime}
              </Text>
            </View>

            <View
              style={{
                margin: 0,
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{ color: "#8D91A2", fontSize: 18, fontFamily: "Bold" }}
              >
                {flight.Currency}.{flight.TotalAmount}
              </Text>
              <Text
                style={{ color: "#8D91A2", fontSize: 16, fontFamily: "Light" }}
              >
                {flight.Refundable}
              </Text>

              <Text
                style={{ color: "green", fontSize: 18, fontFamily: "Light" }}
              >
                Cashback: N/A
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { FlightDetails, DepartureDate } = this.props.route.params.results;
    const { from, to, trip } = this.props.route.params.search;
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#ecf0f1" }}
      >
        <View
          style={{
            flex: 1,
            margin: 10,
            borderRadius: 10,
            flexDirection: "row",
            backgroundColor: "#fff",
            justifyContent: "space-between",
          }}
        >
          <View style={{ margin: 20, width: "30%" }}>
            <Text
              style={{
                textAlign: "center",
                color: "#8D91A2",
                fontSize: 18,
                fontFamily: "Light",
              }}
            >
              From
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#161646",
                fontSize: 22,
                fontFamily: "Regular",
              }}
            >
              {from}
            </Text>
          </View>
          <View
            style={{
              margin: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {trip == 2 && (
              <>
                <Icon
                  style={{ color: "#8D91A2" }}
                  name="plane-departure"
                  size={30}
                />
                <Icon
                  style={{
                    color: "#8D91A2",
                    transform: [{ rotateY: "180deg" }],
                  }}
                  name="plane-departure"
                  size={30}
                />
              </>
            )}
            {trip == 1 && (
              <Icon
                style={{ color: "#8D91A2" }}
                name="plane-arrival"
                size={30}
              />
            )}
          </View>

          <View style={{ margin: 20, width: "30%" }}>
            <Text
              style={{
                textAlign: "center",
                color: "#8D91A2",
                fontSize: 18,
                fontFamily: "Light",
              }}
            >
              To
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#161646",
                fontSize: 22,
                fontFamily: "Regular",
              }}
            >
              {to}
            </Text>
          </View>
        </View>
        {FlightDetails.map((flight) => {
          return this.renderFlights(flight);
        })}
      </ScrollView>
    );
  }
}

export class AirlinesFlightDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Flight Detail...",
    });
  }
  goToBooking() {
    const { detail, search } = this.props.route.params;
    this.props.navigation.navigate("AirlinesFlightBooking", {
      detail: detail,
      search: search,
    });
  }
  render() {
    const { detail, search } = this.props.route.params;

    //console.log(detail, search)
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#ecf0f1" }}
      >
        <View>
          <View>
            <TopBackgroundIcon
              style={{ position: "absolute" }}
              preserveAspectRatio="none"
              width="100%"
            />
          </View>

          <View style={styles.card}>
            <Text
              style={[
                {
                  fontSize: 20,
                  textAlign: "center",
                  color: "#474747",
                  marginLeft: 30,
                  marginTop: 10,
                  fontFamily: "Bold",
                },
              ]}
            >
              Flight Detail
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Flight Number</Text>
              <Text style={styles.value}>{detail.FlightNo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.value}>
                {detail.Departure}-{detail.DepartureTime}
              </Text>
              <Text style={styles.value}>
                {detail.Arrival}-{detail.ArrivalTime}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Free Baggage</Text>
              <Text style={styles.value}>{detail.FreeBaggage}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text
              style={[
                {
                  fontSize: 20,
                  textAlign: "center",
                  color: "#474747",
                  marginLeft: 30,
                  marginTop: 10,
                  fontFamily: "Bold",
                },
              ]}
            >
              Payment Detail
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>
                {search.adult} X Adult ({detail.AdultFare})
              </Text>
              <Text style={styles.value}>
                {detail.Currency}.{(detail.AdultFare * search.adult).toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>
                {search.child} X Child ({detail.ChildFare})
              </Text>
              <Text style={styles.value}>
                {detail.Currency}.{(detail.ChildFare * search.child).toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Airport Tax</Text>
              <Text style={styles.value}>
                {detail.Currency}.{detail.Tax.toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fuel Surcharge</Text>
              <Text style={styles.value}>
                {detail.Currency}.{detail.FuelSurcharge.toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Fare</Text>
              <Text style={styles.value}>
                {detail.Currency}.{detail.TotalAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={styles.value}>{detail.Currency}.0</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payable Fare(Non Refundable)</Text>
              <Text style={styles.value}>
                {detail.Currency}.{detail.TotalAmount.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.row]}>
              <Text style={[styles.label, { color: "#2FBB07" }]}>Cashback</Text>
              <Text style={[styles.value, { color: "#2FBB07" }]}>
                {search.cashback}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            margin: 20,
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              this.goToBooking();
            }}
          >
            <ButtonPrimary title={"Book"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
export class AirlinesFlightBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nationalities: [
        { label: "Nepalese", value: "NP" },
        { label: "Indian", value: "IN" },
      ],
      adultorchild: [
        { label: "Adult", value: "A" },
        { label: "Child", value: "C" },
      ],
      initials: [
        { label: "Mr.", value: "Mr." },
        { label: "Mrs", value: "Mrs" },
        { label: "Ms", value: "Ms" },
      ],
      contactFullName: "",
      contactMobileNo: "",
      contactEmail: "",
      passengers: [],
      fromBranchId: 1,
      fromAccountNo: "0",
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      fromAccountNoError: "",
    };
  }
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.setState({ accountList: arr, fromAccountNo: arr[0].value });
  };
  setPassengerName = (text, index) => {
    const name = text.split(" ");
    if (name.length > 0 && name != undefined) {
      if (!(name[0] === "")) {
        if (name.length == 2) {
          const { passengers } = this.state;
          passengers[index].firstName = name[0];
          passengers[index].lastName = name[1];
          this.setState({ passengers });
        }
        if (name.length == 3) {
          const { passengers } = this.state;
          passengers[index].firstName = name[0];
          passengers[index].lastName = name[2];
          passengers[index].midName = name[1];
          this.setState({ passengers });
        }
      }
    }
  };
  renderPassengerform = (pasengerCount) => {
    var elements = [];
    var i;
    for (i = this.state.isPassenger ? 1 : 0; i < pasengerCount; i++) {
      let ind = i;
      // this.setState({ passengers: [...this.state.passengers, {title:'',firstName:'',midName:'',lastName:'',nationality:'',type:''}] })
      elements.push(
        <View
          style={[
            styles.card,
            { backgroundColor: "#ecf0f1", paddingBottom: 70 },
          ]}
        >
          <Text
            style={[
              {
                fontSize: 20,
                textAlign: "left",
                color: "#474747",
                marginLeft: 0,
                marginTop: 10,
                fontFamily: "Bold",
              },
            ]}
          >
            Passenger Information #{i + 1}
          </Text>
          <View
            style={{
              marginTop: 5,
              zIndex: 99
            }}
          >
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: "#fff",
                color: "red",
                borderRadius: 10,
                fontFamily: "Regular",
                borderColor: "#fff",
                borderWidth: 0,
              }}
              itemStyle={{
                justifyContent: "flex-start",
                fontFamily: "Medium",
                color: "red",
              }}
              labelStyle={{
                fontFamily: "Medium",
                color: "#9A9A9A",
              }}
              arrowColor={"#9A9A9A"}
              placeholder={"Select Initials..."}
              items={this.state.initials}
              controller={(instance) => (this.controller = instance)}
              onChangeItem={(item) => {
                const { passengers } = this.state;
                if (passengers[ind] == undefined) {
                  passengers[ind] = {};
                }
                passengers[ind].title = item.value;
                this.setState({ passengers });
              }}
            />
          </View>
          <View>
            <RegularInputText
              key="FullName"
              Keyboradty
              placeholder="Full Name"
              onChangeText={(text) => {
                var name = text.trim();
                //this.setState({ firstName: this.validateAmount(text) })
                this.setPassengerName(name, ind);
              }}
            />
            {!!this.state.firstNameError && (
              <Text style={{ color: "red" }}>{this.state.firstNameError}</Text>
            )}
          </View>

          <View
            style={{
              marginTop: 5,
              zIndex: 99
            }}
          >
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: "#fff",
                color: "red",
                borderRadius: 10,
                fontFamily: "Regular",
                borderColor: "#fff",
                borderWidth: 0,
              }}
              itemStyle={{
                justifyContent: "flex-start",
                fontFamily: "Medium",
                color: "red",
              }}
              labelStyle={{
                fontFamily: "Medium",
                color: "#9A9A9A",
              }}
              arrowColor={"#9A9A9A"}
              placeholder={"Select Nationality..."}
              value={this.state.nationality}
              items={this.state.nationalities}
              controller={(instance) => (this.controller = instance)}
              onChangeItem={(item) => {
                const { passengers } = this.state;
                if (passengers[ind] == undefined) {
                  passengers[ind] = {};
                }
                passengers[ind].nationality = item.value;
                this.setState({ passengers });
              }}
            />
          </View>
          <View
            style={{
              marginTop: 15,
              zIndex: 99
            }}
          >
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: "#fff",
                color: "red",
                borderRadius: 10,
                fontFamily: "Regular",
                borderColor: "#fff",
                borderWidth: 0,
              }}
              itemStyle={{
                justifyContent: "flex-start",
                fontFamily: "Medium",
                color: "red",
              }}
              labelStyle={{
                fontFamily: "Medium",
                color: "#9A9A9A",
              }}
              arrowColor={"#9A9A9A"}
              placeholder={"Select Adult or Child..."}
              items={this.state.adultorchild}
              controller={(instance) => (this.controller = instance)}
              onChangeItem={(item) => {
                const { passengers } = this.state;
                if (passengers[ind] == undefined) {
                  passengers[ind] = {};
                }
                passengers[ind].type = item.value;
                this.setState({ passengers });
              }}
            />
          </View>
        </View>
      );
    }
    return elements;
  };
  componentDidMount = async () => {
    await this.GetAccountList();
    this.props.navigation.setOptions({
      title: "Booking",
    });
  };
  BookNow = async () => {
    const {
      passengers,
      contactEmail,
      contactFullName,
      contactMobileNo,
      fromAccountNo,
    } = this.state;
    let isValid = true;
    passengers.forEach((p) => {
      for (const property in p) {
        // console.log(`${property}: ${p[property]}`);
        if (property == "midName") {
        } else if (
          p[property] == " " ||
          p[property] == "" ||
          p[property] == null
        ) {
          isValid = false;
          break;
        }
      }
    });

    if (contactEmail == "" || contactEmail == null) {
      ToastMessage.Short("contact email is required.");
      return;
    }
    const validate = (email) => {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

      return expression.test(String(email).toLowerCase());
    };
    if (!validate(contactEmail)) {
      ToastMessage.Short("invalid email.");
      return;
    }
    if (contactFullName == "" || contactFullName == null) {
      ToastMessage.Short("contact name is required.");
      return;
    }
    if (contactMobileNo == "" || contactMobileNo == null) {
      ToastMessage.Short("contact phone no.is required.");
      return;
    }
    if (isValid == false) {
      ToastMessage.Short("passenger informations are missing.");
      return;
    }
    let userInfo = await helpers.GetUserInfo();
    const { detail, search } = this.props.route.params;
    let model = {
      Id: "",
      UserId: userInfo.Id,
      CompanyId: 1,
      AccountNo: fromAccountNo,
      BranchId: 1,
      OutBoundFlightId: detail.FlightId,
      InboundFlightId: "",
      ContactPersonName: contactFullName,
      ContactPersonEmail: contactEmail,
      ContactPersonPhone: contactMobileNo,
      NoOfAdult: detail.Adult,
      NoOfChild: detail.Child,
      Nationality: detail.Nationality,
      Currency: detail.Currency,
      Amount: detail.TotalAmount,
      Passengers: passengers,
      isPassenger: false,
    };

    this.setState({ spinner: true });
    var response = await (await request()).post(
      endPoints.BookFlightTicket,
      qs.stringify(model)
    );
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ spinner: false });
        const { detail, search } = this.props.route.params;
        this.props.navigation.navigate("AirlinesTicketSuccess", {
          postedValue: model,
          flightDetail: detail,
          ticketResponse: response.data,
        });
      } else {
        this.setState({ spinner: false });
        ToastMessage.Short(response.data.Message);
        //this.props.navigation.navigate("AirlinesTicketSuccess", {"postedValue":model, "flightDetail": detail,"ticketResponse":response.data });
      }
    }
  };
  updated = false;
  render() {
    const { detail, search } = this.props.route.params;
    let totalPassenger = detail.Child + detail.Adult;
    let i;
    if (!this.updated) {
      var pax = [];
      for (i = 0; i < totalPassenger; i++) {
        pax.push({
          title: "",
          firstName: "",
          midName: "",
          lastName: "",
          nationality: "",
          type: "",
        });
      }
      this.setState({ passengers: pax });
      this.updated = true;
    }
    return (
      <>
        <Spinner
          color={Colors.PrimaryColor}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#ecf0f1" }}
        >
          <View style={{ flex: 1, alignContent: "center" }}>
            <View>
              <TopBackgroundIcon
                style={{
                  position: "absolute",
                  color: Colors.primary,
                }}
                preserveAspectRatio="none"
                width="100%"
              />
            </View>
            <View style={{ margin: 20 }}>
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 16,
                  color: "#fff",
                  padding: 5,
                }}
              >
                From Account
              </Text>
            </View>
            <View style={{ margin: 20, marginTop: 0, zIndex: 99 }}>
              <DropDownPicker
                containerStyle={{ height: 50 }}
                style={{
                  backgroundColor: "#fff",
                  color: "red",
                  borderRadius: 10,
                  fontFamily: "Regular",
                  borderColor: "#fff",
                  borderWidth: 0,
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                  fontFamily: "Medium",
                  color: "red",
                }}
                labelStyle={{
                  fontFamily: "Medium",
                  color: "#9A9A9A",
                }}
                arrowColor={"#9A9A9A"}
                defaultValue={this.state.fromAccountNo}
                value={this.state.fromaccountNo}
                items={this.state.accountList}
                controller={(instance) => (this.controller = instance)}
                onChangeList={(items, callback) => {
                  this.setState(
                    {
                      items,
                    },
                    callback
                  );
                }}
                onChangeItem={(item) =>
                  this.setState({
                    fromAccountNo: item.value,
                  })
                }
              />
              {!!this.state.fromAccountNoError && (
                <Text style={{ color: "red" }}>
                  {this.state.fromAccountNoError}
                </Text>
              )}
            </View>

            <View style={[styles.card, { backgroundColor: "#ecf0f1" }]}>
              <Text
                style={[
                  {
                    fontSize: 20,
                    textAlign: "center",
                    color: "#474747",
                    marginLeft: 30,
                    marginTop: 10,
                    fontFamily: "Bold",
                  },
                ]}
              >
                Contact Person Info
              </Text>
              <View>
                <RegularInputText
                  key="Full Name"
                  Keyboradty
                  placeholder="Full Name"
                  onChangeText={(text) => {
                    this.setState({ contactFullName: text });
                  }}
                />
                {!!this.state.contactFullNameError && (
                  <Text style={{ color: "red" }}>
                    {this.state.contactFullNameError}
                  </Text>
                )}
              </View>
              <View>
                <RegularInputText
                  key="MobileNumber"
                  Keyboradty
                  maxLength={10}
                  keyboardType="numeric"
                  placeholder="Mobile Number"
                  onChangeText={(text) => {
                    this.setState({ contactMobileNo: text });
                  }}
                />
                {!!this.state.contactMobileNoError && (
                  <Text style={{ color: "red" }}>
                    {this.state.contactMobileNoError}
                  </Text>
                )}
              </View>
              <View>
                <RegularInputText
                  key="EmailAddress"
                  Keyboradty
                  keyboardType="email-address"
                  placeholder="Email Address"
                  onChangeText={(text) => {
                    this.setState({ contactEmail: text });
                  }}
                />
                {!!this.state.contactEmailError && (
                  <Text style={{ color: "red" }}>
                    {this.state.contactEmailError}
                  </Text>
                )}
              </View>
              {/* <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.isPassenger ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    this.setState({ isPassenger: !this.state.isPassenger });
                  }}
                  value={this.state.isPassenger}
                />
                <Text
                  style={{
                    alignSelf: "center",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  is Passenger
                </Text>
              </View> */}
            </View>

            {this.renderPassengerform(totalPassenger)}
          </View>
          <View
            style={{
              flex: 1,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                this.BookNow();
              }}
            >
              <ButtonPrimary title={"Book"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }
}

export class TicketSuccess extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    const {
      flightDetail,
      ticketResponse,
      postedValue,
    } = this.props.route.params;
    const { Message, Data } = ticketResponse;
    // let model = {
    //   Id: '',
    //   UserId: userInfo.Id,
    //   CompanyId: 1,
    //   AccountNo: fromAccountNo,
    //   BranchId: 1,
    //   OutBoundFlightId: detail.FlightId,
    //   InboundFlightId: '',
    //   ContactPersonName: contactFullName,
    //   ContactPersonEmail: contactEmail,
    //   ContactPersonPhone: contactMobileNo,
    //   NoOfAdult: detail.Adult,
    //   NoOfChild: detail.Child,
    //   Nationality: detail.Nationality,
    //   Currency: detail.Currency,
    //   Amount: detail.TotalAmount,
    //   Passengers: passengers
    // };

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: "100%", backgroundColor: "#eee" }}
        >
          <View>
            <TopBackgroundIcon
              style={{ position: "absolute" }}
              preserveAspectRatio="none"
              width="100%"
            />
          </View>

          <Text
            style={[
              {
                fontWeight: "700",
                fontSize: 20,
                color: "#fff",
                marginLeft: 30,
                marginTop: 60,
              },
            ]}
          >
            {"Ticket Purchase/Booking Successfull"}
          </Text>
          <View style={successStyle.card}>
            <View style={successStyle.row}>
              <Text style={successStyle.label}>From Account </Text>
              <Text style={successStyle.value}>{postedValue.AccountNo}</Text>
            </View>
            {/* <View style={successStyle.row} >
              <Text style={successStyle.label} >TransactionCode</Text>
              <Text style={successStyle.value} ></Text>
            </View> */}

            <View style={successStyle.row}>
              <Text style={successStyle.label}>Transaction Amount </Text>
              <Text style={successStyle.value}>{postedValue.Amount}</Text>
            </View>
            {Data.Tickets.map((ticket) => {
              return (
                <>
                  <View style={successStyle.row}>
                    <Text style={successStyle.label}>Ticket No </Text>
                    <Text style={successStyle.value}>{ticket.TicketNo}</Text>
                  </View>
                  <View style={successStyle.row}>
                    <Text style={successStyle.label}>Class </Text>
                    <Text style={successStyle.value}>{ticket.ClassCode}</Text>
                  </View>
                </>
              );
            })}

            <View style={{ textAlign: "center", margin: 20 }}>
              <Text style={{ textAlign: "center" }}>
                {"Please check your email for tickets"}
              </Text>
              <Text style={{ textAlign: "center" }}>{Message}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 0.6,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              color="success"
              onPress={() => {
                this.props.navigation.replace("Home");
              }}
            >
              <ButtonPrimary title={"OK"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const successStyle = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
    paddingStart: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  label: {
    color: "#000",
  },
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  label: {
    color: "#000",
  },
});
