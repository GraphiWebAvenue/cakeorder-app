import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 📦 Stack Params
type RootStackParamList = {
  SummaryOrder: any;
};

const UserLoginRegisterScreen = () => {
  const { user, setUser, logout } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const orderParams = route.params || {};

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleConfirm = () => {
    navigation.navigate('SummaryOrder', orderParams);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://cakeorder.shop/api/login.php', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        navigation.navigate('SummaryOrder', orderParams);
      } else {
        Alert.alert('Login failed', res.data.message || 'Please try again');
      }
    } catch (err) {
      Alert.alert('Login error', 'Unable to login. Try again later.');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('https://cakeorder.shop/api/register.php', {
        name,
        email,
        password,
        phone_number: phone,
      });
      if (res.data.success) {
        setUser(res.data.user);
        navigation.navigate('SummaryOrder', orderParams);
      } else {
        Alert.alert('Registration failed', res.data.message || 'Please try again');
      }
    } catch (err) {
      Alert.alert('Registration error', 'Unable to register. Try again later.');
    }
  };

  if (user && user.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Are you logged in as {user.name || user.email}?</Text>
        {user.phone_number && (
          <Text style={styles.phone}>Phone: {user.phone_number}</Text>
        )}
        <View style={styles.confirmButton}>
          <Button title="Yes, continue" onPress={handleConfirm} />
        </View>
        <Button title="No, log out" color="#cc0000" onPress={logout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('login')}
          style={[styles.tab, activeTab === 'login' && styles.activeTab]}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('register')}
          style={[styles.tab, activeTab === 'register' && styles.activeTab]}
        >
          <Text>Register</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'login' ? (
        <View style={styles.form}>
          <Text>Email:</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      ) : (
        <View style={styles.form}>
          <Text>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Text>Email:</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Register" onPress={handleRegister} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  form: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  phone: { fontSize: 16, marginBottom: 12 },
  confirmButton: { marginBottom: 12 },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007bff',
  },
});

export default UserLoginRegisterScreen;
