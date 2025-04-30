
import { Request } from 'express';

export interface UserRequest extends Request {
  user: {
    dpi: string;
    username: string;
    rol: string;
  };
}
