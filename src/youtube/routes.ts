import { Router, Request, Response } from 'express';
import yt, { VideoDetails } from './youtube';

const router = Router();

interface YtFunc<T> {
  (id: string): Promise<T>;
}

interface Handler {
  (req: Request, res: Response): Promise<void>;
}

const bindHandler = <T = string>(fn: YtFunc<T>): Handler => async (
  req,
  res,
): Promise<void> => {
  try {
    const id = req?.params.id || (await yt.getId());
    const data = await fn(id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(`Fail: ${e.message}`);
  }
};

router.get('/id', bindHandler(yt.getId));
router.get('/info/:id', bindHandler(yt.getInfo));
router.get('/video-details/:id', bindHandler<VideoDetails>(yt.getVideoDetails));
router.get('/url/:id', bindHandler(yt.getUrl));
router.get('/stream/:id', async (req, res) => {
  try {
    const id = req?.params.id || (await yt.getId());
    const url = await yt.getUrl(id);
    const stream = await yt.getStream(url);
    res.setHeader('content-length', stream.headers['content-type']);
    res.contentType(stream.data.headers['content-type']);
    stream.data.pipe(res);
  } catch (e) {
    res.status(500).send(`Fail: ${e.message}`);
  }
});

export default router;
