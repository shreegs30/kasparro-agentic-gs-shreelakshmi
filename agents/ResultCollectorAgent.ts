import { BaseAgent } from './BaseAgent';
import { EventBus } from '../core/EventBus';

export class ResultCollectorAgent extends BaseAgent {
  name = "ResultCollectorAgent";
  private faq?: any;
  private productPage?: any;
  private comparison?: any;

  protected registerSubscriptions(): void {
    this.eventBus.subscribe('FAQ_GENERATED', this.handle.bind(this));
    this.eventBus.subscribe('PRODUCT_PAGE_GENERATED', this.handle.bind(this));
    this.eventBus.subscribe('COMPARISON_GENERATED', this.handle.bind(this));
  }

  async handle(eventType: string, payload: any): Promise<void> {
    if (eventType === 'FAQ_GENERATED') {
      console.log('ResultCollectorAgent: Received FAQ_GENERATED', payload);
      this.faq = payload;
    } else if (eventType === 'PRODUCT_PAGE_GENERATED') {
      console.log('ResultCollectorAgent: Received PRODUCT_PAGE_GENERATED', payload);
      this.productPage = payload;
    } else if (eventType === 'COMPARISON_GENERATED') {
      console.log('ResultCollectorAgent: Received COMPARISON_GENERATED', payload);
      this.comparison = payload;
    }

    if (this.faq && this.productPage && this.comparison) {
      console.log('ResultCollectorAgent: All results collected, publishing ALL_CONTENT_READY');
      const result = {
        faq: this.faq,
        product_page: this.productPage,
        comparison_page: this.comparison
      };
      this.eventBus.publish('ALL_CONTENT_READY', result);
    }
  }
}