import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchPostalCode } from '../api/api';
import BranchCard from '../components/BranchCard';

type RootStackParamList = {
  Home: undefined;
  CakeList: { branchId: number };
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setPostalCode } = useUser();
  const [postalCode, setPostalCodeInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!postalCode.trim()) {
      Alert.alert('Missing Input', 'Please enter a valid postal code.');
      return;
    }

    setPostalCode(postalCode.trim());
    setLoading(true);
    try {
      const token = 'your_test_token_here';
      const response = await searchPostalCode(postalCode.toUpperCase(), token);
      console.log('📦 API Response:', response);
      setResult(response);
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({ message: 'Error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleBranchPress = (branchId: number) => {
    navigation.navigate('CakeList', { branchId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your postal code:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 5041DS"
        value={postalCode}
        onChangeText={setPostalCodeInput}
      />
      <Button title="Search" onPress={handleSearch} />

      {loading ? (
        <Text>Loading...</Text>
      ) : result?.branches?.length ? (
        <BranchCard
          branch={result.branches[0]}
          onPress={() => handleBranchPress(result.branches[0].id)}
        />
      ) : result?.message ? (
        <Text style={styles.result}>
          {result.message === 'No branches found for this postal code.'
            ? 'هیچ شعبه‌ای برای این کد پستی پیدا نشد.'
            : result.message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
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
