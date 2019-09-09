/**
 * 给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。
 * @param {number[]} nums
 * @return {number[][]}
 */
export const threeSum = function(nums: number[]): number[][] {
  nums.sort();
  const result = [];
  const len = nums.length;

  if (nums[0] > 0 || nums[len - 1] < 0) return [];

  let i = 0;
  let left = 0;
  let right = 0;

  while (i < len - 2) {
    // 剪枝
    if (nums[i] > 0) break;
    left = i + 1;
    right = len - 1;

    while (left < right) {
      if (nums[right] < 0) break;

      let sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
      }

      if (sum > 0) {
        while (nums[right] === nums[--right]) {}
      } else {
        while (nums[left] === nums[++left]) {}
      }
    }

    // 去重
    while (nums[i] === nums[++i]) {}
  }

  return result;
};
