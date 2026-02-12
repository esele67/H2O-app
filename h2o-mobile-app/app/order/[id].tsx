import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '../../services/api';

const STATUSES = ['NEW', 'ACCEPTED', 'DISPATCHED', 'DELIVERED'];

export default function OrderStatus() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);

  const fetch = async () => {
    const o = await api.getOrder(id as string);
    setOrder(o);
  };

  useEffect(() => {
    fetch();
    intervalRef.current = setInterval(fetch, 5000) as any;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current as any);
    };
  }, [id]);

  if (!order) return null;

  const idx = STATUSES.indexOf(order.status);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Order {order.id}</ThemedText>
      <ThemedText>Placed: {new Date(order.createdAt).toLocaleString()}</ThemedText>
      <View style={{ marginTop: 12 }}>
        {STATUSES.map((s, i) => (
          <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: i <= idx ? 'green' : 'gray' }} />
            <Text>{s}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 12 }}>
        <ThemedText type="subtitle">Summary</ThemedText>
        {order.items.map((it: any, i: number) => {
          // productId may be populated (object) or just an id string. Avoid rendering objects directly.
          const pid = it.productId && (typeof it.productId === 'string' ? it.productId : (it.productId._id || it.productId.id));
          const productName = it.product?.name || (it.productId && (it.productId.name || it.productId.title)) || it.raw?.product?.name || String(pid || 'Item');
          const qty = it.qty ?? it.quantity ?? it.quantity ?? 1;
          return (
            <Text key={pid || i}>{productName} x {qty}</Text>
          );
        })}
        <Text>Address: {order.address || order.addressId}</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 } });
