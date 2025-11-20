import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, inject, signal, effect } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-sandbox',
  templateUrl: './ai-sandbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSandboxComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLDivElement>;
  
  private geminiService = inject(GeminiService);

  messages: WritableSignal<Message[]> = signal([
    { sender: 'ai', text: 'Bienvenido al Sandbox Regulatorio con IA. ¿Cómo puedo asistirle hoy con las regulaciones financieras de Costa Rica?' }
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

  async sendMessage(event: Event) {
    event.preventDefault();
    const prompt = this.currentPrompt().trim();
    if (!prompt || this.loading()) return;

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
       this.error.set(e?.toString() ?? 'Ocurrió un error desconocido.');
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
    }, 0);
  }
}