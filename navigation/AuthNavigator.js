import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}