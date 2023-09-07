import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";

import useGlobalStore from '../app/useGlobalStore';

export default function Menu() {
  const{globals,setGlobals} = useGlobalStore();
  return (
    <Pressable style={{position:'absolute',width:'100%',zIndex:99,height:'100%'}} onPress={()=>setGlobals({...globals,showSideBar:true})}>
      <Ionicons name="menu" size={30} color="white" />
    </Pressable>
  )
}