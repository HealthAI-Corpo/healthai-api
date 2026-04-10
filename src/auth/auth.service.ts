import { Injectable } from '@nestjs/common';

export interface ZitadelUser {
  userId: string;
  email?: string;
}

@Injectable()
export class AuthService {}
