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
import {RootStackParamList} from './src/@types/navigation';

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
