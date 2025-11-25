import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MyLeaveHistoryScreen from '../screens/leave/MyLeaveHistoryScreen';
import TeamLeaveHistoryScreen from '../screens/leave/TeamLeaveHistoryScreen';
import MentorApprovalScreen from '../screens/mentor/MentorApproveScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import { AssetSection } from '../screens/profilescreen/AssetSection';
import EditProfileScreen from '../screens/profilescreen/EditProfileScreen';
import { InformationScreen } from '../screens/profilescreen/InformationScreen';
import LeaveDetailsScreen from '../screens/profilescreen/LeaveDetailsScreen';
import LeaveRequestScreen from '../screens/profilescreen/LeaveScreen';
import TabNavigator from './TabNavigator';

const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <AppStack.Navigator initialRouteName="Root">
      {/* <AppStack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      /> */}
      <AppStack.Screen
        name="Root"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen name="EditProfile" component={EditProfileScreen} />
      <AppStack.Screen name="AssetsScreen" component={AssetSection} />
      <AppStack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{ headerTitle: 'Information' }}
      />
      <AppStack.Screen
        name="LeaveScreen"
        component={LeaveRequestScreen}
        options={{ headerTitle: 'Leave Request' }}
      />
      <AppStack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
      <AppStack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerShown: true,
        }}
      />

      <AppStack.Screen
        name="MentorApproval"
        component={MentorApprovalScreen}
        options={{ headerTitle: 'Leave Approval' }}
      />
      <AppStack.Screen
        name="TeamLeaveHistory"
        component={TeamLeaveHistoryScreen}
        options={{ headerTitle: 'Leave Approval' }}
      />
      <AppStack.Screen
        name="MyLeaveHistory"
        component={MyLeaveHistoryScreen}
        options={{ headerTitle: 'Leave Approval' }}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
