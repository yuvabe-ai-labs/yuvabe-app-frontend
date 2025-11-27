import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatScreen from '../screens/chatbot/ChatBotScreen';
import HomeScreen from '../screens/homescreen/HomeScreen';
import MentorLeaveListScreen from '../screens/mentor/MentorLeaveListScreen';
import ProfileScreen from '../screens/profilescreen/ProfileScreen';
import RequestLeaveScreen from '../screens/requestLeave/RequestLeave';
import { useUserStore } from '../store/useUserStore';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useUserStore();

  const role = user?.role ?? 'user';

  const isMentor = role === 'mentor';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Tab.Navigator
        key={role}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({ color, focused, size }) => {
            let iconName = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ChatBot') {
              iconName = focused ? 'chatbox' : 'chatbox-outline';
            } else if (route.name === 'Request Leave') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Pending Leaves') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="ChatBot" component={ChatScreen} />

        {/* Mentor gets ONLY pending leaves */}
        {isMentor && (
          <Tab.Screen name="Pending Leaves" component={MentorLeaveListScreen} />
        )}

        {/* Everyone who is NOT a mentor gets ONLY Request Leave */}
        {!isMentor && (
          <Tab.Screen name="Request Leave" component={RequestLeaveScreen} />
        )}

        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
export default TabNavigator;

// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={function ({ route }) {
//         return {
//           tabBarIcon: function ({ color, focused, size }) {
//             var iconName: string = '';
//             if (route.name === 'Home') {
//               iconName = focused ? 'home' : 'home-outline';
//             } else if (route.name === 'ChatBot') {
//               iconName = focused ? 'chatbubble' : 'chatbubble-outline';
//             } else if (route.name === 'Feed') {
//               iconName = focused ? 'newspaper' : 'newspaper-outline';
//             } else if (route.name === 'Profile') {
//               iconName = focused ? 'person' : 'person-outline';
//             }
//             return <Icon name={iconName} color={color} size={size}></Icon>;
//           },
//           tabBarActiveTintColor: '#007aff',
//           tabBarInactiveTintColor: 'gray',
//           headerShown: false,
//         };
//       }}
//     >
//       <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
//       <Tab.Screen name="Profile" component={ProfileScreen}></Tab.Screen>
//       <Tab.Screen name="Feed" component={FeedScreen}></Tab.Screen>
//       <Tab.Screen name="ChatBot" component={ChatScreen}></Tab.Screen>
//     </Tab.Navigator>
//   );
// }
