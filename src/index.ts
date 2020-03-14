import axios from 'axios';
import express, { Response } from 'express';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';

const app = express();

app.listen(4200, 'localhost', () => console.log('server running'));

const getVidLink = async (num: number): Promise<string> => {
  const { items } = await ytsr(`IMG${num}`);
  const randIndex = Math.floor(Math.random() * items.length);
  return items[randIndex].link;
};

const getVidInfo = async (link: string): Promise<string> => {
  const { formats } = await ytdl.getInfo(link);
  return formats[0].url;
};

const getVid = async (res: Response<any>): Promise<void> => {
  const numb = Math.floor(Math.random() * 10000);
  getVidLink(numb)
    .then(getVidInfo)
    .then(url =>
      axios({
        method: 'get',
        responseType: 'stream',
        url,
      }).then(resp => {
        res.setHeader('content-length', resp.headers['content-length']);
        res.setHeader('content-type', resp.data.headers['content-type']);
        resp.data.pipe(res);
      }),
    )
    .catch(() => getVid(res));
};

app.get('/video', async function(req, res) {
  getVid(res);
});
