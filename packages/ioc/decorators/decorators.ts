import * as constants from './constants';

export function Controller(name: string): ClassDecorator {
  return target => {
    Reflect.defineMetadata(constants.Controller, name, target);
  };
}

export function Get(path: string = '') {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    const methodMeta = {
      method: 'GET',
      path,
      middleware: descriptor.value
    };

    Reflect.defineMetadata(constants.Get, methodMeta, target.constructor);
  };
}

export function Body() {}
