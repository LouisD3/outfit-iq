import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { analyzeOutfit } from '../services/openai';
import { Ionicons } from '@expo/vector-icons';
import { Style, styleConfig } from '../types/style';

export default function UploadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style>('casual');
  const [trialEnded, setTrialEnded] = useState(false);

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
      navigation.navigate('Loading');
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const analysis = await analyzeOutfit(base64, selectedStyle);
      navigation.replace('Result', {
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
    } catch (error: any) {
      if (error.message && error.message.includes('Essai gratuit terminé')) {
        setTrialEnded(true);
        navigation.goBack();
      } else {
        console.error('Erreur lors de l\'analyse:', error);
        alert('Une erreur est survenue lors de l\'analyse de l\'outfit');
        navigation.goBack();
      }
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
              <Ionicons name="camera-outline" size={48} color="#007AFF" />
              <Text style={styles.cameraButtonLabel}>Appuyez pour prendre une photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.styleContainer}>
        <Text style={styles.styleTitle}>Choisis ton style :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScrollView}>
          {Object.entries(styleConfig).map(([key, style]) => (
            <TouchableOpacity 
              key={key}
              style={[
                styles.styleButton,
                selectedStyle === key && styles.selectedStyleButton
              ]} 
              onPress={() => setSelectedStyle(key as Style)}
            >
              <Ionicons 
                name={style.icon} 
                size={24} 
                color={selectedStyle === key ? '#fff' : '#007AFF'} 
              />
              <Text style={[
                styles.styleButtonText,
                selectedStyle === key && styles.selectedStyleText
              ]}>
                {style.label}
              </Text>
              <Text style={[
                styles.styleDescription,
                selectedStyle === key && styles.selectedStyleDescription
              ]}>
                {style.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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

      <Modal
        visible={trialEnded}
        transparent
        animationType="slide"
        onRequestClose={() => setTrialEnded(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 30, borderRadius: 16, alignItems: 'center', width: 300 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Essai gratuit terminé</Text>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
              Votre essai gratuit est terminé. Passez au plan payant pour continuer à utiliser OutfitIQ !
            </Text>
            <Pressable
              style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 }}
              onPress={() => {/* TODO: Rediriger vers la page de souscription */}}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Souscrire</Text>
            </Pressable>
            <Pressable onPress={() => setTrialEnded(false)}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Fermer</Text>
            </Pressable>
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
    padding: 20,
  },
  cameraButtonLabel: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 10,
    textAlign: 'center',
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
  styleScrollView: {
    flexDirection: 'row',
  },
  styleButton: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    marginRight: 10,
    width: 120,
    backgroundColor: '#fff',
  },
  selectedStyleButton: {
    backgroundColor: '#007AFF',
  },
  styleButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  selectedStyleText: {
    color: '#fff',
  },
  styleDescription: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedStyleDescription: {
    color: '#fff',
  },
}); 