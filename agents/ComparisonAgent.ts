
import { BaseAgent } from './BaseAgent';
import { NormalizedProduct, ComparisonData } from '../types';
import { generateJSON } from '../services/geminiService';
import { TemplateEngine, ComparisonPageTemplate } from '../templates/TemplateEngine';
import * as blocks from '../blocks/LogicBlocks';
import { SchemaType } from '@google/generative-ai';
import { EventBus } from '../core/EventBus';

export class ComparisonAgent extends BaseAgent {
  name = "ComparisonAgent";
  private engine = new TemplateEngine();

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.engine.register(ComparisonPageTemplate);
  }

  protected registerSubscriptions(): void {
    this.eventBus.subscribe('PRODUCT_NORMALIZED', this.handle.bind(this));
  }

  async handle(eventType: string, payload: any): Promise<void> {
    if (eventType === 'PRODUCT_NORMALIZED') {
      console.log('ComparisonAgent: Received PRODUCT_NORMALIZED', payload);
      const comparison = await this.generateComparison(payload);
      console.log('ComparisonAgent: Publishing COMPARISON_GENERATED', comparison);
      this.eventBus.publish('COMPARISON_GENERATED', comparison);
    }
  }

  private async generateComparison(product: NormalizedProduct): Promise<any> {
    const prompt = `Create a fictional competitor "Product B" for "${product.name}".
    Generate a comparison matrix.
    Context:
    - Current Product: ${product.name}, ${product.specs.concentration}, Price: ${product.pricing.currency}${product.pricing.amount}
    - Ingredients: ${product.specs.ingredients.join(', ')}

    Make Product B slightly weaker or more expensive to highlight ${product.name}'s value.`;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        productB: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            concentration: { type: SchemaType.STRING },
            price: { type: SchemaType.STRING },
            key_ingredients: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ['name', 'concentration', 'price', 'key_ingredients']
        },
        comparisonPoints: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              feature: { type: SchemaType.STRING },
              productAValue: { type: SchemaType.STRING },
              productBValue: { type: SchemaType.STRING },
              winner: { type: SchemaType.STRING }
            },
            required: ['feature', 'productAValue', 'productBValue']
          }
        }
      },
      required: ['productB', 'comparisonPoints']
    };

    const comparisonRaw = await generateJSON<any>(prompt, schema);

    const finalData: ComparisonData = {
      productA: product,
      productB: comparisonRaw.productB,
      comparisonPoints: comparisonRaw.comparisonPoints
    };

    return this.engine.render('ComparisonPage', {
      comparison: blocks.comparisonBlock(finalData)
    });
  }
}
