import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../pages/ProfileScreen';
// import CreateEventScreen from '../pages/CreateEventScreen';
// import EventsListScreen from '../pages/EventsListScreen';
// import EventDetailScreen from '../pages/EventDetailScreen';
// import ContributionScreen from '../pages/ContributionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {<Stack.Screen name="Profile" component={ProfileScreen} />}
    </Stack.Navigator>
  );
}

{/* <Stack.Navigator>
//   <Stack.Screen name="Events" component={EventsListScreen} />
//   <Stack.Screen name="EventDetail" component={EventDetailScreen} />
//   <Stack.Screen name="Profile" component={ProfileScreen} />
//   <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
//   <Stack.Screen name="Contribution" component={ContributionScreen} />
// </Stack.Navigator> */}