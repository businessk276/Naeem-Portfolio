import { db } from '../server/db.js';

export default async function handler(_req: any, res: any) {
  try {
    await db.ready;
    res.status(200).json(db.getPublicPortfolio());
  } catch (error) {
    console.error('Portfolio API error:', error);
    res.status(500).json({ error: 'Failed to load portfolio data' });
  }
}