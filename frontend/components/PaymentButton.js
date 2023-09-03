import { View, Text, TextInput, Button, Alert, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function PaymentButton({amount}) {
    const stripe = useStripe();

const pay = async () => {
  const showToast = (message) => {
    Toast.show({
      type: 'error',
      text2: message,
      position:'top'
    });
  }
    try {
      const finalAmount = parseInt(amount);
      const access_token = await AsyncStorage.getItem('access_token');
      if (finalAmount < 1) {
        showToast('Something went wrong, please try again later.');
        return;
      }
      const response = await fetch("http://127.0.0.1:5000/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ amount: finalAmount }),
      });
      const data = await response.json();
      if (!response.ok) {
       
        showToast(data.message);
        return;
      }
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
      });
      if (initSheet.error) {
        showToast(initSheet.error.message);
        return; 
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret,
      });
      if (presentSheet.error) {
        showToast(presentSheet.error.message);
       
      }
      Alert.alert("Payment successfull! Thank you for placing order.");
    } catch (err) {
      showToast(err.message);
      return;
    }
  };

  return (
    <View>
      <Toast />
   <Pressable onPress={pay}>
                  <LinearGradient
                    colors={["#DF00BC", "#9C00E4"]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={[styles.button, { marginTop: 40 }]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600",fontSize:18 }}>
                       Pay ${amount}
                    </Text>
                  </LinearGradient>
          </Pressable>
</View>
  )
}

const styles = StyleSheet.create({
  button:{
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DF00BC",
    borderRadius: 15,
  }
});
