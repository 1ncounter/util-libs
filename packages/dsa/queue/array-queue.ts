import { IQueue } from './queue.interface';

export class ArrayQueue implements IQueue<number> {
  private top: number;
  private data: number[] = [];

  enqueue(value: number) {
    this.data.unshift(value);
  }

  dequeue() {
    return this.data.pop();
  }
}
