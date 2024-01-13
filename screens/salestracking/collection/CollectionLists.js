import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";

const CollectionList = ({ navigation }) => {
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getList = async () => {
        setIsLoading(true);
        try {
            var response = await (await request())
                .get(Api.Collections.List)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setParties(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Parties");
                }
            } else {
                ToastMessage.Short("Error Loading Parties");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getList();
            return () => {
                // Cleanup function (optional)
                // Additional cleanup logic (if needed)
            };
        }, [])
    );

    return (
        <View>
            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ width: "100%", backgroundColor: "#eee" }}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={styles.container}>
                        <View>
                            {parties.map((party) => (
                                <TouchableOpacity
                                    key={party.value}
                                    style={styles.partyItem}
                                    onPress={() =>
                                        navigation.navigate("CollectionDetails", { party })
                                    }
                                >
                                    <Text style={styles.partyName}>{party.name}</Text>
                                    <Text style={styles.partyInfo}>{`Recieved Amount: ${party.amount}`}</Text>
                                    <Text style={styles.partyInfo}>{`Recieved Date: ${party.date}`}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}

            <View>
                <TouchableOpacity
                    style={styles.circle}
                    onPress={() => {
                        navigation.navigate('AddCollection', { partyNames: parties.map(party => party.name) });
                    }}
                >
                    <BankingIcons.plus fill="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        alignContent: "center",
        justifyContent: "flex-start",
    },
    partyItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    partyName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    partyInfo: {
        fontSize: 16,
    },
    circle: {
        backgroundColor: Colors.primary,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CollectionList;
