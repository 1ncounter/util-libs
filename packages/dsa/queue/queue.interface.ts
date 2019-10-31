export interface IQueue<T> {
  dequeue(): T;
  enqueue(value: T): void;
}
