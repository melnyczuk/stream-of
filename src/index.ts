import axios, { AxiosResponse } from 'axios';
import express, { Response } from 'express';
import cors from 'cors';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';

const app = express();

const origin = process.env.DEV
  ? 'http://localhost:3000'
  : 'https://sites.melnycz.uk';

const PORT: number = parseInt(process.env.PORT || '3001', 10);
app.use(cors({ origin, 'Access-Control-Allow-Origin': origin }));
app.listen(PORT, '0.0.0.0', () => console.log(`server running port: ${PORT}`));

const rN = (seed: number): number => Math.floor(Math.random() * seed);

const newUrl = async (): Promise<string> => {
  const num = rN(10000);
  const { items } = await ytsr(`IMG${num}`);
  const { link } = items[rN(items.length)];
  const {
    formats: [{ url }],
  } = await ytdl.getInfo(link);
  return url;
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
    const resp = await axios({ method: 'get', responseType: 'stream', url });
    res.setHeader('content-length', resp.headers['content-length']);
    res.setHeader('content-type', resp.data.headers['content-type']);
    console.log('pipe:', url);
    resp.data.pipe(res);
  } catch (e) {
    console.log('error:', e);
    getPipe(res);
  }
};

app.get('/', async function(_, res) {
  await getPipe(res);
  console.log('sent');
});

app.get('/link', async function(_, res) {
  await getLink(res);
  console.log('sent');
});
