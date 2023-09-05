import { View, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import GlobalContext from '../GlobalContext';

export default function Menu() {
  const {globals,setGlobals} = useContext(GlobalContext);
  return (
    <Pressable style={{position:'absolute',width:'100%',zIndex:99,height:'100%'}} onPress={()=>setGlobals({...globals,showSideBar:true})}>
      <Ionicons name="menu" size={30} color="white" />
    </Pressable>
  )
}