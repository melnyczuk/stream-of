import { Router, Response } from 'express';
import { asyncRequestErrorHandler } from './errors';
import { getLink, getStream, getUrl } from './functions';

const routes = Router();

routes.get(
  '/video-link',
  asyncRequestErrorHandler(async (res: Response) => {
    const link = await getLink(0);
    console.log('/video-link :', link);
    res.status(200).send(link);
  }),
);

routes.get(
  '/stream-url',
  asyncRequestErrorHandler(async (res: Response) => {
    const url = await getUrl(0);
    console.log('/stream-url :', url);
    res.status(200).send(url);
  }),
);

routes.get(
  '/pipe-stream',
  asyncRequestErrorHandler(async (res: Response) => {
    const stream = await getStream(0);
    console.log('/pipe-stream :', stream.data.responseUrl);
    res.setHeader('content-length', stream.headers['content-type']);
    res.setHeader('content-type', stream.data.headers['content-type']);
    stream.data.pipe(res);
  }),
);

export default routes;
