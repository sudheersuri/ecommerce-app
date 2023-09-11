import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";
import useGlobalStore from "../app/useGlobalStore";
import { logout } from "../functions";
import { darkTheme, lightTheme } from "../theme";
import GlobalContext from "../app/GlobalContext";

export default function Sidebar() {
  const{globals,setGlobals} = useGlobalStore();
  const router = useRouter();
  const {theme,setTheme} = useContext(GlobalContext);
  const ThemeButton = () => {
    return (<View>
      <Ionicons name="moon" size={22} color={theme.moonColor} />
    </View>);
  }
  return (
    globals.showSideBar && (
      <View style={[styles.container,{backgroundColor:theme.backgroundColor,borderRightWidth: theme.mode==='dark'?1:0}]}>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: theme.textColor, fontSize: 25 }}>Menu</Text>
          <Ionicons
            name="close-outline"
            size={30}
            color={theme.textColor}
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
          <Text style={{ color: theme.textColor, fontSize: 18, marginLeft: 10 }}>
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
          <Text style={{ color: theme.textColor, fontSize: 18,marginLeft:10 }}>
            Saved Addresses
          </Text>
        </Pressable>
        <Pressable style={{marginTop:30,flexDirection:'row',alignItems:'center'}}  onPress={() => 
      setTheme(theme.mode==='dark'?lightTheme:darkTheme)
    } >
            <ThemeButton />
            <Text style={{color:theme.textColor,fontSize: 18,marginLeft:10}}>{theme.mode==='dark'?'Light Mode':'Dark Mode'}</Text>
        </Pressable>
        <Pressable
          style={{flexDirection:'row',alignItems:'center', marginTop: 30}}
          onPress={() => {
            setGlobals({ ...globals, showSideBar: false });
            logout(router);
          }}
        >
          <Ionicons name="log-out" size={20} color="gray" />
          <Text style={{ color: theme.textColor, fontSize: 18,marginLeft:10 }}>
            Logout
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
    paddingHorizontal: 10,
    
    paddingTop: 50,
    borderColor: "#1F1F1F",
    shadowOffset: { width: 15,height:2 },
    shadowOpacity: 0.7,
    shadowRadius:100
  },
});
