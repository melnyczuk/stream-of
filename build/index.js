'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const axios_1 = __importDefault(require('axios'));
const express_1 = __importDefault(require('express'));
const ytsr_1 = __importDefault(require('ytsr'));
const ytdl_core_1 = __importDefault(require('ytdl-core'));
const app = express_1.default();
app.listen(4200, 'localhost', () => console.log('server running'));
const getVidLink = async num => {
  const { items } = await ytsr_1.default(`IMG${num}`);
  const randIndex = Math.floor(Math.random() * items.length);
  return items[randIndex].link;
};
const getVidInfo = async link => {
  const { formats } = await ytdl_core_1.default.getInfo(link);
  return formats[0].url;
};
const getVid = async res => {
  const numb = Math.floor(Math.random() * 10000);
  getVidLink(numb)
    .then(getVidInfo)
    .then(url =>
      axios_1
        .default({
          method: 'get',
          responseType: 'stream',
          url,
        })
        .then(resp => {
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
