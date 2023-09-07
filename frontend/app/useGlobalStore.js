import {create} from 'zustand';

// Define the Zustand store for globals
const useGlobalStore = create((set) => ({
  globals: {
    username: '',
    selectedCategory: 0,
    cartItems: [],
    savedAddresses: [],
    shippingAddressId: 0,
    showSideBar: false
  },
  setGlobals: (newGlobals) => set({ globals: newGlobals }),
}));

export default useGlobalStore;
