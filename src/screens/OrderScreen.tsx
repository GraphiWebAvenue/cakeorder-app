import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import axios from 'axios';

type RootStackParamList = {
  Order: {
    method: 'pickup' | 'delivery';
    delivery_date?: string;
    delivery_time?: string;
    postal_code?: string;
    province?: string;
    city?: string;
    street_address?: string;
    house_number?: string;
    extra_details?: string;
  };
  Home: undefined;
};

const OrderScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Order'>>();
  const navigation = useNavigation<any>();
  const { cartItems, clearCart, totalPrice } = useCart();
  const { user } = useUser();

  const {
    method,
    delivery_date,
    delivery_time,
    postal_code,
    province,
    city,
    street_address,
    house_number,
    extra_details,
  } = route.params;

  const handlePlaceOrder = async () => {
    if (!user || !user.id) {
      Alert.alert('Error', 'You must be logged in to place an order.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    const address =
      method === 'delivery'
        ? `Province: ${province}, City: ${city}, Street: ${street_address}, No: ${house_number}, Extra: ${extra_details}`
        : '';

    try {
      const response = await axios.post('https://cakeorder.shop/api/orders.php', {
        user_id: user.id,
        items: cartItems,
        delivery_method: method,
        delivery_date: delivery_date || '',
        delivery_time: delivery_time || '',
        postal_code: postal_code || '',
        address,
        total_price: totalPrice,
      });

      if (response.data.success) {
        clearCart();
        Alert.alert('Success', 'Your order has been placed!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Order failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not submit your order.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <Text style={styles.label}>Total Price: €{totalPrice.toFixed(2)}</Text>
      <Text style={styles.label}>Delivery Method: {method}</Text>

      {method === 'pickup' && (
        <>
          <Text style={styles.label}>Date: {delivery_date}</Text>
          <Text style={styles.label}>Time: {delivery_time}</Text>
        </>
      )}

      {method === 'delivery' && (
        <>
          <Text style={styles.label}>Province: {province}</Text>
          <Text style={styles.label}>City: {city}</Text>
          <Text style={styles.label}>Street: {street_address}</Text>
          <Text style={styles.label}>House No: {house_number}</Text>
          {extra_details ? <Text style={styles.label}>Extra: {extra_details}</Text> : null}
        </>
      )}

      <Button title="Place Order" onPress={handlePlaceOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
});

export default OrderScreen;
