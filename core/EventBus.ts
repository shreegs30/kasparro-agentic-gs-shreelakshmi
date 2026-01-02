export type EventHandler = (eventType: string, payload: any) => void;

export class EventBus {
  private subscribers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler): void {
    console.log('EventBus: Subscribed to', eventType);
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(handler);
  }

  publish(eventType: string, payload: any): void {
    console.log('EventBus: Publishing', eventType, payload ? 'with payload' : 'no payload');
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      console.log('EventBus: Calling', handlers.length, 'handlers for', eventType);
      handlers.forEach(handler => handler(eventType, payload));
    } else {
      console.log('EventBus: No handlers for', eventType);
    }
  }
}