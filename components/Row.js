import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
export const SimpleRow = ({ data }) => {
    return (
        <TouchableWithoutFeedback key={data.Title} >
            <View key={data.TranDate} style={[styles.rect2, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View >
                    <Text style={styles.checkoutMart}>{data.Title}</Text>
                    <Text style={styles.date}>{data.TranDate}</Text>
                    <Text style={styles.date}>{data.TranTime}</Text>
                </View>
                {
                    Number(data.Amount) > 0 ? <Text style={styles.pricePositive}>{Math.abs(data.Amount)}</Text> : <Text style={styles.price}>{Math.abs(data.Amount)}</Text>
                }
            </View>
        </TouchableWithoutFeedback>
    )


}
export const RowDetailedView = ({ data }) => {
    return (
        <View key={data.Title}>
            {
                <View>
                    <View style={[styles.rect2, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View >
                            <Text style={styles.checkoutMart}>{data.Title}</Text>
                            <Text style={styles.date}>{data.Remarks}</Text>
                            <Text style={styles.date}>{data.LogType}</Text>
                        </View>
                        {
                            Number(data.Amount) > 0 ? <Text style={styles.pricePositive}>{Math.abs(data.Amount)}</Text> : <Text style={styles.price}>{Math.abs(data.Amount)}</Text>
                        }
                    </View>
                    {
                        Number(data.UserCommission) > 0 ? (<View style={[styles.rect2, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[styles.checkoutMart, { textAlign: "center", margin: 10 }]}>{data.Title} Cashback</Text>
                            <Text style={styles.pricePositive}>{data.UserCommission}</Text>
                        </View>) : <View></View>
                    }
                </View>
            }
        </View>

    )


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(225,229,235,1)",
        borderRadius: 12,
        height: 200
    },
    rect2: {
        // width: "100%",
        // height: 60,
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 5,
        flex: 1,
        minHeight:70
    },
    checkoutMart: {
        fontFamily: "Regular",
        color: "rgba(54,71,93,1)",
        fontSize: 14,
        marginTop: 7,
        marginLeft: 11
    },
    date: {
        fontFamily: "Regular",
        color: "rgba(174,185,202,1)",
        fontSize: 12,
        marginTop: 3,
        marginLeft: 11
    },
    price: {
        fontFamily: "Regular",
        color: "rgba(254,104,90,1)",
        fontSize: 16,
        fontWeight: '700',
        textAlign: "center",
        margin: 15

    },
    pricePositive:
    {
        fontFamily: "Regular",
        color: "green",
        fontSize: 16,
        fontWeight: '700',
        textAlign: "center",
        margin: 15
    }
});