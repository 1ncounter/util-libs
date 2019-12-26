export interface INode<T> {
  data: T | null;
  left: INode<T> | null;
  right: INode<T> | null;

  parent: INode<T> | null;
}

export interface IBinaryTree<T> {
  /**
   * 查找节点
   */
  find(key: T): INode<T>;

  /**
   * 插入新节点
   */
  insert(value: T): void;

  /**
   * 删除节点
   */
  delete(value: T): void;

  /**
   * 中序遍历：左子树 -> 根节点 -> 右子树
   */
  infixOrder(node: INode<T>): void;

  /**
   * 前序遍历: 根节点 -> 左子树 -> 右子树
   */
  preOrder(node: INode<T>): void;

  /**
   * 后序遍历: 左子树 -> 右子树 -> 根节点
   */
  postOrder(node: INode<T>): void;

  /**
   * 查找最大值
   */
  findMax(): T;

  /**
   * 查找最小值
   */
  findMin(): T;
}
