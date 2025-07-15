import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AuthContext } from '../contexts/AuthContext';
import { loginWithGoogleFirebase } from '../services/auth';
import { makeRedirectUri } from 'expo-auth-session';

const REDIRECT_URI = makeRedirectUri({ useProxy: true }); //'https://auth.expo.io/@archly/frontend';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { user } = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '316030030857-fbatsfmgm34l3svjvbou7vc2gqsimkn1.apps.googleusercontent.com',
    redirectUri: REDIRECT_URI,
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
    // useProxy: true,
    usePKCE: false,
  });

  useEffect(() => {
    console.log('🌐 OAuth Response:', response);

    if (response?.type === 'success') {
      const idToken = response.params?.id_token;

      if (!idToken) {
        Alert.alert('❌ Error', 'Token de Google no recibido');
        return;
      }

      loginWithGoogleFirebase(idToken)
        .then(userCredential => {
          console.log('✅ Logueado en Firebase:', userCredential?.user?.email);
        })
        .catch(err => {
          console.error('❌ Firebase login error:', err);
          Alert.alert('Error en Firebase', err.message);
        });

    } else if (response?.type === 'error') {
      console.error('❌ Error OAuth:', response.error);
      Alert.alert('Error de Login', 'No se pudo iniciar sesión con Google.');
    } else if (response?.type === 'cancel') {
      console.warn('⚠️ Usuario canceló login.');
    } else if (response?.type === 'dismiss') {
      console.log('🕳 Modal cerrado sin login.');
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Event App</Text>
      <Button disabled={!request} title="Login with Google" onPress={promptAsync} />
    </View>
  );
}
// navigation.reset({
//   index: 0,
//   routes: [{ name: 'EventsList' }],
// });

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
});
