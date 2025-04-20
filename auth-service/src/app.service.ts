import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! from auth service';
  }

  getError(): string {
    throw new Error('Auth Servie Error');
  }
}
