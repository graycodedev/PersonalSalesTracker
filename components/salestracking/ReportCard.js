import { View, Text } from 'react-native'
import React from 'react'
import { Colors } from '../../screens/style/Theme'

const ReportCard = ({icon, title, subtitle,style}) => {
  return (
    <View style={[{padding:20, borderRadius: 10, justifyContent:"space-between", backgroundColor:"white"}, style]}>
      <View>{icon}</View>
      <View>
        <Text style={{fontSize: 15, fontFamily:"SemiBold"}}>{title}</Text>
        <Text style={{fontSize: 18, fontFamily:"SemiBold", color: "black"}}>{subtitle}</Text>
      </View>
    </View>
  )
}

export default ReportCard