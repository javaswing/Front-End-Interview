import CPromise from '../index';

// @link https://github.com/domenic/promise-tests/blob/master/lib/tests/promises-a.js
describe('[Promise/A] Basic characteristics of `then`', () => {
  test('test constructor', () => {
    new CPromise((resolve, _rejects) => {
      resolve(8888);
    }).then((res) => {
      console.log('res', res);
    });
  });
});
