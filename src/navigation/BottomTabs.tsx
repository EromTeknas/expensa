import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/app/HomeScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';
import ROUTES, {RouteName} from '../constants/routes';
// import {NavigationContainer} from '@react-navigation/native';

const Tab = createBottomTabNavigator<Record<RouteName, undefined>>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === ROUTES.HOME) {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === ROUTES.SETTINGS) {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName!} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: COLORS.backgroundColor, // custom tab bar background
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 6,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
