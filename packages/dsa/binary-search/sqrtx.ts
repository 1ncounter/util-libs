/**
 * @param {number} x
 * @return {number}
 */
export const mySqrt = function(x: number): number {
  if (x === 0) return 0;
  if (x < 4) return 1;

  let left = 0;
  let right = Math.floor(x / 2) + 1;

  while (left < right) {
    let mid = Math.floor((left + right + 1) / 2);

    if (Math.pow(mid, 2) > x) {
      right = mid - 1;
    } else {
      left = mid;
    }
  }

  return Math.floor(left);
};
