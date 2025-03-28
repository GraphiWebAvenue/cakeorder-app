import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const OrderScreen = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [extraDetails, setExtraDetails] = useState('');

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login', { redirectTo: 'Order' });
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!deliveryMethod) {
      Alert.alert('Select delivery method');
      return;
    }

    const orders = cartItems.map((item) => ({
      user_id: user.id,
      cake_id: item.id,
      branch_id: 1, // TODO: Replace with actual branch logic
      delivery_method: deliveryMethod,
      delivery_date: deliveryMethod === 'pickup' ? deliveryDate : null,
      delivery_time: deliveryMethod === 'pickup' ? deliveryTime : null,
      price_type: item.portion,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      province: deliveryMethod === 'delivery' ? province : '',
      city: deliveryMethod === 'delivery' ? city : '',
      street_address: deliveryMethod === 'delivery' ? street : '',
      house_number: deliveryMethod === 'delivery' ? houseNumber : '',
      extra_details: deliveryMethod === 'delivery' ? extraDetails : '',
    }));

    try {
      for (const order of orders) {
        await axios.post('https://cakeorder.shop/api/orders.php', order);
      }
      Alert.alert('Success', 'Order placed successfully!');
      clearCart();
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', 'Could not place order.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Review Your Order</Text>
      {cartItems.map((item, idx) => (
        <View key={idx} style={styles.itemBox}>
          <Text>{item.name} ({item.portion})</Text>
          <Text>
            {item.quantity} × €{item.price.toFixed(2)} = €{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}

      <Text style={styles.label}>Delivery Method</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setDeliveryMethod('pickup')} style={[styles.option, deliveryMethod === 'pickup' && styles.selected]}>
          <Text>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDeliveryMethod('delivery')} style={[styles.option, deliveryMethod === 'delivery' && styles.selected]}>
          <Text>Delivery</Text>
        </TouchableOpacity>
      </View>

      {deliveryMethod === 'pickup' && (
        <View>
          <TextInput placeholder="Delivery Date (YYYY-MM-DD)" value={deliveryDate} onChangeText={setDeliveryDate} style={styles.input} />
          <TextInput placeholder="Delivery Time (HH:MM)" value={deliveryTime} onChangeText={setDeliveryTime} style={styles.input} />
        </View>
      )}

      {deliveryMethod === 'delivery' && (
        <View>
          <TextInput placeholder="Province" value={province} onChangeText={setProvince} style={styles.input} />
          <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
          <TextInput placeholder="Street Address" value={street} onChangeText={setStreet} style={styles.input} />
          <TextInput placeholder="House Number" value={houseNumber} onChangeText={setHouseNumber} style={styles.input} />
          <TextInput placeholder="Extra Details" value={extraDetails} onChangeText={setExtraDetails} style={styles.input} />
        </View>
      )}

      <Text style={styles.total}>Total: €{totalPrice.toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  itemBox: { padding: 10, backgroundColor: '#f9f9f9', marginBottom: 8, borderRadius: 6 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  row: { flexDirection: 'row', marginTop: 8 },
  option: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#d1e7dd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderScreen;
