import React from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export default function Support() {
  return (
    <ThemedView style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Support</Text>
      <Text>Phone: +1-555-0100</Text>
      <Text>Email: support@example.com</Text>
      <View style={{ height: 12 }} />
      <Button title="Call support" onPress={() => Linking.openURL('tel:+15550100')} />
      <View style={{ height: 8 }} />
      <Button title="Email support" onPress={() => Linking.openURL('mailto:support@example.com')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 } });
