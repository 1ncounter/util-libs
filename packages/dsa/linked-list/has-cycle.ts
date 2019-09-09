import { INode } from './linked-list.interface';

export function hasCycle(head: INode<number>) {
  const set = new Set<INode<number>>();

  while (head) {
    if (set.has(head)) {
      return true;
    } else {
      set.add(head);
    }

    head = head.next;
  }

  return false;
}

export function hasCycle2(head: INode<number>) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head.next;

  while (slow !== fast) {
    if (!fast.next || !fast) return false;

    slow = slow.next;
    fast = fast.next.next;
  }

  return true;
}
