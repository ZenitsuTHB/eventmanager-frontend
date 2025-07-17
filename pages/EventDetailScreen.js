import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { doc, getDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EventDetailsScreen({ route }) {
  const { eventId } = route.params;
  const navigation = useNavigation();

  const [event, setEvent] = useState(null);
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) setEvent(eventDoc.data());
      else setEvent(null);
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const q = query(collection(db, 'event_signups'), where('eventId', '==', eventId));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSignups(list);
      setLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar borrado',
      '¿Seguro que quieres borrar este evento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', eventId));
              Alert.alert('Evento borrado');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error al borrar', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!event) return <Text style={styles.message}>Evento no encontrado</Text>;
  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const renderSignup = ({ item }) => (
    <View style={styles.signupItem}>
      <Text style={styles.userText}>Usuario: {item.userId}</Text>
      <Text style={styles.itemsText}>Llevará: {item.items}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con flecha atrás y botón borrar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Evento</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash" size={26} color="#d11a2a" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.text}>{event.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Lugar:</Text>
        <Text style={styles.text}>{event.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.text}>{new Date(event.date).toLocaleDateString()}</Text>
      </View>

      <View style={[styles.section, { flex: 1 }]}>
        <Text style={[styles.label, { marginBottom: 10 }]}>Personas inscritas:</Text>
        {signups.length === 0 ? (
          <Text style={styles.text}>Nadie se ha inscrito aún</Text>
        ) : (
          <FlatList
            data={signups}
            keyExtractor={(item) => item.id}
            renderItem={renderSignup}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // espacio para que el delete no quede pegado al título
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  signupItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  userText: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    color: '#222',
  },
  itemsText: {
    fontSize: 14,
    color: '#555',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    paddingTop: 40,
  },
});
