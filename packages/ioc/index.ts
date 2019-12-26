import 'reflect-metadata';
import { Controller, Get } from './decorators/decorators';
import * as constants from './decorators/constants';

@Controller('cats')
class Application {
  @Get()
  findAll(ctx, next) {
    console.log('find all');
  }
}

const name = Reflect.getMetadata(constants.Controller, Application);
const routerMeta = Reflect.getMetadata(constants.Get, Application);

console.log(name);
routerMeta.middlewares.forEach(m => m());
