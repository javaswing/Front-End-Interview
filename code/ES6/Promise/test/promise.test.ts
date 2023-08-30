import CPromise from '../index';

// @link https://github.com/domenic/promise-tests/blob/master/lib/tests/promises-a.js
describe('[Promise/A] Basic characteristics of `then`', () => {
  test('test base version', () => {
    new CPromise((resolve, _rejects) => {
      resolve(8888);
    }).then((res) => {
      expect(res).toEqual(8888);
    });
  });

  it('test then chain', () => {
    new CPromise((resolve, _reject) => {
      resolve(1);
    })
      .then((res) => {
        return res + '2';
      })
      .then((res) => {
        console.log('res', res);
        expect(res).toEqual('12');
      });
  });

  it('test then chain by new promise', () => {
    expect.assertions(1);

    new CPromise((resolve, _reject) => {
      resolve(1);
    })
      .then((_res) => {
        return new CPromise((resolve, _reject) => {
          resolve(2);
        });
      })
      .then((r) => {
        console.log('r', r);
        // expect(r).toBe(24);
        return r;
      });
  });
});
