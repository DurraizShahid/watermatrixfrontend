import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import bcrypt from 'bcryptjs';


// Constants
const API_URL = 'https://mapmatrixbackend-production.up.railway.app/api/auth/users';

// Custom hook for managing form state
const useForm = (initialState: any) => {
  const [formData, setFormData] = useState(initialState);
  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  return { formData, handleChange };
};

// Function to fetch users from API
const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

// Function to register a new user
const registerUser = async (name: string, email: string, phone: string, password: string, country: string, city: string) => {
  const newUser = {
    name,
    email,
    phone_number: phone, // Match the field names in your API
    password_hash: password, // Ensure the password is hashed appropriately on the backend
    country,
    city,
  };

  try {
    const response = await axios.post(API_URL, newUser);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

interface LoginScreenProps {
  navigation: any;
  onLoginSuccess: (userId: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Form handling for login and signup
  const { formData: loginData, handleChange: handleLoginChange } = useForm({
    phoneNo: '',
    loginPassword: '',
  });

  const { formData: signupData, handleChange: handleSignupChange } = useForm({
    signupName: '',
    signupEmail: '',
    signupPhone: '',
    signupPassword: '',
    signupConfirmPassword: '',
    country: '',
    city: '',
  });

  // Fetch users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch {
        Alert.alert('Error', 'Unable to fetch users.');
      }
    };

    loadUsers();
  }, []);

  // Login handler
  const handleLogin = async () => {
    setLoading(true);
    const user = users.find((user) => user.phone_number === loginData.phoneNo);

    // If user is found, compare the password
    if (user) {
        const isPasswordValid = await bcrypt.compare(loginData.loginPassword, user.password_hash);
        
        setLoading(false);

        if (isPasswordValid) {
            Alert.alert('Success', 'Logged in successfully.');
            onLoginSuccess(user.UserId);
            navigation.navigate('Search', { userId: user.UserId });
        } else {
            Alert.alert('Error', 'Invalid phone number or password.');
        }
    } else {
        setLoading(false);
        Alert.alert('Error', 'Invalid phone number or password.');
    }
};

  // Signup handler
  const handleSignup = async () => {
    const { signupPassword, signupConfirmPassword } = signupData;

    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(
        signupData.signupName,
        signupData.signupEmail,
        signupData.signupPhone,
        signupData.signupPassword,
        signupData.country,
        signupData.city
      );
      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Login'); // Optionally navigate to Login after successful signup
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Render input field
  const renderInput = (placeholder: string, value: string, onChange: (text: string) => void, secureTextEntry = false) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChange}
    />
  );

  return (
    <View style={styles.container}>
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

      <View style={styles.formContainer}>
        {isLogin ? (
          <>
            {renderInput('Phone Number', loginData.phoneNo, (text) => handleLoginChange('phoneNo', text))}
            <View style={styles.passwordContainer}>
              {renderInput('Password', loginData.loginPassword, (text) => handleLoginChange('loginPassword', text), !showPassword)}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {renderInput('Full Name', signupData.signupName, (text) => handleSignupChange('signupName', text))}
            {renderInput('Email', signupData.signupEmail, (text) => handleSignupChange('signupEmail', text))}
            {renderInput('Phone Number', signupData.signupPhone, (text) => handleSignupChange('signupPhone', text))}
            {renderInput('City', signupData.city, (text) => handleSignupChange('city', text))}
            {renderInput('Country', signupData.country, (text) => handleSignupChange('country', text))}
            <View style={styles.passwordContainer}>
              {renderInput('Password', signupData.signupPassword, (text) => handleSignupChange('signupPassword', text), !showPassword)}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
              </TouchableOpacity>
            </View>
            {renderInput('Confirm Password', signupData.signupConfirmPassword, (text) => handleSignupChange('signupConfirmPassword', text), true)}
            <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.loginButtonText}>Create Account</Text>}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19191C',
  },
  backgroundImage: {
    width: '100%',
    height: 150,
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
    top: 13,
  },
  loginButton: {
    backgroundColor: '#00D6BE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#fff',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default LoginScreen;
