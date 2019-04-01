export function selection(nums: number[]): number[] {
  let len = nums.length;
  let minIndex;
  let temp;

  for (let i = 0; i < len; i++) {
    minIndex = i;

    for (let j = i + 1; j < len; j++) {
      if (nums[j] < nums[minIndex]) minIndex = j;
    }

    temp = nums[i];
    nums[i] = nums[minIndex];
    nums[minIndex] = temp;
  }

  return nums;
}
