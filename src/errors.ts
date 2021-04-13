import { Response } from 'express';

export const circuitBreaker = async function cb<T>(
  fn: () => Promise<T>,
  res: Response,
  attempt = 0,
  maxAttempts = 10,
): Promise<T | void> {
  if (attempt > maxAttempts) {
    res.status(508).send(`${fn.name} exceeded retry limit`);
    return;
  }
  return fn().catch(() => cb(fn, res, attempt + 1));
};
