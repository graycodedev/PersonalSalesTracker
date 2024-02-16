import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { CustomDropdown } from "../../../components/CustomDropdown";
import { ButtonPrimary } from "../../../components/Button";
import { ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RegularInputText } from "../../../components/Input";
import { Colors } from "../../style/Theme";
import { AutoCompleteList } from "../../../components/AutoCompleteList";
import Api from "../../../constants/Api";
import CustomModal from "../../../components/CustomModal";
import * as BankingIcons from "../../../components/BankingIcons"; 
import Circle from "../../../components/shapes/Circle"; 
import WarningModal from "../../../components/WarningModal";
import ToastMessage from "../../../components/Toast/Toast";
import request from "../../../config/RequestManager";
import qs from "qs"
import Warning from "../../../components/Warning";
const AddOrder = ({ navigation, route }) => {
    const { selectedOrder, orders } = route.params || {};
    const { name, price, type, image } = selectedOrder || {};

    const [selectedParty, setSelectedParty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [deliveryDate, setDeliveryDate]= useState(new Date());
    
    const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState(null);
    const [selectedProductPrice, setSelectedProductPrice] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [selectedProducts, setSelectedProducts] = useState([]);

    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [applyVAT, setApplyVAT] = useState(false);
    const [showPartiesList, setShowPartiesList]= useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProducts, setShowProducts] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete]= useState(false);
    const [deleteIndex, setDeleteIndex]= useState(-1);
    const [updateIndex, setUpdateIndex]= useState(-1);
    const [notes, setNotes]= useState("");


    const [quantityError, setQuantityError]= useState("");
    const [productError, setProductError]= useState("");
    const [partyError, setPartyError]= useState("");

    useEffect(()=>{
     navigation.setOptions({
            title: "Add Order",
          });
        var today = new Date();
var tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
setDeliveryDate(tomorrow)

    }, [])


    const addProductValidation=()=>{
        setQuantityError("");
        setProductError("");
        let isValid= true;
        if(quantity<1){
            isValid= false;
setQuantityError("Invalid Quantity");
        }
        if(selectedProduct == null){
            isValid= false;
            setProductError("Select a product")
        }
        return isValid;
    }

    const addOrderValidation=()=>{
        setPartyError("");
        let isValid= true;
        if(selectedParty == null){
            isValid= false;
            setPartyError("Select a party!!")
        }
        return isValid;
    }


    const handleAddProduct = () => {
            const newProduct = {
                Id: 0,
                ProductId: selectedProduct.Id,
                OrderedQuantity:quantity,
                Rate: selectedProduct.PreferedSellingPrice,
                SoldQuantity: quantity,
                ProductName: selectedProduct.ProductName, 
                PreferedSellingPrice: selectedProduct.PreferedSellingPrice
            };
            setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
            setQuantity(1);
            setSelectedProduct(null);
        setModalVisible(false);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    };

    const formattedDate = selectedDate.toLocaleDateString("en-UK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const onChangeDeliveryDate = (event, deliveryDate) => {
        const currentDate = deliveryDate || deliveryDate;
        if(deliveryDate < new Date()){
           setShowDeliveryDatePicker(false);
        return
        }
        setShowDeliveryDatePicker(false);
        setDeliveryDate(currentDate);
    };

    const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-UK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const updateSelectedParty = (item) => {
        setSelectedParty(item);
        setShowPartiesList(false);
    }


    const onClose = () => {
        setShowPartiesList(false);
    }
    const updateSelectedProduct = (item) => {
        setSelectedProduct(item);
        setShowProducts(false);
    }


    const onCloseProducts = () => {
        setShowProducts(false);
    }

    const deleteOrder =()=>{
        let products= selectedProducts;
        products.splice(deleteIndex, 1);
        setSelectedProducts(products);
        setShowConfirmDelete(false)
    }


    const openUpdateModel= (index)=>{
        setUpdateIndex(index);
        setSelectedProduct(selectedProducts[index]);
        setQuantity(selectedProducts[index].OrderedQuantity) 
        setModalVisible(true);
    }

    const handleUpdateProduct = () => {
        const newProduct = {
            Id: 0,
            ProductId: selectedProduct.Id,
            OrderedQuantity:quantity,
            Rate: selectedProduct.PreferedSellingPrice,
            SoldQuantity: quantity,
            ProductName: selectedProduct.ProductName, 
            PreferedSellingPrice: selectedProduct.PreferedSellingPrice
        };
        let products= selectedProducts;
        products[updateIndex]= newProduct;
        setSelectedProducts(products)
        setQuantity(1);
        setSelectedProduct(null);
        setUpdateIndex(-1)
        setModalVisible(false);
};

const submitOrder=async()=>{
setIsLoading(true)
    let data={
        Id: 0, 
        PartyId: selectedParty.Id,
        CustomerNote:notes, 
        EstimatedDeliveryDate: deliveryDate, 
        SalesPersonIdentityUserId: 1, 
        OrderDetailInputVM: selectedProducts, 
    }
    var response = await (await request())
    .post(Api.Orders.Save, qs.stringify(data))
    .catch(function (error) {
        alert(error)
        setIsLoading(false);
        ToastMessage.Short("Error Occurred Contact Support");
    });
    console.log("rest",response )
if (response != undefined) {
    
    if (response.data.Code == 200) {
        setIsLoading(false);
       navigation.navigate("Home")

    } else {
        ToastMessage.Short(response.data.Message);
    }
} else {
    ToastMessage.Short("Error Occurred Contact Support");
}
setIsLoading(false);
}



    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                {/* <View>
                    <Text style={{ fontFamily: "Medium", marginTop: 10, marginBottom: -5 }}>
                       Order Date:
                    </Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <RegularInputText
                            key="date"
                            placeholder="Date"
                            value={formattedDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                </View> */}
                <View>
                    <Text style={{ fontFamily: "Medium", marginTop: 10, marginBottom: -5 }}>
                        Delivery Date:
                    </Text>
                    <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
                        <RegularInputText
                            key="deliverydate"
                            placeholder="Date"
                            value={formattedDeliveryDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showDeliveryDatePicker && (
                        <DateTimePicker
                            value={deliveryDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDeliveryDate}
                        />
                    )}
                </View>
                <View style={{ marginBottom: 15, zIndex: 99 }}>
                <TouchableOpacity
                  style={[styles.addDashedBox, {width:"100%", borderStyle:!selectedParty?"dashed":"solid" }]}
                  onPress={() => setShowPartiesList(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                  { !selectedParty && <BankingIcons.plus height={10} width={10} fill={Colors.primary} />}
                    <Text style={{ fontFamily: "Regular", fontSize: 16 }}>  {!selectedParty ? "Add Party" : selectedParty.PartyName}</Text>
                  </View>
                </TouchableOpacity>
                <Warning text={partyError} />


                    {showPartiesList && (
                        <AutoCompleteList
                            autocompleteurl={Api.Parties.List}
                            noItemFoundText={"No parties found!"}
                            searchablePlaceholder="Search Party"
                            itemSelected={updateSelectedParty}
                            visible={showPartiesList}
                            onClose={() => onClose()}
                            renderItem={(item) => (
                                <View style={styles.item}>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>{item.PartyName}</Text>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>{item.ContactPersonName}</Text>
                                    <Text style={{ fontFamily: "Regular", fontSize: 14 }}>{item.Email}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>

   {selectedProducts.length >0 ? 
                <View style={styles.ordersView}>
                    <Text style={{fontFamily:"SemiBold", fontSize: 16, marginBottom: 4}}>Products</Text>
                    <View>
                        {selectedProducts.map((product, index) => (
                            <TouchableOpacity key={index} style={styles.orderItem}>
                                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                    <Text style={styles.orderName}>{product.ProductName}</Text>
                                    <View style={{flexDirection:"row"}}>
                                    <TouchableOpacity onPress={()=>{
                                        openUpdateModel(index)
                                    }}>
                                                                           <BankingIcons.Edit  height={18} width={18} fill={Colors.primary} style={{marginRight: 8}}/>

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{setShowConfirmDelete(true);
                                        setDeleteIndex(index)
                                    }}>
                                    <BankingIcons.DeleteIcon height={18} width={18} fill={"red"}/>
                                    </TouchableOpacity>
                                    </View>
                                    
                                   
                                </View>
                                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                    <View style={{flexDirection:"row"}}>
                                        <Text style={styles.orderInfo}>Qty: {product.SoldQuantity}  {" "} </Text>
                                        <Text style={styles.orderInfo}>Rate: Rs.{product.Rate}</Text>
                                    </View>
                                    <View>
                                    <Text style={[styles.orderInfo, {fontSize: 16, fontFamily: "SemiBold"}]}>Rs.{product.SoldQuantity * product.Rate} </Text>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                       
                    </View>

                   
            
                    
                
            {/* <Circle backgroundColor={Colors.primary} radius={14} containerStyle={{alignItems:"center", justifyContent:"center", alignSelf:"flex-end", marginTop: 6}}>
            <Circle backgroundColor={"white"} radius={12} containerStyle={{alignItems:"center", justifyContent:"center"}}>
            <TouchableOpacity
                onPress={() => {
                    setModalVisible(true)
                }}
            >\
                <BankingIcons.plus fill={Colors.primary} />
            </TouchableOpacity>

</Circle>
            </Circle> */}
                    

                    

                   
                </View>
                :

                 <>
                                         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily: "Medium", color: "#9A9A9A", fontSize: 20 }}>
                                    Empty cart! Add Products
                                </Text>
                            </View>
                                    </>}

                                       <TouchableOpacity
                  style={[styles.addDashedBox, {marginBottom: 4}]}
                  onPress={()=>{setModalVisible(true)}}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <BankingIcons.plus height={10} width={10} fill={Colors.primary} />
                    <Text
                      style={{
                        fontFamily: "Medium",
                        fontSize: 16,
                        color: Colors.primary,
                        marginLeft: 8,
                      }}
                    >
                      Add Products
                    </Text>
                  </View>
                </TouchableOpacity>


                {selectedProducts.length >0 && <View style={{borderTopWidth: 1, borderBottomWidth:1, borderColor:"black", padding: 8,marginVertical: 8}}>
                    <View style={{flexDirection:"row"}}> 
                    <Text style={{fontFamily:"SemiBold", fontSize: 16}}>Qty:</Text>
                    
                    <Text style={{fontFamily:"SemiBold", fontSize: 16, marginLeft: 4}}>{selectedProducts.reduce((sum, item) => sum + item.SoldQuantity, 0)}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}> 
                    <Text style={{fontFamily:"SemiBold", fontSize: 16}}>Total Amount:</Text>
                    
                    <Text style={{fontFamily:"SemiBold", fontSize: 16, marginLeft: 4}}>{selectedProducts.reduce((sum, item) => sum + item.SoldQuantity* item.Rate, 0)}</Text>
                    </View>
                    

                    </View>
                    }

                                 

                                    <RegularInputText
                        key="notes"
                        placeholder="Notes"
                        onChangeText={(text) => {
                            setNotes(text)
                        }}
                        value={notes}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                                    {selectedProducts.length !=0 &&
                    <TouchableOpacity onPress={async() => {
                        if(!addOrderValidation()){
                            return;
                        }
                        await submitOrder()}}>
                    <ButtonPrimary title={"Submit"} />
                    <ActivityIndicator
                        animating={isLoading}
                        color="#ffa500"
                        style={styles.activityIndicator}
                    />
                </TouchableOpacity>
}


            </View>
            {modalVisible &&
        <CustomModal
          visible={modalVisible}
          closeModal={() => setModalVisible(false)}
        >
                        
                                        <View style={{ width:"100%",  zIndex: 99 }}>
                                            <Text style={{ fontFamily: "Medium", marginBottom: 4 }}>Product</Text>
                    <TouchableOpacity onPress={() => setShowProducts(true)} style={{ paddingLeft: 10, paddingVertical: 14, backgroundColor: "#f5f5f5", borderRadius: 5, }}>

                        <Text style={{ fontFamily: "Regular", fontSize: 14 }}>  {!selectedProduct ? "Choose Product" : selectedProduct.ProductName}</Text>

                    </TouchableOpacity>
                    <Warning text={productError} />


                    {showProducts && (
                        <AutoCompleteList
                            autocompleteurl={Api.Products.List}
                            noItemFoundText={"No products found!"}
                            searchablePlaceholder="Search Products"
                            itemSelected={updateSelectedProduct}
                            visible={showProducts}
                            onClose={() => onCloseProducts()}
                            renderItem={(item) => (
                                <View style={styles.item}>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>{item.ProductName}</Text>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>{item.PreferedSellingPrice}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
                {selectedProduct && <View>
                <Text style={{ fontFamily: "Medium", marginBottom: 4 }}>Rate</Text>
                    <RegularInputText
                        placeholder={"Rs." + selectedProduct.PreferedSellingPrice.toString()}
                        value={"Rs." + selectedProduct.PreferedSellingPrice.toString()}
                        style={{backgroundColor: "#f5f5f5"}}
                        editable={false}
                        placeholderStyle={{color:"black"}}
                    />
                </View>}



                <View>
                <Text style={{ fontFamily: "Medium", marginBottom: 4 }}>Quantity</Text>
                    <RegularInputText
                    keyboardType="numeric"
                        key="quantity"
                        onChangeText={(text) => {
                            setQuantity(parseInt(text))
                        }}
                        value={quantity>0 ?quantity.toString():""}
                        style={{backgroundColor: "#f5f5f5"}}
                    />
                </View>
                <Warning text={quantityError} />
               <TouchableOpacity style={{alignSelf:"flex-end", width:"40%"}} onPress={()=>{
                if(!addProductValidation()){
                    return;
                }
                if(updateIndex>-1){
                    handleUpdateProduct()
                }
                else{
                    handleAddProduct()

                }
                }}>
                        <ButtonPrimary title={updateIndex > -1? "Update": "Add"} style={{height: 50}}/>
                    </TouchableOpacity>
                </CustomModal>}

                {showConfirmDelete && (
            <WarningModal
              text1={"Delete Order Item?"}
              text2={"Are you sure you want to delete this order?"}
              onConfirm={deleteOrder}
              onCancel={() => {
                setShowConfirmDelete(false)
              }}
              warning
            />
          )}
        </ScrollView>
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
    scrollView: {
        height: 250,
        flex: 1,
    },
    ordersView: {
        marginTop: 4,
        marginBottom: 4
    },
    activityIndicator: {
        marginTop: 10,
    },
    modalContainer: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: "white",
        padding: 20,
        height: 350,
        width: 350,
    },
    orderItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        justifyContent: 'center',
    },
    orderName: {
        fontSize: 16,
        fontFamily: "SemiBold",
    },
    orderInfo: {
        fontSize: 16,
    },
    item: {
        padding: 8,
        borderBottomColor: "#e2e2e2",
        borderBottomWidth: 1,
        marginBottom: 5,
        backgroundColor: "#fff",
        paddingLeft: 18
    },
    addDashedBox:
    {
        borderColor: "gray",
        borderWidth: 1,
        justifyContent: "center",
        borderRadius: 6,
        alignItems: "center",
        paddingHorizontal: 8,
        backgroundColor: "white",
        paddingVertical: 5,
        width: "40%", 
        alignSelf:"center", 
        borderStyle:"dashed"
      }
});

export default AddOrder;
