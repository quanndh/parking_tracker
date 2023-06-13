import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hello() {
    return 'Parking tracker';
  }
}
