// src/components/BranchCard.tsx
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native'; // حذف View

type Props = {
  branch: {
    id: number;
    name: string;
    address: string;
    city: string;
    distance?: number;
  };
  onPress?: () => void;
};

const BranchCard = ({ branch, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{branch.name}</Text>
      <Text style={styles.text}>📍 {branch.address}, {branch.city}</Text>
      {branch.distance !== undefined && (
        <Text style={styles.text}>🧭 Distance: {branch.distance} km</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
  },
});

export default BranchCard;
