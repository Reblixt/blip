import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  findAll() {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 2, name: 'From serviec' },
    ]
  }
}
