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
import { useState } from "react";
import { SocialMediaButton } from "../components/SocialMediaButton";

const API_URL = "http://127.0.0.1:5000/register";
export default function Register() {
  
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


  const showToast = (type,message) => {
    Toast.show({
      type,
      text2: message,
      position:'top'
    });
  }

  const onSubmit = (reqdata) => {
    setLoading(true);
    console.log(reqdata);
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqdata),
    })
      .then((response) => response.json())
      .then((data) => {  
          if(data.message.includes("success"))
            router.replace("/login");
          else
            showToast('error',data.message);
      })
      .catch((error) => {
        showToast('error',error.message);
        console.error("Error:", error);
      })
      .finally(()=>{
        setLoading(false);
      });;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => router.replace("/login")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </Pressable>
        <Text style={[styles.title, { marginLeft: 10 }]}>Register</Text>
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
     
      <Text style={[styles.label, { marginBottom: 10, marginLeft: 7 }]}>Username</Text>
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
            style={[styles.field]}
            placeholderTextColor="#888888"
          />
        )}
        name="username"
      />
      {errors.username && <Text style={styles.errorText}>* Name is required</Text>}
      </View>

     
      <Text style={[styles.label, { marginTop:30,marginBottom: 10, marginLeft: 7 }]}>Email</Text>
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
            style={styles.field}
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
          { marginTop: 30, marginBottom: 10, marginLeft: 7 },
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
            style={styles.field}
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
          colors={["#DF00BC", "#9C00E4"]}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.button, { marginTop: 40 }]}
        >
            {loading?
           <ActivityIndicator size="small" color="#fff" />:
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
    color: "#fff",
  },
  smallText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 40,
  },
  label: {
    color: "#fff",
    fontSize: 17,
  },
  errorText:{
    color:'#9C00E4',
    position:"absolute",
    top:60,
    left:7
  },
  field: {
    backgroundColor: "#171717",
    borderRadius: 15,
    borderColor: "#1F1F1F",
    borderWidth: 1,
    color: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  backButton: {
    backgroundColor: "#000",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#1F1F1F",
    paddingHorizontal:10,
    paddingVertical:7
  },
});
