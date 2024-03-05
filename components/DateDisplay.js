import React from 'react';
import { Text } from 'react-native';

const DateDisplay = ({ date }) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Text>{formattedDate}</Text>
    );
};

const TimeDisplay = ({ time }) => {
    const formattedTime = new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });

    return (
        <Text>{formattedTime}</Text>
    );
};

export { DateDisplay, TimeDisplay };