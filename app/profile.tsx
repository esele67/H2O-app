import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      {user ? (
        <View>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
          <Text>{user.phone}</Text>
          {/* <Button title="Edit" onPress={() => router.push('/profile/edit')} /> */}
          <Button title="Addresses" onPress={() => router.push('/addresses')} />
          <Button title="Logout" onPress={() => { logout(); router.replace('/login'); }} />
        </View>
      ) : (
        <Button title="Login" onPress={() => router.push('/login')} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 } });
