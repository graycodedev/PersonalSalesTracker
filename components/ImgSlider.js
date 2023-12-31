import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import api from "../constants/Api";
import { Colors } from "../screens/style/Theme";

const ImgSlider = ({ navigation, data }) => {
  const [offers, setOffers] = useState(data);
  useEffect(() => {}, []);
  let images = offers.map((item) => api.BaseUrl + item.ImageUrl);

  return (
    <View style={styles.container}>
      <SliderBox
        images={images}
        sliderBoxHeight={180}
        circleLoop
        autoplay
        dotColor={Colors.primary}
        inactiveDotColor="#e2e2e2"
        imageLoadingColor={Colors.Color}
        onCurrentImagePressed={(index) =>
          navigation.navigate("OfferScreen", {
            title: offers[index].Title,
            image: offers[index].ImageUrl,
            desc: offers[index].ShortDescription,
          })
        }
      />
    </View>
  );
};
export default ImgSlider;

const styles = StyleSheet.create({});
