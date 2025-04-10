import React from 'react';
import {View, Text, Button, ActivityIndicator} from 'react-native';
import {useAuth} from '../features/auth/authHooks';
import BottomTabs from '../navigation/BottomTabs';

const LoginScreen = () => {
  const {signIn, loading, user, error} = useAuth();

  if (user) {
    return <BottomTabs />;
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Sign in with Google" onPress={signIn} />
      )}
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

export default LoginScreen;
