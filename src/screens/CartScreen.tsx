import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();
  const navigation = useNavigation();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before continuing.');
      return;
    }
    // TODO: Check login here before continuing
    navigation.navigate('DeliveryMethod'); // Placeholder for next screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.name} ({item.portion}) x{item.quantity}</Text>
            <Text style={styles.text}>€{(item.price * item.quantity).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={styles.remove}>❌ Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: €{totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: { fontSize: 16 },
  remove: { color: 'red', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  footer: { marginTop: 20 },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  clearButton: { alignItems: 'center' },
  clearText: { color: 'red', fontSize: 14 },
});

export default CartScreen;
