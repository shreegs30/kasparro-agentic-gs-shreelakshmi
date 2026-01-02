
import { BaseAgent } from './BaseAgent';
import { RawProductData, NormalizedProduct } from '../types';
import { EventBus } from '../core/EventBus';

export class DataParserAgent extends BaseAgent {
  name = "DataParserAgent";

  protected registerSubscriptions(): void {
    this.eventBus.subscribe('RAW_PRODUCT_RECEIVED', this.handle.bind(this));
  }

  async handle(eventType: string, payload: any): Promise<void> {
    console.log('DataParserAgent handle called with', eventType);
    if (eventType === 'RAW_PRODUCT_RECEIVED') {
      console.log('DataParserAgent: Received RAW_PRODUCT_RECEIVED', payload);
      const normalized = await this.parseData(payload);
      console.log('DataParserAgent: Publishing PRODUCT_NORMALIZED', normalized);
      this.eventBus.publish('PRODUCT_NORMALIZED', normalized);
    }
  }

  private async parseData(input: RawProductData): Promise<NormalizedProduct> {
    // Deterministic parsing
    return {
      id: `PROD-${Date.now()}`,
      name: input.product_name,
      specs: {
        concentration: input.concentration,
        skinTypes: input.skin_type,
        ingredients: input.key_ingredients,
      },
      features: {
        benefits: input.benefits,
        usage: input.how_to_use,
        precautions: input.side_effects,
      },
      pricing: {
        amount: input.price.replace(/[^0-9]/g, ''),
        currency: input.price.startsWith('₹') ? 'INR' : 'USD'
      }
    };
  }
}
