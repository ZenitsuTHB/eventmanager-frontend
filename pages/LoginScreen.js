import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { AuthContext } from '../contexts/AuthContext';
import { loginWithGoogleFirebase } from '../services/auth';
import { makeRedirectUri } from 'expo-auth-session';

const REDIRECT_URI = makeRedirectUri({ useProxy: true });
console.log('ÑÑÑÑÑÑÑ', REDIRECT_URI)

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { user } = useContext(AuthContext);



  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'null to replace',
    responseType: 'id_token',
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    usePKCE: false, // <- IMPORTANTE
    // redirectUri: Constants.expoConfig?.scheme
    //   ? `${Constants.expoConfig.scheme}:/oauth2redirect/google`
    //   : 'https://auth.expo.io/@archly/frontend',
  });
  console.log('bbbbbbbbbbbbbb', response)
  useEffect(() => {
    if (response?.type === 'success') {
      console.log('aaaaaaaaaaaaaaaaa', response)

      const idToken = response.params?.id_token;
      //2Connect to firebase
      loginWithGoogleFirebase(idToken)
        .then(userCredential => {
          console.log('User successfully logged in firebase: ', userCredential);
        })
        .catch(err => {
          console.error('Error while trying to log in Firebase', err);
        });
      //1const { authentication } = response;
      //1console.log('Logged in with access token:', authentication.accessToken);
      //1Optional: Fetch profile from Google
      //1fetch('https://www.googleapis.com/userinfo/v2/me', {
      //  1headers: { Authorization: `Bearer ${authentication.accessToken}` },
      //})
      //  .then(res => res.json())
      //  .then(data => console.log('Google user:', data));
    } else {
      console.log(2222, response)
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Event App</Text>
      <Button disabled={!request} title="Login with Google" onPress={() => promptAsync()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
});
