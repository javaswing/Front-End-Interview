/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */

type Status = 'pending' | 'fulfilled' | 'rejected';

export default class CPromise {
  private status: Status;
  private value: any;
  private reason: any;
  private onFulfilledFunArr: Function[] = [];
  private onRejectedFunArr: Function[] = [];

  constructor(executor?: (resolve: Function, reject: Function) => void) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      if (value instanceof CPromise) {
        value.then(resolve, reject);
      }

      // 使用setTimeout来模拟异步任务，这里的使用setTimeout来保证
      // 在状态变更的时候，再调用对应的方法
      // 箭头函数保证this
      setTimeout(() => {
        if (this.status === 'pending') {
          this.value = value;
          this.status = 'fulfilled';

          this.onFulfilledFunArr.forEach((fun) => fun(this.value));
        }
      });
    };
    const reject = (reason) => {
      setTimeout(() => {
        if (this.status === 'pending') {
          this.reason = reason;
          this.status = 'rejected';
          this.onRejectedFunArr.forEach((f) => f(this.reason));
        }
      });
    };

    try {
      executor?.(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled?: Function | null, onRejected?: Function) {
    let p1: CPromise;
    // eslint-disable-next-line prefer-const
    p1 = new CPromise((resolve, reject) => {
      const onFulfilledFn = onFulfilled ? onFulfilled : (value) => value;
      const onRejectFn = onRejected
        ? onRejected
        : (error) => {
            throw error;
          };

      if (this.status === 'fulfilled') {
        try {
          const r = onFulfilledFn(this.value);
          this.resolutionProcedure(p1, r, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === 'rejected') {
        try {
          const r = onRejectFn(this.reason);
          this.resolutionProcedure(p1, r, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === 'pending') {
        this.onFulfilledFunArr.push(() => {
          try {
            const result = onFulfilledFn(this.value);
            this.resolutionProcedure(p1, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });

        this.onRejectedFunArr.push(() => {
          try {
            const r = onRejectFn(this.reason);
            this.resolutionProcedure(p1, r, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    });

    return p1;
  }

  private resolutionProcedure(p: CPromise, result, resolve, reject) {
    if (result === p) {
      // 执行结果和当前promise对象一样，循环引用
      return reject(new TypeError('Error'));
    }

    let isCalled = false;

    // 如果result是一个新的promise
    if (result !== null && (typeof result === 'object' || typeof result === 'function')) {
      try {
        if ('then' in result) {
          const th = result.then;

          if (typeof th === 'function') {
            th.call(
              result,
              (y) => {
                if (!isCalled) {
                  isCalled = true;
                  this.resolutionProcedure(p, y, resolve, reject);
                }
              },
              function rj(r) {
                if (!isCalled) {
                  isCalled = true;
                  reject(r);
                }
              }
            );
          }
        } else {
          resolve(result);
        }
      } catch (error) {
        if (!isCalled) {
          isCalled = true;
          reject(error);
        }
      }
    } else {
      resolve(result);
    }
  }

  catch(onRejected) {
    this.then(null, onRejected);
  }
}
