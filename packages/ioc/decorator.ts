import 'reflect-metadata';

function classDecorator(target: any) {
  // target: 当前类的构造函数
  console.log(target);
  const v = target.prototype.walk;

  target.prototype.walk = function() {
    console.log('before');
    v.call(this);
  };
}

function methodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  //target: 当前实例对象
  //propertyKey: 方法名
  //descriptor: PropertyDescriptor 描述对象上的属性
  const method = descriptor.value;
  descriptor.value = function() {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
      'paramsKey',
      target,
      propertyKey
    );

    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error('Missing required argument.');
        }
      }
    }

    return method.apply(this, arguments);
  };
}

function paramsDecorator(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  // target: 当前实例对象
  // propertyKey: 当前方法名
  // index: 参数的下标
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata('paramsKey', target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    'paramsKey',
    existingRequiredParameters,
    target,
    propertyKey
  );
}

class Animal {
  @methodDecorator
  walk(@paramsDecorator number: number) {
    console.log('walk ' + number + ' step');
  }
}

const ani = new Animal();
ani.walk(5);
