import { Request, Response } from 'express';

export class LoopDetected extends Error {
  constructor(fn: Function) {
    super(`${fn.name} exceeded retry limit`);
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

export const circuitBreaker = <T>(fn: (arg?: unknown) => Promise<T>) =>
  async function cb(
    arg?: Parameters<typeof fn>,
    attempt = 0,
    maxAttempts = 10,
  ): Promise<T> {
    if (attempt > maxAttempts) {
      throw new LoopDetected(fn);
    }
    const result = await fn(arg);
    return result || cb(arg, attempt + 1);
  };
