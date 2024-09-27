import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Alert, Button } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native';
import { CameraOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/MainNavigator';

const AddProperty = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Residential');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [furnished, setFurnished] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [water, setWater] = useState(false);
  const [electricity, setElectricity] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
 const [images, setImages] = useState<string | null>(null);
 const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddProperty'>>();

  const handleSave = () => {
    // Validate inputs
    if (!title || !description || !price || !address || !zipcode || !city || !area) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Create property object
    const property = {
      title,
      description,
      price: parseFloat(price),
      type,
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
    };

    // Here you would typically send this data to your backend or store it locally
    console.log('Property saved:', property);
    Alert.alert('Success', 'Property added successfully');

    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setType('Residential');
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
  };

  const handleAddImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      multiple: true,
      selectionLimit: 5, 
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const newImages = response.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    });
  };
  
  const handleCaptureImage = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const capturedImage = response.assets[0].uri;
        setImages(capturedImage || null);
      }
    });
  };
  const handleLocationSelection = (longitude: number, latitude: number) => {
    setLongitude(longitude.toString());
    setLatitude(latitude.toString());
  };
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.heading}>Add a</Text>
        <Text style={styles.headingTwo}>Property.</Text>
        <Text style={styles.subheading}>List your property with ease and reach potential buyers or renters.</Text>
        
        <TouchableOpacity style={styles.imageUploadContainer} onPress={handleAddImages}>
        
          <MaterialCommunityIcons name="plus" size={24} color="#666" />
          <Text style={styles.imageUploadText}>Add Images</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.capture} onPress={handleAddImages}>
        <TouchableOpacity onPress={handleCaptureImage} >
        <Text style={styles.imageUploadText}>Capture from camera</Text>

          </TouchableOpacity>
          </TouchableOpacity>
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
        
        <Text style={styles.sectionTitle}>Property Location</Text>
        
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => setType('Residential')}
        >
          <Text style={styles.typeButtonText}>Residential</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#666"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          placeholderTextColor="#666"
          value={latitude}
          onChangeText={setLatitude}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          placeholderTextColor="#666"
          value={longitude}
          onChangeText={setLongitude}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#666"
          value={city}
          onChangeText={setCity}
        />
        
        <Text style={styles.sectionTitle}>Additional Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Area (Sq. Ft.)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={area}
          onChangeText={setArea}
        />
        
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
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Is the property furnished?</Text>
          <Switch
            value={furnished}
            onValueChange={setFurnished}
            trackColor={{ false: "#3E3E3E", true: "#45B08C" }}
            thumbColor={furnished ? "#45B08C" : "#f4f3f4"}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Does it have a kitchen/s?</Text>
          <Switch
            value={kitchen}
            onValueChange={setKitchen}
            trackColor={{ false: "#3E3E3E", true: "#45B08C" }}
            thumbColor={kitchen ? "#45B08C" : "#f4f3f4"}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Does it have running water?</Text>
          <Switch
            value={water}
            onValueChange={setWater}
            trackColor={{ false: "#3E3E3E", true: "#45B08C" }}
            thumbColor={water ? "#45B08C" : "#f4f3f4"}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Does it have Electricity?</Text>
          <Switch
            value={electricity}
            onValueChange={setElectricity}
            trackColor={{ false: "#3E3E3E", true: "#45B08C" }}
            thumbColor={electricity ? "#45B08C" : "#f4f3f4"}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Is the property paid for?</Text>
          <Switch
            value={isPaid}
            onValueChange={setIsPaid}
            trackColor={{ false: "#3E3E3E", true: "#45B08C" }}
            thumbColor={isPaid ? "#45B08C" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity style={styles.saveButton}    onPress={() => (navigation as any).navigate('Mapp', { onSelectLocation: handleLocationSelection })} >
        <Text style={styles.saveButtonText}>Select Location on Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 0,
  },
  headingTwo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  typeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterLabel: {
    color: '#FFF',
    marginRight: 10,
    fontSize: 16,
    flex: 1,
  },
  counterValue: {
    color: '#FFF',
    marginHorizontal: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#45B08C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageUploadContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  capture:{
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageUploadText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AddProperty;