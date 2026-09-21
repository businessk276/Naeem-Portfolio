import jwt from 'jsonwebtoken';
import { db } from '../../../server/db.js';

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
    const id = String(req.query.id);
    const raw = db.getRaw();
    const message = raw.contact_messages.find(item => item.id === id);

    if (req.method === 'PUT') {
      if (!message) return res.status(404).json({ error: 'Message not found' });
      Object.assign(message, req.body || {});
      db.save(raw);
      return res.status(200).json({ success: true, message });
    }

    if (req.method === 'DELETE') {
      raw.contact_messages = raw.contact_messages.filter(item => item.id !== id);
      db.save(raw);
      return res.status(200).json({ success: true, message: 'Message deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Message API error:', error);
    return res.status(500).json({ error: 'Unable to update messages' });
  }
}