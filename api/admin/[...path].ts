import { appReady } from '../../server.js';

export default async function handler(req: any, res: any) {
  const app = await appReady;
  return app(req, res);
}