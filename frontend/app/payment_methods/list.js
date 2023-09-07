import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { checkAccessToken } from '../../functions';

export default function List() {
   const router = useRouter();
   useEffect(() => {
    checkAccessToken(router);
  }, []);
   const Header = () => {
        return (
          <View style={{position:'relative', alignItems: 'center',borderBottomWidth:1,borderBottomColor:'gray',paddingBottom:20}}>
            <Ionicons name="chevron-back-outline" size={30} color="#fff" style={{position:'absolute',left:0}} onPress={() => router.back()} />
            <Text style={{ color:'#fff',marginTop:5,fontSize:18,fontWeight:'bold' }}>Payment methods</Text>
          </View>
        );
  }
  return (
    <View style={styles.container}>
      <Header />
      {
        paymentMethods.length === 0 ? (
            <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
                <Ionicons name="wallet-outline" size={60} color="gray" />
                <Text style={{color:'#fff'}}>No payment methods added</Text>
                <Pressable  style={{position:'absolute',bottom:25,width:'100%'}} onPress={()=>router.push('/payment_methods/create_or_edit')}>
                        <LinearGradient
                        colors={["#DF00BC", "#9C00E4"]}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={[styles.button, { marginTop: 40 }]}
                        >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Add Card</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        ) : (
            <FlatList
                data={paymentMethods}
                renderItem={({item}) => <PaymentMethodItem item={item} />}
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