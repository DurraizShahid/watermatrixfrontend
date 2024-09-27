import api from './config';

// Type for API error response
interface ApiError {
  message?: string;
  data?: any;
}

// Register a new user
export const registerUser = async (name: string, email: string, phone: string, password: string, Country: string, City: string) => {
  try {
    const response = await api.post('/auth/register', { name: name, email: email, phone_number: phone,password_hash: password,country:Country,city:City, });


    return response.data;
  } catch (error) {
    // Type guard to check if error is an Axios error
    if (error instanceof Error) {
      throw (error as ApiError).message || 'Error registering user';
    }
    throw 'Error registering user';
  }
};

// Login user
export const loginUser = async (phone: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { PhoneNo: phone, Password: password });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw (error as ApiError).message || 'Error logging in';
    }
    throw 'Error logging in';
  }
};

// // Send OTP to phone number
// export const sendOtp = async (phone: string) => {
//   try {
//     const response = await api.post('/users/send-otp', { PhoneNo: phone });
//     return response.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw (error as ApiError).message || 'Error sending OTP';
//     }
//     throw 'Error sending OTP';
//   }
// };

// Verify OTP
// export const verifyOtp = async (phone: string, otp: string) => {
//   try {
//     const response = await api.post('/users/verify-otp', { PhoneNo: phone, Otp: otp });
//     return response.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw (error as ApiError).message || 'Error verifying OTP';
//     }
//     throw 'Error verifying OTP';
//   }
// };
