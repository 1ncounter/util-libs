import { INode, IBinaryTree } from './tree.interface';

export class TreeNode implements INode<number> {
  data: number = null;
  left = null;
  right = null;

  parent = null;

  constructor(value: number) {
    this.data = value;
  }
}

export class BinaryTree implements IBinaryTree<number> {
  private root: TreeNode = null;

  find(value: number): TreeNode {
    let currentNode = this.root;

    while (currentNode) {
      if (currentNode.data === value) {
        return currentNode;
      } else if (currentNode.data < value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    return null;
  }

  insert = (value: number) => {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
    } else {
      let currentNode = this.root;
      let parentNode: TreeNode = null;

      while (currentNode) {
        parentNode = currentNode;
        if (currentNode.data > value) {
          currentNode = currentNode.left;

          if (!currentNode) {
            parentNode.left = newNode;
          }
        } else {
          currentNode = currentNode.right;

          if (!currentNode) {
            parentNode.right = newNode;
          }
        }
      }
    }
  };

  delete(value: number) {}

  findMin(): number {
    return null;
  }
  findMax(): number {
    return null;
  }

  preOrder(node: TreeNode = this.root) {
    if (node) {
      console.log(node.data);
      this.preOrder(node.left);
      this.preOrder(node.right);
    }
  }

  infixOrder(node: TreeNode = this.root) {
    if (node) {
      this.infixOrder(node.left);
      console.log(node.data);
      this.infixOrder(node.right);
    }
  }

  postOrder(node: TreeNode = this.root) {
    if (node) {
      this.postOrder(node.left);
      this.postOrder(node.right);
      console.log(node.data);
    }
  }
}
