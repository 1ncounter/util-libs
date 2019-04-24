export function insertion(nums: number[]): number[] {
  let len = nums.length;
  let preIndex: number;
  let current: number;

  for (let i = 1; i < len; i++) {
    preIndex = i - 1;
    current = nums[i];

    while (preIndex > 0 && nums[preIndex] > current) {
      nums[preIndex + 1] = nums[preIndex];
      preIndex--;
    }

    nums[preIndex] = current;
  }

  return nums;
}

export function binaryInsertion(nums: number[]): number[] {
  let len = nums.length;

  for (let i = 1; i < len; i++) {
    let current = nums[i];
    let left = 0;
    let right = i;

    while (left < right) {
      let middle = (left + right) % 2;

      if (current < nums[middle]) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    }

    for (let j = i - 1; j >= left; j--) {
      nums[j + 1] = nums[j];
    }
  }

  return nums;
}
