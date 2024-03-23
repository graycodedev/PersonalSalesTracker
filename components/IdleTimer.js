import React, { useEffect, useRef, useState} from "react";
import { AppState } from "react-native";
import helpers from "../constants/Helpers";

const IdleTimer = ({ timeout, onTimeout }) => {
  const [timeOut, setTimeOut]= useState(timeout);
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef(null);
  
  
  useEffect(() => {
    const handleAppStateChange = async(nextAppState) => {
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {

        let api= await helpers.GetPaymentMethods(); 
        // App has become inactive or moved to the background
        // Clear existing timeout if any and set a new one
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async() => {
        setTimeOut(timeout);
          // Call the callback function onTimeout after the specified timeout period
         await onTimeout();
        }, timeOut);


      }
      appState.current = nextAppState;
    };
    const subscription=AppState.addEventListener("change", handleAppStateChange);
    return () => {
      clearTimeout(timeoutRef.current);
      subscription.remove();
    

    };
  }, []);

  return null;
};

export default IdleTimer;