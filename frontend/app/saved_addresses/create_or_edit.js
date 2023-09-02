import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
  } from "react-native";
  import React, { useState } from "react";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import { Controller, useForm } from "react-hook-form";
  import { useRouter } from "expo-router";
  import { LinearGradient } from "expo-linear-gradient";
  import { ScrollView } from "react-native-gesture-handler";
  
export default function Page() {
    const router = useRouter();
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
            color="#fff"
            style={{ position: "absolute", left: 0 }}
            onPress={() => router.back()}
          />
          <Text
            style={{
              color: "#fff",
              marginTop: 5,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Add New Address
          </Text>
        </View>
      );
    };
    const { handleSubmit, control, formState, watch } = useForm();
    const { errors } = formState;
    const onSubmit = (data) => {
      
        console.log(data);
        // Handle form submission here
      };
  return (
    <View style={styles.container}>
        <Header />
       <ScrollView
        style={{ marginVertical: 30, marginHorizontal: 2 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fullWidth}>
          <Text style={[styles.label, { marginBottom: 10 }]}>Nickname</Text>
          <Controller
            name="nickName"
            control={control}
            rules={{ required: true }}
            render={({ field:{ onChange, value } }) => (
              <TextInput
                onChangeText={(text) => {
                  onChange(text);
                }}
                placeholder="Home"
                style={styles.field}
               
                value={value}
                placeholderTextColor={"gray"}
              />
            )}
          />
          {errors.nickName && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>
          <View>
            <View style={styles.fullWidth}>
              <Text style={[styles.label, { marginBottom: 10 }]}>Address</Text>
              <Controller
                name="address"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <View>
                    <TextInput
                      {...field}
                      placeholder="Enter your address"
                      style={styles.field}
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
              <Text style={[styles.label, { marginBottom: 10 }]}>City</Text>
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <View>
                    <TextInput
                      {...field}
                      placeholder="Enter your city"
                      style={styles.field}
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
              <Text style={[styles.label, { marginBottom: 10 }]}>State</Text>
              <Controller
                name="state"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <View>
                    <TextInput
                      {...field}
                      placeholder="Enter your state"
                      style={styles.field}
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
              <Text style={[styles.label, { marginBottom: 10 }]}>Zip Code</Text>
              <Controller
                name="zipCode"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <View>
                    <TextInput
                      {...field}
                      placeholder="Enter your zip code"
                      style={styles.field}
                      placeholderTextColor={"gray"}
                    />
                    {errors.zipCode && (
                      <Text style={styles.errorText}>Zip Code is required</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

        <Pressable onPress={handleSubmit(onSubmit)}>
          <LinearGradient
            colors={["#DF00BC", "#9C00E4"]}
            start={[0, 0]}
            end={[1, 0]}
            style={[styles.button, { marginTop: 40 }]}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
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
      backgroundColor: "#DF00BC",
      borderRadius: 15,
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
    errorText: {
      color: "red",
    },
    label: {
      color: "#fff",
      fontSize: 17,
    },
  });
  