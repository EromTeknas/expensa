import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/app/HomeScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';
import ROUTES, {RouteName} from '../constants/routes';
// import {NavigationContainer} from '@react-navigation/native';
import {initializeDatabase} from '../watermelon/utils/init.db';
import {database} from '../watermelon/database';
import {Q} from '@nozbe/watermelondb';
import {checkAndRequestReadSMSPermission} from '../utils/checkAndRequestPermissions';
import {getMessageSinceLastSyncDate} from '../services/smsService';
const Tab = createBottomTabNavigator<Record<RouteName, undefined>>();

const BottomTabs = () => {
  useEffect(() => {
    initializeDatabase().then(async () => {
      const permission = await checkAndRequestReadSMSPermission();
      if (permission) {
        console.log('Permission Granted');
        // Fetch the last sync date and sync feature status
        const settings = await database.collections
          .get('settings')
          .query(Q.where('is_sync_feature_enabled', Q.notEq(null))) // ensures the setting exists
          .fetch();

        if (settings.length > 0) {
          const setting = settings[0];
          console.log('Setting', setting.lastSyncDate);
          const lastSyncDateT = new Date(setting.lastSyncDate);
          getMessageSinceLastSyncDate(lastSyncDateT);
        } else {
          // Handle case if settings are missing (though unlikely)
          console.log('Settings not found.');
        }
      } else {
        console.log('permission not granted');
      }
    });
  }, []);
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
