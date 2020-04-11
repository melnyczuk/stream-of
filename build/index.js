'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const axios_1 = __importDefault(require('axios'));
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const ytsr_1 = __importDefault(require('ytsr'));
const ytdl_core_1 = __importDefault(require('ytdl-core'));
const app = express_1.default();
const origin = process.env.DEV
  ? 'http://localhost:3000'
  : 'https://sites.melnycz.uk';
const PORT = parseInt(process.env.PORT || '3001', 10);
app.use(cors_1.default({ origin, 'Access-Control-Allow-Origin': origin }));
app.listen(PORT, '0.0.0.0', () => console.log(`server running port: ${PORT}`));
const rN = seed => Math.floor(Math.random() * seed);
const newUrl = async () => {
  const num = rN(10000);
  const { items } = await ytsr_1.default(`IMG${num}`);
  const { link } = items[rN(items.length)];
  const {
    formats: [{ url }],
  } = await ytdl_core_1.default.getInfo(link);
  return url;
};
const getLink = async res => {
  try {
    const url = await newUrl();
    console.log('link:', url);
    res.send(url);
  } catch (e) {
    console.log('error:', e);
    getLink(res);
  }
};
const getPipe = async res => {
  try {
    const url = await newUrl();
    const resp = await axios_1.default({
      method: 'get',
      responseType: 'stream',
      url,
    });
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
