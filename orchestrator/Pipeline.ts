
import { RawProductData } from '../types';
import { EventBus } from '../core/EventBus';
import { DataParserAgent } from '../agents/DataParserAgent';
import { QuestionGenerationAgent } from '../agents/QuestionGenerationAgent';
import { FAQAgent } from '../agents/FAQAgent';
import { ProductPageAgent } from '../agents/ProductPageAgent';
import { ComparisonAgent } from '../agents/ComparisonAgent';
import { ResultCollectorAgent } from '../agents/ResultCollectorAgent';

export type PipelineProgressCallback = (step: string, data: any) => void;

export class Pipeline {
  private eventBus: EventBus;
  private onProgress?: PipelineProgressCallback;
  private resultPromise: Promise<any>;
  private resolveResult: (value: any) => void;
  private rawData: RawProductData;

  constructor(rawData: RawProductData, onProgress?: PipelineProgressCallback) {
    this.rawData = rawData;
    this.eventBus = new EventBus();
    this.onProgress = onProgress;

    // Bootstrap agents
    new DataParserAgent(this.eventBus);
    new QuestionGenerationAgent(this.eventBus);
    new FAQAgent(this.eventBus);
    new ProductPageAgent(this.eventBus);
    new ComparisonAgent(this.eventBus);
    new ResultCollectorAgent(this.eventBus);

    // Setup result collection
    this.resultPromise = new Promise((resolve) => {
      this.resolveResult = resolve;
    });

    this.eventBus.subscribe('ALL_CONTENT_READY', (eventType, payload) => {
      console.log('Pipeline: Received ALL_CONTENT_READY', payload);
      this.resolveResult(payload);
    });

    // Optional: subscribe to progress events
    if (this.onProgress) {
      this.eventBus.subscribe('PRODUCT_NORMALIZED', (eventType, payload) => {
        console.log('Pipeline: Received PRODUCT_NORMALIZED', payload);
        this.onProgress!('normalized', payload);
      });
      this.eventBus.subscribe('QUESTIONS_GENERATED', (eventType, payload) => {
        console.log('Pipeline: Received QUESTIONS_GENERATED', payload);
        this.onProgress!('questions', payload);
      });
      this.eventBus.subscribe('FAQ_GENERATED', (eventType, payload) => {
        console.log('Pipeline: Received FAQ_GENERATED', payload);
        this.onProgress!('faq', payload);
      });
      this.eventBus.subscribe('PRODUCT_PAGE_GENERATED', (eventType, payload) => {
        console.log('Pipeline: Received PRODUCT_PAGE_GENERATED', payload);
        this.onProgress!('productPage', payload);
      });
      this.eventBus.subscribe('COMPARISON_GENERATED', (eventType, payload) => {
        console.log('Pipeline: Received COMPARISON_GENERATED', payload);
        this.onProgress!('comparison', payload);
      });
    }
  }

  async execute() {
    // Publish initial event
    console.log('Pipeline: Publishing RAW_PRODUCT_RECEIVED', this.rawData);
    this.eventBus.publish('RAW_PRODUCT_RECEIVED', this.rawData);

    // Wait for all content to be ready
    console.log('Pipeline: Waiting for ALL_CONTENT_READY');
    return await this.resultPromise;
  }
}
