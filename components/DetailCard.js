import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppStyles from '../assets/theme/AppStyles'

const DetailCard = (props) => {
    
  return (
    <View style={styles.container}>

    <View style={styles.itemContainer}>
        {props.details.map((detail, index)=>(
            <View style={styles.item} key={index}>
                        <Text style={AppStyles.DetailText.KeyText}>{detail.Label}</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{detail.Value}</Text>
                        </View>
                    </View>
        ))}
      
    </View>
    </View>
  )
}



export default DetailCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        alignContent: "center",
        justifyContent: "flex-start",
    },
    itemContainer: {
        backgroundColor: 'white',
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        justifyContent: 'space-between',
        padding: 10,
        paddingVertical:4
    },
    odometerInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    odometerData: {
        fontSize: 16,
        textAlign: 'right'
    },
})