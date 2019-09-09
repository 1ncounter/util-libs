import { INode } from './linked-list.interface';

export function detectCycle(head: INode<number>): INode<number> {
  const set = new Set<INode<number>>();

  while (head) {
    if (set.has(head)) {
      return head;
    } else {
      set.add(head);
    }

    head = head.next;
  }

  return null;
}

export function detectCycle2(head: INode<number>): INode<number> {
  if (!head || !head.next) return null;

  let slow = head;
  let fast = head.next;
  let hasCycle = false;

  while (slow && fast) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }

  if (hasCycle) {
    let detection = head;

    while (slow !== detection) {
      slow = slow.next;
      detection = detection.next;
    }

    return detection;
  } else {
    return null;
  }
}
