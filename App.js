
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView, Platform, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeColor, getSeasonPalette, getSeasonDescription, getPremiumContent } from './utils/colorLogic.js';

// Since we cannot use expo-gl or canvas easily in standard Expo Go without adding libs that might be heavy,
// We will mock the color extraction for now by just "simulating" it or picking a random realistic skin tone 
// if we can't get pixel data. 
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const handleUnlockPremium = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPremiumUnlocked(true);
      setShowUnlockModal(false);
      Alert.alert("Success", "Premium content unlocked!");
    }, 1500);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Crop to 1x1 aspect ratio (square), user centers face
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
      }
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      // 1. Resize to a small size (e.g., 50x50) to average out noise, but for simplicity
      // and ensuring we get a dominant color, we resize to 1x1.
      // This essentially calculates the average color of the cropped area.
      const manipResult = await ImageManipulator.manipulateAsync(
        image,
        [{ resize: { width: 1, height: 1 } }],
        { format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      // 2. Decode base64 (JPEG) using jpeg-js
      const rawData = Buffer.from(manipResult.base64, 'base64');
      const jpegData = jpeg.decode(rawData, { useTArray: true }); // returns { width, height, data }
      
      // data is a Uint8Array [r, g, b, a, r, g, b, a, ...]
      const r = jpegData.data[0];
      const g = jpegData.data[1];
      const b = jpegData.data[2];
      
      console.log(`Extracted Color: R${r} G${g} B${b}`);

      // 3. Analyze
      const analysis = analyzeColor(r, g, b);
      
      setResult(analysis);
      setLoading(false);

    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Could not analyze image. Please try again.");
      setLoading(false);
    }
  };

  const renderPremiumContent = (season) => {
    const content = getPremiumContent(season);
    if (!content) return null;

    return (
      <View style={styles.premiumContent}>
        <Text style={styles.premiumHeader}>Luxury Style Guide</Text>
        <Text style={styles.premiumDescription}>{content.styleGuide}</Text>

        <Text style={styles.subHeader}>Shopping List</Text>
        {content.shoppingList.map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))}

        <Text style={styles.subHeader}>Beauty & Hair</Text>
        <Text style={styles.categoryTitle}>Makeup:</Text>
        {content.beauty.makeup.map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))}

        <Text style={styles.categoryTitle}>Hair:</Text>
        {content.beauty.hair.map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Seasonal Color AI</Text>
        <Text style={styles.subtitle}>Discover your perfect palette.</Text>

        <View style={styles.card}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Take Selfie</Text>
            </TouchableOpacity>
          </View>
        </View>

        {image && !result && (
          <TouchableOpacity 
            style={[styles.actionButton, loading && styles.disabled]} 
            onPress={analyzeImage}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>
              {loading ? "Analyzing..." : "Analyze My Season"}
            </Text>
          </TouchableOpacity>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.seasonTitle}>{result.season}</Text>
            <Text style={styles.description}>{getSeasonDescription(result.season)}</Text>
            
            <Text style={styles.sectionHeader}>Your Power Colors:</Text>
            <View style={styles.palette}>
              {getSeasonPalette(result.season).map((color, index) => (
                <View key={index} style={[styles.colorSwatch, { backgroundColor: color }]} />
              ))}
            </View>

            {!premiumUnlocked ? (
              <View style={styles.premiumBox}>
                <Text style={styles.premiumTitle}>Unlock Full Report</Text>
                <Text style={styles.premiumText}>
                  Get 50+ outfit ideas, makeup shades, and hair colors for {result.season}.
                </Text>
                <TouchableOpacity style={styles.premiumButton} onPress={() => setShowUnlockModal(true)}>
                  <Text style={styles.premiumButtonText}>Upgrade - $3.99</Text>
                </TouchableOpacity>
              </View>
            ) : (
              renderPremiumContent(result.season)
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showUnlockModal}
        onRequestClose={() => setShowUnlockModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Unlock Luxury Style Guide</Text>
            <Text style={styles.modalDescription}>Get access to personalized shopping lists, beauty recommendations, and expert style tips for only $3.99.</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.buttonClose]}
              onPress={handleUnlockPremium}
            >
              <Text style={styles.textStyle}>Pay $3.99</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.buttonCancel]}
              onPress={() => setShowUnlockModal(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: '#ff7f50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  seasonTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  palette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#eee',
  },
  premiumBox: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  premiumText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  premiumButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  premiumContent: {
    width: '100%',
    backgroundColor: '#fffaf0',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  premiumHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
  },
  premiumDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#d4af37',
  },
  buttonCancel: {
    backgroundColor: '#999',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
