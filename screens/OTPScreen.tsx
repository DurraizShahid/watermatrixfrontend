// File: /screens/OTPScreen.tsx

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation and useRoute hooks
import { verifyOtp } from '../api/userApi'; // Import verifyOtp function

const OTPScreen: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation(); // Initialize navigation hook
  const route = useRoute(); // Get the route to retrieve parameters
  const { phone } = route.params as { phone: string }; // Retrieve the phone number passed from the previous screen

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus the next input if it's not the last
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Check if all inputs are filled to navigate
    if (newOtp.every((item) => item !== '')) {
      // Ensure OTP is complete before verifying
      verifyOtpCode(newOtp.join('')); // Convert array to string
    }
  };

  const verifyOtpCode = async (otpCode: string) => {
    setLoading(true); // Set loading to true
    try {
      const response = await verifyOtp(phone, otpCode); // Call verifyOtp API
      setLoading(false); // Reset loading state
      Alert.alert('Success', 'OTP verified successfully.');
      (navigation as any).navigate('Search'); // Navigate to the main screen
    } catch (error) {
      setLoading(false); // Reset loading state
      Alert.alert('Error', error as string);
    }
  };

  const handleResendCode = async () => {
    // Implement resend OTP functionality here if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Code</Text>
      <Text style={styles.subtitle}>
        We have sent you an SMS with the code to +62 1309 - 1710 - 1920
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            ref={(input) => (inputsRef.current[index] = input)}
          />
        ))}
      </View>

      {/* Resend Code Button */}
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendCode}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
  },
  resendCode: {
    color: '#00D6BE',
    fontWeight: 'bold',
  },
});

export default OTPScreen;
