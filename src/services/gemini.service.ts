import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;
  
  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        this.chat = this.ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: 'Eres un asistente experto de IA especializado en el ecosistema financiero y regulatorio de Costa Rica (SUGEF, CONASSIF, BCCR, SINPE). Proporcionas información concisa y precisa basada en leyes costarricenses como la Ley 8204. Analiza las consultas de los usuarios y responde como un consultor de RegTech.',
          },
        });
      } catch (e) {
        console.error("Fallo al inicializar GoogleGenAI. Verifique la API Key.", e);
      }
    } else {
      console.error("Variable de entorno API_KEY no encontrada.");
    }
  }

  async getRegulatoryResponse(prompt: string): Promise<string> {
    if (!this.chat) {
      return Promise.reject("El cliente de IA Gemini no está inicializado. Se requiere una API Key.");
    }
    
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message: prompt });
      return response.text;
    } catch (error) {
      console.error('Error llamando a la API de Gemini:', error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      return Promise.reject(`Fallo al obtener una respuesta de la IA. ${errorMessage}`);
    }
  }
}