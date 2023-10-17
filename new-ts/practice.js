"use strict";
// function getFirstElement<T>(arr: T[]): T {
//     return arr[0];
// }
// let ans1 = getFirstElement<number>([1,2,3])
// let ans2 = getFirstElement<string>(["hello", "world"])
// console.log(ans1, ans2);
// ans2.toLowerCase();
function swapInputs(a, b) {
    let temp = a;
    a = b;
    b = temp;
    return [a, b];
}
let swap = swapInputs("world", "hello");
console.log(swap);
