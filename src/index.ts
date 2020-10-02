import axios, { AxiosResponse } from 'axios';
import express, { Request, Response } from 'express';
import cors from 'cors';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';

const app = express();

const { ORIGIN, PORT } = process.env;

app.use(cors({ origin: ORIGIN, 'Access-Control-Allow-Origin': ORIGIN }));

app.listen(parseInt(PORT || '8080', 10), '0.0.0.0', () =>
  console.log(`server running port: ${PORT}`),
);

const rN = (seed: number): number => Math.floor(Math.random() * seed);

const newUrl = async (): Promise<string> => {
  const { items } = await ytsr(`IMG${rN(10000)}`);
  const { link } = items[rN(items.length)];
  const { formats } = await ytdl.getInfo(link);
  return formats[0].url;
};

const getLink = async (res: Response<string>): Promise<void> => {
  try {
    const url = await newUrl();
    console.log('link:', url);
    res.send(url);
  } catch (e) {
    console.log('error:', e);
    getLink(res);
  }
};

const getPipe = async (res: Response<AxiosResponse['data']>): Promise<void> => {
  try {
    const url = await newUrl();
    const response = await axios({
      method: 'get',
      responseType: 'stream',
      url,
    });
    res.setHeader('content-length', response.headers['content-length']);
    res.setHeader('content-type', response.data.headers['content-type']);
    console.log('pipe:', url);
    response.data.pipe(res);
  } catch (e) {
    console.log('error:', e);
    getPipe(res);
  }
};

app.get('/', async function(_: Request, res: Response<AxiosResponse['data']>) {
  await getPipe(res);
  console.log('sent');
});

app.get('/link', async function(
  _: Request,
  res: Response<AxiosResponse['data']>,
) {
  await getLink(res);
  console.log('sent');
});
