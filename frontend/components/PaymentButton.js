import { View, Text, TextInput, Button, Alert, Pressable, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { redirectToOrdersWithSuccessMessage, showToast } from '../functions';
import GlobalContext from '../GlobalContext';
import { useRouter } from 'expo-router';

export default function PaymentButton({amount}) {
   const stripe = useStripe();
   const { globals,setGlobals } = useContext(GlobalContext);
   const router = useRouter();
   const pay = async () => {


    try {
      const finalAmount = parseInt(amount);
      const access_token = await AsyncStorage.getItem('access_token');
      if (finalAmount < 1) {
        showToast('error','Something went wrong, please try again later.');
        return;
      }
      const response = await fetch("http://127.0.0.1:5000/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ 
          amount: finalAmount,
          shipping_address: globals.savedAddresses.filter((address)=>globals.shippingAddressId===address.id)[0],
          items: globals.cartItems,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast('error',data.message);
        return;
      }
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
      });
      if (initSheet.error) {
        showToast('error',initSheet.error.message);
        return; 
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret,
      });
      if (presentSheet.error) {
        showToast('error',presentSheet.error.message);
       
      }
      redirectToOrdersWithSuccessMessage(router);
    } catch (err) {
      showToast('error',err.message);
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
