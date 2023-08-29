/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */

type Status = 'pending' | 'fulfilled' | 'rejected';

export default class CPromise {
  private status: Status;
  private value: any;
  private reason: any;

  constructor(executor?: (resolve: Function, reject: Function) => void) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.value = value;
        this.status = 'fulfilled';
      }
    };
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
      }
    };

    executor?.(resolve, reject);
  }

  then(onFulfilled?: Function, onRejected?: Function) {
    const fulfilled = onFulfilled ? onFulfilled : (value) => value;
    const reject = onRejected
      ? onRejected
      : (error) => {
          throw error;
        };

    if (this.status === 'fulfilled') {
      fulfilled(this.value);
    }

    if (this.status === 'rejected') {
      reject(this.reason);
    }
  }
}
