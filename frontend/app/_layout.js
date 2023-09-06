import { Stack } from 'expo-router';
import GlobalContext from '../GlobalContext';
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from '../theme';
import { useState } from 'react';

export default function HomeLayout() {
    
    const colorScheme = useColorScheme();
    // Choose the theme based on device appearance
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    
    const [globals, setGlobals] = useState({ theme: theme,username:'',selectedCategory:1,cartItems:[],savedAddresses:[],shippingAddressId:0,showSideBar:false,categories:[],products:[] });
    return (
        <GlobalContext.Provider value={{ globals, setGlobals }}>
            <Stack screenOptions={{headerShown:false}}/>
        </GlobalContext.Provider>
    )
}
