import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, ScrollView, Image } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

const OrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const Header = () => {
    return (
      <View style={{position:'relative', alignItems: 'center',borderBottomWidth:1,borderBottomColor:'gray',paddingBottom:20}}>
        <Ionicons name="chevron-back-outline" size={30} color="#fff" style={{position:'absolute',left:0}} onPress={() => router.back()} />
        <Text style={{ color:'#fff',marginTop:5,fontSize:18,fontWeight:'bold' }}>Orders</Text>
      </View>
    );
  }
  const OrderDetailModal = () => {
    const OrderItem = ({item}) => {
        return (
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <View style={{flexDirection:'row'}}>
                    <Image source={{uri:item.imageURL}} style={{width:50,height:50}} />
                    <View style={{marginTop:5}}>
                            <Text style={{color:'#fff',fontWeight:'bold'}}>{item.name}</Text>
                            <Text style={{color:'#fff',fontSize:12,marginTop:5}}>X{item.qty}</Text>
                    </View>
                </View>
                <Text style={{color:'#fff',fontWeight:'bold'}}>${item.price}</Text>
            </View>
        );
    }
    const getshipping_address = () => {
        return `${selectedOrder.shipping_address.address}, ${selectedOrder.shipping_address.city}, ${selectedOrder.shipping_address.state}, ${selectedOrder.shipping_address.zipcode}`;
    }
    return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                        <View>
                        <Text style={{color:'#fff',fontWeight:'bold'}}>Order#: 211e12312</Text>
                        </View>
                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}>
                        <Ionicons name="close-outline" size={25} color="#fff" />
                </Pressable>
                </View>
                <FlatList 
                        data={selectedOrder.items}
                        renderItem={OrderItem}
                        keyExtractor={item => item.id}
                        style={{width:'100%'}}
                />
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                             <Ionicons name="location" size={20} color="#fff" />
                             <Text style={{color:'#fff'}}>{getshipping_address()}</Text>
                        </View>
                    </View>    
                    <Text style={{color:'#fff',fontSize:20,fontWeight:'bold'}}>$12.31</Text>
                </View>
              </View>
              
            </View>
          </Modal>
        </View>);
  }
  useEffect(() => {
    
    const fetchOrders = async () => {
      try {
        const access_token = await AsyncStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:5000/orders', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={()=>{
        setSelectedOrder(item);
        setModalVisible(true);
    }}>
      <View>
            <Text style={{color:'#fff',fontWeight:'bold'}}>Order#: 1212312312</Text>
            <Text style={{color:'#fff',opacity:0.7,marginTop:5}}>20th Dec 2019, 3:00 pm</Text>
            <Text style={{color:'green',marginTop:10}}>Delivery by <Text style={{fontWeight:'bold'}}>21st Jan 2020</Text></Text>
      </View>
      <View style={{justifyContent:'justify-between',height:'100%',alignItems:'flex-end'}}>
        <Text style={{color:'#fff',fontWeight:'bold',fontSize:18}}>
                $300
        </Text>
        <Text style={{color:'#fff',marginTop:22}}>View</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
        style={{marginTop:5}}
      />
      {selectedOrder && <OrderDetailModal />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: "#000",
        paddingTop: 40,
        paddingHorizontal: 15,
  },
  orderList: {
    paddingBottom: 16,
  },
  orderItem: {
    backgroundColor: '#333', // Dark gray background for each order item
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  orderText: {
    color: '#fff', // White text color
    fontSize: 16,
    marginBottom: 8,
  },
  centeredView: {
    flex: 1,
    marginTop: 250,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#000',
    borderRadius: 5,
    borderColor:'#fff',
    borderWidth:1,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default OrdersScreen;
