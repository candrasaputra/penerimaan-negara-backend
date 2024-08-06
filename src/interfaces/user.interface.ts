import { Request } from 'express';

export interface User {
    id: string;
    username: number;
    name: string;
    role: string;
    password?: string;
  }
  
export interface RequestWithUser extends Request {
    user?: User;
}
