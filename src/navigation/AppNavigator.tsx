import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AssetSection } from '../screens/profilescreen/AssetSection';
import EditProfileScreen from '../screens/profilescreen/EditProfileScreen';
import { InformationScreen } from '../screens/profilescreen/InformationScreen';
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
    </AppStack.Navigator>
  );
};

export default AppNavigator;
