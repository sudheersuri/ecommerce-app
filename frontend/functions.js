import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


export const showToast = (type, message) => {
    Toast.show({
      type: type,
      text2: message,
      position:'top'
    });
}

export const API_REQUEST = async (url,method,data=null,authorized=false) => {
    try {
       
        const accessToken = authorized ? await AsyncStorage.getItem('access_token') : '';
      
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          //conditionally add body if method is not GET
          ...(method!=='GET' && {body: JSON.stringify(data)}),
        });
       return response;
      } catch (error) {
        console.log(error);
        showToast('error', error.message);
      }     
}
export const redirectToLoginWithSessionExpiredMessage = async (router) => {
  router.replace({ pathname: "/login", params: { error:'Session Expired, Please login again.' } });
}
export const redirectToOrdersWithSuccessMessage = async (router) => {
  router.replace({ pathname: "/orders", params: { message:'Payment Successfull, Thanks for placing order!' } });
}
export const checkAccessToken = async (router) => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    
    if (!access_token) {
      // Access token is not present, navigate to login screen
      router.replace({ pathname: "/login", params: { error:'Session Expired, Please login again.' } });
      return;
    }
  } catch (error) {
    showToast('error', error.message);
  }
};
