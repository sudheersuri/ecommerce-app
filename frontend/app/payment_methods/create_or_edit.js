import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

export default function create_or_edit() {
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
          Add New card
        </Text>
      </View>
    );
  };

  function CardDetails() {
    const { handleSubmit, control, formState, watch } = useForm();
    const { errors } = formState;

    const fullName = watch('fullName', '');
    const cardNumber = watch('cardNumber', '');
    const expiry = watch('expiry', '');
    const securityCode = watch('securityCode', '');

    const [isBillingSameAsShipping, setIsBillingSameAsShipping] =
      useState(true);
    const sameAsShippingAddress = () => {
      setIsBillingSameAsShipping(!isBillingSameAsShipping);
    };
    const onSubmit = (data) => {
      // Handle form submission here
    };

    return (
      <View>
        <View
        style={{
          height: 200,
          width: "100%",
          backgroundColor: "#DDE7F6",
          borderRadius: "15",
          paddingHorizontal: 25,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{fullName?fullName:'FULL NAME'}</Text>
          <Image
            source={{
              uri: "https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png",
            }}
            style={{ height: 70, width: 70 }}
          />
        </View>
        <Text style={{ color: "#000", opacity: 0.5, fontSize: 12 }}>
          CARD NUMBER
        </Text>
        <Text style={{ marginTop: 5, fontWeight: "bold" }}>
          {cardNumber?cardNumber:'XXXX XXXX XXXX XXXX'}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Text
              style={{
                color: "#000",
                opacity: 0.5,
                fontSize: 12,
                marginTop: 15,
              }}
            >
              EXPIRY
            </Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>{expiry?expiry:'MM/DD'}</Text>
          </View>
          <View style={{ marginLeft: 100 }}>
            <Text
              style={{
                color: "#000",
                opacity: 0.5,
                fontSize: 12,
                marginTop: 15,
              }}
            >
              CVV
            </Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>{securityCode?securityCode:'***'}</Text>
          </View>
        </View>
      </View>
      <ScrollView
        style={{ marginVertical: 30, marginHorizontal: 2 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fullWidth}>
          <Text style={[styles.label, { marginBottom: 10 }]}>Full Name </Text>
          <Controller
            name="fullName"
            control={control}
            rules={{ required: true }}
            render={({ field:{ onChange, value } }) => (
              <TextInput
                onChangeText={(text) => {
                  onChange(text);
                }}
                placeholder="John Doe"
                style={styles.field}
               
                value={value}
                placeholderTextColor={"gray"}
              />
            )}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.fullWidth}>
          <Text style={[styles.label, { marginBottom: 10 }]}>Card Number</Text>
          <Controller
            name="cardNumber"
            control={control}
            rules={{ required: true }}
            render={({ field:{ onChange, value } }) => (
              <TextInput
                onChangeText={(text) => {
                  onChange(text);
                }}
                placeholder="XXXX XXXX XXXX XXXX"
                style={styles.field}
                keyboardType="numeric"
                placeholderTextColor={"gray"}
              />
            )}
          />
          {errors.cardNumber && (
            <Text style={styles.errorText}>Card Number is required</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { marginBottom: 10 }]}>Expiry</Text>
            <Controller
              name="expiry"
              control={control}
              rules={{ required: true }}
              render={({ field:{ onChange, value } }) => (
                <TextInput
                  onChangeText={(text) => {
                    onChange(text);
                  }}
                  placeholder="MM/YY"
                  style={styles.field}
                  keyboardType="numeric"
                  placeholderTextColor={"gray"}
                />
              )}
            />
            {errors.expiry && (
              <Text style={styles.errorText}>Expiry is required</Text>
            )}
          </View>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { marginBottom: 10 }]}>
              Security Code
            </Text>
            <Controller
              name="securityCode"
              control={control}
              rules={{ required: true }}
              render={({ field:{ onChange, value } }) => (
                <TextInput
                  onChangeText={(text) => {
                    onChange(text);
                  }}
                  placeholder="***"
                  style={styles.field}
                  keyboardType="numeric"
                  placeholderTextColor={"gray"}
                />
              )}
            />
            {errors.securityCode && (
              <Text style={styles.errorText}>Security Code is required</Text>
            )}
          </View>
        </View>
        {!isBillingSameAsShipping && (
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
                name="zipcode"
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
                    {errors.zipcode && (
                      <Text style={styles.errorText}>Zip Code is required</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        )}

        <View>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => sameAsShippingAddress()}
          >
            <Ionicons
              name={
                isBillingSameAsShipping ? "checkmark-circle" : "ellipse-outline"
              }
              size={25}
              color={isBillingSameAsShipping ? "#fff" : "gray"}
            />
            <Text style={{ color: "#fff", marginLeft: 4 }}>
              Same as Shipping Address
            </Text>
          </Pressable>
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
    );
  }
  return (
    <View style={styles.container}>
      <Header />
      <CardDetails />
    </View>
  );
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
