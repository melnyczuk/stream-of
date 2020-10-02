import { Router, Request, Response } from 'express';
import { getLink, getStream, getUrl } from './functions';

const routes = Router();

const asyncRequestErrorHandler = (fn: (r: Response) => Promise<void>) => (
  _: Request,
  res: Response,
): Promise<void> =>
  fn(res).catch(e => {
    console.log('error:', e);
    res.status(500).send(e);
  });

routes.get(
  '/video-link',
  asyncRequestErrorHandler(async (res: Response) => {
    const link = await getLink();
    console.log('link:', link);
    res.status(200).send(link);
  }),
);

routes.get(
  '/stream-url',
  asyncRequestErrorHandler(async (res: Response) => {
    const url = await getUrl();
    console.log('link:', url);
    res.status(200).send(url);
  }),
);

routes.get(
  '/pipe-stream',
  asyncRequestErrorHandler(async (res: Response) => {
    const stream = await getStream();
    console.log('stream');
    res.setHeader('content-length', stream.headers['content-type']);
    res.setHeader('content-type', stream.data.headers['content-type']);
    stream.data.pipe(res);
  }),
);

export default routes;
