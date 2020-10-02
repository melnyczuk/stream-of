import axios, { AxiosResponse } from 'axios';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';
import { LoopDetected } from './errors';

export const rN = (seed: number): number => Math.floor(Math.random() * seed);

export const getLink = async (
  attempt: number,
  n = rN(10000),
): Promise<string> => {
  if (attempt > 9) {
    throw new LoopDetected('getLink');
  }

  const { items } = await ytsr(`IMG${n}`);
  const nItem: number = rN(items.length);
  const { link } = items[nItem];

  return link ? link : getLink(attempt + 1);
};

export const getUrl = async (
  attempt: number,
  link = getLink(attempt),
): Promise<string> => {
  if (attempt > 9) {
    throw new LoopDetected('getUrl');
  }

  const id = ytdl.getURLVideoID(await link);
  const { formats = [] } = await ytdl.getInfo(id);
  const [{ url = undefined }] = formats;

  return url ? url : getUrl(attempt + 1);
};

export const getStream = async (
  attempt: number,
  url = getUrl(attempt),
): Promise<AxiosResponse> => {
  if (attempt > 9) {
    throw new LoopDetected('getStream');
  }

  const stream = await axios({
    method: 'get',
    responseType: 'stream',
    url: await url,
  }).catch(() => getStream(attempt + 1));

  return stream?.headers['content-type'].length > 0
    ? stream
    : getStream(attempt + 1);
};
