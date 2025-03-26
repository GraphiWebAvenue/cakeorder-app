// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CakeListScreen from './src/screens/CakeListScreen';
import CakeDetailsScreen from './src/screens/CakeDetailsScreen';
import CartScreen from './src/screens/CartScreen'; // ✅ اضافه شد
import { CartProvider } from './src/context/CartContext'; // ✅

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CakeList" component={CakeListScreen} options={{ title: 'Available Cakes' }} />
        <Stack.Screen name="CakeDetails" component={CakeDetailsScreen} options={{ title: 'Cake Details' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
        <Stack.Screen name="DeliveryMethod" component={DeliveryMethodScreen} options={{ title: 'Delivery Method' }} />  {/* ✅ جدید */}
      </Stack.Navigator>

      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
