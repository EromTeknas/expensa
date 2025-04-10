import React from 'react';
import {View, Button, Text, ActivityIndicator} from 'react-native';
import BottomTabs from '../navigation/BottomTabs';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {signInWithGoogleThunk} from '../features/auth/authThunk';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const {user, authLoading, authError} = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    try {
      dispatch(signInWithGoogleThunk());
    } catch (error) {
      console.log('Login Failed', error);
    }
  };
  if (user) {
    return <BottomTabs />;
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {authLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Sign in with Google" onPress={handleLogin} />
      )}
      {authError && <Text style={{color: 'red'}}>{authError}</Text>}
    </View>
  );
};

export default LoginScreen;
