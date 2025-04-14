import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const DeliveryMethodScreen = () => {
  const { postalCode } = useUser();
  const { cartItems, totalPrice } = useCart();
  const navigation = useNavigation<any>();
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup');

  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [branchId, setBranchId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.post('https://cakeorder.shop/api/get_city_by_postal.php', {
          postal_code: postalCode,
        });
        if (res.data.success) {
          setCity(res.data.city);
          setProvince(res.data.province);
          setBranchId(res.data.branch_id);
        } else {
          setCity('');
          setProvince('');
          setBranchId(null);
        }
      } catch (error) {
        console.error('Error fetching city/province:', error);
      }
    };

    if (postalCode) {
      fetchLocation();
    }
  }, [postalCode]);

  const handleContinue = () => {
    if (!branchId) {
      Alert.alert('Error', 'Unable to determine nearest branch.');
      return;
    }

    const baseParams = {
      method,
      delivery_method: method,
      postal_code: postalCode,
      items: cartItems,
      total_price: totalPrice,
      branch_id: branchId,
    };

    if (method === 'pickup') {
      if (!selectedDate || !selectedTime) {
        Alert.alert('Missing Info', 'Please select date and time for pickup.');
        return;
      }

      navigation.navigate('UserLoginRegister', {
        ...baseParams,
        delivery_date: selectedDate,
        delivery_time: selectedTime,
      });
    } else {
      if (!province || !city || !street || !houseNumber) {
        Alert.alert('Missing Info', 'Please fill in all address fields.');
        return;
      }

      navigation.navigate('UserLoginRegister', {
        ...baseParams,
        province,
        city,
        street_address: street,
        house_number: houseNumber,
        extra_details: extraInfo,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your delivery method:</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, method === 'pickup' && styles.active]}
          onPress={() => setMethod('pickup')}
        >
          <Text style={styles.toggleText}>Pick Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, method === 'delivery' && styles.active]}
          onPress={() => setMethod('delivery')}
        >
          <Text style={styles.toggleText}>Delivery</Text>
        </TouchableOpacity>
      </View>

      {method === 'delivery' && (
        <View style={styles.form}>
          <Text>Postal Code:</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={postalCode}
            editable={false}
            selectTextOnFocus={false}
          />
          <Text>City:</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={city}
            editable={false}
            selectTextOnFocus={false}
          />
          <Text>Province:</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={province}
            editable={false}
            selectTextOnFocus={false}
          />
          <Text>Street Address:</Text>
          <TextInput style={styles.input} value={street} onChangeText={setStreet} />
          <Text>House Number:</Text>
          <TextInput style={styles.input} value={houseNumber} onChangeText={setHouseNumber} />
          <Text>Extra Info (optional):</Text>
          <TextInput style={styles.input} value={extraInfo} onChangeText={setExtraInfo} />
        </View>
      )}

      {method === 'pickup' && (
        <View style={styles.form}>
          <Text>Select Date:</Text>
          <TextInput
            style={styles.input}
            value={selectedDate}
            onChangeText={setSelectedDate}
            placeholder="e.g. 2025-03-30"
          />
          <Text>Select Time:</Text>
          <TextInput
            style={styles.input}
            value={selectedTime}
            onChangeText={setSelectedTime}
            placeholder="e.g. 15:30:00"
          />
        </View>
      )}

      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  toggleContainer: { flexDirection: 'row', marginBottom: 20 },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    borderRadius: 6,
  },
  active: { backgroundColor: '#cdeaff' },
  toggleText: { fontSize: 16 },
  form: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: '#eee',
    color: '#999',
  },
});

export default DeliveryMethodScreen;
