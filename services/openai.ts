import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/api';

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
}

export async function analyzeOutfit(imageBase64: string): Promise<OutfitAnalysis> {
  try {
    console.log('Début de l\'analyse avec OpenAI...');
    console.log('Longueur de l\'image en base64:', imageBase64.length);
    console.log('Clé API utilisée:', OPENAI_API_KEY.substring(0, 8) + '...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Vous êtes un expert en mode et style vestimentaire. Analysez l'outfit de la personne sur la photo et fournissez un feedback détaillé. Répondez au format JSON avec les champs suivants : score (nombre entre 0 et 10), feedback (tableau de 3 commentaires maximum), suggestions (tableau de 3 suggestions maximum). IMPORTANT : Ne pas inclure de backticks ou de marqueurs de code dans la réponse, juste le JSON brut."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analysez cet outfit et donnez votre avis."
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
      max_tokens: 500
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
      suggestions: analysis.suggestions
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