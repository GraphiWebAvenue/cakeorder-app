import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// تعریف نوع استک ناوبری
type RootStackParamList = {
  DeliveryMethod: undefined;
  Cart: undefined;
};

const CartScreen = () => {
  // استفاده از نوع صحیح برای ناوبری
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before continuing.');
      return;
    }
    navigation.navigate('DeliveryMethod');  // ✅ استفاده از نوع‌دهی صحیح
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.imageContainer}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <Image
                  source={{ uri: 'https://via.placeholder.com/80x80?text=No+Image' }}
                  style={styles.image}
                />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cakeName}>{item.name} ({item.portion})</Text>
              <Text style={styles.text}>
                {item.quantity} × €{item.price.toFixed(2)} = €{(item.price * item.quantity).toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.remove}>❌ Remove</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  cakeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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
