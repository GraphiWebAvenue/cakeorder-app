// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CakeListScreen from './src/screens/CakeListScreen';
import CakeDetailsScreen from './src/screens/CakeDetailsScreen';
import { CartProvider } from './src/context/CartContext'; // ✅ ایمپورت

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <CartProvider> {/* ✅ اینجا wrap می‌کنیم */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CakeList" component={CakeListScreen} options={{ title: 'Available Cakes' }} />
          <Stack.Screen name="CakeDetails" component={CakeDetailsScreen} options={{ title: 'Cake Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
