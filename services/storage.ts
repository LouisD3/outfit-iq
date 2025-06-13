import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OutfitAnalysis {
  id: string;
  imageUri: string;
  date: string;
  score: number;
  feedback: string[];
  suggestions: string[];
  style: 'casual' | 'business' | 'elegant';
}

const STORAGE_KEY = '@outfitiq_analyses';

export const storageService = {
  async saveAnalysis(analysis: OutfitAnalysis): Promise<void> {
    try {
      const existingAnalyses = await this.getAnalyses();
      const updatedAnalyses = [analysis, ...existingAnalyses];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  },

  async getAnalyses(): Promise<OutfitAnalysis[]> {
    try {
      const analyses = await AsyncStorage.getItem(STORAGE_KEY);
      return analyses ? JSON.parse(analyses) : [];
    } catch (error) {
      console.error('Error getting analyses:', error);
      return [];
    }
  },

  async deleteAnalysis(id: string): Promise<void> {
    try {
      const analyses = await this.getAnalyses();
      const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }
}; 