import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Alert, Switch, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Import Axios
import { useNavigation } from '@react-navigation/native';

const AddProperty = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
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
  const [locationName, setLocationName] = useState(''); // Uneditable location name
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();

  const handleSave = () => {
    // Validation
    if (!title || !description || !price || !address || !zipcode || !city || !area || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const property = {
      title,
      description,
      price: parseFloat(price),
      address,
      zipcode,
      city,
      area: parseFloat(area),
      bedrooms,
      bathrooms,
      furnished,
      kitchen,
      water,
      electricity,
      isPaid,
      images,
      latitude,
      longitude,
    };

    // Add property to backend
    console.log('Property saved:', property);
    Alert.alert('Success', 'Property added successfully');
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice(''); setAddress('');
    setZipcode(''); setCity(''); setArea(''); setBedrooms(1); setBathrooms(1);
    setFurnished(false); setKitchen(false); setWater(false); setElectricity(false);
    setIsPaid(false); setImages([]); setLocationName(''); setLatitude(''); setLongitude('');
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

  const handleRemoveImage = (uri) => {
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

  const handleLocationSelection = (longitude, latitude) => {
    setLongitude(longitude.toString());
    setLatitude(latitude.toString());
    fetchLocationName(latitude, longitude); // Fetch location name
  };

  const fetchLocationName = async (lat, lon) => {
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

  return (
    <ScrollView style={styles.scrollView}>
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
          placeholder="Price"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {/* Location field */}
        <Text style={styles.sectionTitle}>Property Location</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate('Mapp', { onSelectLocation: handleLocationSelection })}
        >
          <Text style={styles.saveButtonText}>Select Location on Map</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Location Name"
          value={locationName}
          editable={false} // Make this field uneditable
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
          placeholder="Area (Sq. Ft.)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={area}
          onChangeText={setArea}
        />
        
        {/* Counter for bedrooms */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Bedrooms:</Text>
          <TouchableOpacity onPress={() => setBedrooms(Math.max(1, bedrooms - 1))}>
            <MaterialCommunityIcons name="minus-circle" size={24} color="#45B08C" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{bedrooms}</Text>
          <TouchableOpacity onPress={() => setBedrooms(bedrooms + 1)}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#45B08C" />
          </TouchableOpacity>
        </View>

        {/* Counter for bathrooms */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Bathrooms:</Text>
          <TouchableOpacity onPress={() => setBathrooms(Math.max(1, bathrooms - 1))}>
            <MaterialCommunityIcons name="minus-circle" size={24} color="#45B08C" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{bathrooms}</Text>
          <TouchableOpacity onPress={() => setBathrooms(bathrooms + 1)}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#45B08C" />
          </TouchableOpacity>
        </View>

        {/* Additional Information Section */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Furnished</Text>
          <Switch
            value={furnished}
            onValueChange={setFurnished}
            thumbColor={furnished ? "#45B08C" : "#666"}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Kitchen</Text>
          <Switch
            value={kitchen}
            onValueChange={setKitchen}
            thumbColor={kitchen ? "#45B08C" : "#666"}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Water Supply</Text>
          <Switch
            value={water}
            onValueChange={setWater}
            thumbColor={water ? "#45B08C" : "#666"}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Electricity Supply</Text>
          <Switch
            value={electricity}
            onValueChange={setElectricity}
            thumbColor={electricity ? "#45B08C" : "#666"}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Is Paid</Text>
          <Switch
            value={isPaid}
            onValueChange={setIsPaid}
            thumbColor={isPaid ? "#45B08C" : "#666"}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Property</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#1A1A1D',
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
    backgroundColor: '#1A1A1D',
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
    color: '#45B08C',
    marginVertical: 10,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#45B08C',
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
