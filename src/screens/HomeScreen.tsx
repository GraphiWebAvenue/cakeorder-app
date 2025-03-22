// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { searchPostalCode } from '../api/api';

const HomeScreen = () => {
  const [postalCode, setPostalCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = 'your_test_token_here'; // بعداً با JWT واقعی جایگزین می‌کنیم
      const response = await searchPostalCode(postalCode, token);
      setResult(response);
    } catch (error) {
      setResult({ message: 'Error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your postal code:</Text>
      <TextInput
        style={styles.input}
        value={postalCode}
        onChangeText={setPostalCode}
        placeholder="e.g. 5038AA"
      />
      <Button title="Search" onPress={handleSearch} />
      {loading ? <Text>Loading...</Text> : result && (
        <Text style={styles.result}>{JSON.stringify(result, null, 2)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  result: {
    marginTop: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
  },
});

export default HomeScreen;
