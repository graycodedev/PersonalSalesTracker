import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ToastMessage from './Toast/Toast';

const Toast = ({ message }) => {
    const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (message.length>0) 
    setIsVisible(true)

      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }
      ).start(() => {
        setTimeout(() => {
            setIsVisible(false)
          hideToast();
        }, 2000); // Adjust the duration you want the toast message to be visible
      });
    
  }, [message.length>0]);

  const hideToast = () => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }
    ).start();
  };

  return (
    <>
        {isVisible && ( <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>)}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Toast;
