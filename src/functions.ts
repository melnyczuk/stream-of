import axios, { AxiosResponse } from 'axios';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';

export const rN = (seed: number): number => Math.floor(Math.random() * seed);

export const getLink = async (n = rN(10000)): Promise<string> => {
  const { items } = await ytsr(`IMG${n}`, {});
  const nItem: number = rN(items.length);
  const { link } = items[nItem];
  return link ? link : getLink();
};

export const getUrl = async (link = getLink()): Promise<string> => {
  const id = ytdl.getURLVideoID(await link);
  const { formats } = await ytdl.getInfo(id);
  const [{ url }] = formats;
  return url ? url : getUrl();
};

export const getStream = async (url = getUrl()): Promise<AxiosResponse> => {
  const stream = await axios({
    method: 'get',
    responseType: 'stream',
    url: await url,
  });
  return stream?.headers['content-type'].length > 0 ? stream : getStream();
};
