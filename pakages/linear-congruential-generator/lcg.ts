// 一段 JS 随机数生成算法如下，为什么用 9301, 49297, 233280 这三个数字做基数？
// http://www.zhihu.com/question/22818104

export function lcg(number: number): number {
  const seed = Date.now();

  const rnd = (seed: number): number => {
    seed = (seed * 9301 + 49297) % 233280;

    return seed / 233280;
  };

  return Math.ceil(rnd(seed) * number);
}
