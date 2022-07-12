/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, ResponseSchemaSuccess, Get, IStringSchema } from '@bakku/platform';

import { TestController } from 'src/definitions';

@Controller({
  name: Symbol('TestController'),
  path: TestController.path,
})
export class TestControllerImpl {
  @Get(TestController.children.status, 'Test Api Status')
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Return test status!')
  testApi(): string {
    return 'Test Api Success';
  }
}
