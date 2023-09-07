import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";
import useGlobalStore from "../app/useGlobalStore";

export default function Sidebar() {
  const{globals,setGlobals} = useGlobalStore();
  const router = useRouter();
  return (
    globals.showSideBar && (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 25 }}>Menu</Text>
          <Ionicons
            name="close-outline"
            size={30}
            color="#fff"
            onPress={() => setGlobals({ ...globals, showSideBar: false })}
          />
        </View>
        <Pressable
         style={{flexDirection:'row',alignItems:'center', marginTop: 30}}
          onPress={() => {
            setGlobals({ ...globals, showSideBar: false });
            router.push("/orders");
          }}
        >
             <Ionicons name="cart" size={20} color="gray" />
          <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>
            Orders
          </Text>
        </Pressable>
        <Pressable
          style={{flexDirection:'row',alignItems:'center', marginTop: 30}}
          onPress={() => {
            setGlobals({ ...globals, showSideBar: false });
            router.push({pathname:"/saved_addresses/list",params:{selectionMode:true}});
          }}
        >
          <Ionicons name="location" size={20} color="gray" />
          <Text style={{ color: "#fff", fontSize: 18,marginLeft:10 }}>
            Saved Addresses
          </Text>
        </Pressable>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    position: "absolute",
    width: "55%",
    height: "130%",
    backgroundColor: "black",
    paddingHorizontal: 10,
    borderRightWidth: 1,
    paddingTop: 50,
    borderColor: "#1F1F1F",
    shadowOffset: { width: 15,height:2 },
    shadowOpacity: 0.7,
    shadowRadius:100
  },
});
