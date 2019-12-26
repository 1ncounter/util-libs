import { Node } from './singly-linked-list';

export const addTwoNumbers = function(l1: Node<number>, l2: Node<number>) {
  let head = null;
  let result = null;
  let carry = 0;

  while (l1 || l2) {
    const l1Val = l1 ? l1.value : 0;
    const l2Val = l2 ? l2.value : 0;
    const sum = l1Val + l2Val + carry;
    const cur = sum % 10;

    carry = Math.floor(sum / 10);

    const node = new Node<number>(cur);

    if (result) {
      result.next = node;
      result = result.next;
    } else {
      head = node;
      result = node;
    }

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return head;
};
