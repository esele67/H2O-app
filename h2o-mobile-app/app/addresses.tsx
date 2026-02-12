import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import api from '../services/api';

export default function Addresses() {
  const { user } = useAuth();
  const [addrs, setAddrs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const a = await api.getAddresses(user._id);
      setAddrs(a);
    })();
  }, [user]);

  return (
    <ThemedView style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Addresses</Text>
      <FlatList data={addrs} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>{item.label}</Text>
          <Text>{item.text}</Text>
        </View>
      )} />
      <Button title="Add address" onPress={async () => { if (user) { await api.addAddress({ userId: user._id, label: 'Home', text: '123 Main St' }); const a = await api.getAddresses(user._id); setAddrs(a); } }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, card: { padding: 12, borderWidth: 1, marginBottom: 8 } });
