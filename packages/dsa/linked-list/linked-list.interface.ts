export interface INode<T> {
  value: T | null;
  previous?: INode<T> | null;
  next: INode<T> | null;
}

export interface ILinkedList<T> {
  get(index: number): T | null;

  addAtHead(value: T): void;

  addAtTail(value: T): void;

  addAtIndex(index: number, value: T): void;

  deleteAtIndex(index: number): void;
}
