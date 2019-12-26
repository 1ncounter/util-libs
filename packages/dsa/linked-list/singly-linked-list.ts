import { INode, ILinkedList } from './linked-list.interface';

export class Node<T> implements INode<T> {
  value: T | null;
  next: Node<T> | null;

  constructor(value: T | null) {
    this.value = value;
    this.next = null;
  }
}

export class SinglyLinkedList<T> implements ILinkedList<T> {
  head: Node<T> | null = null;
  size: number = 0;

  constructor() {
    const node = new Node<T>(null);

    this.head = node;
  }

  get(index: number): T | null {
    if (index < 0) return null;

    let i = 0;
    let cur = this.head;

    while (cur) {
      if (i === index) return cur.value;

      cur = cur.next;
      i++;
    }

    return null;
  }

  addAtHead(value: T): void {
    const node = new Node<T>(value);

    if (this.size === 0) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }

    this.size++;
  }

  addAtTail(value: T): void {
    const node = new Node<T>(value);

    if (this.size === 0) {
      this.head = node;
    } else {
      let cur = this.head;

      while (cur.next) {
        cur = cur.next;
      }

      cur.next = node;
    }

    this.size++;
  }

  addAtIndex(index: number, value: T) {
    if (index > this.size - 1) return;

    const node = new Node<T>(value);

    let i = 1;
    let cur = this.head;

    while (i < index) {
      cur = cur.next;
      i++;
    }

    node.next = cur.next;
    cur.next = node;
    this.size++;
  }

  deleteAtIndex(index: number) {
    if (index > this.size - 1) return;

    if (index === 0) {
      this.head = this.head.next;
      return;
    }

    let i = 0;
    let prev = this.head;

    while (i < index + 1) {
      prev = prev.next;
      i++;
    }

    prev.next = prev.next ? prev.next.next : null;
    this.size--;
  }
}
