import React, { useState } from 'react';
import { analyzeOutfit } from '../services/openai';
import { Alert, Modal, Pressable } from 'react-native';

export default function UploadScreen() {
  const [trialEnded, setTrialEnded] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // ... code pour préparer l'image et le style ...
      await analyzeOutfit(image, selectedStyle);
      // ... code pour afficher le résultat ...
    } catch (error: any) {
      if (error.message && error.message.includes('Essai gratuit terminé')) {
        setTrialEnded(true);
      } else {
        Alert.alert('Erreur', error.message || 'Erreur inconnue');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
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