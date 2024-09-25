// import libraries
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// create a component
const Signin = () => {
  const [FullName, setFullName] = useState('');
  const [PhoneNo, setPhoneNo] = useState('');
  const [City, setCity] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [Country, setCountry] = useState('');



const navigation=useNavigation();

const handleRegister = () => {
  axios.post('http://localhost:3000', {
    FullName,
    PhoneNo,
    City,
    Password,
    Country,
    Email
  })
    .then(response => {
      Alert.alert('User registered successfully!');
      // Navigate to AccountScreen with success message
      (navigation as any).navigate('AccountScreen');
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Registration failed', 'There was an error registering the user.');
    });
};


  return (
    <View style={styles.container}>
      <Text>Signin</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={FullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={PhoneNo}
        onChangeText={setPhoneNo}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={City}
        onChangeText={setCity}
      />
     <TextInput
        style={styles.input}
        placeholder="Password"
        value={Password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={Email}
        onChangeText={setEmail}
     
      />
     <TextInput
        style={styles.input}
        placeholder="Country"
        value={Country}
        onChangeText={setCountry}
    
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

// make this component available to the app
export default Signin;
