export interface IStack<T> {
  push(value: T): void;
  pop(): T;
  top(): T;
  empty(): boolean;
}
