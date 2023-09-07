
import { Text, View, TextInput, Button, Alert, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import {  useEffect, useState } from "react";
import { SocialMediaButton } from "../components/SocialMediaButton";

import { API_REQUEST, showToast } from "../functions";
import env from '../env';
import useGlobalStore from "./useGlobalStore";

const REQUEST_URL = `${env.API_URL}/login`;

export default function Login() {
  const{globals,setGlobals} = useGlobalStore();
  const {theme} = globals;
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
    if(response.status===401) 
    {
      showToast('error',data.message);
      return;
    }
    else if(response.status===200)
    {
      if(data.access_token){
        await AsyncStorage.setItem('access_token', data.access_token);
        setGlobals({...globals,username:data.username});
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.smallText}>Login with one of the following options</Text>
      <View style={styles.SocialMediaButtonsContainer}>
         <SocialMediaButton icon="logo-google"/>
         <SocialMediaButton icon="logo-apple"/>
      </View>
      <Text style={[styles.label,{marginBottom:10,marginLeft:7}]}>Email</Text>
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
            style={styles.field}
          
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>* Email is required.</Text>}
      </View>

      <Text style={[styles.label,{marginTop:30,marginBottom:10,marginLeft:7}]}>Password</Text>
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
            style={styles.field}
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
          colors={['#DF00BC', '#9C00E4']}
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
                <Text style={{color:'#A2A2A2'}}>Don't have an account? <Text style={{color:'#fff'}}>Register</Text></Text>
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
      backgroundColor:'#000',
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
      color:'#fff',
      marginTop:20,
    },
    smallText:{
      color:'#888888',
      fontSize:13,
      marginTop:40,
      marginLeft:7
    },
    label:{
      color:'#fff',
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
      color:'#fff',
      paddingVertical:18,
      paddingHorizontal:15,
    }
}
);