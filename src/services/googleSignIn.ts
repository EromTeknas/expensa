import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {supabase} from './supbaseClient';

GoogleSignin.configure({
  webClientId:
    '1035840591477-8mbepfb5r2q39n2bguoms6qo0hs7lrr2.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;
    
    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken!,
    });

    if (error) {
      throw error;
    }

    return data.user;
  } catch (error: any) {
    console.log('ERROR IS: ' + JSON.stringify(error));

    throw error;
  }
};
