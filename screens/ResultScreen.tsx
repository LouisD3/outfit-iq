import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';

export default function ResultScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Simulation de données d'analyse
  const analysis = {
    score: 8.5,
    feedback: [
      "Les couleurs sont bien coordonnées et créent une harmonie visuelle agréable.",
      "La combinaison des textures est intéressante et ajoute de la profondeur à l'ensemble.",
      "Les proportions sont bien équilibrées et mettent en valeur votre silhouette."
    ],
    suggestions: [
      "Essayez d'ajouter un accessoire pour compléter l'ensemble.",
      "Une ceinture pourrait mieux définir votre taille.",
      "Pensez à ajouter une touche de couleur vive pour plus de dynamisme."
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Note globale</Text>
        <Text style={styles.score}>{analysis.score}/10</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Points forts</Text>
        {analysis.feedback.map((item, index) => (
          <View key={index} style={styles.feedbackItem}>
            <Text style={styles.feedbackText}>• {item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggestions d'amélioration</Text>
        {analysis.suggestions.map((item, index) => (
          <View key={index} style={styles.feedbackItem}>
            <Text style={styles.feedbackText}>• {item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#34C759',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  feedbackItem: {
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
}); 