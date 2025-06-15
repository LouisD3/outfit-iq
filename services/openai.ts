import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/api';
import { Style } from '../types/style';

if (!OPENAI_API_KEY) {
  throw new Error('La clé API OpenAI n\'est pas configurée');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface OutfitAnalysis {
  score: number;
  feedback: string[];
  suggestions: string[];
  style: Style;
}

export async function analyzeOutfit(imageBase64: string, style: Style = 'casual'): Promise<OutfitAnalysis> {
  try {
    console.log('Début de l\'analyse avec OpenAI...');
    console.log('Longueur de l\'image en base64:', imageBase64.length);
    console.log('Clé API utilisée:', OPENAI_API_KEY.substring(0, 8) + '...');
    
    const stylePrompt = {
      casual: "Analysez l'outfit dans un style décontracté et quotidien.",
      business: "Analysez l'outfit dans un style professionnel et business.",
      elegant: "Analysez l'outfit dans un style élégant et sophistiqué.",
      sport: "Analysez l'outfit dans un style sportif et dynamique.",
      streetwear: "Analysez l'outfit dans un style urbain et streetwear.",
      minimalist: "Analysez l'outfit dans un style minimaliste et épuré."
    }[style];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en mode et style vestimentaire, connu pour ton honnêteté et ta précision. ${stylePrompt} 

Analyse l'outfit de la personne sur la photo de manière extrêmement détaillée et précise. Sois honnête et direct dans tes commentaires, tout en restant constructif. 

Réponds au format JSON avec les champs suivants :
- score : un nombre entre 0 et 10, reflérant l'adéquation globale de l'outfit avec le style choisi
- feedback : un tableau de 6-8 commentaires détaillés sur les points forts et les points faibles de l'outfit, en incluant :
  * L'harmonie des couleurs (analyse précise des combinaisons, des contrastes, des nuances)
  * La cohérence des pièces entre elles (comment chaque pièce s'harmonise avec les autres)
  * L'adéquation avec le style choisi (points forts et points à améliorer)
  * La qualité visuelle des vêtements (coupe, tissu, finitions)
  * Les détails qui font la différence (accessoires, finitions, détails de style)
  * La silhouette globale et les proportions
  * L'équilibre entre les différentes parties de l'outfit
  * Les éléments qui pourraient être améliorés
- suggestions : un tableau de 6-8 suggestions très précises et réalisables pour améliorer l'outfit, en incluant :
  * Des alternatives de pièces spécifiques avec des exemples concrets
  * Des conseils de style détaillés pour chaque pièce
  * Des accessoires recommandés avec des suggestions de couleurs et de styles
  * Des ajustements de coupe ou de taille précis
  * Des combinaisons de couleurs alternatives avec des exemples
  * Des conseils sur les proportions et la silhouette
  * Des suggestions de marques ou de styles similaires
  * Des conseils sur les tendances actuelles adaptées à ce style

IMPORTANT : 
- Sois très précis dans tes commentaires et suggestions
- Donne des exemples concrets et réalisables
- N'hésite pas à être direct et honnête dans tes critiques
- Propose des alternatives spécifiques et détaillées
- Utilise le tutoiement dans tes réponses pour être plus personnel
- Ne pas inclure de backticks ou de marqueurs de code dans la réponse, juste le JSON brut.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyse mon outfit en détail et donne-moi ton avis honnête et constructif."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    });

    console.log('Réponse reçue de l\'API:', JSON.stringify(response, null, 2));

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('Pas de contenu dans la réponse:', response);
      throw new Error('Réponse invalide de l\'API');
    }

    console.log('Contenu de la réponse:', content);

    // Nettoyer la réponse des backticks et marqueurs de code
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    console.log('Contenu nettoyé:', cleanContent);

    const analysis = JSON.parse(cleanContent);
    console.log('Analyse parsée:', analysis);

    return {
      score: analysis.score,
      feedback: analysis.feedback,
      suggestions: analysis.suggestions,
      style
    };
  } catch (error: any) {
    console.error('Erreur détaillée lors de l\'analyse:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data
    });
    throw error;
  }
} 