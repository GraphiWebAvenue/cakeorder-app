import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DeliveryMethodScreen = () => {
  const navigation = useNavigation();
  const [method, setMethod] = useState<'pickup' | 'delivery' | null>(null);
  const [address, setAddress] = useState('');

  const handleNext = () => {
    if (method === 'pickup') {
      navigation.navigate('DateTime'); // صفحه بعدی برای انتخاب تاریخ و زمان
    } else if (method === 'delivery' && address.trim()) {
      navigation.navigate('DateTime', { address });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your delivery method</Text>

      <TouchableOpacity
        style={[
          styles.option,
          method === 'pickup' && styles.selectedOption,
        ]}
        onPress={() => setMethod('pickup')}
      >
        <Text style={styles.optionText}>🛍 Pickup from Branch</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          method === 'delivery' && styles.selectedOption,
        ]}
        onPress={() => setMethod('delivery')}
      >
        <Text style={styles.optionText}>🚚 Delivery to My Address</Text>
      </TouchableOpacity>

      {method === 'delivery' && (
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
      )}

      {method && (
        <Button title="Continue" onPress={handleNext} disabled={method === 'delivery' && !address.trim()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#fff',
  },
  title: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 20,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 15,
  },
  selectedOption: {
    backgroundColor: '#cdeeff',
    borderWidth: 2,
    borderColor: '#00aaff',
  },
  optionText: {
    fontSize: 18,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default DeliveryMethodScreen;
