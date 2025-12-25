
import { GoogleGenAI, Modality, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Types ---
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Text Generation (Chat, Thinking, Search, Fast) ---

export const generateAIResponse = async (
  history: ChatMessage[],
  prompt: string,
  mode: 'fast' | 'think' | 'search' | 'standard'
) => {
  let modelName = 'gemini-3-pro-preview'; // Default for complex tasks
  let config: any = {
    systemInstruction: "You are A.D.A.M., an advanced AI assistant in a cyberpunk world. Keep responses concise, technical, and helpful.",
  };

  // Configure based on mode
  switch (mode) {
    case 'fast':
      // Fast AI responses
      modelName = 'gemini-flash-lite-latest';
      break;
    
    case 'think':
      // Thinking mode for complex queries
      modelName = 'gemini-3-pro-preview';
      config.thinkingConfig = { thinkingBudget: 32768 }; // Max budget
      // Note: maxOutputTokens should NOT be set when using thinkingBudget per guidelines
      break;
    
    case 'search':
      // Google Search Grounding
      modelName = 'gemini-3-flash-preview';
      config.tools = [{ googleSearch: {} }];
      break;
      
    case 'standard':
    default:
       // General Intelligence
       modelName = 'gemini-3-pro-preview';
       break;
  }

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: config,
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const response = await chat.sendMessage({ message: prompt });
    
    let text = response.text || "No text response generated.";
    
    // Handle Search Grounding URLs
    if (mode === 'search' && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks;
      const links = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => `[${c.web.title}](${c.web.uri})`)
        .join('\n');
      
      if (links) {
        text += `\n\nSOURCES:\n${links}`;
      }
    }

    return text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "ERROR: Neural Link Interrupted. " + (error as Error).message;
  }
};

// --- Text to Speech (TTS) ---

export const generateSpeech = async (text: string): Promise<ArrayBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Cyberpunk feel
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// --- Video Generation (Veo) ---

export const generateHologram = async (
  imageBase64: string,
  prompt: string,
  aspectRatio: '16:9' | '9:16'
): Promise<string | null> => {
    try {
        // Veo requires fresh instance with selected key per guidelines
        const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let operation = await veoAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/png',
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await veoAi.operations.getVideosOperation({operation: operation});
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) return null;

        // Fetch using the key to get the blob for local playback
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);

    } catch (e) {
        console.error("Veo Error:", e);
        throw e;
    }
}

// --- Live API Helper ---
// Expose the client instance for the Live component to use directly
export const getGenAIClient = () => ai;
