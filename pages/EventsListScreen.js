// EventsListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function EventsListScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchPhoto = async () => {
      const userRef = collection(db, 'users');
      const uid = auth.currentUser?.uid;
      if (uid) {
        const docSnap = await (await import('firebase/firestore')).getDoc((await import('firebase/firestore')).doc(userRef, uid));
        if (docSnap.exists()) {
          setPhotoURL(docSnap.data().photoURL);
        }
      }
    };
    fetchPhoto();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: photoURL || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.profileText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <View style={styles.noEventsBox}>
          <Text style={styles.noEventsText}>🚫 There are no events yet!</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
        <AntDesign name="pluscircle" size={60} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  profileContainer: { alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 25 },
  profileText: { fontSize: 12, color: '#007BFF' },
  card: { padding: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold' },
  date: { marginTop: 4, color: '#666' },
  fab: { position: 'absolute', bottom: 20, right: 20 },
  noEventsBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noEventsText: { fontSize: 18, color: '#888' },
});