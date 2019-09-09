import { SinglyLinkedList } from './singly-linked-list';
import { DoublyLinkedList } from './doubly-linked-list';

test('singly linked list test', () => {
  const singlyList = new SinglyLinkedList<number>();

  singlyList.addAtHead(1);
  singlyList.addAtTail(3);

  expect(singlyList.get(1)).toEqual(3);

  singlyList.addAtIndex(1, 2);

  expect(singlyList.get(1)).toEqual(2);
});

test('doubly linked list test', () => {
  const doublyList = new DoublyLinkedList<number>();

  doublyList.addAtHead(1);
  doublyList.addAtTail(3);

  expect(doublyList.get(1)).toEqual(3);

  doublyList.addAtIndex(1, 2);

  expect(doublyList.get(1)).toEqual(2);
});
