import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
  } from "react-native";
  import React, {  useContext, useEffect, useState } from "react";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import { Controller, useForm } from "react-hook-form";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { LinearGradient } from "expo-linear-gradient";
  import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

import { checkAccessToken, showToast } from "../../functions";
import env from "../../env";
import useGlobalStore from "../useGlobalStore";
import GlobalContext from "../GlobalContext";


const REQUEST_URL = `${env.API_URL}/save_address`;
export default function Page() {
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    const{globals,setGlobals} = useGlobalStore();
    const {theme,setTheme} = useContext(GlobalContext);
    const params = useLocalSearchParams();
    useEffect(() => {
      checkAccessToken(router);
    }, [])
    const Header = () => {
      return (
        <View
          style={{
            position: "relative",
            alignItems: "center",
            paddingBottom: 20,
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={theme.textColor}
            style={{ position: "absolute", left: 0 }}
            onPress={() => router.back()}
          />
          <Text
            style={{
              color: theme.textColor,
              marginTop: 5,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
           {params?.nickname?'Edit Address': 'Add New Address'}
          </Text>
        </View>
      );
    };
   
    const { handleSubmit, control, formState } = useForm({
      defaultValues: {
        nickname:params.nickname || '',
        address:params.address || '',
        city:params.city || '',
        state:params.state || '',
        zipcode:params.zipcode || '',
      },
    });
    const { errors } = formState;
    const fetchAddresses = async () => {
      try {
        const url = "http://127.0.0.1:5000/get_addresses";
        const access_token = await AsyncStorage.getItem('access_token');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json', // You can adjust headers as needed
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        if(data.length)
        {
          setLoading(false);
          
          setGlobals({...globals,savedAddresses:data,shippingAddressId:data[0].id}); 
          router.back();
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    
    const onSubmit = async (reqdata) => {
        setLoading(true);
        const access_token = await AsyncStorage.getItem('access_token');
        // Handle form submission here
        if(params?.id)
        {
          reqdata.id = params.id;
        }
        fetch(REQUEST_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
          body: JSON.stringify(reqdata)
        })
          .then(response => {
            if (!response.ok) {
              // Handle the case where the response status is not in the 200-299 range
              throw new Error(`Error ${response.status}`);
            }
            return response.json();
          }
          )
          .then(data => {
            fetchAddresses();
          })
          .catch(error => {
            showToast('error',error.message);
            console.error('Error:', error);
          })
          .finally(()=>{
           
          });
      };
  return (
    <View style={[styles.container,{backgroundColor:theme.backgroundColor}]}>
        <Header />
       <ScrollView
        style={{ marginVertical: 30, marginHorizontal: 2 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fullWidth}>
          <Text style={[styles.label, { marginBottom: 10,color:theme.textColor }]}>Nickname</Text>
          <Controller
            name="nickname"
            control={control}
            rules={{ required: true }}
            render={({ field:{ onChange, value } }) => (
              <TextInput
                onChangeText={(text) => {
                  onChange(text);
                }}
                placeholder="Home"
                style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
                value={value}
                placeholderTextColor={"gray"}
              />
            )}
          />
          {errors.nickname && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>
          <View>
            <View style={styles.fullWidth}>
              <Text style={[styles.label, { marginBottom: 10,color:theme.textColor  }]}>Address</Text>
              <Controller
                name="address"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value} }) => (
                  <View>
                    <TextInput
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      value={value}
                      placeholder="Enter your address"
                     
                       style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
                      placeholderTextColor={"gray"}
                    />
                    {errors.address && (
                      <Text style={styles.errorText}>Address is required</Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View style={styles.fullWidth}>
              <Text style={[styles.label, { marginBottom: 10,color:theme.textColor  }]}>City</Text>
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value} }) => (
                  <View>
                    <TextInput
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      value={value}
                      placeholder="Enter your city"
                       style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
                      placeholderTextColor={"gray"}
                    />
                    {errors.city && (
                      <Text style={styles.errorText}>City is required</Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View style={styles.fullWidth}>
              <Text style={[styles.label, { marginBottom: 10,color:theme.textColor  }]}>State</Text>
              <Controller
                name="state"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value} }) => (
                  <View>
                    <TextInput
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      value={value}
                      placeholder="Enter your state"
                       style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
                      placeholderTextColor={"gray"}
                    />
                    {errors.state && (
                      <Text style={styles.errorText}>State is required</Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View style={styles.fullWidth}>
              <Text style={[styles.label, { marginBottom: 10,color:theme.textColor  }]}>Zip Code</Text>
              <Controller
                name="zipcode"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value} }) => (
                  <View>
                    <TextInput
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      value={value}
                      placeholder="Enter your zip code"
                       style={[styles.field,{backgroundColor:theme.fieldBackgroundColor,color:theme.textColor}]}
                      placeholderTextColor={"gray"}
                    />
                    {errors.zipcode && (
                      <Text style={styles.errorText}>Zip Code is required</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

        <Pressable onPress={handleSubmit(onSubmit)}>
          <LinearGradient
            colors={theme.buttonThemeColor}
            start={[0, 0]}
            end={[1, 0]}
            style={[styles.button, { marginTop: 40 }]}
          >
             {loading?
           <ActivityIndicator size="small" color={theme.textColor} />:
          <Text style={{ color:'#fff', fontWeight: "600" }}>Save</Text>}
          </LinearGradient>
        </Pressable>
        <Toast />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
     
      paddingTop: 40,
      paddingHorizontal: 15,
    },
    fullWidth: {
      width: "100%",
      marginBottom: 20,
    },
    halfWidth: {
      width: "48%",
      marginBottom: 20,
    },
    button: {
      paddingVertical: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },
    field: {
     
      borderRadius: 15,
      borderColor: "#1F1F1F",
      borderWidth: 1,
     
      paddingVertical: 18,
      paddingHorizontal: 15,
    },
    errorText: {
      color: "red",
    },
    label: {
      fontSize: 17,
    },
  });
  