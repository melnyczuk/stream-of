import express from 'express';
import cors from 'cors';
import youtube from './youtube';

const { ORIGIN, PORT } = process.env;

const app = express();
app.use(cors({ origin: ORIGIN, 'Access-Control-Allow-Origin': '*' }));
app.use('/yt', youtube);
app.listen(parseInt(PORT || '8080', 10), '0.0.0.0', () => console.log('📽'));
