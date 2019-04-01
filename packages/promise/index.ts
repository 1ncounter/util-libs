import { isFunction, isObject } from './utils';

enum PROMISE_STATUS {
  pending = 0,
  fulfilled = 1,
  rejected = 2
}

type PromiseStatus = 'pending' | 'fulfilled' | 'rejected';

interface Thenable<R> {
  then<U>(
    onFulfilled?: (value: R) => U | Thenable<U>,
    onRejected?: (error: any) => U | Thenable<U>
  ): Thenable<U>;
  then<U>(
    onFulfilled?: (value: R) => U | Thenable<U>,
    onRejected?: (error: any) => void
  ): Thenable<U>;
}

interface Resolve<R> {
  (value?: R | Thenable<R>): void;
}

interface Reject {
  (error?: any): void;
}

interface Resolver<R> {
  (resolve: Resolve<R>, reject: Reject): void;
}

let id = 0;
const PROMISE_ID = Math.random()
  .toString(36)
  .substring(2);

export default class Promise<R> implements Thenable<R> {
  private ['[[PromiseStatus]]']: PromiseStatus = 'pending';
  private ['[[PromiseValue]]']: any = undefined;
  subscribes: any[] = [];

  private init(resolver: Resolver<R>) {
    try {
      resolver(
        value => this.mockResolve(value),
        reson => this.mockReject(reson)
      );
    } catch (error) {
      this.mockReject(error);
    }
  }

  private mockResolve(value: any) {
    // resolve 不能传入当前 then 返回的 Promise 对象，否则会报 TypeError
    if (value === this) {
      this.mockReject(
        new TypeError('You cannot resolve a promise with itself')
      );
      return;
    }

    // 处理 value 为其他有效 JavaScript 的情况
    if (!isFunction(value) && !isObject(value)) {
      this.fulfill(value);
      return;
    }

    // 处理 value 为 Thenable 的情况
    this.handleLikeThenable(value, this.genThen(value));
  }

  private mockReject(reson: any) {
    this['[[PromiseStatus]]'] = 'rejected';
    this['[[PromiseValue]]'] = reson;

    this.asap(this.publish);
  }

  private fulfill(value: any) {
    this['[[PromiseStatus]]'] = 'fulfilled';
    this['[[PromiseValue]]'] = value;

    if (this.subscribes.length !== 0) {
      this.asap(this.publish);
    }
  }

  private handleLikeThenable(value: any, then: any) {
    // 处理 "真实" promise 对象
    if (this.isThenable(value, then)) {
      this.handleOwnThenable(value);
      return;
    }

    // 获取 then 值失败且抛出异常，则以此异常为拒因 reject promise
    if (then.error) {
      this.mockReject(then.error);
      return;
    }

    // 如果 then 是函数，则检验 then 方法的合法性
    if (isFunction(then)) {
      this.handleForeignThenable(value, then);
      return;
    }

    // 非 Thenable ，则将该终植直接交由 fulfill 处理
    this.fulfill(value);
  }

  private genThen(value: any) {
    try {
      return value.then;
    } catch (error) {
      return { error };
    }
  }

  private isThenable(value: any, then: any) {
    const sameConstructor = value.constructor === this.constructor;
    const sameThen = then === this.then;
    const sameResolve = value.constructor.resolve === Promise.resolve;

    return sameConstructor && sameThen && sameResolve;
  }

  private handleOwnThenable(thenable: any) {
    // 处理 value 为 promise 对象的情况
    const state = thenable['[[PromiseStatus]]'];
    const result = thenable['[[PromiseValue]]'];

    if (state === 'fulfilled') {
      this.fulfill(result);
      return;
    }
    if (state === 'rejected') {
      this.mockReject(result);
      return;
    }

    this.subscribe(
      thenable,
      undefined,
      value => this.mockResolve(value),
      reason => this.mockReject(reason)
    );
  }

  private handleForeignThenable(thenable: any, then: any) {
    this.asap(() => {
      // 如果 resolvePromise 和 rejectPromise 均被调用，
      // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      // 此处 sealed (稳定否)，用于处理上诉逻辑
      let sealed: boolean = false;
      let error: any;

      try {
        then(
          thenable,
          value => {
            if (sealed) return;

            sealed = true;

            if (thenable !== value) {
              this.mockResolve(value);
            } else {
              this.fulfill(value);
            }
          },
          reason => {
            if (sealed) {
              return;
            }
            sealed = true;
            this.mockReject(reason);
          }
        );
      } catch (e) {
        error = e;
      }

      if (!sealed && error) {
        sealed = true;
        this.mockReject(error);
      }
    });
  }

  /**
   * as soon as possible 英文的缩写，在 promise 中起到的作用是尽快响应变化。
   * 在 Promises/A+规范 的 Notes 3.1 中提及了 promise 的 then 方法可以采用“宏任务（macro-task）”机制或者“微任务（micro-task）”机制来实现。
   * @param callback
   */
  private asap(callback: any) {
    setTimeout(() => {
      callback.call(this);
    }, 1);
  }

  /**
   * 使用发布订阅模式来处理异步 订阅
   * @param parent 为当前调用 then 方法的 promise 对象
   * @param child 为即将由 then 方法返回的 promise 对象
   * @param onFulfillment then 方法的第一个参数
   * @param onRejection then 方法的第二个参数
   */
  private subscribe(
    parent: Promise<R>,
    child: Promise<R>,
    onFulfillment,
    onRejection
  ) {
    let {
      subscribes,
      subscribes: { length }
    } = parent;

    subscribes[length] = child;
    subscribes[length + PROMISE_STATUS.fulfilled] = onFulfillment;
    subscribes[length + PROMISE_STATUS.rejected] = onRejection;

    if (length === 0 && PROMISE_STATUS[parent['[[PromiseStatus]]']]) {
      this.asap(this.publish);
    }
  }

  /**
   * publish 是发布，是通过 invokeCallback 来调用回调函数的
   */
  private publish() {
    const subscribes = this.subscribes;
    const state = this['[[PromiseStatus]]'];
    const settled = PROMISE_STATUS[state];
    const result = this['[[PromiseValue]]'];

    if (subscribes.length === 0) return;

    for (let i = 0; i < subscribes.length; i += 3) {
      const item = subscribes[i];
      const callback = subscribes[i + settled];

      if (item) {
        this.invokeCallback(state, item, callback, result);
      } else {
        callback(result);
      }
    }

    this.subscribes.length = 0;
  }

  /**
   * @param settled (稳定状态)，promise 处于非 pending 状态则称之为 settled，settled 的值可以为 fulfilled 或 rejected
   * @param child 即将返回的 promise 对象
   * @param callback 根据 settled 选择的 onFulfilled 或 onRejected 回调函数
   * @param detail 当前调用 then 方法 promise 的 value(终值) 或 reason(拒因)
   */
  private invokeCallback(
    settled: PromiseStatus,
    child: Promise<R>,
    callback: any,
    detail: any
  ) {
    const hasCallback = isFunction(callback);
    let value: any;
    let error: any;
    let succeeded: boolean;
    let failed: boolean;

    // 是否有 callback 的对应逻辑处理
    if (hasCallback) {
      // 回调函数执行后是否会抛出异常，即相应处理
      try {
        value = callback(detail);
      } catch (error) {
        value = { error };
      }

      if (value && value.error) {
        failed = true;
        error = value.error;
      } else {
        succeeded = true;
      }

      if (value === child) {
        this.mockReject.call(
          child,
          () =>
            new TypeError(
              'A promises callback cannot return that same promise.'
            )
        );
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    // promise 结束(执行结束或被拒绝)前不能执行回调的逻辑处理
    if (child['[[PromiseStatus]]'] !== 'pending') return;

    if (hasCallback && succeeded) {
      this.mockResolve.call(child, value);
      return;
    }

    if (failed) {
      this.mockReject.call(child, error);
      return;
    }

    if (settled === 'fulfilled') {
      this.fulfill.call(child, value);
      return;
    }

    if (settled === 'rejected') {
      this.mockReject.call(child, value);
      return;
    }
  }

  constructor(resolver: Resolver<R>) {
    this[PROMISE_ID] = id++;

    if (!isFunction(resolver)) {
      throw new TypeError(
        'You must pass a resolver function as the first argument to the promise constructor'
      );
    }

    if (this instanceof Promise) {
      this.init(resolver);
    } else {
      throw new TypeError(
        "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
      );
    }
  }

  then(onFulfilled?, onRejected?) {
    const parent: any = this;
    const child = new parent.constructor(() => {});

    // promise 各状态对应枚举值 'pending' 对应 0 ，'fulfilled' 对应 1，'rejected' 对应 2
    const state = PROMISE_STATUS[this['[[PromiseStatus]]']];

    if (state) {
      const callback = arguments[state - 1];

      this.asap(() =>
        this.invokeCallback(
          this['[[PromiseStatus]]'],
          child,
          callback,
          this['[[PromiseValue]]']
        )
      );
    } else {
      // 调用 then方法 的 promise 处于 pending 状态的处理逻辑，一般为异步情况。
      this.subscribe(parent, child, onFulfilled, onRejected);
    }

    return child;
  }

  catch(onRejection) {
    return this.then(null, onRejection);
  }

  finally(callback: any) {
    return this.then(callback, callback);
  }

  static resolve(object: any) {
    let Constructor = this;

    if (
      object &&
      typeof object === 'object' &&
      object.constructor === Constructor
    ) {
      return object;
    }

    let promise = new Constructor(() => {});
    promise.mockResolve(object);
    return promise;
  }

  static reject(reason: any) {
    let Constructor = this;
    let promise = new Constructor(() => {});
    promise.mockReject(reason);
    return promise;
  }

  static all(entries: any[]) {
    let Constructor = this;
    let result = [];
    let num = 0;

    if (!Array.isArray(entries)) {
      return new Constructor((_, reject) => {
        reject(new TypeError('You must pass an array to all.'));
      });
    }

    if (entries.length === 0) {
      return new this(resolve => resolve([]));
    }

    return new this((resolve, reject) => {
      entries.forEach(item => {
        this.resolve(item).then(data => {
          result.push(data);
          num++;
          if (num === entries.length) {
            resolve(result);
          }
        }, reject);
      });
    });
  }

  static race(entries: any[]) {
    let Constructor = this;

    if (!Array.isArray(entries)) {
      return new Constructor((_, reject) => {
        reject(new TypeError('You must pass an array to race.'));
      });
    }

    return new this((resolve, reject) => {
      let length = entries.length;
      for (let i = 0; i < length; i++) {
        this.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}
