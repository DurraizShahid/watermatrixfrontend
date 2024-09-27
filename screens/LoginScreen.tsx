import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import users from './userdummyData'; // Adjust as necessary to import your user data
import { loginUser,registerUser } from '../api/userApi'; // Assume you have a function to register users

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps & { onLoginSuccess: (userId: string) => void }> = ({ navigation, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login state
  const [phoneNo, setPhoneNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [Country, setCountry] = useState('');
  const [City, setCity] = useState('');


  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await loginUser(phoneNo, loginPassword);
      setLoading(false);
      Alert.alert('Success', 'Logged in successfully.');
  
      console.log("UserId:", data.UserId); // This will now be the UUID
      onLoginSuccess(data.UserId); // Pass UUID
  
      navigation.navigate('AddProperty', { userId: data.UserId });
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };
  const handleSignup = async () => {
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    setLoading(true);
    try {
      await registerUser(signupName, signupEmail, signupPhone, signupPassword, Country, City);
      setLoading(false);
      Alert.alert('Success', 'Registration successful');
      // navigation.navigate('OTP', { phone: signupPhone });
    } catch (error: any) {
      setLoading(false);
      // Log the error to understand the issue
      console.error(error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message || 'An unexpected error occurred.');
      } else if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground source={require('../images/topsplash.png')} style={styles.backgroundImage}>
        <Text style={styles.needHelpText}>Need Help?</Text>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsLogin(true)}>
            <Text style={[styles.tabText, isLogin && styles.activeTab]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(false)}>
            <Text style={[styles.tabText, !isLogin && styles.activeTab]}>Sign-up</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.tabIndicator, { left: isLogin ? '0%' : '70%' }]} />
      </ImageBackground>

      {isLogin ? (
        <View style={styles.formContainer}>
          {/* Login Form */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={phoneNo}
            onChangeText={setPhoneNo}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={loginPassword}
              onChangeText={setLoginPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* Sign-up Form */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={signupName}
            onChangeText={setSignupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={signupEmail}
            onChangeText={setSignupEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={signupPhone}
            onChangeText={setSignupPhone}
          />
           <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#888"
            value={City}
            onChangeText={setCity}
          />
           <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={Country}
            onChangeText={setCountry}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={loginPassword}
              onChangeText={setLoginPassword}
            />
            
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={signupConfirmPassword}
            onChangeText={setSignupConfirmPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.loginButtonText}>Create Account</Text>}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'flex-start',
  },
  needHelpText: {
    color: '#fff',
    textDecorationLine: 'underline',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 20,
    color: '#fff',
  },
  activeTab: {
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 134,
    height: 9,
    backgroundColor: '#00D6BE',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loginButton: {
    backgroundColor: '#00D6BE',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
