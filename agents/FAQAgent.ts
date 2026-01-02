
import { BaseAgent } from './BaseAgent';
import { NormalizedProduct, CategorizedQuestion, FAQItem } from '../types';
import { generateJSON } from '../services/geminiService';
import { TemplateEngine, FAQTemplate } from '../templates/TemplateEngine';
import { SchemaType } from '@google/generative-ai';
import { EventBus } from '../core/EventBus';

export class FAQAgent extends BaseAgent {
  name = "FAQAgent";
  private engine = new TemplateEngine();
  private product?: NormalizedProduct;
  private questions?: CategorizedQuestion[];

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.engine.register(FAQTemplate);
  }

  protected registerSubscriptions(): void {
    this.eventBus.subscribe('PRODUCT_NORMALIZED', this.handle.bind(this));
    this.eventBus.subscribe('QUESTIONS_GENERATED', this.handle.bind(this));
  }

  async handle(eventType: string, payload: any): Promise<void> {
    if (eventType === 'PRODUCT_NORMALIZED') {
      console.log('FAQAgent: Received PRODUCT_NORMALIZED', payload);
      this.product = payload;
    } else if (eventType === 'QUESTIONS_GENERATED') {
      console.log('FAQAgent: Received QUESTIONS_GENERATED', payload);
      this.questions = payload;
    }

    if (this.product && this.questions) {
      console.log('FAQAgent: Generating FAQ');
      const faq = await this.generateFAQ(this.product, this.questions);
      console.log('FAQAgent: Publishing FAQ_GENERATED', faq);
      this.eventBus.publish('FAQ_GENERATED', faq);
    }
  }

  private async generateFAQ(product: NormalizedProduct, questions: CategorizedQuestion[]): Promise<any> {
    // Pick first 5 questions for the FAQ output
    const topQuestions = questions.slice(0, 5);

    const prompt = `Answer these questions for product "${product.name}" using ONLY this context:
    - Concentration: ${product.specs.concentration}
    - Ingredients: ${product.specs.ingredients.join(', ')}
    - Usage: ${product.features.usage}
    - Side effects: ${product.features.precautions}

    Questions: ${topQuestions.map(q => q.question).join(' | ')}`;

    const schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          answer: { type: SchemaType.STRING }
        },
        required: ['question', 'answer']
      }
    };

    const qna = await generateJSON<FAQItem[]>(prompt, schema);
    return this.engine.render('FAQ', { items: qna });
  }
}
