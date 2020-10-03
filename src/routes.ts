import { AxiosResponse } from 'axios';
import { Router, Response } from 'express';
import { asyncRequestErrorHandler } from './errors';
import { getLink, getStream, getUrl } from './functions';

const routes = Router();

function good<T>(res: Response, data: T): void {
  console.log(res.req?.path, data);
  res.status(200).send(data);
  return;
}

function bad(res: Response): void {
  console.log('/video-link : 404');
  res.status(500).send('Fail');
  return;
}

function pipe(res: Response, stream: AxiosResponse): void {
  console.log(res.req?.path, stream.data.responseUrl);
  res.setHeader('content-length', stream.headers['content-type']);
  res.contentType(stream.data.headers['content-type']);
  stream.data.pipe(res);
}

routes.get(
  '/video-link',
  asyncRequestErrorHandler(async (res: Response) => {
    const link = await getLink();
    link ? good(res, link) : bad(res);
  }),
);

routes.get(
  '/stream-url',
  asyncRequestErrorHandler(async (res: Response) => {
    const url = await getUrl();
    url ? good(res, url) : bad(res);
  }),
);

routes.get(
  '/pipe-stream',
  asyncRequestErrorHandler(async (res: Response) => {
    const stream = await getStream();
    stream ? pipe(res, stream) : bad(res);
  }),
);

export default routes;
