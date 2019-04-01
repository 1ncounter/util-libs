interface Descriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;
  get?: () => any;
  set?: (value: any) => void;
}

function readonly(target: object, key: string, descriptor: Descriptor = {}) {
  descriptor.writable = false;
  return descriptor;
}

class Dog {
  @readonly
  bark() {
    return 'wang!wang!';
  }
}

const dog = new Dog();
console.log(dog.bark());

dog.bark = () => 'bark!bark!';

console.log(dog.bark());
