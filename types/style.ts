import { Ionicons } from '@expo/vector-icons';

export type Style = 'casual' | 'business' | 'elegant' | 'sport' | 'streetwear' | 'minimalist';

export interface StyleConfig {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
}

export const styleConfig: Record<Style, StyleConfig> = {
  casual: {
    icon: 'shirt-outline',
    label: 'Casual',
    description: 'Style décontracté et quotidien'
  },
  business: {
    icon: 'briefcase-outline',
    label: 'Business',
    description: 'Style professionnel et élégant'
  },
  elegant: {
    icon: 'diamond-outline',
    label: 'Élégant',
    description: 'Style sophistiqué et raffiné'
  },
  sport: {
    icon: 'fitness-outline',
    label: 'Sport',
    description: 'Style dynamique et confortable'
  },
  streetwear: {
    icon: 'walk-outline',
    label: 'Streetwear',
    description: 'Style urbain et tendance'
  },
  minimalist: {
    icon: 'apps-outline',
    label: 'Minimaliste',
    description: 'Style épuré et essentiel'
  }
}; 