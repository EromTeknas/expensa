import React, {useEffect} from 'react';
import {View, Button, Text, ActivityIndicator} from 'react-native';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {signInWithGoogleThunk} from '../features/auth/authThunk';
import ROUTES from '../constants/routes';
import {ScreenProps} from '../@types/navigation';

const LoginScreen: React.FC<ScreenProps<typeof ROUTES.LOGIN>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const {user, authLoading, authError} = useAppSelector(state => state.auth);

  // Move navigation logic to useEffect to avoid updating during render
  useEffect(() => {
    if (user) {
      navigation.replace(ROUTES.TABS); // Replace current screen with Tabs to avoid going back to login
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    try {
      dispatch(signInWithGoogleThunk());
    } catch (error) {
      console.log('Login Failed', error);
    }
  };

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
