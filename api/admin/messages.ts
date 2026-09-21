import jwt from 'jsonwebtoken';
import { db } from '../../server/db.js';

function authenticate(req: any, res: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin token required.' });
    return false;
  }

  try {
    jwt.verify(header.slice(7), process.env.JWT_SECRET || 'md-jobaer-portfolio-super-secret-key-2026');
    return true;
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
    return false;
  }
}

export default async function handler(req: any, res: any) {
  if (!authenticate(req, res)) return;

  try {
    await db.ready;
    if (req.method === 'GET') {
      return res.status(200).json(db.getRaw().contact_messages || []);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Messages API error:', error);
    return res.status(500).json({ error: 'Unable to load messages' });
  }
}