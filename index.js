// algorithm 算法 algorithm

// 复杂度分为： O(1) O(n) O(n^2) O(logN)  O(nlogN)

// 复杂度为 O(n) 线性阶
function main(n) {
  while (--n > 0) {
    console.log(n);
  }
}


// O(n^2) 平方阶
function N2(n) {
    for (let index = 0; index < n; index++) {
        for (let j = 0; j < index; j++) {
            console.log('j is', j);         
        }

    }
}

// main(5)

// O(logN) 对数阶
function logN(n) {
  let i = 1;
  while (i < n) {
    console.log(i);
    i = i * 2;
  }
  console.log('end');
}

// O(nlogn) 线性对数阶
function nlogN(n) {
    for (let i = 0; i < n; i++) {
        let j = i;
        while(j < n) {
            console.log(i);
            j = j * 2;
        }
        
    }
}