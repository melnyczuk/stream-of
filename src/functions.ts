import axios, { AxiosResponse } from 'axios';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';
import { circuitBreaker } from './errors';

const getRandomInt = (seed: number): number => Math.floor(Math.random() * seed);

export const getLink = circuitBreaker<string>(
  async (n: number = getRandomInt(10000)) => {
    const { items = [] } = await ytsr(`IMG${n}`);
    const { link = '' } = items[getRandomInt(items.length)];
    return link;
  },
);

export const getUrl = circuitBreaker<string>(
  async (link: Promise<string> = getLink()) => {
    const id = ytdl.getURLVideoID(await link);
    const { formats = [] } = await ytdl.getInfo(id);
    const { url = '' } = formats[0];
    return url;
  },
);

export const getStream = circuitBreaker<AxiosResponse>(
  async (url: Promise<string> = getUrl()) => {
    return axios({
      url: await url,
      method: 'get',
      responseType: 'stream',
    });
  },
);
