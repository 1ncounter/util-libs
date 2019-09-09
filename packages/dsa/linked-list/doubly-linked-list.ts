import { INode, ILinkedList } from './linked-list.interface';

class Node<T> implements INode<T> {
  value: T | null;
  previous: Node<T> | null;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

export class DoublyLinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number = 0;

  constructor() {
    const node = new Node<T>(null);

    this.head = node;
    this.tail = node;
  }

  get(index: number): T | null {
    if (index > this.size - 1) return null;

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
      this.head = this.tail = node;
    } else if (this.size === 1) {
      this.head = node;
      this.head.next = this.tail;
      this.tail.previous = this.head;
    } else {
      node.next = this.head;
      this.head = node;
    }

    this.size++;
  }

  addAtTail(value: T): void {
    const node = new Node<T>(value);

    if (this.size === 0) {
      this.head = this.tail = node;
    } else if (this.size === 1) {
      node.previous = this.head;
      this.tail = node;
      this.head.next = node;
    } else {
      this.tail.next = node;
      node.previous = this.tail;
      this.tail = node;
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

    cur.next.previous = node;
    node.next = cur.next;
    cur.next = node;
    node.previous = cur;

    this.size++;
  }

  deleteAtIndex(index: number) {
    if (index > this.size - 1) return;

    let i = 0;
    let cur = this.head;

    while (i < index) {
      cur = cur.next;
      i++;
    }

    cur.previous.next = cur.next;
    cur.next.previous = cur.previous;

    this.size--;
  }
}
