### Promise 实现

Promise A+ 规范 https://promisesaplus.com/

规范大致如下：

- Promise 本质是一个状态机。每个 promise 只能是 3 种状态中的一种：pending、fulfilled 或 rejected。
- 状态转变只能是 pending -> fulfilled 或者 pending -> rejected。状态转变不可逆。
- then 方法可以被同一个 promise 调用多次。
- then 方法必须返回一个 promise。
- 规范里没有明确说明返回一个新的 promise 还是复用老的 promise（即 return this），大多数实现都是返回一个新的 promise，而且复用老的 promise 可能改变内部状态，这与规范也是相违背的。
- 值穿透。

![1](https://pic3.zhimg.com/v2-1abae5c06f4717f0049fc6b7bb04b3da_r.jpg)

![2](https://pic4.zhimg.com/v2-755063b7ed8e8821fefff21bab64956f_r.jpg)

![3](https://pic4.zhimg.com/v2-46d25b48d50265bde7be6bc190d4eb13_b.jpg)

![4](https://pic3.zhimg.com/v2-699b592ec942cb9670e4feb1ec73b452_b.jpg)

![5](https://pic4.zhimg.com/v2-9594b816c81c305abf340cfb652ee1e3_r.jpg)

![6](https://pic4.zhimg.com/v2-e699f64d02ed7ae6c122fd28a7051b27_b.jpg)

[[Resolve]] 实现
![7](https://pic4.zhimg.com/v2-7eef5ccbffd5d619ec08ba231e273d57_r.jpg)
