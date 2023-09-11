import { View, Text, TextInput, Button, Alert, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { redirectToOrdersWithSuccessMessage} from '../functions';

import { useRouter } from 'expo-router';
import useGlobalStore from '../app/useGlobalStore';
import { useContext, useState } from 'react';
import GlobalContext from '../app/GlobalContext';

export default function PaymentButton({amount}) {
  const {theme} = useContext(GlobalContext);
   const stripe = useStripe();
   const{globals,setGlobals} = useGlobalStore();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const pay = async () => {

    setLoading(true);
    try {
      const finalAmount = parseInt(amount);
      const access_token = await AsyncStorage.getItem('access_token');
      if (finalAmount < 1) {
       alert('Something went wrong, please try again later.');
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
      setLoading(false);
      if (!response.ok) {
       alert(data.message);
        return;
      }
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
      });
      if (initSheet.error) {
       alert(initSheet.error.message);
        return; 
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret,
      });
      if (presentSheet.error) {
       alert(presentSheet.error.message);
       return;
      }
      
      redirectToOrdersWithSuccessMessage(router);
    } catch (err) {
      setLoading(false);
    alert(err.message);
      return;
    }
   
  };

  return (
    <View>      
  
    <Pressable onPress={pay}>
                    <LinearGradient
                      colors={theme.buttonThemeColor}
                      start={[0, 0]}
                      end={[1, 0]}
                      style={[styles.button, { marginTop: 40 }]}
                    >
                     {loading?
                     <ActivityIndicator size="small" color="#fff" />
                     :<Text style={{ color: "#fff", fontWeight: "600",fontSize:18 }}>
                        Pay ${amount}
                      </Text>}
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
