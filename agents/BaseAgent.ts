
import { EventBus } from '../core/EventBus';

export abstract class BaseAgent {
  abstract name: string;

  constructor(protected eventBus: EventBus) {
    this.registerSubscriptions();
  }

  protected abstract registerSubscriptions(): void;

  abstract handle(eventType: string, payload: any): Promise<void>;
}
