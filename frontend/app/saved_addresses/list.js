import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalContext from '../../GlobalContext';
import { checkAccessToken } from '../../functions';


export default function List() {
   const router = useRouter();
   const {globals,setGlobals} = useContext(GlobalContext);
   useEffect(() => {
    checkAccessToken(router);
  }, []);
   const params = useLocalSearchParams();
   const Header = () => {
        return (
          <View style={{position:'relative', alignItems: 'center',paddingBottom:20}}>
            <Ionicons name="chevron-back-outline" size={30} color="#fff" style={{position:'absolute',left:0}} onPress={() => router.back()} />
            <Text style={{ color:'#fff',marginTop:5,fontSize:18,fontWeight:'bold' }}>Saved Addresses</Text>
          </View>
        );
  }

  const AddressItem = ({item}) => {
   
   return (<Pressable  style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center',borderBottomWidth:0, borderRadius:10,borderBottomColor:"gray",padding:10,backgroundColor:globals.shippingAddressId===item.id && !params?.selectionMode ?'#1F1F1F':'transparent',paddingVertical:20}} 
      onPress={() => {
        params?.selectionMode?router.push({pathname:'/saved_addresses/create_or_edit',params:{...item}}) :setGlobals({...globals,shippingAddressId:item.id})
      }}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Ionicons name="location" size={45} color="white" />
        <View style={{marginLeft:5}}>
          <Text style={{color:'#fff',fontWeight:'bold'}}>{item.nickname}</Text>
          <Text style={{color:'#fff',marginTop:5,width:'96%'}}>{`${item.address}, ${item.city}, ${item.state}, ${item.zipcode}`}</Text>
        </View>
      </View>
      {params?.selectionMode ? <Ionicons name="create-outline" size={24} color="white" />:<Ionicons name="chevron-forward" size={24} color="white" />}
    </Pressable>)
  }
  return (
    <View style={[styles.container,{position:'relative'}]}>
      <Header />
      {
        globals.savedAddresses?.length === 0 ? (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Ionicons name="wallet-outline" size={60} color="gray" />
                <Text style={{color:'#fff'}}>No Saved Addresses</Text>
                
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
                        colors={["#DF00BC", "#9C00E4"]}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={[styles.button, { marginTop: 40 }]}
                        >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Add New Address</Text>
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