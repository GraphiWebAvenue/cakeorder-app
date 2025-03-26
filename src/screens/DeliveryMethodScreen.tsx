import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DeliveryMethodScreen = () => {
  const navigation = useNavigation();
  const [method, setMethod] = useState<'pickup' | 'delivery' | null>(null);

  const handleContinue = () => {
    if (!method) {
      Alert.alert('Please select a delivery method.');
      return;
    }
    if (method === 'pickup') {
      navigation.navigate('SelectDate'); // placeholder
    } else {
      navigation.navigate('EnterAddress'); // placeholder
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you want to receive your order?</Text>

      <TouchableOpacity
        style={[styles.option, method === 'pickup' && styles.selected]}
        onPress={() => setMethod('pickup')}
      >
        <Text style={styles.optionText}>🛍 Pick up from branch</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, method === 'delivery' && styles.selected]}
        onPress={() => setMethod('delivery')}
      >
        <Text style={styles.optionText}>📦 Deliver to my address</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  selected: {
    borderColor: '#007bff',
    backgroundColor: '#e7f1ff',
  },
  optionText: { fontSize: 16 },
  button: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default DeliveryMethodScreen;
