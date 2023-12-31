import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, ScrollView, ToastAndroid } from 'react-native';
import {
  LoanIcon, LineupIcon,
  WalletIcon, CashInHandIcon, PiggySavingIcon
  , TopupIcon, MoneyInOutIcon, CardIcon, PaymentIcon, WaterIcon, AirPlaneIcon, ElectricityIcon, TvIcon, InternetIcon, IntraBankIcon
} from "./IconsAll";
import { TouchableOpacity } from 'react-native';
import api from '../constants/Api';

export class CategoryViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }
  onCategoryClick = (category) => {

    if (category.UseStaticForms) {
      //ToastAndroid.show("this is static form", ToastAndroid.SHORT);   

      //to lower case and removing white space
      let catName = category.Name.toLowerCase().replace(/\s/g, "");

      if (catName == "electricity" || catName == "topup"||catName == "airlines"
      // || catName == "education"|| catName == "bus" || catName == "movies"|| catName == "events"
      )
        this.props.navigation.navigate(`${catName}`);
      else {
        ToastAndroid.show("Comming soon...", ToastAndroid.SHORT);
      }
    } else {
      this.props.navigation.navigate(`dynamicmerchant`, category);
    }
  }
  renderItem = (category) => {
    return (
      <TouchableOpacity key={category.Name} onPress={() => this.onCategoryClick(category)}>
        <View style={merchant.rect2}>

          <Image source={{ uri: `${api.BaseUrl}${category.Image}?w=400&h=400&mode=pad` }}
            // source={{ uri: 'https://www.gamasutra.com/db_area/images/news/2018/Jun/320213/supermario64thumb1.jpg' }}
            style={merchant.icon}
          />
          <Text style={merchant.airline}>{category.Name}</Text>
        </View>
      </TouchableOpacity>);
  }
  render() {
    return (
      <>
        {this.props.categories.length == 0 && (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            <View style={merchant.noitem}>
              <Text style={merchant.airline}>More merchants are connecting soon.</Text>
            </View>
          </View>
        )}
        {this.props.categories.length > 1 && (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

              {this.props.categories.map((item, index) => {
                return (
                  this.renderItem(item)
                )
              })
              }

            </ScrollView>
          </View>
        )}
      </>
    )
  }
}

const merchant = StyleSheet.create({
  noitem: {
    flexGrow: 1,
    backgroundColor: "#fff",
    width: "90%",
    height: 112,
    margin: 5,
    alignItems: "center",
    borderRadius: 10
  },
  rect2: {
    backgroundColor: "#fff",
    width: 80,
    height: 112,
    margin: 5,
    alignItems: "center",
    borderRadius: 10
  },
  icon: {
    // color: "rgba(128,128,128,1)",
    //fontSize: 40,
    height: 50,
    width: 50,
    marginTop: 19,

  },
  airline: {
    fontFamily: "Regular",
    color: "rgba(94,108,128,1)",
    fontSize: 12,
    marginTop: 10
  },
  transfer: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 10
  }

});

