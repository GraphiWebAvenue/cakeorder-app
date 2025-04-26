import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext'; // 👈 اضافه شده

type RootStackParamList = {
  OrderComplete: { trackingCode: string };
  Home: undefined;
};

const OrderCompleteScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderComplete'>>();
  const { clearCart } = useCart(); // 👈 اضافه شده برای پاک کردن سبد

  const trackingCode = route.params?.trackingCode || 'N/A';

  useEffect(() => {
    // ✅ وقتی این صفحه باز شد، سبد خرید رو پاک کن
    clearCart();
  }, [clearCart]);

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

      <View style={styles.buttonWrapper}>
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 10 },
  code: { fontSize: 24, fontWeight: 'bold', color: '#007bff', marginBottom: 6 },
  copyHint: { fontSize: 14, color: '#888' },
  buttonWrapper: { marginTop: 30 },
});

export default OrderCompleteScreen;
