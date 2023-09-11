import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { API_REQUEST, checkAccessToken, redirectToLoginWithSessionExpiredMessage, showToast } from '../../functions';
import useGlobalStore from '../useGlobalStore';
import env from '../../env';
import GlobalContext from '../GlobalContext';


export default function List() {
  const {theme} = useContext(GlobalContext);
   const router = useRouter();
   const{globals,setGlobals} = useGlobalStore();
   const fetchAddresses = async () => {
    try {
      const REQUEST_URL = `${env.API_URL}/get_addresses`;
      const response = await API_REQUEST(REQUEST_URL, "GET", null, true);
      const data = await response.json();

      if (response.status === 401)
        redirectToLoginWithSessionExpiredMessage(router);
      else if (response.status === 200) {
        if (data.length)
        {
          setGlobals({
            ...globals,
            savedAddresses: data,
            shippingAddressId: data[0].id,
          });
        }
      } else showToast("error", data.message);
    } catch (error) {
      showToast("error", error);
    }
  };
   useEffect(() => {
    checkAccessToken(router);
    fetchAddresses();
  }, []);
   const params = useLocalSearchParams();
   const Header = () => {
        return (
          <View style={{position:'relative', alignItems: 'center',paddingBottom:20}}>
            <Ionicons name="chevron-back-outline" size={30} color={theme.textColor} style={{position:'absolute',left:0}} onPress={() => router.back()} />
            <Text style={{ color:theme.textColor,marginTop:5,fontSize:18,fontWeight:'bold' }}>Saved Addresses</Text>
          </View>
        );
  }

  const AddressItem = ({item}) => {
   
   return (<Pressable  style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center',borderBottomWidth:0, borderRadius:10,borderBottomColor:theme.selectedAddressItemBackgroundColor,padding:10,backgroundColor:globals.shippingAddressId===item.id && !params?.selectionMode ?theme.selectedAddressItemBackgroundColor:'transparent',paddingVertical:20}} 
      onPress={() => {
        params?.selectionMode?router.push({pathname:'/saved_addresses/create_or_edit',params:{...item}}) :setGlobals({...globals,shippingAddressId:item.id})
      }}>
      <View style={{flexDirection:'row',alignItems:'center',flex:8,paddingRight:5}}>
        <Ionicons name="location" size={45} color={theme.textColor} />
        <View style={{marginLeft:5}}>
          <Text style={{color:theme.textColor,fontWeight:'bold'}}>{item.nickname}</Text>
          <Text style={{color:theme.textColor,marginTop:5,width:"98%"}}>{`${item.address}, ${item.city}, ${item.state}, ${item.zipcode}`}</Text>
        </View>
      </View>
      <View style={{flex:1}}>
      {params?.selectionMode ? <Ionicons name="create-outline" size={24} color={theme.textColor} />:null}
      </View>
    </Pressable>)
  }
  return (
    <View style={[styles.container,{position:'relative',backgroundColor:theme.backgroundColor}]}>
      <Header />
      {
        globals.savedAddresses?.length === 0 ? (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Ionicons name="wallet-outline" size={60} color="gray" />
                <Text style={{color:theme.textColor}}>No Saved Addresses</Text>
                
            </View>
        ) : (
            <FlatList
                data={globals.savedAddresses}
                renderItem={AddressItem}
                keyExtractor={item => item.id}
                extraData={globals}
            />
        )
      }
      <View style={{justifyContent:'center',alignItems:'center'}}>
      <Pressable style={{position:'absolute',bottom:25,width:'100%'}} onPress={()=>router.push('/saved_addresses/create_or_edit')}>
                        <LinearGradient
                        colors={theme.buttonThemeColor}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={[styles.button, { marginTop: 40 }]}
                        >
                        <Text style={{ color: '#fff', fontWeight: "600" }}>Add New Address</Text>
                    </LinearGradient>
      </Pressable>
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
    button: {
      paddingVertical: 22,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#DF00BC",
      borderRadius: 15,
    }
});