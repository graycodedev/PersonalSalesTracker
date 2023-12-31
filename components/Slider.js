import React from 'react';
import PropTypes from 'prop-types';
import {View,Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native';
const data=[
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")},
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")},
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")},
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")},
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")},
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")},
    {Title:"Account",SubTitle:'test',Icon:require("../assets/imgs/Cards.png")}
]
export const SimpleSlider = ({}) => {
    return (
        <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between' }}>
            <ScrollView horizontal  showsHorizontalScrollIndicator={false}>
        {
            data.map(function(item, i){
                return (
                        <View style={merchant.rect2}>
                        <Image style={merchant.icon} source={item.Icon} ></Image> 
                    <Text style={merchant.airline}>{item.title}</Text>
                        <Text style={merchant.transfer}>Transfer</Text>
                    </View>
                        
                )
            })
        }
        </ScrollView>
        </View>
    )
    
}

  const merchant = StyleSheet.create({
    rect2: {
        backgroundColor: "#fff",
        width: (Dimensions.get('window').width / 4) - 20,
        height: 112,
        margin:5,
        alignItems:"center",
        borderRadius:10
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 40,
        height: 40,
        width: 50,
        marginTop: 19,

    },
    airline: {
       // fontFamily: "poppins-regular",
        color: "rgba(94,108,128,1)",
        fontSize: 12,
        marginTop: 10
    },
    transfer: {
       // fontFamily: "poppins-regular",
        color: "rgba(174,185,202,1)",
        fontSize: 10
    }

});
