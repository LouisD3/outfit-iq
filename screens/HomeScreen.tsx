import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#ffffff', '#f5f5f7', '#ffffff']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="shirt-outline" size={32} color="#0071e3" />
            </View>
          </View>
          <Text style={styles.title}>OutfitIQ</Text>
          <Text style={styles.subtitle}>Votre assistant mode personnel</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.featureContainer}>
              <View style={styles.feature}>
                <Ionicons name="sparkles-outline" size={24} color="#0071e3" />
                <Text style={styles.featureText}>Analyse IA</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="trending-up-outline" size={24} color="#0071e3" />
                <Text style={styles.featureText}>Conseils personnalisés</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="time-outline" size={24} color="#0071e3" />
                <Text style={styles.featureText}>Historique</Text>
              </View>
            </View>

            <Text style={styles.description}>
              Obtenez des conseils personnalisés et une évaluation de votre style grâce à l'intelligence artificielle.
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Upload')}
            >
              <Ionicons name="camera-outline" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Évaluer mon outfit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.historyButton]}
              onPress={() => navigation.navigate('History')}
            >
              <Ionicons name="time-outline" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Voir l'historique</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#86868b',
    marginBottom: 40,
    letterSpacing: -0.2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 13,
    color: '#1d1d1f',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 17,
    color: '#1d1d1f',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  button: {
    backgroundColor: '#0071e3',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButton: {
    backgroundColor: '#86868b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  buttonIcon: {
    marginRight: 8,
  },
}); 