import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default function ProfileScreen() {
  const uid = auth.currentUser?.uid;
  const userRef = doc(db, 'users', uid);

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    interests: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProfile({
          name: data.name || '',
          age: data.age?.toString() || '',
          interests: data.interests?.join(', ') || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateDoc(userRef, {
        name: profile.name,
        age: parseInt(profile.age),
        interests: profile.interests.split(',').map(tag => tag.trim()),
      });
      Alert.alert('✅ Perfil actualizado');
    } catch (err) {
      Alert.alert('❌ Error al guardar', err.message);
    }
  };

  if (loading) return <Text style={styles.loading}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        value={profile.name}
        onChangeText={name => setProfile({ ...profile, name })}
        style={styles.input}
      />

      <Text style={styles.label}>Edad:</Text>
      <TextInput
        value={profile.age}
        onChangeText={age => setProfile({ ...profile, age })}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Intereses (separados por coma):</Text>
      <TextInput
        value={profile.interests}
        onChangeText={interests => setProfile({ ...profile, interests })}
        multiline
        style={styles.textarea}
      />

      <Button title="Guardar cambios" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 16, marginBottom: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  textarea: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, minHeight: 60 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 18 },
});
