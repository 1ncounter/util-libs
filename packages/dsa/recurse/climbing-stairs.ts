export function climbStairs(n: number): number {
  if (n === 1 || n === 2) return n;

  // return climbStairs(n - 1) + climbStairs(n - 2);

  const map = {};
  map[1] = 1;
  map[2] = 2;

  for (let i = 3; i < n; i++) {
    map[i] = map[i - 1] + map[i - 2];
  }

  return map[n - 1] + map[n - 2];
}
