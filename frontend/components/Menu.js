import { View, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";

import useGlobalStore from '../app/useGlobalStore';
import GlobalContext from '../app/GlobalContext';

export default function Menu() {
  const {theme} = useContext(GlobalContext);
  const{globals,setGlobals} = useGlobalStore();
  return (
    <Pressable style={{position:'absolute',width:'100%',zIndex:99,height:'100%'}} onPress={()=>setGlobals({...globals,showSideBar:true})}>
      <Ionicons name="menu" size={30} color={theme.menuIconColor} />
    </Pressable>
  )
}