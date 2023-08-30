import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export const SocialMediaButton = ({icon})=>{
    return (
      <View style={{borderRadius:20,height:75,width:'48%',justifyContent:'center',alignItems:'center',backgroundColor:'#171717'}}>
          <Ionicons name={icon} size={32} color="white" />
      </View>
    );
}