import { IStack } from './stack.interface';

export class ArrayStack implements IStack<number> {
  private data: number[] = [];

  push(value: number) {
    this.data.push(value);
  }

  pop(): number {
    return this.data.pop();
  }

  top(): number {
    return this.data[this.data.length - 1];
  }

  empty() {
    return this.data.length === 0;
  }
}
