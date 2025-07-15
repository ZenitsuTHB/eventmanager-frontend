// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, storage } from '../services/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const uid = auth.currentUser?.uid;
  const userRef = doc(db, 'users', uid);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    interests: '',
    bio: '',
    photoURL: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          age: data.age?.toString() || '',
          interests: data.interests?.join(', ') || '',
          bio: data.bio || '',
          photoURL: data.photoURL || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const imgRef = ref(storage, `profile-pictures/${uid}`);
      await uploadBytes(imgRef, blob);
      const downloadURL = await getDownloadURL(imgRef);
      setProfile(prev => ({ ...prev, photoURL: downloadURL }));
    }
  };

  const handleSave = async () => {
    if (!profile.firstName.trim()) return Alert.alert('Error', 'El nombre es obligatorio.');
    if (!profile.lastName.trim()) return Alert.alert('Error', 'El apellido es obligatorio.');
    if (!profile.age || isNaN(profile.age) || profile.age <= 0) return Alert.alert('Error', 'Edad inválida.');

    setSaving(true);
    try {
      await updateDoc(userRef, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: parseInt(profile.age),
        interests: profile.interests.split(',').map(tag => tag.trim()),
        bio: profile.bio,
        photoURL: profile.photoURL,
      });
      Alert.alert('✅ Perfil actualizado');
      setEditMode(false);
    } catch (err) {
      Alert.alert('❌ Error al guardar', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDeleteAccount = async () => {
    Alert.alert('¿Eliminar cuenta?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(userRef);
            await deleteUser(auth.currentUser);
          } catch (err) {
            Alert.alert('Error al eliminar cuenta', err.message);
          }
        }
      }
    ]);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('EventsList')} style={styles.backButton}>
        <AntDesign name="arrowleft" size={28} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: profile.photoURL || 'https://via.placeholder.com/150' }} style={styles.avatar} />
      {editMode && <Button title="Cambiar foto" onPress={handlePickImage} />}

      <Text style={styles.label}>Nombre:</Text>
      <TextInput editable={editMode} value={profile.firstName} onChangeText={firstName => setProfile({ ...profile, firstName })} style={styles.input} />

      <Text style={styles.label}>Apellido:</Text>
      <TextInput editable={editMode} value={profile.lastName} onChangeText={lastName => setProfile({ ...profile, lastName })} style={styles.input} />

      <Text style={styles.label}>Edad:</Text>
      <TextInput editable={editMode} value={profile.age} onChangeText={age => setProfile({ ...profile, age })} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Intereses (separados por coma):</Text>
      <TextInput editable={editMode} value={profile.interests} onChangeText={interests => setProfile({ ...profile, interests })} multiline style={styles.textarea} />

      <Text style={styles.label}>Biografía:</Text>
      <TextInput editable={editMode} value={profile.bio} onChangeText={bio => setProfile({ ...profile, bio })} multiline style={styles.textarea} />

      {editMode ? (
        <Button title={saving ? 'Guardando...' : 'Guardar cambios'} onPress={handleSave} disabled={saving} />
      ) : (
        <Button title="Editar perfil" onPress={() => setEditMode(true)} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="gray" />
        <Button title="Eliminar cuenta" onPress={handleDeleteAccount} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40 },
  label: { marginTop: 16, marginBottom: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  textarea: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, minHeight: 60 },
  avatar: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginBottom: 16 },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 10 },
});