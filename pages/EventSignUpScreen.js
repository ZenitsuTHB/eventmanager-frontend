import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

export default function EventSignUpScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [items, setItems] = useState('');

  const handleSignUp = async () => {
    if (!items.trim()) return Alert.alert('❌ Campo vacío', 'Debes indicar qué llevarás');

    try {
      await addDoc(collection(db, 'event_signups'), {
        eventId,
        userId: auth.currentUser.uid,
        items,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('✅ Te has inscrito al evento');
      navigation.goBack();
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>¿Qué vas a llevar al evento?</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Ej: Snacks, bebidas, mantas..."
        value={items}
        onChangeText={setItems}
      />
      <Button title="Inscribirme" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    minHeight: 60,
  },
});
