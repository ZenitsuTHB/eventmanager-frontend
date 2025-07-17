import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../pages/LoginScreen';
import EventsListScreen from '../pages/EventsListScreen';
import ProfileScreen from '../pages/ProfileScreen';
import CreateEventScreen from '../pages/CreateEventScreen';
import EventSignUpScreen from '../pages/EventSignUpScreen';
import EventDetailScreen from '../pages/EventDetailScreen';

import { AuthContext } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="EventsList" component={EventsListScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
          <Stack.Screen name="EventSignUp" component={EventSignUpScreen} />
          <Stack.Screen name="EventDetails" component={EventDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}


{/* <Stack.Screen name="Profile" component={ProfileScreen} /> */ }

{/* <Stack.Screen name="Events" component={EventsListScreen} /> */ }
//   <Stack.Screen name="EventDetail" component={EventDetailScreen} />

//   <Stack.Screen name="Contribution" component={ContributionScreen} />