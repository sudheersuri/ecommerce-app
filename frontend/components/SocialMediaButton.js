import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from "../app/GlobalContext";
import { useContext } from "react";

export const SocialMediaButton = ({icon})=>{
   const {theme} = useContext(GlobalContext);
    return (
      <View style={{borderRadius:20,height:75,width:'48%',justifyContent:'center',alignItems:'center',backgroundColor:theme.logoBackgroundColor}}>
          <Ionicons name={icon} size={32} color={theme.textColor} />
      </View>
    );
}