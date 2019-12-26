import { BinaryTree } from './tree';

const binaryTree = new BinaryTree();

const example = new Array(10).fill(1).map(_ => Math.floor(Math.random() * 50));

for (const number of example) {
  binaryTree.insert(number);
}

binaryTree.preOrder();
