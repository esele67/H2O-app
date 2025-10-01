import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import api from '../services/api';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!user) return;
      const o = await api.getOrders(user.id);
      setOrders(o);
    })();
  }, [user]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Orders</ThemedText>
      <FlatList data={orders} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/order/${item.id}`)}>
          <Text>#{item.id.slice(0, 6)} - {new Date(item.placedAt).toLocaleDateString()}</Text>
          <Text>Total items: {item.items.length}</Text>
          <Text>Status: {item.status}</Text>
        </TouchableOpacity>
      )} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, card: { padding: 12, borderWidth: 1, marginBottom: 8, borderRadius: 8 } });
