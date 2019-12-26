import 'reflect-metadata';

function Role(name: string): ClassDecorator {
  return function(target) {
    Reflect.defineMetadata('role', name, target);
  };
}

@Role('admin')
class Post {}

const metadata = Reflect.getMetadata('role', Post);

console.log(metadata);
