import { Injectable } from '@nestjs/common';
import open from 'open';

@Injectable()
export class AppService {
  async openSwagger(): Promise<void> {
    const url = 'https://adventurous-plum-dress.cyclic.app/api';

    await open(url);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
