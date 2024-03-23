import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { RegularInputText } from './Input';

const Form = ({ inputs }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const validateForm = () => {
        let formValid = true;
        const newErrors = {};

        inputs.forEach(input => {
            if (input.required && !formData[input.name]) {
                newErrors[input.name] = true;
                formValid = false;
            }
        });

        setErrors(newErrors);
        return formValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
        } else {
        }
    };

    return (
        <View style={styles.container}>
            {inputs.map(input => (
                // <TextInput
                //     key={input.name}
                //     style={[
                //         styles.input,
                //         errors[input.name] && styles.inputError
                //     ]}
                //     placeholder={input.placeholder}
                //     onChangeText={value => handleInputChange(input.name, value)}
                // />
                <RegularInputText
                key={input.name}
            placeholder={input.placeholder}
            onChangeText={value => handleInputChange(input.name, value)}
            // value={contactPersonName}
          />
            ))}
            <Button title="Submit" onPress={handleSubmit} />
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