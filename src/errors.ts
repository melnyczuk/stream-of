import { Request, Response } from 'express';

export class LoopDetected extends Error {
  constructor(funcName: string) {
    super(`${funcName} exceeded retry limit`);
    this.name = 'LoopDetected';
  }
}

export const asyncRequestErrorHandler = (
  fn: (r: Response) => Promise<void>,
) => (_: Request, res: Response): Promise<void> =>
  fn(res).catch(({ constructor, message }) => {
    console.log('error:', message);
    if (constructor === LoopDetected) {
      res.status(508).send(message);
    } else {
      res.status(500).send(message);
    }
  });
