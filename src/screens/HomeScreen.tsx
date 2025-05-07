import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        <Text style={styles.welcomeText}>
          Welcome to the first online cake ordering app
        </Text>


        <Image
          source={{ uri: 'https://www.oetker.co.uk/assets/recipes/assets/46b664a502ce4ebdb241e6667ce789b7/1272x764/pinata-rainbow-cake.webp' }}
          style={styles.cakeImage}
        />


        <Text style={styles.label}>Enter your postal code:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5041DS"
          value={postalCode}
          onChangeText={setPostalCodeInput}
        />
        <Button title="Search" onPress={handleSearch} />

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : result?.branches?.length ? (
          <BranchCard
            branch={result.branches[0]}
            onPress={() => handleBranchPress(result.branches[0].id)}
          />
        ) : result?.message ? (
          <Text style={styles.result}>
            {result.message === 'No branches found for this postal code.'
              ? 'Hich Shobeii Peyda Nashod'
              : result.message}
          </Text>
        ) : null}

        <Image
          source={{ uri: 'https://freedesignfile.com/upload/2019/11/Chef-holding-a-birthday-cake-vector.jpg' }}
          style={styles.chefImage}
        />

        <Text style={styles.footerText}>
          This app is developed by Erfan & Makvan & Nikvan
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cakeImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginBottom: 40,
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
    width: '100%',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  result: {
    marginTop: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
  chefImage: {
    width: 300,
    height: 300,
    borderRadius: 75,
    marginTop: 30,
  },
  footerText: {
    marginTop: 30,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomeScreen;
