import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {supabase} from './supbaseClient';
import Config from 'react-native-config';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_ACCESS_TOKEN,
  scopes: ['profile', 'email'],
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);

    const idToken = userInfo.data?.idToken;
    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken!,
    });

    console.log(data);

    if (error) {
      console.log(error);
      throw error;
    }

    return data.user;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
