import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  CakeList: { branchId: number };
  CakeDetails: { cake: Cake };
};

type Cake = {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  base_price: number;
  per_slice_price?: number;
  half_price?: number;
  is_per_slice_enabled: number;
};

const CakeListScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CakeList'>>();
  const { branchId } = route.params;
  const navigation = useNavigation();

  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await axios.post('https://cakeorder.shop/api/cakes.php', {
          branch_id: branchId,
        });

        if (response.data.cakes) {
          const cakes = response.data.cakes.map((cake: any) => ({
            ...cake,
            base_price: Number(cake.base_price ?? 0),
            per_slice_price: Number(cake.price_per_slice ?? 0),
            half_price: Number(cake.price_half ?? 0),
            is_per_slice_enabled: Number(cake.is_per_slice_enabled ?? 0),
          }));
          setCakes(cakes);
        } else {
          setError(response.data.message || 'No cakes found.');
        }
      } catch (err) {
        setError('Failed to load cakes.');
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [branchId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (cakes.length === 0) {
    return <Text style={styles.empty}>No cakes available in this branch.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cakes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CakeDetails', { cake: item })}>
            <View style={styles.card}>
              {item.image_url && (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              )}
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.description}</Text>

              {item.is_per_slice_enabled === 1 ? (
                <View style={styles.priceRow}>
                  <Text style={styles.price}>🍰 Slice: €{(item.per_slice_price ?? 0).toFixed(2)}</Text>
                  <Text style={styles.price}>🌓 Half: €{(item.half_price ?? 0).toFixed(2)}</Text>
                  <Text style={styles.price}>🎂 Whole: €{(item.base_price ?? 0).toFixed(2)}</Text>
                </View>
              ) : (
                <Text style={styles.price}>🎂 Price: €{(item.base_price ?? 0).toFixed(2)}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  price: { fontWeight: 'bold', marginRight: 12 },
  priceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  error: { marginTop: 50, padding: 16, color: 'red', fontSize: 16 },
  empty: { marginTop: 50, padding: 16, fontSize: 16, textAlign: 'center' },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default CakeListScreen;