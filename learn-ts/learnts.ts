 function calculateSum(a: number, b:number): number {
    return a + b;
 }

//  const answer = calculateSum(1,2);
//  console.log(answer);

// INTERFACES

interface PersonGenderProperties {
   gender: string;
   orientation: string;
   pronouns: string;
}

interface PersonInterface extends PersonGenderProperties {
   name: string;
   age: number;
   // genderProps: PersonGenderProperties;
   // greet(): string;
   // greetAge(): string;
}

// function greet(person: Person): string {
//    return "Hello ms " + person.name + " glad that you are " + person.age + " years old.";
// }

// console.log(greet({
//    name: "vrukshali",
//    age: 22
// }))

function greet1(person: PersonInterface) {

}

console.log(greet1({
   name: "vrukshali",
   age: 21,
   gender: "female",
   orientation: "straight",
   pronouns: "she/her"
}))

// class Person implements PersonInterface {
//    name: string;
//    age: number;

//    constructor(name: string, age: number) {
//       this.name = name;
//       this.age = age;
//    }

//    greet() {
//       return "hi ms " + this.name;
//    }

//    greetAge() {
//       return "Your age is " + this.age;
//    }
// }

// const personObj = new Person("vrukshali", 22);
// console.log(personObj.greet());
// console.log(personObj.greetAge());


// TYPE
type PersonInterface1 = {
   name: string;
   age: number;
}

function greet2(person: PersonInterface1) {
   return "Hello ms " + person.name + " glad that you are " + person.age + " years old.";
}

console.log(greet2({
   name: "vrukshali",
   age: 22
}))


interface Circle {
   radius: number;
   borderWidth?: number;
}

interface Square{
   side: number;
}

interface Rectangle {
   width: number;
   height: number;
}

// Types are very useful for unions and ors
type Shape = Rectangle | Circle | Square

function renderShape (shape: Shape) {
   console.log("Rendered!!")
}

// Enums
enum Arithmetic {
   Add,
   Sub,
   Div,
   Mul
};

function calculate(
   a: number,
   b: number,
   operation: Arithmetic
): number {
   if (operation === Arithmetic.Add) {
      return a + b;
   } else if ( operation === Arithmetic.Sub ) {
      return a - b;
   } else if (operation === Arithmetic.Mul) {
      return a * b;
   } else if (operation === Arithmetic.Div) {
      return a/b;
   } else {
      return -1;
   }
}

let a = calculate(1, 4, Arithmetic.Add);
console.log(a);