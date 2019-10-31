/**
 * @param {number} num
 * @return {boolean}
 */
export const isPerfectSquare = function(num: number): boolean {
  if (num === 1 || num === 0 || num === 4) return true;

  let left = 0;
  let right = Math.floor(num / 2);

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    const square = Math.pow(mid, 2);

    if (square === num) {
      return true;
    } else if (square > num) {
      right = mid - 1;
    } else {
      left = mid;
    }
  }

  return false;
};
