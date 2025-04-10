import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {signOut} from '../../features/auth/authSlice';

const SettingsScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(signOut());
    // Optionally, add any additional logout logic (e.g., navigation, clearing tokens)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default SettingsScreen;
