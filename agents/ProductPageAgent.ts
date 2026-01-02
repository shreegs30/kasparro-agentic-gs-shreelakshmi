
import { BaseAgent } from './BaseAgent';
import { NormalizedProduct } from '../types';
import { TemplateEngine, ProductPageTemplate } from '../templates/TemplateEngine';
import * as blocks from '../blocks/LogicBlocks';
import { EventBus } from '../core/EventBus';

export class ProductPageAgent extends BaseAgent {
  name = "ProductPageAgent";
  private engine = new TemplateEngine();

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.engine.register(ProductPageTemplate);
  }

  protected registerSubscriptions(): void {
    this.eventBus.subscribe('PRODUCT_NORMALIZED', this.handle.bind(this));
  }

  async handle(eventType: string, payload: any): Promise<void> {
    if (eventType === 'PRODUCT_NORMALIZED') {
      console.log('ProductPageAgent: Received PRODUCT_NORMALIZED', payload);
      const page = await this.generatePage(payload);
      console.log('ProductPageAgent: Publishing PRODUCT_PAGE_GENERATED', page);
      this.eventBus.publish('PRODUCT_PAGE_GENERATED', page);
    }
  }

  private async generatePage(product: NormalizedProduct): Promise<any> {
    const pageData = {
      header: {
        title: product.name,
        subtitle: `Professional Grade ${product.specs.concentration} Formula`,
        cta: "Buy Now"
      },
      details: blocks.ingredientsBlock(product),
      instructions: blocks.usageBlock(product),
      safety: blocks.safetyBlock(product)
    };

    return this.engine.render('ProductPage', pageData);
  }
}
