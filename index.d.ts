declare global {
  namespace Express {
    export interface Request {
      userId: null | string;
    }
  }
}
