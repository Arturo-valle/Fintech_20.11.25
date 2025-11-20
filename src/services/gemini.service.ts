import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private chat: ChatSession | null = null;
  
  // Expose the API Key status
  hasApiKey = signal<boolean>(false);

  constructor() {
    // Check for existing key in localStorage on init
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) {
      this.initializeAI(storedKey);
    }
  }

  initializeAI(apiKey: string) {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: 'Eres un asistente experto de IA especializado en el ecosistema financiero y regulatorio de Costa Rica (SUGEF, CONASSIF, BCCR, SINPE). Proporcionas información concisa y precisa basada en leyes costarricenses como la Ley 8204 y normativas vigentes. Actúa como un consultor RegTech senior.',
      });

      this.chat = this.model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2000,
        },
      });

      this.hasApiKey.set(true);
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      console.log("Google GenAI initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI.", e);
      this.hasApiKey.set(false);
    }
  }

  clearApiKey() {
    localStorage.removeItem('GEMINI_API_KEY');
    this.genAI = null;
    this.model = null;
    this.chat = null;
    this.hasApiKey.set(false);
  }

  async getRegulatoryResponse(prompt: string): Promise<string> {
    if (!this.chat) {
      return Promise.reject("La API Key de Gemini no está configurada.");
    }
    
    try {
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return Promise.reject("Error al obtener respuesta de la IA.");
    }
  }

  async analyzeStartupMatch(startupDescription: string, vcProfiles: any[]): Promise<string> {
    if (!this.model) {
      return Promise.reject("IA no inicializada.");
    }

    const prompt = `
      Actúa como un experto en Venture Capital y Matchmaking de Startups.

      Analiza la siguiente Startup:
      "${startupDescription}"

      Y compárala con los siguientes perfiles de VC disponibles:
      ${JSON.stringify(vcProfiles)}

      Tu tarea:
      1. Identifica el MEJOR VC para esta startup.
      2. Calcula un "Score de Match" (0-100).
      3. Explica brevemente por qué es el mejor match y qué sinergias existen.
      4. Si ninguno es bueno, dilo honestamente.

      Formato de respuesta deseado (JSON):
      {
        "bestMatchVcName": "Nombre del VC",
        "score": 95,
        "reasoning": "Explicación breve..."
      }
      Responde SOLO con el JSON.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing match:', error);
      return Promise.reject("Error en el análisis de matchmaking.");
    }
  }
}
