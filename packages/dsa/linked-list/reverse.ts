import { INode } from './linked-list.interface';

export function iterationReverse(head: INode<number>): INode<number> {
  let prev: INode<number> = null;
  let current: INode<number> = head;

  while (current) {
    const nextNode = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }

  return prev;
}

export function recursiveReverse(head: INode<number>): INode<number> {
  if (!head || !head.next) return head;

  const next = head.next;
  const node = recursiveReverse(next);

  next.next = head;
  head.next = null;

  return node;
}

export function reverseBetween(
  head: INode<number>,
  m: number,
  n: number
): INode<number> {
  if (m === n) return head;

  let prev: INode<number> = null;
  let curr: INode<number> = head;

  while (m > 1) {
    prev = curr;
    curr = curr.next;

    m--;
    n--;
  }

  let con = prev;
  let tail = curr;

  while (n > 0) {
    const temp = curr.next;

    curr.next = prev;
    prev = curr;
    curr = temp;

    n--;
  }

  if (con !== null) {
    con.next = prev;
  } else {
    head = prev;
  }

  tail.next = curr;

  return head;
}
