import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import AppStyles from '../assets/theme/AppStyles';
import {DateDisplay} from './DateDisplay';
import * as BankingIcons from "./BankingIcons";

const ListItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.listItemContainer}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={AppStyles.Text.BoldTitle}>{item.PartyName ? item.PartyName : item.LocationName}</Text>
                    <DateDisplay date={item.VisitDate || item.PaymentDate} />
                </View>
                {item.PartyName && (
                    <BankingIcons.tickMark fill='green' style={styles.imageStyle} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    listItemContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    imageStyle: {
        marginRight: 10,
    },
};

export default ListItem;
