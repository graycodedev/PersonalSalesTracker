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
import DateDisplay from "../../../components/DateDisplay";
import AppStyles from "../../../assets/theme/AppStyles";

const CollectionList = ({ navigation }) => {
    const [collections, setCollections] = useState([]);
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
                    console.log("cc", response.data.Data[0])
                    setCollections(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Collections");
                }
            } else {
                ToastMessage.Short("Error Loading Collections");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Collections",
        });
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
        <View style={{ flex: 1 }}>
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
                            {collections.map((collection) => (
                                <TouchableOpacity
                                    key={collection.Id}
                                    style={styles.collectionItem}
                                    onPress={() =>
                                        navigation.navigate("CollectionDetails", { collection })
                                    }
                                >
                                    <View>
                                        <Text style={AppStyles.Text.BoldTitle}>{collection.PartyName}</Text>
                                        <Text style={AppStyles.Text.Regular}>{`Payment Amount: Rs.${collection.Amount}`}</Text>
                                        <Text style={AppStyles.Text.Regular}>
                                            Recieved Date: <DateDisplay date={collection.PaymentDate} />
                                        </Text>
                                    </View>
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
                        navigation.navigate("AddCollection");
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
    collectionItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    collectionName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    collectionInfo: {
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
