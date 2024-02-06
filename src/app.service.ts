import { Injectable } from '@nestjs/common';
import open from 'open';

@Injectable()
export class AppService {
  async openSwagger(): Promise<void> {
    const url = 'http://localhost:3000/api';

    await open(url);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
