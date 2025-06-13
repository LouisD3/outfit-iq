import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { analyzeOutfit } from '../services/openai';

type Style = 'casual' | 'business' | 'elegant';

export default function UploadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style>('casual');

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin des permissions de la caméra pour continuer !');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert('Veuillez d\'abord prendre ou sélectionner une photo');
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Convertir l'image en base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Analyser l'outfit avec l'API
      const analysis = await analyzeOutfit(base64, selectedStyle);

      // Naviguer vers l'écran de résultat avec l'analyse
      navigation.navigate('Result', {
        analysis: {
          id: Date.now().toString(),
          imageUri: image,
          date: new Date().toISOString(),
          score: analysis.score,
          feedback: analysis.feedback,
          suggestions: analysis.suggestions,
          style: analysis.style
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      alert('Une erreur est survenue lors de l\'analyse de l\'outfit');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.cameraButtonText}>📸</Text>
              <Text style={styles.cameraButtonLabel}>Appuyez pour prendre une photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.styleContainer}>
        <Text style={styles.styleTitle}>Choisissez un style :</Text>
        <View style={styles.styleButtons}>
          <TouchableOpacity 
            style={[styles.styleButton, selectedStyle === 'casual' && styles.selectedStyleButton]} 
            onPress={() => setSelectedStyle('casual')}
          >
            <Text style={[styles.styleButtonText, selectedStyle === 'casual' && styles.selectedStyleText]}>Casual</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.styleButton, selectedStyle === 'business' && styles.selectedStyleButton]} 
            onPress={() => setSelectedStyle('business')}
          >
            <Text style={[styles.styleButtonText, selectedStyle === 'business' && styles.selectedStyleText]}>Business</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.styleButton, selectedStyle === 'elegant' && styles.selectedStyleButton]} 
            onPress={() => setSelectedStyle('elegant')}
          >
            <Text style={[styles.styleButtonText, selectedStyle === 'elegant' && styles.selectedStyleText]}>Élégant</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!image ? (
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choisir une photo</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Reprendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Choisir une photo</Text>
            </TouchableOpacity>
          </>
        )}

        {image && (
          <TouchableOpacity 
            style={[styles.button, styles.analyzeButton]} 
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Analyser l'outfit</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 48,
    marginBottom: 10,
  },
  cameraButtonLabel: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#34C759',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  styleContainer: {
    marginBottom: 20,
  },
  styleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  styleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  styleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  selectedStyleButton: {
    backgroundColor: '#007AFF',
  },
  styleButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedStyleText: {
    color: '#fff',
  },
}); 