/**
 * 作为一种典型的分而治之思想的算法应用，归并排序的实现由两种方法：
 * 自上而下的递归（所有递归的方法都可以用迭代重写，所以就有了第2种方法）
 * 自下而上的迭代
 *
 * 然而,在 JavaScript 中这种方式不太可行,因为这个算法的递归深度对它来讲太深了。
 *
 * 一些语言提供了尾递归优化。这意味着如果一个函数返回自身递归调用的结果，那么调用的过程会被替换为一个循环，它可以显著提高速度。
 * 遗憾的是，JavaScript当前并没有提供尾递归优化。深度递归的函数可能会因为堆栈溢出而运行失败。
 * @param nums
 */
export function merge(nums: number[]): number[] {
  if (nums.length < 2) return nums;

  let middle = Math.floor(nums.length / 2);
  let left = nums.slice(0, middle);
  let right = nums.slice(middle);

  return mergeLeftAndRight(merge(left), merge(right));
}

function mergeLeftAndRight(left: number[], right: number[]): number[] {
  const result: number[] = [];

  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while (left.length) {
    result.push(left.shift());
  }

  while (right.length) {
    result.push(right.shift());
  }

  return result;
}
