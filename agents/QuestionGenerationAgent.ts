
import { BaseAgent } from './BaseAgent';
import { NormalizedProduct, CategorizedQuestion } from '../types';
import { generateJSON } from '../services/geminiService';
import { SchemaType } from '@google/generative-ai';
import { EventBus } from '../core/EventBus';

export class QuestionGenerationAgent extends BaseAgent {
  name = "QuestionGenerationAgent";

  protected registerSubscriptions(): void {
    this.eventBus.subscribe('PRODUCT_NORMALIZED', this.handle.bind(this));
  }

  async handle(eventType: string, payload: any): Promise<void> {
    if (eventType === 'PRODUCT_NORMALIZED') {
      console.log('QuestionGenerationAgent: Received PRODUCT_NORMALIZED', payload);
      const questions = await this.generateQuestions(payload);
      console.log('QuestionGenerationAgent: Publishing QUESTIONS_GENERATED', questions);
      this.eventBus.publish('QUESTIONS_GENERATED', questions);
    }
  }

  private async generateQuestions(product: NormalizedProduct): Promise<CategorizedQuestion[]> {
    const prompt = `You are a Senior Content Strategist. Generate EXACTLY 15 user questions for the product "${product.name}".

    Product Context:
    - active: ${product.specs.concentration} ${product.specs.ingredients[0]}
    - benefits: ${product.features.benefits.join(', ')}
    - usage: ${product.features.usage}
    - target skin: ${product.specs.skinTypes.join(', ')}

    Requirements:
    - Generate 3 questions for EACH category: informational, usage, safety, purchase, comparison.
    - Total must be exactly 15 questions.
    - Do not invent facts. Stay strictly within the provided context.`;

    const schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { 
            type: SchemaType.STRING, 
            description: 'The category: informational, usage, safety, purchase, or comparison' 
          },
          question: { 
            type: SchemaType.STRING,
          }
        },
        required: ['category', 'question']
      }
    };

    return await generateJSON<CategorizedQuestion[]>(prompt, schema);
  }
}
