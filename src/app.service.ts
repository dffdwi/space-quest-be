import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion(): object {
    return {
      code: 'success',
      message: '',
      payload: '1.0',
    };
  }
}
