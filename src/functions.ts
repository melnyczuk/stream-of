import axios, { AxiosResponse } from 'axios';
import ytsr from 'ytsr';
import ytdl, { videoInfo } from 'ytdl-core';
import { circuitBreaker } from './errors';

const getRandomInt = (seed: number): number => Math.floor(Math.random() * seed);

export const getLink = circuitBreaker<string>(
  async (n: number = getRandomInt(10000)) => {
    const { items = [] } = await ytsr(`IMG${n}`);
    const { link = '' } = items[getRandomInt(items.length)];
    return link;
  },
);

export const getId = circuitBreaker<string>(
  async (link: Promise<string> = getLink()) => ytdl.getURLVideoID(await link),
);

export const getInfo = circuitBreaker<
  videoInfo['player_response']['videoDetails']
>(async (id: Promise<string> = getId()) => {
  const info = await ytdl.getBasicInfo(await id);
  return info.player_response.videoDetails;
});

export const getUrl = circuitBreaker<string>(
  async (id: Promise<string> = getId()) => {
    const { formats = [] } = await ytdl.getInfo(await id);
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
