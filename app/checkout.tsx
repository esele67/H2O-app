import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import api from '../services/api';

export default function Checkout() {
  const { productId, qty: qtyParam } = useLocalSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(Number(qtyParam) || 1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await api.getProduct(productId as string);
      setProduct(p);
      if (user) {
        const a = await api.getAddresses(user.id);
        setAddresses(a);
        if (a[0]) setSelected(a[0].id);
      }
    })();
  }, [productId, user]);

  const handleAddAddress = async () => {
    if (!user) return alert('Login required');
    const entry = await api.addAddress({ userId: user.id, label: 'Home', text: '123 Main St' });
    setAddresses((s) => [entry, ...s]);
    setSelected(entry.id);
  };

  const handleConfirm = async () => {
    if (!selected) return alert('Please add/select address');
    if (!product) return;
    const order = await api.postOrder({ userId: user?.id, addressId: selected, items: [{ productId: product.id, qty }], paymentMethod: 'COD' });
    router.replace(`/order/${order.id}`);
  };

  if (!product) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Checkout</ThemedText>
      <ThemedText>Item: {product.name}</ThemedText>
      <ThemedText>Qty: {qty}</ThemedText>
      <ThemedText>Unit: ${product.price.toFixed(2)}</ThemedText>
      <ThemedText type="subtitle">Total: ${(product.price * qty).toFixed(2)}</ThemedText>

      <View style={{ marginTop: 12 }}>
        <ThemedText type="subtitle">Delivery address</ThemedText>
        {addresses.length === 0 ? (
          <View style={{ gap: 8 }}>
            <ThemedText>No saved addresses</ThemedText>
            <Button title="Add address" onPress={handleAddAddress} />
          </View>
        ) : (
          addresses.map((a) => (
            <View key={a.id} style={{ marginVertical: 6 }}>
              <Text>{a.label}: {a.text}</Text>
              <Button title={selected === a.id ? 'Selected' : 'Select'} onPress={() => setSelected(a.id)} />
            </View>
          ))
        )}
      </View>

      <TextInput placeholder="Delivery notes (optional)" value={notes} onChangeText={setNotes} style={styles.input} />

      <View style={{ marginTop: 12 }}>
        <Button title="Confirm Order (COD)" onPress={handleConfirm} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, input: { borderWidth: 1, padding: 8, borderRadius: 6, marginTop: 12 } });
