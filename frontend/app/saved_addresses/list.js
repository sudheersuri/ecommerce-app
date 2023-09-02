import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useState } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function List() {
   const [savedAddresses,setSavedAddresses] = useState([]);
   const router = useRouter();
   const Header = () => {
        return (
          <View style={{position:'relative', alignItems: 'center',borderBottomWidth:1,borderBottomColor:'gray',paddingBottom:20}}>
            <Ionicons name="chevron-back-outline" size={30} color="#fff" style={{position:'absolute',left:0}} onPress={() => router.back()} />
            <Text style={{ color:'#fff',marginTop:5,fontSize:18,fontWeight:'bold' }}>Saved Addresses</Text>
          </View>
        );
  }
  return (
    <View style={styles.container}>
      <Header />
      {
        savedAddresses.length === 0 ? (
            <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
                <Ionicons name="wallet-outline" size={60} color="gray" />
                <Text style={{color:'#fff'}}>No Saved Addresses</Text>
                <Pressable  style={{position:'absolute',bottom:25,width:'100%'}} onPress={()=>router.push('/saved_addresses/create_or_edit')}>
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
        ) : (
            <FlatList
                data={savedAddresses}
                renderItem={({item}) => <AddressItem item={item} />}
                keyExtractor={item => item.id}
            />
        )
      }
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