import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import LoginScreen from './src/screens/LoginScreen';
import {store} from './src/app/store';
import AuthProvider from './src/features/auth/authProvider';

function App(): React.JSX.Element {
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
