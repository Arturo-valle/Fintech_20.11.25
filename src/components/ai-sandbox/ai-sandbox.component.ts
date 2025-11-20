import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-sandbox',
  templateUrl: './ai-sandbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  standalone: true
})
export class AiSandboxComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLDivElement>;
  
  geminiService = inject(GeminiService);

  messages: WritableSignal<Message[]> = signal([
    { sender: 'ai', text: 'Bienvenido al Sandbox Regulatorio FintechCR. Soy un experto en normativa SUGEF, Ley 8204 y estándares del BCCR. ¿En qué puedo asesorarte hoy?' }
  ]);
  currentPrompt = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      // Any time messages change, scroll to bottom
      if (this.messages()) {
        this.scrollToBottom();
      }
    });
  }

  async sendMessage(event?: Event) {
    if (event) event.preventDefault();

    const prompt = this.currentPrompt().trim();
    if (!prompt || this.loading()) return;

    if (!this.geminiService.hasApiKey()) {
      this.error.set("Por favor, conecta tu API Key en el encabezado para usar el asistente.");
      return;
    }

    // Add user message
    this.messages.update(msgs => [...msgs, { sender: 'user', text: prompt }]);
    this.currentPrompt.set('');
    this.loading.set(true);
    this.error.set(null);
    this.scrollToBottom();

    try {
      const aiResponse = await this.geminiService.getRegulatoryResponse(prompt);
      this.messages.update(msgs => [...msgs, { sender: 'ai', text: aiResponse }]);
    } catch (e: any) {
       this.error.set(e?.toString() ?? 'Ocurrió un error de conexión con la IA.');
    } finally {
      this.loading.set(false);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
