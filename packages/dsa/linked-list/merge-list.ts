import { INode } from './linked-list.interface';

class Node<T> implements INode<T> {
  value: T | null;
  next: Node<T> | null;

  constructor(value: T | null) {
    this.value = value;
    this.next = null;
  }
}

export const mergeTwoLists = function(
  l1: INode<number>,
  l2: INode<number>
): INode<number> {
  let head = new Node<number>(null);
  const res = head;

  while (l1 && l2) {
    if (l1.value < l2.value) {
      head.next = l1;
      l1 = l1.next;
    } else {
      head.next = l2;
      l2 = l2.next;
    }

    head = head.next;
  }

  if (!l2) {
    head.next = l1;
  } else if (!l1) {
    head.next = l2;
  }

  return res.next;
};

export const mergeTwoLists2 = function(l1: INode<number>, l2: INode<number>) {
  if (!l1 || !l2) return l1 || l2;

  if (l1.value > l2.value) {
    l2.next = mergeTwoLists2(l1, l2.next);
    return l2;
  } else {
    l1.next = mergeTwoLists2(l1.next, l2);
    return l1;
  }
};
