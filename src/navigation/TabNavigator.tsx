import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Home as HomeIcon,
  MessageCircle,
  FileText,
  ListChecks,
  User as UserIcon,
} from 'lucide-react-native';

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
            let IconComponent = HomeIcon;

            if (route.name === 'Home') IconComponent = HomeIcon;
            else if (route.name === 'ChatBot') IconComponent = MessageCircle;
            else if (route.name === 'Request Leave') IconComponent = FileText;
            else if (route.name === 'Pending Leaves') IconComponent = ListChecks;
            else if (route.name === 'Profile') IconComponent = UserIcon;

            return (
              <IconComponent
                size={size}
                color={color}
                strokeWidth={focused ? 2.5 : 1.5} // thicker when selected
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="ChatBot" component={ChatScreen} />

        {isMentor && (
          <Tab.Screen
            name="Pending Leaves"
            component={MentorLeaveListScreen}
          />
        )}

        {!isMentor && (
          <Tab.Screen name="Request Leave" component={RequestLeaveScreen} />
        )}

        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default TabNavigator;
