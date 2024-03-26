import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../screens/style/Theme'

const ReportCard = ({icon, title, subtitle,style, navigation}) => {
  return (
    <TouchableOpacity style={[{padding:20, borderRadius: 10, justifyContent:"space-between", backgroundColor:"white"}, style]} onPress={()=>{if(navigation){
      navigation()}}}> 
      <View>{icon}</View>
      <View>
        <Text style={{fontSize: 15, fontFamily:"SemiBold"}}>{title}</Text>
        <Text style={{fontSize: 18, fontFamily:"SemiBold", color: "black"}}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ReportCard