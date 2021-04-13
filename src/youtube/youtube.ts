import axios, { AxiosResponse } from 'axios';
import ytdl, { videoInfo } from 'ytdl-core';
import ytsr from 'ytsr';

export type VideoDetails = videoInfo['player_response']['videoDetails'];

const getRandomInt = (seed: number): number => Math.floor(Math.random() * seed);

const getId = async (): Promise<string> => {
  const query = `IMG${getRandomInt(10000)}`;
  const { items = [] } = await ytsr(query);
  const { link = '' } = items[getRandomInt(items.length)];
  return ytdl.getURLVideoID(link);
};

const getInfo = (id: string): Promise<videoInfo> => ytdl.getInfo(id);

const getVideoDetails = async (id: string): Promise<VideoDetails> => {
  const info = await ytdl.getBasicInfo(id);
  return info.player_response.videoDetails;
};

const getUrl = async (id: string): Promise<string> => {
  const info = await ytdl.getInfo(id);
  return info.formats?.[0]?.url || '';
};

const getStream = async (id: string): Promise<AxiosResponse> => {
  const url = await getUrl(id);
  return axios({
    url,
    method: 'get',
    responseType: 'stream',
  });
};

export default {
  getId,
  getInfo,
  getVideoDetails,
  getUrl,
  getStream,
};
