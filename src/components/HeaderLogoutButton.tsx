import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';

const HeaderLogoutButton = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useUser();
  const { clearCart } = useCart();
  const { clearOrderDetails } = useOrder();

  const handleLogout = () => {
    logout();
    clearCart();
    clearOrderDetails();
    navigation.navigate('Home');
  };

  if (user && user.id) {
    return (
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  text: {
    color: '#fff',
  },
});

export default HeaderLogoutButton;
