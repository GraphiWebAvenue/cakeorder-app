import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

// تعریف دقیق نوع Cake
type Cake = {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  base_price: number;
  per_slice_price?: number;
  half_price?: number;
  is_per_slice_enabled: number;
};

// نوع route برای CakeDetailsScreen
type RouteParams = {
  cake: Cake;
};

const CakeDetailsScreen = () => {
  const route = useRoute();
  const { cake } = route.params as RouteParams;  // ✅ تعریف صحیح نوع داده
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const [selectedOption, setSelectedOption] = useState<'slice' | 'half' | 'whole'>('whole');
  const [quantity, setQuantity] = useState('1');

  const getPrice = () => {
    switch (selectedOption) {
      case 'slice':
        return cake.per_slice_price;
      case 'half':
        return cake.half_price;
      default:
        return cake.base_price;
    }
  };

  const handleAddToCart = () => {
    const price = getPrice();
    const qty = parseInt(quantity, 10);  // ✅ استفاده از رادیوکس

    if (!price || isNaN(qty) || qty < 1) {
      Alert.alert('Error', 'Please select a valid quantity and portion.');
      return;
    }

    addToCart({
      id: cake.id,
      name: cake.name,
      portion: selectedOption,
      price,
      quantity: qty,
      image_url: cake.image_url,  // ✅ اضافه شد
    });

    Alert.alert('Added to cart', `${qty} x ${selectedOption}`, [
      { text: 'Go to Cart', onPress: () => navigation.navigate('Cart' as never) },  // ✅ اصلاح نوع
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.container}>
      {cake.image_url && (
        <Image source={{ uri: cake.image_url }} style={styles.image} />
      )}
      <Text style={styles.name}>{cake.name}</Text>
      <Text style={styles.description}>{cake.description}</Text>

      <Text style={styles.label}>Choose portion:</Text>
      <View style={styles.optionsRow}>
        {cake.is_per_slice_enabled === 1 && (
          <>
            <TouchableOpacity
              onPress={() => setSelectedOption('slice')}
              style={[
                styles.optionBtn,
                selectedOption === 'slice' && styles.selected,
              ]}
            >
              <Text>🍰 Slice (€{(cake.per_slice_price ?? 0).toFixed(2)})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOption('half')}
              style={[
                styles.optionBtn,
                selectedOption === 'half' && styles.selected,
              ]}
            >
              <Text>🌓 Half (€{(cake.half_price ?? 0).toFixed(2)})</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          onPress={() => setSelectedOption('whole')}
          style={[
            styles.optionBtn,
            selectedOption === 'whole' && styles.selected,
          ]}
        >
          <Text>🎂 Whole (€{(cake.base_price ?? 0).toFixed(2)})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.viewCart}
        onPress={() => navigation.navigate('Cart' as never)}  // ✅ اصلاح نوع
      >
        <Text style={styles.viewCartText}>🛒 View Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 12 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  optionBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
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
    width: 100,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewCart: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewCartText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default CakeDetailsScreen;
