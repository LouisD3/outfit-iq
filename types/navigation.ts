import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OutfitAnalysis } from '../services/storage';

export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Result: { analysis?: OutfitAnalysis };
  History: undefined;
  Loading: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 