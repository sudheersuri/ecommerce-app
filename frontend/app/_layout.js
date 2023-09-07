import { Stack } from 'expo-router';

import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from '../theme';
import { useState } from 'react';

export default function HomeLayout() { 
    return (
     <Stack screenOptions={{headerShown:false}}/> 
    )
}
