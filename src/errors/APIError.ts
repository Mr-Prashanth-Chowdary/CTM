export default class APIError extends Error {
  status: number;
  code: string | number;

  constructor(code: string | number, message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
