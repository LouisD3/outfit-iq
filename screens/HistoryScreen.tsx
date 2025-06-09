import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { storageService, OutfitAnalysis } from '../services/storage';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 30;

export default function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [analyses, setAnalyses] = useState<OutfitAnalysis[]>([]);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    const loadedAnalyses = await storageService.getAnalyses();
    setAnalyses(loadedAnalyses);
  };

  const renderItem = ({ item }: { item: OutfitAnalysis }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Result', { analysis: item })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.score}>{item.score}/10</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={analyses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune analyse pour le moment</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 15,
  },
  item: {
    width: ITEM_WIDTH,
    margin: 7.5,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: ITEM_WIDTH,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 