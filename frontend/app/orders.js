import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, ScrollView, Image } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from 'expo-router';
import env from '../env';
import { API_REQUEST, checkAccessToken, redirectToLoginWithSessionExpiredMessage, showToast } from '../functions';
import GlobalContext from './GlobalContext';

const REQUEST_URL = `${env.API_URL}/orders`;

const OrdersScreen = () => {
  const {theme} = useContext(GlobalContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fetchOrders = async () => {
    try {
      const response = await API_REQUEST(REQUEST_URL,'GET',null,true);
      const data = await response.json();
     
      if(response.status===401 || response.status===422)
        redirectToLoginWithSessionExpiredMessage(router);
      else if(response.status===200)
      {
        if(data.length) setOrders(data);
      }
      else 
        showToast('error',data.message);
    } catch (error) {
      showToast('error',error);
    }
  };
  useEffect(() => {
    checkAccessToken();
    fetchOrders();
  }, []);
  const Header = () => {
    return (
      <View style={{position:'relative', alignItems: 'center',paddingBottom:20}}>
        <Ionicons name="chevron-back-outline" size={30} color={theme.textColor} style={{position:'absolute',left:0}} onPress={() => router.back()} />
        <Text style={{ color:theme.textColor,marginTop:5,fontSize:18,fontWeight:'bold' }}>Orders</Text>
      </View>
    );
  }
  const get_shipping_address = () => {
    return `${selectedOrder.shipping_address.address}, ${selectedOrder.shipping_address.city}, ${selectedOrder.shipping_address.state}, ${selectedOrder.shipping_address.zipcode}`;
  }
  const OrderDetailModal = () => {
    const OrderItem = ({item}) => {
        return (
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <View style={{flexDirection:'row'}}>
                    <Image source={{uri:item.imageURL}} style={{width:50,height:50}} />
                    <View style={{marginTop:5}}>
                            <Text style={{color:theme.textColor,fontWeight:'bold'}}>{item.name}</Text>
                            <Text style={{color:theme.textColor,fontSize:12,marginTop:5}}>X{item.qty}</Text>
                    </View>
                </View>
                <Text style={{color:theme.textColor,fontWeight:'bold'}}>${item.price}</Text>
            </View>
        );
    }
  
    return (
        <View style={modalVisible?styles.centeredView:null}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView,{backgroundColor:theme.backgroundColor}]}>
                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                        <View>
                        <Text style={{color:theme.textColor,fontWeight:'bold'}}>Order# {selectedOrder.id.toUpperCase().slice(5,13)}</Text>
                        </View>
                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}>
                        <Ionicons name="close-outline" size={25} color={theme.textColor} />
                </Pressable>
                </View>
                <FlatList 
                        data={selectedOrder.items}
                        renderItem={OrderItem}
                        keyExtractor={item => item.id}
                        style={{width:'100%'}}
                />
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <View style={{flex:8}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                             <Ionicons name="location" size={20} color={theme.textColor} />
                             <Text style={{color:theme.textColor,width:'90%',marginLeft:4}}>{get_shipping_address()}</Text>
                        </View>
                    </View>    
                    <Text style={{flex:2,textAlign:'right',color:theme.textColor,fontSize:20,fontWeight:'bold',textAlign:'right'}}>${parseFloat(selectedOrder.total/100)}</Text>
                </View>
              </View>
              
            </View>
          </Modal>
        </View>);
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
  
    // Define options for formatting the date
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
  
    return date.toLocaleDateString(undefined, options);
  };
  const renderItem = ({ item }) => (
    <Pressable style={styles.orderItem} onPress={()=>{
        setSelectedOrder(item);
        setModalVisible(true);
    }}>
      <View>
            <Text style={{color:theme.textColor,fontWeight:'bold'}}>Order# {item.id.slice(5,13).toUpperCase()}</Text>
            <Text style={{color:theme.textColor,opacity:0.7,marginTop:5}}>{formatDate(item.created_timestamp)}</Text>
            <Text style={{color:'green',marginTop:10}}>Delivery by <Text style={{fontWeight:'bold'}}>21st Jan 2020</Text></Text>
      </View>
      <View style={{justifyContent:'justify-between',height:'100%',alignItems:'flex-end'}}>
        <Text style={{color:theme.textColor,fontWeight:'bold',fontSize:18}}>
        ${parseFloat(item.total/100)}
        </Text>
        <Text style={{color:theme.textColor,marginTop:22}}>View</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container,{backgroundColor:theme.backgroundColor}]}>
      <Header />
      {orders.length ?  <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
        style={{marginTop:5}}
      />:(<View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:theme.textColor,textAlign:'center',marginTop:50}}>No orders found</Text>
      </View>)}
      {selectedOrder && <OrderDetailModal />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
       
        paddingTop: 40,
        paddingHorizontal: 15,
  },
  orderList: {
    paddingBottom: 16,
  },
  orderItem: {
    borderBottomColor: 'gray',
    borderBottomWidth:0.4,
    paddingVertical: 16,
    paddingHorizontal: 5,
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
    marginTop:250,
  },
  modalView: {
  
    borderRadius: 5,
    borderColor:'gray',
    margin:20,
    borderWidth:1,
    padding: 15,
    alignItems: 'center',
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
