
import { Text, View, TextInput, Button, Alert, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import {  useContext, useEffect, useState } from "react";
import { SocialMediaButton } from "../components/SocialMediaButton";

import { API_REQUEST, showToast } from "../functions";
import env from '../env';
import useGlobalStore from "./useGlobalStore";
import GlobalContext from "./GlobalContext";

const REQUEST_URL = `${env.API_URL}/login`;

export default function Login() {
  const {theme,setTheme} = useContext(GlobalContext);
  const{globals,setGlobals} = useGlobalStore();
  const [loading,setLoading] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (reqdata) => {
    setLoading(true);
    const response = await API_REQUEST(REQUEST_URL,'POST',reqdata);
    const data = await response.json();
    setLoading(false);
    if(response.status===401 || response.status===422) 
    {
      showToast('error',data.message);
      return;
    }
    else if(response.status===200)
    {
      if(data.access_token){
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('username', data.username);
        router.replace('/');
        return;
      }
      else 
      {
        showToast('error',data.message);
        return;
      }
    }
  };
  useEffect(()=>{
    if(params?.error) showToast('error',params.error);
  },[params]);

  useEffect(()=>{

  },[theme]);

  return (
    <>
    <StatusBar />
    <ScrollView style={[styles.container,{backgroundColor:theme.backgroundColor}]}>
      <Text style={[styles.title,{color:theme.textColor}]}>Login</Text>
      <Text style={[styles.smallText,{color:theme.textColor}]}>Login with one of the following options</Text>
      <View style={styles.SocialMediaButtonsContainer}>
         <SocialMediaButton icon="logo-google"/>
         <SocialMediaButton icon="logo-apple"/>
      </View>
      <Text style={[styles.label,{marginBottom:10,marginLeft:7,color:theme.textColor}]}>Email</Text>
      <View style={{position:"relative"}}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Enter your email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#888888"
            style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>* Email is required.</Text>}
      </View>

      <Text style={[styles.label,{marginTop:30,marginBottom:10,marginLeft:7,color:theme.textColor}]}>Password</Text>
      <View style={{position:"relative"}}>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 6, 
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Enter your password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
            placeholderTextColor="#888888"
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.errorText}>* Password should be at least 6 characters.</Text>
      )}
      </View>
      <Pressable  onPress={handleSubmit(onSubmit)}>
      <LinearGradient
          colors={theme.buttonThemeColor}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.button,{marginTop:40}]}
        >
        {loading?
        <ActivityIndicator size="small" color="#fff" />:
        <Text style={{color:'#fff',fontWeight:"600"}}>Log in</Text>}
        </LinearGradient>
      </Pressable>
      <Link href="/register" asChild>
             <Pressable style={{alignItems:'center',marginTop:15}}>
                <Text style={{color:'#A2A2A2'}}>Don't have an account? <Text style={{color:theme.textColor}}>Register</Text></Text>
             </Pressable>
      </Link>
      <Toast />
    </ScrollView>
    </>
  );
}


const styles = StyleSheet.create(
  {
    container:{
      flex:1,
     
      paddingTop:40,
      paddingHorizontal:15,
    },
    SocialMediaButtonsContainer:{marginTop:15,marginBottom:40,flexDirection:'row',justifyContent:'space-between'},
    button:{
      paddingVertical:22,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#DF00BC',
      borderRadius:15,
      
    },
    title:{
      fontSize:30,
      fontWeight:'500',
      marginTop:20,
    },
    smallText:{
      color:'#888888',
      fontSize:13,
      marginTop:40,
      marginLeft:7
    },
    label:{
      
      fontSize:17
    },
    errorText:{
      color:'#9C00E4',
      position:"absolute",
      top:60,
      left:7
    },
    field:{
      backgroundColor:'#171717',
      borderRadius:15,
      borderColor:'#1F1F1F',
      borderWidth:1,
      paddingVertical:18,
      paddingHorizontal:15,
    }
}
);