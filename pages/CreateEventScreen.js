import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CreateEventScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const validateDate = (inputDate) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    if (!dateRegex.test(inputDate)) return false;

    const parsedDate = new Date(inputDate);
    return !isNaN(parsedDate.getTime());
  };

  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert('Campo vacío', 'Título está vacío');
    if (!description.trim()) return Alert.alert('Campo vacío', 'Descripción está vacía');
    if (!location.trim()) return Alert.alert('Campo vacío', 'Lugar está vacío');
    if (!date.trim()) return Alert.alert('Campo vacío', 'Fecha está vacía');

    if (!validateDate(date.trim())) {
      return Alert.alert('Fecha inválida', 'Usa el formato YYYY-MM-DD, por ejemplo: 2025-08-15');
    }

    try {
      await addDoc(collection(db, 'events'), {
        title,
        description,
        location,
        date,
        createdBy: auth.currentUser.uid,
      });
      Alert.alert('✅ Evento creado');
      navigation.goBack();
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Flecha de regreso arriba a la izquierda */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.label}>Título</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Lugar</Text>
      <TextInput value={location} onChangeText={setLocation} style={styles.input} />

      <Text style={styles.label}>Fecha del evento</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={styles.input}
        placeholder="Ej: 2025-08-15"
      />

      <Button title="Crear evento" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50, // para dejar espacio para la flecha
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  label: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
});
