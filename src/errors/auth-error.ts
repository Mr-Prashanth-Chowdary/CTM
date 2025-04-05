import APIError from './APIError';

export class AuthError extends APIError {
  constructor(code: number = 401, message: string) {
    super(code, message);
  }
}
