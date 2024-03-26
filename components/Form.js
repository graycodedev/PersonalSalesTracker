import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";

import { RegularInputText } from './Input';
import Warning from './Warning';
import { ButtonPrimary } from './Button';

const Form = ({ inputs,onSubmit, buttonText }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {

        setFormData({ ...formData, [key]: value });
       
    };

    const validateForm = () => {
        let formValid = true;
        const newErrors = {};

        inputs.forEach(input => {
            if (input.required && !formData[input.key]) {
                newErrors[input.key] = true;
                formValid = false;
            }
        });

        

        setErrors(newErrors);
        return formValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData)
        } else {
        }
    };

    return (
        <View style={styles.container}>
            {inputs.map(input => (
                <>
                   {input.type == "input" &&  <>
                        <RegularInputText
                        key={input.key}
                                    placeholder={input.placeholder}
                                    onChangeText={value => handleInputChange(input.key, value)}
                                    boxStyle={{borderColor: errors[input.key] == true?"red":"white", borderWidth: 1}}
                                  />
                                
                    </>}
                    {input.type == "dropdown" &&  <>
                        <View style={{ marginBottom: 10, marginTop: 10, zIndex: 99 }}>
          <DropDownPicker
            containerStyle={{ height: 50 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              fontFamily: "Regular",
              borderColor: "#fff",
              borderWidth: 0,
            }}
            itemStyle={{
              justifyContent: "flex-start",
              fontFamily: "Medium",
              color: "red",
            }}
            labelStyle={{
              fontFamily: "Medium",
              color: "#9A9A9A",
            }}
            arrowColor={"#9A9A9A"}
            placeholder={input.placeholder}
            label={input.placeholder}
            items={input.items}
            onChangeItem={(item) => handleInputChange(input.key, item.value)}
            defaultValue={input.placeholder}
          />
        </View>
                                
                    </>}

                    
                </>
            ))}
            <View style={{ marginTop: 30 }}>
            <TouchableOpacity
              onPress={() => {
                handleSubmit()
              }}
            >
              <ButtonPrimary title={buttonText??"Submit"} />
            </TouchableOpacity>
          </View>
            {/* <Button title="Submit" onPress={handleSubmit} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    inputError: {
        borderColor: 'red'
    }
});

export default Form;