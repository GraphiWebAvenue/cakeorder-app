import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CakeListScreen from './src/screens/CakeListScreen';
import CakeDetailsScreen from './src/screens/CakeDetailsScreen';
import CartScreen from './src/screens/CartScreen';
import DeliveryMethodScreen from './src/screens/DeliveryMethodScreen';
import { CartProvider } from './src/context/CartContext';
import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CakeList" component={CakeListScreen} options={{ title: 'Available Cakes' }} />
            <Stack.Screen name="CakeDetails" component={CakeDetailsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="DeliveryMethod" component={DeliveryMethodScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </UserProvider>
  );
};

export default App;