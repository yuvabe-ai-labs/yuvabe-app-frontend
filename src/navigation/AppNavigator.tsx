import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatScreen from '../screens/chatbot/ChatBotScreen';
import HomeScreen from '../screens/homescreen/HomeScreen';
import MyLeaveHistoryScreen from '../screens/leave/MyLeaveHistoryScreen';
import TeamLeaveHistoryScreen from '../screens/leave/TeamLeaveHistoryScreen';
import MentorApprovalScreen from '../screens/mentor/MentorApproveScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import AssetSection from '../screens/profilescreen/AssetSection';
import EditProfileScreen from '../screens/profilescreen/EditProfileScreen';
import InformationScreen from '../screens/profilescreen/InformationScreen';
import LeaveDetailsScreen from '../screens/profilescreen/LeaveDetailsScreen';
import LeaveRequestScreen from '../screens/profilescreen/LeaveScreen';
import ProfileScreen from '../screens/profilescreen/ProfileScreen';
import RequestLeaveScreen from '../screens/requestLeave/RequestLeave';

const AppStack = createNativeStackNavigator();

// const AppNavigator = () => {
//   return (
//     <AppStack.Navigator initialRouteName="Root">
//       {/* <AppStack.Screen
//         name="VerifyEmail"
//         component={VerifyEmailScreen}
//         options={{ headerShown: false }}
//       /> */}
//       <AppStack.Screen
//         name="Root"
//         component={TabNavigator}
//         options={{ headerShown: false }}
//       />
//       <AppStack.Screen name="EditProfile" component={EditProfileScreen} />
//       <AppStack.Screen name="AssetsScreen" component={AssetSection} />
//       <AppStack.Screen
//         name="InformationScreen"
//         component={InformationScreen}
//         options={{ headerTitle: 'Information' }}
//       />
//       <AppStack.Screen
//         name="LeaveScreen"
//         component={LeaveRequestScreen}
//         options={{ headerTitle: 'Leave Request' }}
//       />
//       <AppStack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
//       <AppStack.Screen
//         name="Notifications"
//         component={NotificationScreen}
//         options={{
//           headerShown: true,
//         }}
//       />

//       <AppStack.Screen
//         name="MentorApproval"
//         component={MentorApprovalScreen}
//         options={{ headerTitle: 'Leave Approval' }}
//       />
//       <AppStack.Screen
//         name="TeamLeaveHistory"
//         component={TeamLeaveHistoryScreen}
//         options={{ headerTitle: 'Leave Approval' }}
//       />
//       <AppStack.Screen
//         name="MyLeaveHistory"
//         component={MyLeaveHistoryScreen}
//         options={{ headerTitle: 'Leave Approval' }}
//       />
//     </AppStack.Navigator>
//   );
// };

const AppNavigator = () => {
  return (
    <AppStack.Navigator initialRouteName="Home">
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="RequestLeave"
        component={RequestLeaveScreen}
        options={{ headerShown: true, title: 'Request Leave' }}
      />

      <AppStack.Screen name="Notifications" component={NotificationScreen} />
      <AppStack.Screen name="EditProfile" component={EditProfileScreen} />
      <AppStack.Screen name="AssetsScreen" component={AssetSection} />
      <AppStack.Screen name="InformationScreen" component={InformationScreen} />
      <AppStack.Screen name="LeaveScreen" component={LeaveRequestScreen} />
      <AppStack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
      <AppStack.Screen name="MentorApproval" component={MentorApprovalScreen} />
      <AppStack.Screen
        name="TeamLeaveHistory"
        component={TeamLeaveHistoryScreen}
      />
      <AppStack.Screen name="MyLeaveHistory" component={MyLeaveHistoryScreen} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
