import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import LoginScreen from './src/screens/LoginScreen';
import {store} from './src/app/store';
import AuthProvider from './src/features/auth/authProvider';
import {supabase} from './src/services/supbaseClient';
import {setUser} from './src/features/auth/authSlice';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import COLORS from './src/constants/colors';
import Toast from 'react-native-toast-message';
import toastConfig from './src/configs/toastConfig';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ROUTES from './src/constants/routes';
import BottomTabs from './src/navigation/BottomTabs';
import SyncTransactionsScreen from './src/screens/app/SyncTransactionsScreen';
import {RootStackParamList} from './src/@types/navigation';
import {initializeDatabase} from './src/watermelon/utils/init.db';
import {database} from './src/watermelon/database';
import {Q} from '@nozbe/watermelondb';
const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): React.JSX.Element {
  useEffect(() => {
    const fetchSession = async () => {
      const {data} = await supabase.auth.getSession();
      if (data.session?.user) {
        store.dispatch(setUser(data.session.user));
      }
    };

    fetchSession();

    initializeDatabase().then(async () => {
      // Fetch the last sync date and sync feature status
      const settings = await database.collections
        .get('settings')
        .query(Q.where('is_sync_feature_enabled', Q.notEq(null))) // ensures the setting exists
        .fetch();

      if (settings.length > 0) {
        const setting = settings[0];
        console.log('Setting', setting);
      } else {
        // Handle case if settings are missing (though unlikely)
        console.log('Settings not found.');
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.backgroundColor}
          />
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
              <Stack.Screen name={ROUTES.TABS} component={BottomTabs} />
              <Stack.Screen
                name={ROUTES.SYNC_TRANSACTIONS}
                component={SyncTransactionsScreen}
                options={{
                  presentation: 'modal',
                  animationTypeForReplace: 'push',
                  animation: 'slide_from_right',
                }}
              />
            </Stack.Navigator>
            <Toast config={toastConfig} />
          </NavigationContainer>
        </SafeAreaView>
      </AuthProvider>
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
