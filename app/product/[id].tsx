import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '../../services/api';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await api.getProduct(id as string);
      setProduct(p);
    })();
  }, [id]);

  if (!product) return null;

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.image} />
      <ThemedText type="title">{product.name}</ThemedText>
      <ThemedText>{product.description}</ThemedText>
      <ThemedText type="subtitle">${product.price.toFixed(2)}</ThemedText>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <Button title="-" onPress={() => setQty(Math.max(1, qty - 1))} />
        <Text>{qty}</Text>
        <Button title="+" onPress={() => setQty(qty + 1)} />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button title="Order Now" onPress={() => router.push({ pathname: '/checkout', params: { productId: product.id, qty } })} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, image: { width: 200, height: 200 } });
