import React from 'react';
import { Text } from 'react-native';

const DateDisplay = ({ date }) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Text>{formattedDate}</Text>
    );
};

export default DateDisplay;
