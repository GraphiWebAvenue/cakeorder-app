import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CakeListScreen from './src/screens/CakeListScreen';
import CakeDetailsScreen from './src/screens/CakeDetailsScreen';
import CartScreen from './src/screens/CartScreen';
import DeliveryMethodScreen from './src/screens/DeliveryMethodScreen';
import OrderScreen from './src/screens/OrderScreen';
import UserLoginRegisterScreen from './src/screens/UserLoginRegisterScreen';
import SummaryOrderScreen from './src/screens/SummaryOrderScreen';
import OrderCompleteScreen from './src/screens/OrderCompleteScreen';

// Header Logout Button
import HeaderLogoutButton from './src/components/HeaderLogoutButton';

// Context Providers
import { CartProvider } from './src/context/CartContext';
import { UserProvider } from './src/context/UserContext';
import { OrderProvider } from './src/context/OrderContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                headerRight: () => <HeaderLogoutButton />,
                animation: 'slide_from_right', // بهبود تجربه کاربری با انیمیشن اسلاید
              })}
            >
              {/* صفحه اصلی */}
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Welcome to Cake Shop' }} 
              />
              
              {/* صفحات لیست و جزئیات کیک */}
              <Stack.Screen 
                name="CakeList" 
                component={CakeListScreen} 
                options={{ title: 'Available Cakes' }} 
              />
              <Stack.Screen 
                name="CakeDetails" 
                component={CakeDetailsScreen} 
                options={{ title: 'Cake Details' }} 
              />

              {/* صفحات مدیریت سبد خرید و سفارش */}
              <Stack.Screen 
                name="Cart" 
                component={CartScreen} 
                options={{ title: 'Your Cart' }} 
              />
              <Stack.Screen 
                name="DeliveryMethod" 
                component={DeliveryMethodScreen} 
                options={{ title: 'Delivery Method' }} 
              />
              <Stack.Screen 
                name="Order" 
                component={OrderScreen} 
                options={{ title: 'Order Confirmation' }} 
              />
              <Stack.Screen 
                name="SummaryOrder" 
                component={SummaryOrderScreen} 
                options={{ title: 'Order Summary' }} 
              />
              <Stack.Screen 
                name="OrderComplete" 
                component={OrderCompleteScreen} 
                options={{ title: 'Order Complete' }} 
              />

              {/* صفحه ورود/ثبت‌نام */}
              <Stack.Screen 
                name="UserLoginRegister" 
                component={UserLoginRegisterScreen} 
                options={{ title: 'Login / Register' }} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
