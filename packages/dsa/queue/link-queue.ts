import { IQueue } from './queue.interface';
import { SinglyLinkedList } from '../linked-list/singly-linked-list';

export class LinkQueue implements IQueue<number> {
  private data = new SinglyLinkedList<number>();

  enqueue(value: number) {
    this.data.addAtTail(value);
  }

  dequeue() {
    const result = this.data.get(0);

    this.data.deleteAtIndex(0);

    return result;
  }
}
