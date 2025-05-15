import React from 'react';
import {View, Button, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList} from 'react-native';
import BottomTabs from '../navigation/BottomTabs';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {signInWithGoogleThunk} from '../features/auth/authThunk';

const { width } = Dimensions.get('window');

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
     <View style={styles.container}>
     {/* Background Text Layer */}
     <View style={styles.backgroundTextContainer}>
        <FlatList
          data={Array.from({ length: 20 })}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <Text style={styles.backgroundText}>TRACK THEM ALL</Text>
          )}
          scrollEnabled={false}
        />
     </View>

     {/* Login Card */}
     <View style={styles.card}>
       <Text style={styles.title}>Login</Text>

       {authLoading ? (
         <ActivityIndicator size="large" color="#fff" />
       ) : (
         <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
           <Image
             source={{
               uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
             }}
             style={styles.googleIcon}
           />
           <Text style={styles.googleText}>Sign In with Google</Text>
         </TouchableOpacity>
       )}

       {authError && (
         <Text style={{color: 'red', marginTop: 10}}>{authError}</Text>
       )}
     </View>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    position: 'relative',
  },
  backgroundTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity:0.08,
  },
  backgroundText: {
    width: 322,
    height: 29,
    fontSize: 27,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  card: {
    width: 440,
    height: 400,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  footer: {
    color: '#aaa',
    marginTop: 12,
    fontSize: 12,
  },
});

export default LoginScreen;


