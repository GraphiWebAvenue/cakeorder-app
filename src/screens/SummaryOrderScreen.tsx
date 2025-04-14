import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ⛳ تعریف RootStackParamList
type RootStackParamList = {
  OrderComplete: { trackingCode: string };
};

// ⛳ تایپ navigation و route
type SummaryRouteProp = RouteProp<Record<string, object | undefined>, string>;
type SummaryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SummaryOrderScreen = () => {
  const route = useRoute<SummaryRouteProp>();
  const navigation = useNavigation<SummaryNavigationProp>();
  const { user } = useUser();
  const [selectedGateway, setSelectedGateway] = useState('paypal');

  const {
    items = [],
    delivery_method = '',
    delivery_date,
    delivery_time,
    postal_code,
    province,
    city,
    street_address,
    house_number,
    extra_details,
    total_price,
    branch_id,
  }: any = route.params || {};

  const handleConfirmOrder = async () => {
    if (!delivery_method) {
      Alert.alert('Error', 'Delivery method is missing.');
      return;
    }

    try {
      const response = await axios.post('https://cakeorder.shop/api/orders.php', {
        user_id: user?.id,
        items,
        branch_id,
        delivery_method,
        delivery_date,
        delivery_time,
        province,
        city,
        street_address,
        house_number,
        extra_details,
        postal_code,
        total_price,
      });

      if (response.data.success) {
        navigation.navigate('OrderComplete', {
          trackingCode: response.data.tracking_code,
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to place order.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while placing the order.');
    }
  };

  const calculatedTotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      {user && (
        <View style={styles.userInfoBox}>
          <Text style={styles.userInfo}>
            👤 Customer: {user.name} ({user.email})
          </Text>
          {user.phone_number && <Text style={styles.userInfo}>📞 {user.phone_number}</Text>}
        </View>
      )}

      <Text style={styles.sectionTitle}>🧁 Order Items</Text>
      {items.length > 0 ? (
        items.map((item: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.name} × {item.quantity} = €{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.itemText}>No items found.</Text>
      )}

      <Text style={styles.total}>💶 Total Price: €{calculatedTotal.toFixed(2)}</Text>

      <Text style={styles.sectionTitle}>📦 Delivery Info</Text>
      {delivery_method === 'pickup' ? (
        <>
          <Text>Method: Pickup</Text>
          <Text>Date: {delivery_date}</Text>
          <Text>Time: {delivery_time}</Text>
        </>
      ) : (
        <>
          <Text>Method: Delivery</Text>
          <Text>Province: {province}</Text>
          <Text>City: {city}</Text>
          <Text>Street: {street_address}</Text>
          <Text>House No: {house_number}</Text>
          {extra_details ? <Text>Extra: {extra_details}</Text> : null}
          <Text>Postal Code: {postal_code}</Text>
        </>
      )}

      <Text style={styles.sectionTitle}>💳 Choose Payment Method</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedGateway('paypal')}
        >
          <View
            style={[styles.radioCircle, selectedGateway === 'paypal' && styles.radioSelected]}
          />
          <Image
            source={{
              uri: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
            }}
            style={styles.logo}
          />
          <Text>PayPal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedGateway('klarna')}
        >
          <View
            style={[styles.radioCircle, selectedGateway === 'klarna' && styles.radioSelected]}
          />
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg',
            }}
            style={styles.logo}
          />
          <Text>Klarna</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.confirmButton}>
        <Button title="Confirm Order" onPress={handleConfirmOrder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  userInfoBox: { marginBottom: 10 },
  userInfo: { fontSize: 16, marginBottom: 4, color: '#1b5e20' },
  itemRow: { marginBottom: 6 },
  itemText: { fontSize: 16 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 20 },
  radioContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  radioOption: { alignItems: 'center' },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#555',
    marginBottom: 4,
  },
  radioSelected: {
    backgroundColor: '#007bff',
  },
  logo: {
    width: 60,
    height: 40,
    marginVertical: 5,
    resizeMode: 'contain',
  },
  confirmButton: {
    marginTop: 20,
  },
});

export default SummaryOrderScreen;
