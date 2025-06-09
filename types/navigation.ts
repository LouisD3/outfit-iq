import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Result: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 