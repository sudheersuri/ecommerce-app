import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import GlobalContext from "../GlobalContext";
import env from "../env";
import {
  API_REQUEST,
  checkAccessToken,
  redirectToLoginWithSessionExpiredMessage,
  showToast,
} from "../functions";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;

export default function Home({ navigation }) {
  const { globals, setGlobals } = useContext(GlobalContext);
  const router = useRouter();
  const fetchCategories = async () => {
    try {
      const REQUEST_URL = `${env.API_URL}/categories`;
      const response = await API_REQUEST(REQUEST_URL, "GET", null, true);
      const data = await response.json();

      if (response.status === 401)
        redirectToLoginWithSessionExpiredMessage(router);
      else if (response.status === 200) {
        if (data.length)
        {
          setGlobals(prevGlobals => {
            return {...prevGlobals,categories:data,selectedCategory:data[0].id}
          })
        
        }
      } else showToast("error", data.message);
    } catch (error) {
      showToast("error", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const REQUEST_URL = `${env.API_URL}/products`;
      const response = await API_REQUEST(REQUEST_URL, "GET", null, true);
      const data = await response.json();

      if (response.status === 401)
        redirectToLoginWithSessionExpiredMessage(router);
      else if (response.status === 200) {
        if (data.length) {
          setGlobals(prevGlobals => {
            return {...prevGlobals,products:data}
          }
          );
        };
      } else showToast("error", data.message);
    } catch (error) {
      showToast("error", error);
    }
  };
  const fetchAddresses = async () => {
    try {
      const REQUEST_URL = `${env.API_URL}/get_addresses`;
      const response = await API_REQUEST(REQUEST_URL, "GET", null, true);
      const data = await response.json();

      if (response.status === 401)
        redirectToLoginWithSessionExpiredMessage(router);
      else if (response.status === 200) {
        if (data.length)
          setGlobals({
            ...globals,
            savedAddresses: data,
            shippingAddressId: data[0].id,
          });
      } else showToast("error", data.message);
    } catch (error) {
      showToast("error", error);
    }
  };
  const fetchData = async () => {
    await fetchCategories();
    await fetchProducts();
   
  };

  useEffect(() => {
    checkAccessToken(router);
    if(!globals.categories.length && !globals.products.length)
    { 
      fetchAddresses();
      fetchData();
      
    }
   
  }, []);
  const QtySelector = ({ item }) => {
    const { cartItems } = globals;

    const currentCartItem = cartItems.find(
      (cartItem) => cartItem.id === item.id
    );
    const currentQty = currentCartItem ? currentCartItem.qty : 0;

    const handleIncrement = () => {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      );
      setGlobals({
        ...globals,
        cartItems: updatedCartItems,
      });
    };

    const handleDecrement = () => {
      if (currentQty > 1) {
        const updatedCartItems = cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty - 1 }
            : cartItem
        );

        setGlobals({
          ...globals,
          cartItems: updatedCartItems,
        });
      } else {
        //remove item from cart
        const updatedCartItems = cartItems.filter(
          (cartItem) => cartItem.id !== item.id
        );
        setGlobals({
          ...globals,
          cartItems: updatedCartItems,
        });
      }
    };

    const addItemToCart = () => {
      const updatedCartItems = [...cartItems, { ...item, qty: 1 }];
      setGlobals({
        ...globals,
        cartItems: updatedCartItems,
      });
    };

    return (
      <View>
        {currentQty === 0 ? (
          <TouchableOpacity onPress={() => addItemToCart()}>
            <Ionicons name="add-circle" size={30} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TouchableOpacity onPress={handleIncrement}>
              <Ionicons name="add-circle" size={30} color="white" />
            </TouchableOpacity>
            <Text style={{ color: "#fff" }}>{currentQty}</Text>
            <TouchableOpacity onPress={handleDecrement}>
              <Ionicons name="remove-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  const ProductItem = ({ item, index }) => (
    <View
      style={[
        styles.productItem,
        {
          borderLeftWidth: index % 2 === 0 ? 0 : 1,
          borderRightWidth: index % 2 === 0 ? 1 : 0,
          position: "relative",
        },
      ]}
    >
      <Image
        source={{ uri: item.imageURL }}
        style={{
          width: screenWidth / 2 - 15,
          height: screenWidth / 2 - 25,
          marginBottom: 40,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}
      >
        <View>
          <Text style={{ color: "#fff" }}>$ {item.price}</Text>
          <Text style={{ color: "gray", fontWeight: "bold" }}>{item.name}</Text>
        </View>
        <QtySelector item={item} />
      </View>
    </View>
  );

  const ProductList = () => {
    
    const filteredProducts = globals.products.filter(
      (product) => product.categoryId === globals.selectedCategory
    );
    
    return (
      <FlatList
        data={filteredProducts}
        renderItem={({ item, index }) => ProductItem({ item, index })}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
      />
    );
  };
  const CategoryList = () => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const renderItem = ({ item }) => (
      <Pressable
        style={styles.category}
        onPress={() => setGlobals({ ...globals, selectedCategory: item.id })}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight:
              globals.selectedCategory === item.id ? "bold" : "normal",
            opacity: globals.selectedCategory === item.id ? 1 : 0.8,
          }}
        >
          {capitalizeFirstLetter(item.name)}
        </Text>
      </Pressable>
    );

    return (
      <View
        style={{ height: 40, marginTop: 10, paddingHorizontal: 15, zIndex: -1 }}
      >
        <FlatList
          horizontal
          data={globals.categories}
          renderItem={({ item, index }) => renderItem({ item, index })}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  const SearchBar = () => {
    const [searchText, setSearchText] = useState("");
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderWidth: 1,
          borderTopColor: "gray",
          borderBottomColor: "gray",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 7,
          paddingHorizontal: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="ios-search"
            size={24}
            color="white"
            style={{ opacity: 0.5 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={"gray"}
            defaultValue={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
        {searchText && (
          <Pressable onPress={() => setSearchText("")}>
            <Ionicons
              name="close"
              size={24}
              color="white"
              style={{ opacity: 0.5, marginLeft: 10 }}
            />
          </Pressable>
        )}
      </View>
    );
  };
  const getCartItemsCount = () => {
    return globals.cartItems.reduce(
      (totalCount, cartItem) => totalCount + cartItem.qty,
      0
    );
  };
  const Main = () => {
    if(globals.products.length && globals.categories.length)
    return (
      <View>
        <CategoryList />
        <SearchBar />
        <ProductList />
      </View>
    );
    else return (<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text style={{color:'#fff'}}>Loading...</Text>
    </View>);
  }
  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Menu />
          <Text style={styles.companyName}>Shopper</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "#fff" }}>
            {globals.username && globals.username}
          </Text>
          <Pressable
            style={{ position: "relative", borderRadius: 10 }}
            onPress={() => {
              getCartItemsCount() ? router.push("/checkout") : "";
            }}
          >
            <Ionicons name="cart" size={30} color="white" />
            <View
              style={{
                backgroundColor: "#FF6746",
                paddingHorizontal: 5,
                position: "absolute",
                top: -5,
                right: -5,
                borderRadius: 50,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {getCartItemsCount()}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <Header />
        <Sidebar />
        <Main />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
  },
  input: {
    color: "#fff",
    opacity: 0.8,
    marginLeft: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  companyName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 30,
  },
  category: {
    height: 30,
    padding: 5,
    marginRight: 10,
  },
  productItem: {
    flex: 1 / 2,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.1,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});
