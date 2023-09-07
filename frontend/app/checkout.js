import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";

import { FlatList } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { StripeProvider } from "@stripe/stripe-react-native";
import PaymentButton from '../components/PaymentButton';
import useGlobalStore from './useGlobalStore';
import { checkAccessToken } from '../functions';

export default function Checkout() {
  const{globals,setGlobals} = useGlobalStore();
  const router = useRouter();
  const shippingCharge = 5;
  useEffect(() => {
    checkAccessToken(router);
  }, []);
  const Header = () => {
    return (
      <View style={{position:'relative', alignItems: 'center',borderBottomWidth:1,borderBottomColor:'gray',paddingBottom:20}}>
        <Ionicons name="chevron-back-outline" size={30} color="#fff" style={{position:'absolute',left:0}} onPress={() => router.back()} />
        <Text style={{ color:'#fff',marginTop:5,fontSize:18,fontWeight:'bold' }}>Checkout</Text>
      </View>
    );
  }
  const getAddressNickName = () => {
    //get the shippingAddressId from globals and find the address in the savedAddresses array
    let address = globals?.savedAddresses.find(address => address.id === globals.shippingAddressId) ?? null;
    //join them with comma
    return address ? address.nickname : null;
  }
  const getShippingAddress = () => {
   
    //get the shippingAddressId from globals and find the address in the savedAddresses array
    let address = globals?.savedAddresses.find(address => address.id === globals.shippingAddressId) ?? null;
    //join them with comma
    return address ? `${address.address}, ${address.city}, ${address.state}, ${address.zipcode}` : null;
  }
  const QtySelector = ({product}) => {
    return (
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Pressable onPress={()=>
              {
                  //remove item if qty is 0
                  if(product.qty === 1)
                  {
                    setGlobals({...globals,cartItems:globals.cartItems.filter(cartItem => cartItem.id !== product.id)})
                    return;
                  }
                  else 
                    setGlobals({...globals,cartItems:globals.cartItems.map(item => item.id === product.id ? {...item,qty:item.qty-1} : item)})
              }
        }> 
          <Ionicons name="remove-circle-outline" size={30} color="#fff" />
          </Pressable>
        <Text style={{color:'#fff',marginHorizontal:10}}>{product.qty}</Text>
        <Pressable
          onPress={()=>
              setGlobals({...globals,cartItems:globals.cartItems.map(item => item.id === product.id ? {...item,qty:item.qty+1} : item)})
        }
        >
        <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </Pressable>
      </View>
    );
  }

  const CartItemsList = () => {
    const ProductItem = ({item}) => {
      return (
        <View style={{justifyContent:'space-between',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'gray',paddingVertical:10}}>
          <View style={{flexDirection:'row'}}>
                <Image source={{uri:item.imageURL}} style={{width:80,height:80}} />
                <View style={{justifyContent:'space-between',paddingVertical:10}}>
                  <Text style={{color:'#fff'}}>{item.name}</Text>
                  <QtySelector product={item}/>
                </View>
          </View>
          <View style={{justifyContent:'space-between',paddingVertical:10,alignItems:'center'}}>
              <Text style={{color:'#fff'}}>$ 
              {item.price*globals.cartItems.filter(cartItem => cartItem.id === item.id)[0].qty}</Text>
              <Pressable onPress={()=>
                setGlobals({...globals,cartItems:globals.cartItems.filter(cartItem => cartItem.id !== item.id)})
              }>
              <Ionicons name="trash" size={30} color="#fff" />
              </Pressable>
          </View>
        </View>
      );
    }
    return globals.cartItems.length ? 
        (<FlatList 
        data={globals.cartItems}
        renderItem={ProductItem}
        keyExtractor={item => item.id}
      />) : <Text style={{color:'#fff'}}>No items in cart</Text>
  } ;
  const getSubTotal = () => {
    //if no cart items return 0
    if(globals.cartItems.length === 0)
      return 0;
    //else return the sum of qty*price of each item fixed to 2 decimal places
    return globals.cartItems.reduce((sum,item)=>sum+item.qty*item.price,0);
  }
  const getTax = () => {
    //if no cart items return 0
    if(globals.cartItems.length === 0)
      return 0;

    return ((getSubTotal()+shippingCharge) * 0.13).toFixed(2);
  }
  const getTotal = () => {
    return (getSubTotal() + parseFloat(getTax())).toFixed(2);
  }
  
  return (
    <View style={styles.container}>
      <Header />
      <View style={{flex:1}}>
          <View style={{flex:10,marginTop:5,borderBottomWidth:1,borderBottomColor:'gray'}}>
              <CartItemsList />
          </View>
          <View style={{flex:4,paddingHorizontal:3}}>
                {/* <Pressable style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',marginVertical:10}} onPress={()=>router.push('/payment_methods/list')}>
                      <View style={{justifyContent:'space-between'}}>
                          <Text style={{color:'#fff'}}>Payment</Text>
                          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                                <Ionicons name="wallet-outline" size={20} color="#fff" />
                                <Text style={{color:'#fff',marginLeft:5}}>No Payment method selected</Text>
                          </View>
                      </View>
                      <Ionicons name="chevron-forward-outline" size={20} color="#fff" />
                </Pressable> */}
                <Pressable style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',borderTopWidth:1,borderTopColor:'gray',paddingVertical:10}} onPress={()=>router.push('/saved_addresses/list')}>
                      <View style={{justifyContent:'space-between'}}>
                          <Text style={{color:'#fff'}}>Shipping To{' '+getAddressNickName()}</Text>
                          {getShippingAddress() ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                              <Ionicons name="location" size={20} color="#fff" />
                              <Text style={{ color: '#fff' }}>{getShippingAddress()}</Text>
                            </View>
                          ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                              <Ionicons name="ios-alert-circle" size={20} color="red" />
                              <Text style={{ color: 'red' }}> No shipping address selected</Text>
                            </View>
                          )}
                      </View>
                      <Ionicons name="chevron-forward-outline" size={20} color="#fff" />
                </Pressable>
                <View style={{borderTopWidth:1,borderTopColor:'gray',paddingVertical:20}}>
                  <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style={{color:'#fff'}}>Subtotal</Text>
                    <Text style={{color:'#fff'}}>${getSubTotal().toFixed(2)}</Text>
                  </View>
                  <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
                    <Text style={{color:'#fff'}}>Shipping</Text>
                    <Text style={{color:'#fff'}}>${shippingCharge}</Text>
                  </View>
                  <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
                    <Text style={{color:'#fff'}}>Tax</Text>
                    <Text style={{color:'#fff'}}>${getTax()}</Text>
                  </View>
                  <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
                    <Text style={{color:'#fff'}}>Total</Text>
                    <Text style={{color:'#fff'}}>${getTotal()}</Text>
                  </View>
                </View>
               
                
          </View>
          {(getSubTotal()!=0 && globals.shippingAddressId!=0) && <View style={{flex:3}}>
          <StripeProvider publishableKey="pk_test_51MpIlIDYTDNtMFwaNHZ8W0ywBPcphtXCrYMO0A7nrcrTEkZImR4N7kQVsYNqkoNFPX5Ex6BkNTI4XZG3aBG8XOkZ00GVBBGcUf">
                <PaymentButton amount={getTotal()}/>
          </StripeProvider>
          </View>}
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  button:{
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DF00BC",
    borderRadius: 15,
  }
});
