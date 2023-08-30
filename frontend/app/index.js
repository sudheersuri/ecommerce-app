import { Link } from 'expo-router';
import { Button, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlobalContext from '../GlobalContext';

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;

export default function Page() {
  const {globals,setGlobals}= useContext(GlobalContext);
  const [searchText,setSearchText]  = useState('');
  const categories = [
    { id: 1, name: 'New Arrivals' },
    { id: 2, name: 'Shoes' },
    { id: 3, name: 'Clothes' },
    { id: 4, name: 'Handbags' },
    { id: 5, name: 'Trends' },
    { id: 6, name: 'Glasses' },
    // Add more categories as needed
  ];
  const router = useRouter();
  const [response, setResponse] = useState(null);
  const products = [
    {
      id: 1,
      name: 'Product 1',
      price: 19.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 1.',
      categoryId: 1,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 29.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 2.',
      categoryId: 2,
    },
    {
      id: 3,
      name: 'Product 3',
      price: 9.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 3.',
      categoryId: 1,
    },
    {
      id: 4,
      name: 'Product 4',
      price: 39.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 4.',
      categoryId: 3,
    },
    {
      id: 5,
      name: 'Product 5',
      price: 49.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 5.',
      categoryId: 2,
    },
    {
      id: 6,
      name: 'Product 6',
      price: 14.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 6.',
      categoryId: 1,
    },
    {
      id: 7,
      name: 'Product 7',
      price: 24.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 7.',
      categoryId: 3,
    },
    {
      id: 8,
      name: 'Product 8',
      price: 34.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 8.',
      categoryId: 2,
    },
    {
      id: 9,
      name: 'Product 9',
      price: 64.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 9.',
      categoryId: 1,
    },
    {
      id: 10,
      name: 'Product 10',
      price: 79.99,
      imageURL: 'https://www.pngarts.com/files/5/Plain-Pink-T-Shirt-PNG-Image-Background.png',
      description: 'This is the description for Product 10.',
      categoryId: 3,
    },
  ];
  
  
  
  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const access_token = await AsyncStorage.getItem('access_token');
        
        if (!access_token) {
          // Access token is not present, navigate to login screen
          router.replace('/login');
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/protected", {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });

        if (!response.ok) {
         router.replace('/login');
        }
        else
        {
          // Access token is valid, display the protected page
          const data = await response.json();
          console.log(data);
          setResponse(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    checkAccessToken();
  }, []);
  const QtySelector = ({item}) => {
    return (
      <Ionicons name="add-circle" size={30} color="white" onPress={()=>null} />
    );
  }
  const ProductItem = ({ item,index }) => (
    <View style={[styles.productItem,{
      borderLeftWidth:index%2===0?0:1,
      borderRightWidth:index%2===0?1:0,
    }]}>
      <Image source={{uri:item.imageURL}} style={{width:screenWidth/2-15,height:screenWidth/2-15}} />
      <View style={{justifyContent:'space-between',alignItems:"center",flexDirection:'row',width:'100%',paddingHorizontal:10,paddingBottom:10}}>
        <View>
           <Text style={{color:'#fff'}}>$ {item.price}</Text>
           <Text style={{color:'gray',fontWeight:'bold'}}>{item.name}</Text>
        </View>
        <QtySelector item={item}/>
      </View>
    </View>
  );
  
  const ProductList = () => {
    return (
      <FlatList
        data={products}
        renderItem={({ item, index }) => ProductItem({ item, index })}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
      />
    );
  };
  const CategoryList = () => {
    const renderItem = ({ item }) => (
      <Pressable style={styles.category} onPress={()=>setGlobals({...globals,selectedCategory:item.id})}>
        <Text style={{color:'#fff',fontWeight:globals.selectedCategory===item.id?'bold':'normal',opacity:globals.selectedCategory===item.id?1:0.8}}>{item.name}</Text>
      </Pressable>
    );
  
    return (
      <View style={{height:40,marginTop:10,paddingHorizontal: 15,}}>
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item, index }) => renderItem({ item, index })}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
      </View>
    );
  };
  const SearchBar = ()  => {
    return (
      <View style={{borderWidth:1,borderTopColor:'gray',borderBottomColor:'gray',flexDirection:'row',alignItems:'center',paddingVertical:7,paddingHorizontal: 15}}>
             <Ionicons name="ios-search" size={24} color="white" style={{opacity:0.5}} />
             <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor={'gray'}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />  
      </View>
    )
  }
  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
         <Ionicons name="menu" size={30} color="white" onPress={() => router.goBack()} />
         <Text style={styles.companyName}>Shopper</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{fontWeight:'bold',color:'#fff'}}>{response && response.logged_in_as}</Text>
          <Ionicons name="cart" size={30} color="white" onPress={()=>null} />
        </View>
      </View>
    );
  }
  return <>
  <View style={styles.container}>
          <Header /> 
          <CategoryList />
          <SearchBar />
          <ProductList />
  </View>
  </>;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  input:{
    color:'#fff',
    opacity:0.8,
    marginLeft:5
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 15,
  },
  companyName:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
  },
  category: {
    height:30,
    padding:5,
    marginRight:10
  },
  productItem: {
    flex: 1/2,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth:0.1,
    borderBottomWidth:1,
    borderColor: 'gray'
  }
});