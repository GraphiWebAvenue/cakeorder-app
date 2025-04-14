import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Clipboard,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderCompleteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route?.params || {};
  const trackingCode = params.trackingCode || 'N/A';

  const copyToClipboard = () => {
    Clipboard.setString(trackingCode);
    Alert.alert('Copied', 'Tracking code copied to clipboard.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>Your tracking code is:</Text>

      <TouchableOpacity onPress={copyToClipboard}>
        <Text style={styles.code}>{trackingCode}</Text>
        <Text style={styles.copyHint}>Tap to copy</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30 }}>
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 10 },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 6,
  },
  copyHint: { fontSize: 14, color: '#888' },
});

export default OrderCompleteScreen;
