import { IStack } from './stack.interface';
import { SinglyLinkedList } from '../linked-list/singly-linked-list';

export class LinkStack implements IStack<number> {
  private data = new SinglyLinkedList<number>();

  push(value: number) {
    this.data.addAtHead(value);
  }

  pop(): number {
    const result = this.data.get(0);

    this.data.deleteAtIndex(0);

    return result;
  }

  top(): number {
    return this.data.get(0);
  }

  empty() {
    return this.data.size === 0;
  }
}
