import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from 'react-native-toast-message';
import { useContext, useState } from "react";
import { SocialMediaButton } from "../components/SocialMediaButton";
import { API_REQUEST, showToast } from "../functions";
import env from "../env";
import GlobalContext from "./GlobalContext";


const REQUEST_URL = `${env.API_URL}/register`;

export default function Register() {
  const {theme,setTheme} = useContext(GlobalContext);
 
  const [loading,setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();



  const onSubmit = async (reqdata) => {
    setLoading(true);
    const response = await API_REQUEST(REQUEST_URL,'POST',reqdata);
    const data = await response.json();
   
    if(response.status!==200)
    {
      showToast('error',data.message);
      setLoading(false);
      return;
    }
    else
    {
      showToast('success',data.message);
      //after 2 seconds redirect to login page
      setTimeout(()=>{
      setLoading(false);
      router.replace('/login');
      },3000);
      return;
    }
  };

  return (
    <ScrollView style={[styles.container,{backgroundColor:theme.backgroundColor}]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton,{backgroundColor:theme.backgroundColor,borderWidth:theme.mode==='light'?0:2}]}
        >
          <Ionicons name="chevron-back" size={32} color={theme.textColor} />
        </Pressable>
        <Text style={[styles.title, { marginLeft: 10,color:theme.textColor }]}>Register</Text>
      </View>
      <Text style={styles.smallText}>
        Register with one of the following options
      </Text>
      <View
        style={{
          marginTop: 15,
          marginBottom: 40,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <SocialMediaButton icon="logo-google" />
        <SocialMediaButton icon="logo-apple" />
      </View>
     
      <Text style={[styles.label, { marginBottom: 10, marginLeft: 7,color:theme.textColor }]}>Username</Text>
      <View style={{position:"relative"}}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Enter your username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
            placeholderTextColor="#888888"
          />
        )}
        name="username"
      />
      {errors.username && <Text style={styles.errorText}>* Name is required</Text>}
      </View>

     
      <Text style={[styles.label, { marginTop:30,marginBottom: 10, marginLeft: 7,color:theme.textColor }]}>Email</Text>
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
            style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
            placeholderTextColor="#888888"
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>* Email is required.</Text>}
      </View>

      <Text
        style={[
          styles.label,
          { marginTop: 30, marginBottom: 10, marginLeft: 7,color:theme.textColor },
        ]}
      >
        Password
      </Text>
      <View style={{position:"relative"}}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Enter your password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
            placeholderTextColor="#888888"
            secureTextEntry
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.errorText}>* Password should be at least 6 characters.</Text>
      )}
      </View>

      {errors.password && (
        <Text style={{ color: "#fff", marginTop: 5 }}>
          
        </Text>
      )}
      <Pressable onPress={handleSubmit(onSubmit)}>
        <LinearGradient
          colors={theme.buttonThemeColor}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.button, { marginTop: 40 }]}
        >
            {loading?
           <ActivityIndicator size="small" color={theme.textColor} />:
          <Text style={{ color: "#fff", fontWeight: "600" }}>Register</Text>}
        </LinearGradient>
      </Pressable>
      <Link href="/login" asChild>
        <Pressable style={{ alignItems: "center", marginTop: 15 }}>
          <Text style={{ color: "#A2A2A2" }}>
            Already have an account?{" "}
            <Text style={{ color: "#fff" }}>Login</Text>
          </Text>
        </Pressable>
      </Link>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  button: {
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DF00BC",
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
   
  },
  smallText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 40,
  },
  label: {
   
    fontSize: 17,
  },
  errorText:{
    color:'#9C00E4',
    position:"absolute",
    top:60,
    left:7
  },
  field: {
    borderRadius: 15,
    borderColor: "#1F1F1F",
    borderWidth: 1,
    color: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  backButton: {
   
    borderRadius: 18,
    
    borderColor: "#1F1F1F",
    paddingHorizontal:10,
    paddingVertical:7
  },
});
