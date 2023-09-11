import { Stack } from 'expo-router';
import { darkTheme} from '../theme';
import { useState } from 'react';
import GlobalContext from './GlobalContext';

export default function HomeLayout() { 
     // Choose the theme based on device appearance
    const themeObj  = darkTheme;

    const [theme, setTheme] = useState({...themeObj});

    return (
    <GlobalContext.Provider value={{ theme, setTheme }}>
     <Stack screenOptions={{headerShown:false}}/> 
     </GlobalContext.Provider>
    )
}
