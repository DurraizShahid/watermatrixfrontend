import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Alert, Switch, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Import Axios
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from './LoginScreen';
import FormData from 'form-data'; // Import FormData for handling file uploads

const AddProperty = () => {
  const { isLoggedIn, login, logout, UserId } = useAuth(); // Move useAuth here
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [furnished, setFurnished] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [water, setWater] = useState(false);
  const [electricity, setElectricity] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [images, setImages] = useState([]);
  const [locationName, setLocationName] = useState(''); 
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    console.log('UserId:', UserId);
    console.log(`Submitting longitude: ${longitude}, latitude: ${latitude}`);
    const validLongitude = parseFloat(longitude);
    const validLatitude = parseFloat(latitude);
    if (!title || !description || !price || !address || !zipcode || !city || !area || !latitude || !longitude || !type || !status) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(validLongitude) || isNaN(validLatitude)) {
      Alert.alert('Error', 'Invalid longitude or latitude. Please select a valid location.');
      return;
    }



    const formData = new FormData();
    formData.append('UserId', UserId); 
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('type', type);
    formData.append('status', status);
    formData.append('address', address);
    formData.append('zipcode', zipcode);
    formData.append('city', city);
    formData.append('area', parseFloat(area));
    formData.append('bedrooms', bedrooms);
    formData.append('bathrooms', bathrooms);
    formData.append('furnished', furnished ? 1 : 0);
    formData.append('kitchen', kitchen ? 1 : 0);
    formData.append('water', water ? 1 : 0);
    formData.append('electricity', electricity ? 1 : 0);
    formData.append('isPaid', isPaid ? 1 : 0);
    formData.append('longitude', validLongitude.toString());
    formData.append('latitude', validLatitude.toString());

    images.forEach((image, index) => {
      formData.append('images', {
        uri: image,
        type: 'image/jpeg', 
        name: `property_image_${index}.jpg`,
      });
    });

    try {
      const response = await axios.post(
        'https://mapmatrixbackend-production.up.railway.app/api/property/addproperty',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Property saved:', response.data);
      Alert.alert('Success', 'Property added successfully');
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        Alert.alert('Error', `Failed to add property: ${error.response?.data.message || 'Unknown error'}`);
      } else {
        console.error('Error saving property:', error);
        Alert.alert('Error', 'Failed to add property');
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setType('');
    setStatus('');
    setAddress('');
    setZipcode('');
    setCity('');
    setArea('');
    setBedrooms(1);
    setBathrooms(1);
    setFurnished(false);
    setKitchen(false);
    setWater(false);
    setElectricity(false);
    setIsPaid(false);
    setImages([]);
    setLocationName('');
    setLatitude('');
    setLongitude('');
  };
  const handleImagePicker = () => {
    Alert.alert(
      'Add Images',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: handleCamera },
        { text: 'Choose from Gallery', onPress: handleGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleCamera = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchCamera(options, (response) => {
      if (response.assets) {
        const newImages = response.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    });
  };

  const handleRemoveImage = (uri: never) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri));
  };

  const handleGallery = () => {
    const options = { mediaType: 'photo', quality: 1, selectionLimit: 5 };
    launchImageLibrary(options, (response) => {
      if (response.assets) {
        const newImages = response.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    });
  };

  const handleLocationSelection = (long, lat) => {
    setLongitude(long.toString());
    setLatitude(lat.toString());
    console.log(`Location selected: ${long}, ${lat}`); // Debugging log
  };

  const fetchLocationName = async (lat: any, lon: any) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w`);
      if (response.data.status === 'OK') {
        const location = response.data.results[0]?.formatted_address || 'Location not found';
        setLocationName(location); // Set location name from API response
      } else {
        setLocationName('Location not found');
      }
    } catch (error) {
      console.error(error);
      setLocationName('Error fetching location');
    }
  };

  function handleLogin(userId: string): void {
    login(userId);
  }

  return (
    <ScrollView style={styles.scrollView}>
       {isLoggedIn ? (
      <View style={styles.container}>
        
        <Text style={styles.heading}>Add Property</Text>
        <Text style={styles.subheading}>List your property with ease and reach potential buyers or renters.</Text>

        <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImagePicker}>
          <MaterialCommunityIcons name="plus" size={24} color="#666" />
          <Text style={styles.imageUploadText}>Add Images</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity onPress={() => handleRemoveImage(item)} style={styles.deleteButton}>
                  <MaterialCommunityIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageList}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          placeholderTextColor="#666"
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Billing Amount"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Type"
          placeholderTextColor="#666"
         
          value={type}
          onChangeText={setType}
        />
<TextInput
          style={styles.input}
          placeholder="Status"
          placeholderTextColor="#666"
          value={status}
          onChangeText={setStatus}
        />
        {/* Location field */}
        <Text style={styles.sectionTitle}>Property Location</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>(navigation as any).navigate('Mapp', {
          onSelectLocation: handleLocationSelection
})}

      
        >
          <Text style={styles.saveButtonText}>Select Location on Map</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        {/* More fields */}
        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#666"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#666"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Zipcode"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={zipcode}
          onChangeText={setZipcode}
        />
        <TextInput
          style={styles.input}
          placeholder="Area (sqft)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={area}
          onChangeText={setArea}
        />
        
        {/* Bedrooms and Bathrooms */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Bedrooms</Text>
          <TouchableOpacity onPress={() => setBedrooms(Math.max(1, bedrooms - 1))}>
            <MaterialCommunityIcons name="minus-circle" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{bedrooms}</Text>
          <TouchableOpacity onPress={() => setBedrooms(bedrooms + 1)}>
            <MaterialCommunityIcons name="plus-circle" size={30} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Bathrooms</Text>
          <TouchableOpacity onPress={() => setBathrooms(Math.max(1, bathrooms - 1))}>
            <MaterialCommunityIcons name="minus-circle" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{bathrooms}</Text>
          <TouchableOpacity onPress={() => setBathrooms(bathrooms + 1)}>
            <MaterialCommunityIcons name="plus-circle" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Furnished</Text>
          <Switch value={furnished} onValueChange={setFurnished} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Kitchen</Text>
          <Switch value={kitchen} onValueChange={setKitchen} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Active water supply?</Text>
          <Switch value={water} onValueChange={setWater} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Electricity</Text>
          <Switch value={electricity} onValueChange={setElectricity} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Property</Text>
        </TouchableOpacity>
      </View>
      ): (
        <LoginScreen navigation={(navigation as any).navigate('AddProperty')} onLoginSuccess={handleLogin} />
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#19191C',
  },
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUploadText: {
    color: '#666',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#3F3F45',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  multilineInput: {
    height: 80,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1EABA5',
    marginVertical: 10,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#1EABA5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterLabel: {
    color: '#fff',
    marginRight: 10,
    fontSize: 16,
  },
  counterValue: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: 16,
  },
  imageList: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  image: {
    width: 100, // Set width as per your requirement
    height: 100, // Set height as per your requirement
    marginRight: 10,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddProperty;
