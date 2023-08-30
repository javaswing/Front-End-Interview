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

  static resolve(value) {
    return new CPromise((resolve, _) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new CPromise((_, reject) => {
      reject(reason);
    });
  }

  static all(promises: CPromise[]) {
    return new CPromise((resolve, reject) => {
      const len = promises.length;
      const result: any[] = [];
      let count = 0;

      for (let index = 0; index < promises.length; index++) {
        // 注意这里使用的是Promise的resolve, 代码中实现的resolve,没有处理对象还是promise的情况
        // 上面的resolutionProcedure是在实例上，并不是在静态方法上，没有办法调用
        //  Promise/A+ 并没有规定处理resolve的值是thenable的情况，但是ES6的实现上是对这里进行了处理
        Promise.resolve(promises[index]).then(
          function (v) {
            result[index] = v;
            count++;
            if (count === len) {
              resolve(result);
            }
          },
          function (r) {
            reject(r);
          }
        );
      }
    });
  }

  static race(promises: CPromise[]) {
    return new CPromise((resolve, reject) => {
      for (let index = 0; index < promises.length; index++) {
        Promise.resolve(promises[index]).then(
          (v) => {
            resolve(v);
          },
          (r) => {
            reject(r);
          }
        );
      }
    });
  }
}

// =================== test code ================
// 由于暂时不知道jest测试代码怎么写，只能通过实例进行测试

// 1. test then chain
new CPromise((resolve, _reject) => {
  resolve(1);
})
  .then((res) => {
    return res + '2';
  })
  .then((res) => {
    console.log('res => ', res); // 12
  });

new CPromise((resolve, _reject) => {
  resolve(1);
})
  .then((_res) => {
    return new CPromise((resolve, _reject) => {
      resolve(2);
    });
  })
  .then((r) => {
    console.log('r =>', r); // 2
  })
  .then((r) => {
    console.log(r); // undefined
  });

// 2. 测试catch 方法

new CPromise((resolve, _reject) => {
  resolve(1);
})
  .then((res) => {
    console.log('res1', res); // res1 1
    return new CPromise((_resolve, reject) => {
      reject(2);
    });
  })
  .then((res) => {
    console.log('res2 =>', res); // 不执行
  })
  .catch((err) => {
    console.log('catch err ===>', err); // catch err ===> 2
  });

// 3.Promise.resolve

new CPromise((resolve, _reject) => {
  resolve(1);
})
  .then((res) => {
    console.log('Promise.resolve res1: ', res);
    return CPromise.resolve(2);
  })
  .then((res) => {
    console.log('Promise.resolve res2: ', res); // 2
  });

// 4. Promise.reject

new CPromise((resolve, _reject) => {
  resolve(1);
})
  .then((res) => {
    console.log('Promise.reject res1 ->', res);
    return CPromise.reject(2);
  })
  .then((res) => {
    console.log('Promise.reject res2 -> ', res);
  })
  .catch((err) => {
    console.log('Promise.reject err -> ', err); // 2
  });

// 5. Promise.all

CPromise.all([
  new CPromise((resolve, _reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  }),
  new CPromise((resolve, _reject) => {
    setTimeout(() => {
      resolve(2);
    }, 200);
  }),
]).then((res) => {
  console.log('Promise.all res ', res); // Promise.all res  [ 1, 2 ]
});

// 6 Promise.race
// 测试代码
CPromise.race([
  new CPromise((resolve, _reject) => {
    setTimeout(() => {
      resolve(2);
    }, 1000);
  }),
  new CPromise((resolve, _reject) => {
    setTimeout(() => {
      resolve(1);
    }, 200);
  }),
]).then((res) => {
  console.log('Promise.race res ', res); // 1
});

console.log(CPromise.prototype);
