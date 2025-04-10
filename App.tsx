import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import LoginScreen from './src/screens/LoginScreen';
import {store} from './src/app/store';
import AuthProvider from './src/features/auth/authProvider';
import {supabase} from './src/services/supbaseClient';
import {setUser} from './src/features/auth/authSlice';

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
        <NavigationContainer>
          {/* Later add stack/tab navigation */}
          <LoginScreen />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}

export default App;
