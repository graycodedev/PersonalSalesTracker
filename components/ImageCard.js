import { View, Text, ImageBackground,TouchableOpacity } from 'react-native'
import * as SVG from "./BankingIcons"
import React from 'react'
import { Colors } from '../screens/style/Theme'

const ImageCard = ({containerStyle, uri, renderComponent}) => {
  return (
    <View
    style={containerStyle}
  >
    <ImageBackground
      source={{
        uri: uri,
      }}
      resizeMode="stretch"
      style={{
        backgroundColor: "yellow",
        flex: 1,
        aspectRatio: 1, 
        width: "100%"
      }}
    >
        {
            renderComponent
        }
    </ImageBackground>
  </View>
  )
}

export default ImageCard