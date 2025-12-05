import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NotificationIndicator from '../components/NotificationIndicator';
import ChatScreen from '../screens/chatbot/ChatBotScreen';
import HomeScreen from '../screens/homescreen/HomeScreen';
import CreateJournalScreen from '../screens/journaling/CreateJournalScreen';
import JournalingScreen from '../screens/journaling/JournalingScreen';
import LeaveDetailsScreen from '../screens/leave/LeaveDetailsScreen';
import MyLeaveHistoryScreen from '../screens/leave/MyLeaveHistoryScreen';
import TeamLeaveHistoryScreen from '../screens/leave/TeamLeaveHistoryScreen';
import MentorApprovalScreen from '../screens/mentor/MentorApproveScreen';
import MentorLeaveListScreen from '../screens/mentor/MentorLeaveListScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import PayslipScreen from '../screens/payslip/PaySlipScreen';
import AssetSection from '../screens/profilescreen/AssetSection';
import EditProfileScreen from '../screens/profilescreen/EditProfileScreen';
import InformationScreen from '../screens/profilescreen/InformationScreen';
import ProfileScreen from '../screens/profilescreen/ProfileScreen';
import RequestLeaveScreen from '../screens/requestLeave/RequestLeave';
import WaterTrackerScreen from '../screens/wellbeing/water/WaterTrackingScreen';

const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <NotificationIndicator />
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
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="PendingLeaves"
          component={MentorLeaveListScreen}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="AssetsScreen"
          component={AssetSection}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="InformationScreen"
          component={InformationScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="LeaveDetails"
          component={LeaveDetailsScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="MentorApproval"
          component={MentorApprovalScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="TeamLeaveHistory"
          component={TeamLeaveHistoryScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="MyLeaveHistory"
          component={MyLeaveHistoryScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="WaterTracker"
          component={WaterTrackerScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="PaySlip"
          component={PayslipScreen}
          name="Journaling"
          component={JournalingScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="CreateJournal"
          component={CreateJournalScreen}
          options={{ headerShown: false }}
        />
      </AppStack.Navigator>
    </>
  );
};

export default AppNavigator;
